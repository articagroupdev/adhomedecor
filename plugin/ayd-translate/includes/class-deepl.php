<?php

class AYD_DeepL {

    private string $api_key;
    private string $endpoint = 'https://api-free.deepl.com/v2/translate';

    public function __construct( string $api_key ) {
        $this->api_key = $api_key;
    }

    /**
     * Translates plain text from Spanish to English via DeepL Free API.
     * Returns translated string or WP_Error.
     */
    public function translate( string $text ): string|WP_Error {
        if ( empty( $text ) || empty( $this->api_key ) ) {
            return new WP_Error( 'empty', 'Texto o API key vacíos.' );
        }

        $response = wp_remote_post( $this->endpoint, [
            'timeout' => 30,
            'headers' => [
                'Authorization' => 'DeepL-Auth-Key ' . $this->api_key,
                'Content-Type'  => 'application/json',
            ],
            'body' => wp_json_encode( [
                'text'        => [ $text ],
                'source_lang' => 'ES',
                'target_lang' => 'EN',
            ] ),
        ] );

        if ( is_wp_error( $response ) ) {
            return $response;
        }

        $code = (int) wp_remote_retrieve_response_code( $response );
        $body = json_decode( wp_remote_retrieve_body( $response ), true );

        if ( $code === 429 ) {
            return new WP_Error( 'quota_exceeded', 'Cuota por minuto alcanzada.' );
        }

        if ( $code === 456 ) {
            return new WP_Error( 'quota_exceeded', 'Cuota mensual de DeepL alcanzada (500k caracteres).' );
        }

        if ( $code >= 500 ) {
            return new WP_Error( 'server_error', 'Error temporal del servidor de DeepL.' );
        }

        if ( $code !== 200 ) {
            $msg = $body['message'] ?? "Error API DeepL: {$code}";
            return new WP_Error( 'api_error', $msg );
        }

        $translated = $body['translations'][0]['text'] ?? '';

        if ( empty( $translated ) ) {
            return new WP_Error( 'empty_response', 'DeepL devolvió una respuesta vacía.' );
        }

        return trim( $translated );
    }
}
