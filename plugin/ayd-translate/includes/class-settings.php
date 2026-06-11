<?php

class AYD_Settings {

    public function __construct() {
        add_action( 'admin_menu',  [ $this, 'add_menu' ] );
        add_action( 'admin_init',  [ $this, 'register_settings' ] );
    }

    public function add_menu(): void {
        add_menu_page(
            'AYD Translate',
            'AYD Translate',
            'manage_options',
            'ayd-translate',
            [ $this, 'render_page' ],
            'dashicons-translation',
            56
        );
    }

    public function register_settings(): void {
        register_setting( 'ayd_translate_group', 'ayd_translate_provider', [
            'sanitize_callback' => 'sanitize_text_field',
            'default'           => 'deepl',
        ] );
        register_setting( 'ayd_translate_group', 'ayd_translate_api_key', [
            'sanitize_callback' => 'sanitize_text_field',
        ] );
        register_setting( 'ayd_translate_group', 'ayd_translate_auto', [
            'sanitize_callback' => 'rest_sanitize_boolean',
        ] );
    }

    public function render_page(): void {
        $total      = (int) ( wp_count_posts( 'product' )->publish ?? 0 );
        $translated = count( get_posts( [
            'post_type'      => 'product',
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'fields'         => 'ids',
            'meta_query'     => [
                [ 'key' => '_description_en', 'compare' => '!=', 'value' => '' ],
            ],
        ] ) );
        $pending    = $total - $translated;
        $api_key    = get_option( 'ayd_translate_api_key', '' );
        $provider   = get_option( 'ayd_translate_provider', 'groq' );
        ?>
        <div class="wrap">
            <h1>AYD Home Decor — Traducción AI</h1>

            <!-- Stats -->
            <div style="display:flex;gap:16px;margin:20px 0;">
                <?php foreach ( [
                    [ 'label' => 'Total productos',     'value' => $total,      'color' => '#2271b1' ],
                    [ 'label' => 'Con traducción',      'value' => $translated, 'color' => '#00a32a' ],
                    [ 'label' => 'Sin traducción',      'value' => $pending,    'color' => $pending > 0 ? '#d63638' : '#00a32a' ],
                ] as $stat ) : ?>
                <div style="background:#fff;border:1px solid #ccd0d4;border-radius:4px;padding:16px 24px;min-width:140px;text-align:center;">
                    <div style="font-size:32px;font-weight:700;color:<?= $stat['color'] ?>;"><?= $stat['value'] ?></div>
                    <div style="color:#666;font-size:13px;"><?= $stat['label'] ?></div>
                </div>
                <?php endforeach; ?>
            </div>

            <!-- Settings form -->
            <div style="background:#fff;border:1px solid #ccd0d4;border-radius:4px;padding:20px;margin-bottom:20px;">
                <h2 style="margin-top:0;">Configuración</h2>
                <form method="post" action="options.php">
                    <?php settings_fields( 'ayd_translate_group' ); ?>
                    <table class="form-table">
                        <tr>
                            <th><label for="ayd_translate_provider">Proveedor de traducción</label></th>
                            <td>
                                <select id="ayd_translate_provider" name="ayd_translate_provider">
                                    <option value="groq"     <?php selected( $provider, 'groq' ); ?>>Groq — Llama 3.1 (recomendado · sin tarjeta · 14,400 req/día)</option>
                                    <option value="mymemory" <?php selected( $provider, 'mymemory' ); ?>>MyMemory (sin tarjeta · 10k palabras/día)</option>
                                    <option value="deepl"    <?php selected( $provider, 'deepl' ); ?>>DeepL (500k chars/mes · requiere tarjeta)</option>
                                    <option value="gemini"   <?php selected( $provider, 'gemini' ); ?>>Gemini 2.0 Flash (Google · 1500 req/día)</option>
                                </select>
                                <p class="description" id="ayd-provider-hint-groq" <?= $provider !== 'groq' ? 'style="display:none"' : '' ?>>
                                    Obtén tu key gratis (sin tarjeta) en <a href="https://console.groq.com" target="_blank">console.groq.com</a> → API Keys → Create API Key. Límite: 30 req/min · 14,400 req/día.
                                </p>
                                <p class="description" id="ayd-provider-hint-mymemory" <?= $provider !== 'mymemory' ? 'style="display:none"' : '' ?>>
                                    Coloca tu email registrado en <a href="https://mymemory.translated.net" target="_blank">mymemory.translated.net</a> en el campo API Key.
                                </p>
                                <p class="description" id="ayd-provider-hint-deepl" <?= $provider !== 'deepl' ? 'style="display:none"' : '' ?>>
                                    Obtén tu key en <a href="https://www.deepl.com/en/pro-api" target="_blank">deepl.com/en/pro-api</a>. La key termina en <code>:fx</code>.
                                </p>
                                <p class="description" id="ayd-provider-hint-gemini" <?= $provider !== 'gemini' ? 'style="display:none"' : '' ?>>
                                    Obtén tu key en <a href="https://aistudio.google.com" target="_blank">aistudio.google.com</a> → Get API key → Create API key in new project.
                                </p>
                                <script>
                                document.getElementById('ayd_translate_provider').addEventListener('change', function(){
                                    ['groq','mymemory','deepl','gemini'].forEach(function(p){
                                        document.getElementById('ayd-provider-hint-' + p).style.display = (p === this.value) ? '' : 'none';
                                    }, this);
                                });
                                </script>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="ayd_translate_api_key">
                                <?= $provider === 'mymemory' ? 'Email de MyMemory' : 'API Key' ?>
                            </label></th>
                            <td>
                                <input type="<?= $provider === 'mymemory' ? 'email' : 'password' ?>"
                                       id="ayd_translate_api_key" name="ayd_translate_api_key"
                                       value="<?= esc_attr( $api_key ) ?>" class="regular-text" autocomplete="off"
                                       placeholder="<?= $provider === 'mymemory' ? 'tucorreo@gmail.com' : '' ?>" />
                                <?php if ( $provider === 'mymemory' ) : ?>
                                <p class="description">Tu email registrado en MyMemory activa el límite de 10,000 palabras/día.</p>
                                <?php endif; ?>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="ayd_translate_auto">Auto-traducir al guardar</label></th>
                            <td>
                                <label>
                                    <input type="checkbox" id="ayd_translate_auto" name="ayd_translate_auto"
                                           value="1" <?php checked( 1, get_option( 'ayd_translate_auto', 0 ) ); ?> />
                                    Traducir automáticamente cuando se crea un producto nuevo
                                    (solo si el campo en inglés está vacío)
                                </label>
                            </td>
                        </tr>
                    </table>
                    <?php submit_button( 'Guardar configuración' ); ?>
                </form>
            </div>

            <!-- Batch translation -->
            <div style="background:#fff;border:1px solid #ccd0d4;border-radius:4px;padding:20px;">
                <h2 style="margin-top:0;">Traducción masiva</h2>
                <p style="color:#666;">
                    Traduce en lotes todos los productos vía Gemini 2.0 Flash (gratis · hasta 1500 req/día).
                </p>

                <?php if ( empty( $api_key ) ) : ?>
                    <div class="notice notice-warning inline" style="margin:0 0 16px;">
                        <p>Primero guarda tu API key para habilitar la traducción masiva.</p>
                    </div>
                <?php endif; ?>

                <div style="display:flex;gap:10px;flex-wrap:wrap;">
                    <button id="ayd-btn-pending" class="button button-primary"
                            <?= empty( $api_key ) ? 'disabled' : '' ?>>
                        Traducir pendientes (<?= $pending ?>)
                    </button>
                    <button id="ayd-btn-all" class="button"
                            <?= empty( $api_key ) ? 'disabled' : '' ?>>
                        Retraducir todos (<?= $total ?>)
                    </button>
                    <button id="ayd-btn-stop" class="button" style="display:none;">
                        Detener
                    </button>
                </div>

                <div id="ayd-progress-wrap" style="margin-top:16px;display:none;">
                    <div style="background:#f0f0f1;border-radius:4px;height:18px;overflow:hidden;">
                        <div id="ayd-bar" style="background:#2271b1;height:100%;width:0%;transition:width .3s;"></div>
                    </div>
                    <p id="ayd-progress-text" style="margin:6px 0 0;font-size:13px;color:#666;"></p>
                </div>

                <div id="ayd-log" style="
                    margin-top:16px;display:none;max-height:320px;overflow-y:auto;
                    font-family:monospace;font-size:12px;line-height:1.6;
                    background:#f6f7f7;border:1px solid #ddd;border-radius:4px;padding:10px;
                "></div>
            </div>
        </div>
        <?php
    }
}
