<?php
/**
 * @package compositeproducts
 */
/*
Plugin Name: Composite Products
Plugin URI: http://vbnl.net/
Description: Composite Products for Woocommerce
Version: 0.0.1
Author: tbi
Author URI: http://vbnl.net/
License: commercial
*/
// Make sure we don't expose any info if called directly
if ( !function_exists( 'add_action' ) ) { die( 'dont call plugin directly!' ); }

define( 'COPR_PLUGIN_URL', plugin_dir_url( __FILE__ ));
define( 'COPR_PATH', dirname( __FILE__ ).'/' );

define( 'COPR_PLUGINS', COPR_PATH.'plugins/' );
define( 'COPR_LIB', COPR_PATH.'lib/' );
define( 'COPR_CONFIG', COPR_PATH.'config/' );
define( 'COPR_VIEW', COPR_PATH.'view/' );
define( 'COPR_TOOLS', COPR_PATH.'tools/' );

define( 'COPR_SITEURL', get_bloginfo( 'wpurl' ).'/wp-content/plugins/composite_products/view/' );
require_once( COPR_LIB.'bootstrap.php' );

add_action( 'init', 'copr_bootstrap::init', -100 );
add_action( 'wp_enqueue_scripts','copr_bootstrap::loadScripts' );

add_action( 'woocommerce_add_to_cart' , 'repair_woocommerce_2_2_8_session_add_to_cart');

function repair_woocommerce_2_2_8_session_add_to_cart( ){
    if ( defined( 'DOING_AJAX' ) ) {
        wc_setcookie( 'woocommerce_items_in_cart', 1 );
        wc_setcookie( 'woocommerce_cart_hash', md5( json_encode( WC()->cart->get_cart() ) ) );
        do_action( 'woocommerce_set_cart_cookies', true );
    }
}
