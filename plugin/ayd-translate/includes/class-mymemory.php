<?php

class AYD_MyMemory {

    private string $email;
    private string $endpoint = 'https://api.mymemory.translated.net/get';

    /**
     * @param string $email Email registrado en mymemory.translated.net (aumenta límite a 10k palabras/día)
     */
    public function __construct( string $email ) {
        $this->email = $email;
    }

    public function translate( string $text ): string|WP_Error {
        if ( empty( $text ) ) {
            return new WP_Error( 'empty', 'Texto vacío.' );
        }

        $url = add_query_arg( [
            'q'        => $text,
            'langpair' => 'es|en',
            'de'       => $this->email,
        ], $this->endpoint );

        $response = wp_remote_get( $url, [ 'timeout' => 30 ] );

        if ( is_wp_error( $response ) ) {
            return $response;
        }

        $code = (int) wp_remote_retrieve_response_code( $response );
        $body = json_decode( wp_remote_retrieve_body( $response ), true );

        if ( $code === 429 ) {
            return new WP_Error( 'quota_exceeded', 'Límite diario de MyMemory alcanzado.' );
        }

        if ( $code >= 500 ) {
            return new WP_Error( 'server_error', 'Error temporal de MyMemory.' );
        }

        // MyMemory devuelve 200 incluso en errores, revisa responseStatus
        $status = (int) ( $body['responseStatus'] ?? 200 );

        if ( $status === 429 ) {
            return new WP_Error( 'quota_exceeded', 'Límite diario de MyMemory alcanzado (10,000 palabras/día).' );
        }

        if ( $status !== 200 ) {
            return new WP_Error( 'api_error', $body['responseDetails'] ?? "Error MyMemory: {$status}" );
        }

        $translated = $body['responseData']['translatedText'] ?? '';

        if ( empty( $translated ) ) {
            return new WP_Error( 'empty_response', 'MyMemory devolvió una respuesta vacía.' );
        }

        return trim( $translated );
    }
}
