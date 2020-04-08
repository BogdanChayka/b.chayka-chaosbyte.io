import Product from '../../services/Product';
import FormBuilder from './FormBuilder';
import Vue from 'vue';

const product = new Product();
const formBuilder = new FormBuilder();

Vue.component('configurator', require('../../components/Configurator.vue').default);

jQuery(document).ready(function () {

    const app = new Vue({
        el: '#app',
        template: '<configurator></configurator>'
    });

    /*formBuilder.addQuantity();
    formBuilder.init();
    Product.init();

    // if change is detected in amount, the form gets rebuilt
    jQuery('#copr_amount').change(function () {
        formBuilder.init();
    }).change();

    // Adding product to cart
    jQuery('.single_add_to_cart_button').click(function () {
        product.addToCart();
    });*/
});
