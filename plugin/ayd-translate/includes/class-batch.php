<?php

class AYD_Batch {

    public function __construct() {
        add_action( 'admin_enqueue_scripts',        [ $this, 'enqueue' ] );
        add_action( 'wp_ajax_ayd_translate_batch',  [ $this, 'handle_batch' ] );
        add_action( 'wp_ajax_ayd_translate_single', [ $this, 'handle_single' ] );
    }

    public function enqueue( string $hook ): void {
        if ( $hook !== 'toplevel_page_ayd-translate' ) return;

        wp_enqueue_script(
            'ayd-translate-admin',
            AYD_TRANSLATE_URL . 'assets/admin.js',
            [ 'jquery' ],
            AYD_TRANSLATE_VERSION,
            true
        );

        wp_localize_script( 'ayd-translate-admin', 'aydTranslate', [
            'ajaxUrl' => admin_url( 'admin-ajax.php' ),
            'nonce'   => wp_create_nonce( 'ayd_translate_nonce' ),
        ] );
    }

    // ── Translate using selected provider ────────────────────────────────────

    private function translate( string $text ): string|WP_Error {
        $api_key  = get_option( 'ayd_translate_api_key', '' );
        $provider = get_option( 'ayd_translate_provider', 'mymemory' );

        return match ( $provider ) {
            'deepl'    => ( new AYD_DeepL( $api_key ) )->translate( $text ),
            'gemini'   => ( new AYD_Gemini( $api_key ) )->translate( $text ),
            'mymemory' => ( new AYD_MyMemory( $api_key ) )->translate( $text ),
            default    => ( new AYD_Groq( $api_key ) )->translate( $text ),
        };
    }

    // ── Batch handler ────────────────────────────────────────────────────────

    public function handle_batch(): void {
        check_ajax_referer( 'ayd_translate_nonce', 'nonce' );

        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( 'Sin permisos.' );
        }

        $overwrite = isset( $_POST['overwrite'] ) && '1' === $_POST['overwrite'];
        $offset    = $overwrite ? max( 0, intval( $_POST['offset'] ?? 0 ) ) : 0;

        $base_args = [
            'post_type'   => 'product',
            'post_status' => 'publish',
            'fields'      => 'ids',
            'orderby'     => 'ID',
            'order'       => 'ASC',
        ];

        if ( ! $overwrite ) {
            $base_args['meta_query'] = [ 'relation' => 'OR',
                [ 'key' => '_description_en', 'compare' => 'NOT EXISTS' ],
                [ 'key' => '_description_en', 'value'   => '', 'compare' => '=' ],
            ];
        }

        $total = count( get_posts( array_merge( $base_args, [ 'posts_per_page' => -1 ] ) ) );

        if ( $total === 0 ) {
            wp_send_json_success( [ 'done' => true, 'message' => 'Todos los productos están traducidos.' ] );
        }

        $ids = get_posts( array_merge( $base_args, [ 'posts_per_page' => 1, 'offset' => $offset ] ) );

        if ( empty( $ids ) ) {
            wp_send_json_success( [ 'done' => true, 'message' => 'Traducción completada.' ] );
        }

        $product_id  = $ids[0];
        $product     = wc_get_product( $product_id );
        $name        = $product->get_name();
        $description = wp_strip_all_tags( $product->get_short_description() );

        if ( empty( $description ) ) {
            if ( ! $overwrite ) {
                update_post_meta( $product_id, '_description_en', '' );
            }
            wp_send_json_success( [
                'done'        => false,
                'result'      => [ 'name' => $name, 'status' => 'skip', 'message' => 'Sin descripción' ],
                'next_offset' => $overwrite ? $offset + 1 : 0,
                'total'       => $total,
                'translated'  => $this->count_translated(),
            ] );
        }

        $result = $this->translate( $description );

        if ( is_wp_error( $result ) ) {
            $code = $result->get_error_code();

            if ( $code === 'quota_exceeded' ) {
                wp_send_json_success( [
                    'done'        => false,
                    'wait'        => 65,
                    'wait_reason' => 'Cuota alcanzada. Esperando 65s…',
                    'next_offset' => $offset,
                    'total'       => $total,
                    'translated'  => $this->count_translated(),
                ] );
            }

            if ( $code === 'server_error' ) {
                wp_send_json_success( [
                    'done'        => false,
                    'wait'        => 15,
                    'wait_reason' => 'Error temporal del servidor. Reintentando en 15s…',
                    'next_offset' => $offset,
                    'total'       => $total,
                    'translated'  => $this->count_translated(),
                ] );
            }

            wp_send_json_success( [
                'done'        => false,
                'result'      => [ 'name' => $name, 'status' => 'error', 'message' => $result->get_error_message() ],
                'next_offset' => $overwrite ? $offset + 1 : 0,
                'total'       => $total,
                'translated'  => $this->count_translated(),
            ] );
        }

        update_post_meta( $product_id, '_description_en', $result );

        wp_send_json_success( [
            'done'        => false,
            'result'      => [ 'name' => $name, 'status' => 'success', 'message' => 'OK' ],
            'next_offset' => $overwrite ? $offset + 1 : 0,
            'total'       => $total,
            'translated'  => $this->count_translated(),
        ] );
    }

    // ── Single product handler ───────────────────────────────────────────────

    public function handle_single(): void {
        check_ajax_referer( 'ayd_translate_nonce', 'nonce' );

        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( 'Sin permisos.' );
        }

        $product_id = intval( $_POST['product_id'] ?? 0 );
        if ( ! $product_id ) wp_send_json_error( 'ID inválido.' );

        $product = wc_get_product( $product_id );
        if ( ! $product ) wp_send_json_error( 'Producto no encontrado.' );

        $description = wp_strip_all_tags( $product->get_short_description() );
        if ( empty( $description ) ) wp_send_json_error( 'El producto no tiene descripción corta.' );

        $result = $this->translate( $description );

        if ( is_wp_error( $result ) ) wp_send_json_error( $result->get_error_message() );

        update_post_meta( $product_id, '_description_en', $result );
        wp_send_json_success( [ 'translated' => $result ] );
    }

    private function count_translated(): int {
        return count( get_posts( [
            'post_type'      => 'product',
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'fields'         => 'ids',
            'meta_query'     => [
                [ 'key' => '_description_en', 'compare' => '!=', 'value' => '' ],
            ],
        ] ) );
    }
}
