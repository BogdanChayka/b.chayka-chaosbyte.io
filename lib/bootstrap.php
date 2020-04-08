<?php

class copr_bootstrap
{

    public static $productCategory = false;
    public static $menuProduct = false;
    public static $stored = false;

    public static function init()
    {

        session_start();
        require_once(COPR_CONFIG . 'config.php');
        require_once(COPR_LIB . 'wc.php');
        $_SESSION['out'] = '';

        wp_enqueue_style('copr_style', COPR_PLUGIN_URL . 'view/css/copr.css', array(), false);
        if (!is_admin()) {
            wp_enqueue_script('copr_main', COPR_PLUGIN_URL . 'assets/js/frontend.js', array('jquery'), false);
        }

        add_action('save_post', 'copr_bootstrap::save', 50, 3);
        add_action('woocommerce_before_add_to_cart_form', 'copr_bootstrap::showForm');

        #if( isset( $_POST[ 'overrideme' ] ) ){
        add_filter('woocommerce_add_cart_item_data', 'copr_wc::my_custom_data', -10, 2);
        #}

        add_filter('woocommerce_get_cart_item_from_session', 'copr_wc::override_itemdata', -10, 3);
        add_filter('woocommerce_cart_item_price', 'copr_wc::small_custom_price', -10, 3);
        add_filter('woocommerce_gzd_product_cart_description', 'copr_wc::short_description', -10, 2);
        add_action('woocommerce_before_calculate_totals', 'copr_wc::add_custom_price', -10);

    }

    public static function showForm()
    {
        global $post;
        $p = pods('product', $post->ID);
        if ($p) {
            $data = $p->raw('becher_config');
            if ($data) {
                echo '<script type="text/javascript">copr_productdata = ' . ($data) . ';var coprTarget = "' . COPR_PLUGIN_URL . 'ajx.php"; </script><div id="app"></div>';
            }
        }
    }

    public static function save($post_id, $post, $update)
    {
        if ($post->post_type == 'product' && !self::$stored) {
            $p = pods('product', $post_id);
            $data = array();
            $cpreheader = false;
            $preheader = array();
            $header = array();
            if ($p->raw('becher_csv'))
                if ($p->raw('becher_csv')['guid']) {
                    $csv = explode("\n", (file_get_contents($p->raw('becher_csv')['guid'])));
                    foreach ($csv as $k => $c) {
                        $c = str_getcsv($c, ',');
                        $d = array();
                        foreach ($c as $sk => $sv) {
                            $sv = htmlentities(trim($sv));
                            $sv = str_replace(chr(239), '', $sv);
                            $sv = str_replace(chr(187), '', $sv);
                            $sv = str_replace(chr(191), '', $sv);
                            if ($k == 0) {
                                if ($sv) {
                                    $preheader[$sk] = $sv;
                                    $cpreheader = $sv;
                                } else $preheader[$sk] = $cpreheader;
                            } else if ($k == 1) {
                                $header[$sk] = $sv;
                            } else {
                                $sv = str_replace('€', '', $sv);
                                $sv = str_replace('EUR', '', $sv);
                                //$sv = str_replace(',', '.', $sv);
                                $sv = str_replace('.-', '.0', $sv);

                                if (trim($preheader[$sk])) {
                                    if (!isset($d[$preheader[$sk]])) $d[$preheader[$sk]] = array('values' => array(), 'label' => $preheader[$sk]);
                                    if (trim($sv) || trim($sv) === '0') $d[$preheader[$sk]]['values'][] = array('value' => $sv, 'label' => $header[$sk]);
                                } else {
                                    $d[$header[$sk]] = $sv;
                                }
                            }
                        }
                        if (count($d) && @$d['Titel']) {
                            foreach ($d as $dk => $dv) {
                                if (is_array($dv) && !count($dv['values'])) unset($d[$dk]);
                            }
                            $data[] = $d;
                        }
                    }
                    $p->save(array(
                        'becher_config' => json_encode($data)
                    ));
                }
        }
    }

    public static function loadScripts()
    {

    }

    public static function wpse_mime_types($existing_mimes)
    {
        $existing_mimes['csv'] = 'text/csv';
        return $existing_mimes;
    }

    public static function ignore_upload_ext($checked, $file, $filename, $mimes)
    {
        if (!$checked['type']) {
            $wp_filetype = wp_check_filetype($filename, $mimes);
            $ext = $wp_filetype['ext'];
            $type = $wp_filetype['type'];
            $proper_filename = $filename;
            if ($type && $ext !== 'csv') {
                $ext = $type = false;
            }
            $checked = compact('ext', 'type', 'proper_filename');
        }
        return $checked;
    }
}

add_filter('upload_mimes', 'copr_bootstrap::wpse_mime_types');
add_filter('mime_types', 'copr_bootstrap::wpse_mime_types');
add_filter('wp_check_filetype_and_ext', 'copr_bootstrap::ignore_upload_ext', 10, 4);
