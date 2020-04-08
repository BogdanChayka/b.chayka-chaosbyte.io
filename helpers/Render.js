import Format from "./Format";

export default class Render {

    /**
     * Set the price each time there is an update
     * @param sum
     */
    static price(sum) {
        jQuery('p.price').html('<span class="woocommerce-Price-amount amount">' + Format.price(sum, 2) + '&nbsp;<span class="woocommerce-Price-currencySymbol">€</span></span>');
    }

    static hideQuantity() {
        jQuery(".quantity").hide();
        jQuery(".cart").hide();
    }

    /**
     * Update pictures after amount change
     * @param productPicture
     */
    static picture(productPicture) {
        jQuery('.woocommerce-product-gallery img').attr('src', '/' + productPicture);
        jQuery('.woocommerce-product-gallery img[srcset]').attr('srcset', '/' + productPicture);
        jQuery('.woocommerce-product-gallery img[data-src]').attr('data-src', '/' + productPicture);
        jQuery('.woocommerce-product-gallery div[data-thumb]').attr('data-thumb', '/' + productPicture);
        jQuery('.woocommerce-product-gallery img[data-large_image]').attr('data-large_image', '/' + productPicture);
        jQuery('.woocommerce-product-gallery a[href]').attr('href', '/' + productPicture);
    }

    static addedToCart() {
        if (localStorage.hasInsert == 'OK') {
            localStorage.hasInsert = 'FAIL';
            jQuery('#copr_editor').before('<div class="woocommerce copr_updater"><div class="woocommerce-message "><a href="/warenkorb/" class="button wc-forward">Warenkorb ansehen</a> Das Produkt wurde deinem Warenkorb hinzugefügt.</div></div>');
        }
    }
}
