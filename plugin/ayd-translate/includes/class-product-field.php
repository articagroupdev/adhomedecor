<?php

class AYD_Product_Field {

    public function __construct() {
        // Metabox propio siempre visible en el editor de producto
        add_action( 'add_meta_boxes',              [ $this, 'register_metabox' ] );
        add_action( 'woocommerce_process_product_meta', [ $this, 'save_field' ] );
        add_action( 'save_post_product',           [ $this, 'save_field_fallback' ], 10, 1 );

        // Exponer en WooCommerce REST API
        add_filter( 'woocommerce_rest_prepare_product_object', [ $this, 'add_to_rest' ], 10, 3 );

        // Auto-traducir al guardar (si la opción está activa)
        add_action( 'save_post_product', [ $this, 'auto_translate' ], 20, 3 );
    }

    public function register_metabox(): void {
        add_meta_box(
            'ayd_description_en',
            'Descripción en inglés (AYD Translate)',
            [ $this, 'render_metabox' ],
            'product',
            'normal',
            'high'
        );
    }

    public function render_metabox( \WP_Post $post ): void {
        $value     = get_post_meta( $post->ID, '_description_en', true );
        $api_ready = ! empty( get_option( 'ayd_translate_api_key' ) );
        wp_nonce_field( 'ayd_save_description_en', 'ayd_nonce' );
        ?>
        <div style="padding:4px 0;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                <?php if ( $api_ready ) : ?>
                    <button type="button" id="ayd-translate-single"
                            data-id="<?= esc_attr( $post->ID ) ?>"
                            class="button button-small">
                        Traducir descripción corta ahora
                    </button>
                    <span id="ayd-single-status" style="font-size:12px;"></span>
                <?php else : ?>
                    <p style="color:#999;font-size:12px;margin:0;">
                        Configura tu API key en <a href="<?= admin_url( 'admin.php?page=ayd-translate' ) ?>">AYD Translate</a> para traducir automáticamente.
                    </p>
                <?php endif; ?>
            </div>

            <textarea id="_description_en" name="_description_en"
                      rows="5"
                      placeholder="English description…"
                      style="width:100%;font-size:13px;line-height:1.5;resize:vertical;"
            ><?= esc_textarea( $value ) ?></textarea>

            <p style="color:#999;font-size:11px;margin:4px 0 0;">
                Este texto se usa en el sitio web en inglés. Se guarda en el campo <code>_description_en</code>.
            </p>
        </div>
        <?php
        if ( $api_ready ) {
            $this->print_single_script();
        }
    }

    public function save_field( int $post_id ): void {
        if ( ! isset( $_POST['ayd_nonce'] ) ) return;
        if ( ! wp_verify_nonce( $_POST['ayd_nonce'], 'ayd_save_description_en' ) ) return;
        if ( ! current_user_can( 'edit_post', $post_id ) ) return;

        $value = isset( $_POST['_description_en'] )
            ? wp_kses_post( wp_unslash( $_POST['_description_en'] ) )
            : '';
        update_post_meta( $post_id, '_description_en', $value );
    }

    // Fallback for non-WooCommerce save paths
    public function save_field_fallback( int $post_id ): void {
        $this->save_field( $post_id );
    }

    public function add_to_rest( \WP_REST_Response $response, \WC_Product $product, \WP_REST_Request $request ): \WP_REST_Response {
        $response->data['description_en'] = get_post_meta( $product->get_id(), '_description_en', true );
        return $response;
    }

    public function auto_translate( int $post_id, \WP_Post $post, bool $update ): void {
        if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) return;
        if ( ! get_option( 'ayd_translate_auto', false ) ) return;

        $existing = get_post_meta( $post_id, '_description_en', true );
        if ( ! empty( $existing ) ) return;

        $description = $post->post_excerpt;
        if ( empty( $description ) ) return;

        $api_key = get_option( 'ayd_translate_api_key', '' );
        if ( empty( $api_key ) ) return;

        remove_action( 'save_post_product', [ $this, 'auto_translate' ], 20 );

        $gemini     = new AYD_Gemini( $api_key );
        $translated = $gemini->translate( wp_strip_all_tags( $description ) );

        if ( ! is_wp_error( $translated ) ) {
            update_post_meta( $post_id, '_description_en', $translated );
        }

        add_action( 'save_post_product', [ $this, 'auto_translate' ], 20, 3 );
    }

    private function print_single_script(): void {
        ?>
        <script>
        jQuery(function($){
            $('#ayd-translate-single').on('click', function(){
                const btn    = $(this);
                const status = $('#ayd-single-status');
                btn.prop('disabled', true).text('Traduciendo…');
                status.text('').css('color','');

                $.post(ajaxurl, {
                    action:     'ayd_translate_single',
                    nonce:      '<?= wp_create_nonce( 'ayd_translate_nonce' ) ?>',
                    product_id: btn.data('id'),
                }, function(res){
                    if(res.success){
                        $('#_description_en').val(res.data.translated);
                        status.text('✓ Traducido — recuerda guardar el producto').css('color','#00a32a');
                    } else {
                        status.text('✗ ' + (res.data || 'Error')).css('color','#d63638');
                    }
                    btn.prop('disabled', false).text('Traducir descripción corta ahora');
                }).fail(function(){
                    status.text('✗ Error de conexión').css('color','#d63638');
                    btn.prop('disabled', false).text('Traducir descripción corta ahora');
                });
            });
        });
        </script>
        <?php
    }
}
