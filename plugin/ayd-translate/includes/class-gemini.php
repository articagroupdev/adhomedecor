<?php

class AYD_Gemini {

    private string $api_key;
    private string $model    = 'gemini-2.0-flash';
    private string $endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/';

    public function __construct( string $api_key ) {
        $this->api_key = $api_key;
    }

    /**
     * Translates a plain-text string from Spanish to English.
     * Returns the translated string or WP_Error on failure.
     */
    public function translate( string $text ): string|WP_Error {
        if ( empty( $text ) || empty( $this->api_key ) ) {
            return new WP_Error( 'empty', 'Texto o API key vacíos.' );
        }

        $prompt = "Translate the following product description from Spanish to English. "
                . "Return ONLY the translated text — no quotes, no explanations, no extra content:\n\n"
                . $text;

        $url = $this->endpoint . $this->model . ':generateContent?key=' . $this->api_key;

        $response = wp_remote_post( $url, [
            'headers' => [ 'Content-Type' => 'application/json' ],
            'timeout' => 30,
            'body'    => wp_json_encode( [
                'contents' => [
                    [ 'parts' => [ [ 'text' => $prompt ] ] ],
                ],
                'generationConfig' => [
                    'temperature'     => 0.1,
                    'maxOutputTokens' => 2048,
                ],
            ] ),
        ] );

        if ( is_wp_error( $response ) ) {
            return $response;
        }

        $code = wp_remote_retrieve_response_code( $response );
        $body = json_decode( wp_remote_retrieve_body( $response ), true );

        if ( (int) $code === 429 ) {
            return new WP_Error( 'quota_exceeded', 'Cuota por minuto alcanzada.' );
        }

        // 503 / auth backend / service unavailable — transient, safe to retry
        if ( (int) $code >= 500 ) {
            return new WP_Error( 'server_error', 'Error temporal del servidor de Google. Reintentando.' );
        }

        if ( (int) $code !== 200 ) {
            $msg = $body['error']['message'] ?? "Error API: {$code}";
            // Some auth errors are also transient
            if ( str_contains( $msg, 'backend unavailable' ) || str_contains( $msg, 'temporarily' ) ) {
                return new WP_Error( 'server_error', $msg );
            }
            return new WP_Error( 'api_error', $msg );
        }

        $translated = $body['candidates'][0]['content']['parts'][0]['text'] ?? '';

        if ( empty( $translated ) ) {
            return new WP_Error( 'empty_response', 'Gemini devolvió una respuesta vacía.' );
        }

        return trim( $translated );
    }
}
