<?php
$_POST[ 'overrideme' ] = 1;
$_POST[ 'quantity' ] = 1;
$_POST[ 'add-to-cart' ] = '2215';
$_POST[ 'product_id' ] = '2215';

require_once( '../../../wp-load.php' );

global $woocommerce;
$_POST[ 'quantity' ] = 1;
WC()->cart->add_to_cart( $_POST[ 'id' ], $_POST[ 'quantity' ] );
echo '1';
die();
