<?php

class AYD_Groq {

    private string $api_key;
    private string $model    = 'llama-3.1-8b-instant';
    private string $endpoint = 'https://api.groq.com/openai/v1/chat/completions';

    public function __construct( string $api_key ) {
        $this->api_key = $api_key;
    }

    public function translate( string $text ): string|WP_Error {
        if ( empty( $text ) || empty( $this->api_key ) ) {
            return new WP_Error( 'empty', 'Texto o API key vacíos.' );
        }

        $response = wp_remote_post( $this->endpoint, [
            'timeout' => 30,
            'headers' => [
                'Authorization' => 'Bearer ' . $this->api_key,
                'Content-Type'  => 'application/json',
            ],
            'body' => wp_json_encode( [
                'model'    => $this->model,
                'messages' => [
                    [
                        'role'    => 'system',
                        'content' => 'You are a professional translator. Translate the user\'s text from Spanish to English. Return ONLY the translated text, no explanations, no quotes.',
                    ],
                    [
                        'role'    => 'user',
                        'content' => $text,
                    ],
                ],
                'temperature' => 0.1,
                'max_tokens'  => 1024,
            ] ),
        ] );

        if ( is_wp_error( $response ) ) {
            return $response;
        }

        $code = (int) wp_remote_retrieve_response_code( $response );
        $body = json_decode( wp_remote_retrieve_body( $response ), true );

        if ( $code === 429 ) {
            return new WP_Error( 'quota_exceeded', 'Límite de requests Groq alcanzado.' );
        }

        if ( $code >= 500 ) {
            return new WP_Error( 'server_error', 'Error temporal del servidor de Groq.' );
        }

        if ( $code !== 200 ) {
            $msg = $body['error']['message'] ?? "Error API Groq: {$code}";
            return new WP_Error( 'api_error', $msg );
        }

        $translated = $body['choices'][0]['message']['content'] ?? '';

        if ( empty( $translated ) ) {
            return new WP_Error( 'empty_response', 'Groq devolvió una respuesta vacía.' );
        }

        return trim( $translated );
    }
}
