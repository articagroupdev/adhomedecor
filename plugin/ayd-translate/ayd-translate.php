<?php
/**
 * Plugin Name: AYD Home Decor — Translate
 * Description: Añade campo de descripción en inglés a productos WooCommerce con traducción automática via Gemini AI.
 * Version:     1.0.0
 * Author:      AYD Home Decor
 * Requires at least: 6.0
 * Requires PHP: 8.0
 */

if ( ! defined( 'ABSPATH' ) ) exit;

define( 'AYD_TRANSLATE_PATH',    plugin_dir_path( __FILE__ ) );
define( 'AYD_TRANSLATE_URL',     plugin_dir_url( __FILE__ ) );
define( 'AYD_TRANSLATE_VERSION', '1.0.0' );

require_once AYD_TRANSLATE_PATH . 'includes/class-gemini.php';
require_once AYD_TRANSLATE_PATH . 'includes/class-deepl.php';
require_once AYD_TRANSLATE_PATH . 'includes/class-mymemory.php';
require_once AYD_TRANSLATE_PATH . 'includes/class-groq.php';
require_once AYD_TRANSLATE_PATH . 'includes/class-product-field.php';
require_once AYD_TRANSLATE_PATH . 'includes/class-settings.php';
require_once AYD_TRANSLATE_PATH . 'includes/class-batch.php';

add_action( 'plugins_loaded', function () {
    if ( ! class_exists( 'WooCommerce' ) ) {
        add_action( 'admin_notices', function () {
            echo '<div class="notice notice-error"><p><strong>AYD Translate:</strong> requiere WooCommerce activo.</p></div>';
        } );
        return;
    }

    new AYD_Product_Field();
    new AYD_Settings();
    new AYD_Batch();
} );
