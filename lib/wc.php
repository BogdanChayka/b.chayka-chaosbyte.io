<?php

class copr_wc
{

    private static $cartData = array();
    private static $productCounter = 0;
    private static $productInsertCounter = 0;
    private static $metas = array();
    private static $meObject = false;

    public static function override_itemdata($item, $values, $key)
    {
        $_SESSION['out'] .= '1';
        self::$productCounter = 0;
        //print_r($values);
        if (array_key_exists('menu_details', $values)) {
            $item['menu_details'] = $values['menu_details'];
            $token = $item['product_id']; #.'_'.( $item[ 'line_total' ]+$item[ 'line_tax' ] );
            $token = $item['product_id'] . '_' . ($item['line_total'] + $item['line_tax']);
            self::$cartData[md5($token)] = $values['menu_details'];
            $_SESSION['altp_' . self::$productInsertCounter] = $values['menu_details'];
            self::$productInsertCounter++;
        }
        return $item;
    }

    public static function my_custom_data($cart_item_meta, $product_id)
    {
        $_SESSION['out'] .= '2';
        print_r($_POST);
        $cart_item_meta['menu_details'] = json_encode($_POST['details']);
        return $cart_item_meta;
    }

    public static function add_custom_price($cart)
    {
        $_SESSION['out'] .= '3';
        foreach ($cart->cart_contents as $value) {
            $myData = json_decode($value['menu_details'], true);
            if ($myData) {
                $value['data']->set_price($myData['price']);
                $value['data']->set_regular_price($myData['price']);
                $cartItemName = $value['data']->get_name();
                $value['data']->set_name($cartItemName . '<br /><span style="font-weight: normal;">'. $myData['description'] . '</span>');
            }
        }
    }

    // zeigt produktpreis in warenkorb etc (live)
    public static function small_custom_price($wc, $cart_item, $cart_item_key)
    {

        self::$productCounter++;
        $_SESSION['out'] .= '4';
        if (!isset(self::$metas[$cart_item['product_id']])) {
            self::$metas[$cart_item['product_id']] = pods('product', $cart_item['product_id'])->raw('becher_config');
            if (self::$metas[$cart_item['product_id']]) self::$metas[$cart_item['product_id']] = json_decode(self::$metas[$cart_item['product_id']], true);
        }

        if (self::$metas[$cart_item['product_id']]) {
            $p = 0;
            $myData = json_decode($cart_item['menu_details'], true);
            //$menge = $myData['Menge'];
            /*d(self::$metas[$cart_item['product_id']]);
            $amount = intval(self::$metas[$cart_item['product_id']][$menge]['Menge']);
            foreach (self::$metas[$cart_item['product_id']][$menge] as $k => $v) {
                $sk = html_entity_decode($k, ENT_COMPAT | ENT_HTML401, 'UTF-8');
                if ($k == 'Menge') continue;
                if (isset($myData[$sk])) {
                    $dv = self::$metas[$cart_item['product_id']][$menge][$k]['values'][$myData[$sk]];
                    if (strpos($dv['value'], 'p.t') !== false) $p += floatval(trim(str_replace('p.t', '', $dv['value']))) * ($amount / 1000);
                    else $p += floatval($dv['value']);
                }
            }*/
            //d($cart_item['data']->price);
            $cart_item['data']->price = "20.50";

            $wc = '<span class="woocommerce-Price-amount amount">' . number_format(20.50, 2, ',', '.') . '&nbsp;<span class="woocommerce-Price-currencySymbol">€</span></span>';
        }

        return $wc;
    }
}
