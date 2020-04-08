import Vue from 'vue';

Vue.component('product-configurator', require('./components/ProductConfigurator.vue').default);
Vue.component('amount-product', require('./components/AmountProduct.vue').default);
Vue.component('size-product', require('./components/SizeProduct.vue').default);

document.addEventListener('DOMContentLoaded', function () {
    new Vue({
        el: '#app',
        template: '<product-configurator></product-configurator>'
    });
});
