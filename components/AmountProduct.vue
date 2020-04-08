<template>
    <div class="configurator">

        <div class="flex-container">
            <div class="label-box title" style="flex-basis: 160px; text-align: right;">
                <label>{{stringHelper.clear(lang.AMOUNT)}}</label>
            </div>
            <div>
                <select name="amount" v-model="amount">
                    <option v-for="(productAmount, index) in productAmounts" :value="index">
                        {{productAmount.value}}
                    </option>
                </select>
            </div>
        </div>

        <div class="flex-container">
            <div class="label-box title" style="flex-basis: 160px; text-align: right;">
                <label><span v-html="lang.SIZE"></span></label>
            </div>
            <div>
                <select name="size" v-model="size">
                    <option v-for="(productSize, index) in productSizes.values" :value="index">
                        {{productSize.label}} {{'(' + formatPrice(productSize.value) + ')'}}
                    </option>
                </select>
            </div>
        </div>

        <div class="flex-container"
             v-for="productFields in productSelectFields">
            <div class="label-box title" style="flex-basis: 160px; text-align: right;">
                <label>{{stringHelper.clear(productFields.label)}}</label>
            </div>
            <div>
                <select v-model="productFields.selected" @change="onProductFieldValueChanged()">
                    <option v-for="(productField, index) in productFields.values"
                            v-html="productField.label + ' (+ '+ formatPrice(productField.value)+')'"
                            :value="{index: index, value: productField.value}">
                    </option>
                </select>
            </div>
        </div>

        <div class="flex-container">
            <div class="label-box title" style="flex-basis: 160px; text-align: right;"></div>
            <div>
                <button type="submit" class="single_add_to_cart_button button alt" @click="addToCart()">In den Warenkorb
                </button>
            </div>
            <div>
                <div class="configurator-price">
                    {{product.getPrice(totalSum)}}
                    <span class="configurator-price-info">
                         zzgl. Versand
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Product from '../services/Product';
    import Format from '../helpers/Format';
    import Render from '../helpers/Render';
    import Lang from '../language/Lang';
    import StringHelper from "../helpers/StringHelper";

    export default {
        name: 'AmountProduct',
        props: {
            productDataCollection: Array
        },
        data() {
            return {
                lang: Lang,
                product: new Product(),
                productData: Array,
                productAmounts: Array,
                productSizes: Array,
                productSelectFields: Array,
                productDataSelected: Array,
                amount: 0,
                size: 0,
                selectedFieldsSum: Number,
                basePrice: Number,
                stringHelper: new StringHelper(),
                totalSum: 0,
            }
        },

        mounted() {
            Render.hideQuantity(); // The regular WooCommerce quantity has to be hidden
            this.setProductData(this.amount);
            this.buildFormData(this.productData, this.productDataCollection);
        },

        methods: {
            /**
             * From the productDataCollection the productData Object ist being extracted
             */
            setProductData(amount) {
                this.productData = this.product.getProductData(this.productDataCollection, amount);
            },

            /**
             * Building the form based on the productData
             */
            buildFormData() {
                this.productAmounts = this.product.getProductAmounts(this.productDataCollection);
                this.productSizes = this.product.getProductSizes(this.productData);
                this.productSelectFields = this.product.getProductSelectFields(this.productData);
                this.basePrice = this.product.getBasePrice(this.productSizes, this.size);

                this.setProductDataSelected();
                this.setTotalPrice();
            },

            /**
             *  When a product field is changed in value
             */
            onProductFieldValueChanged() {
                this.setProductDataSelected();
                this.setTotalPrice();
            },

            /**
             * Setting the object, that shows which fields are selected (except size & amount)
             * and calculating the sum of the fields, which is added on top of the base price
             */
            setProductDataSelected() {
                this.productDataSelected = this.product.setProductDataSelected(this.productSelectFields);
                this.selectedFieldsSum = this.product.getSelectFieldsSum(this.productDataSelected);
            },

            /**
             * @param price
             * @returns {string}
             */
            formatPrice(price) {
                return Format.price(price) + ' €';
            },

            /**
             * Setting the total price with basePrice and selectedFieldsSum
             * and rendering it into the WooCommerce template
             */
            setTotalPrice() {
                const totalSum = this.product.getTotalPrice(this.basePrice, this.selectedFieldsSum);
                this.totalSum = totalSum;
                Render.price(totalSum);
            },

            addToCart() {
                const productId = this.product.getProductId();
                const price = this.product.getTotalPrice(this.basePrice, this.selectedFieldsSum);
                let description = '';

                _.each(this.productSelectFields, (field) => {
                    if (field.selected.index || field.label === 'Lieferzeit *') {
                        description += `${this.stringHelper.clear(field.label)}: ${field.values[field.selected.index].label} <br />`;
                    }
                });

                const details = {
                    type: 'size',
                    price: price,
                    height: this.height,
                    width: this.width,
                    description: description
                };

                this.product.addToCart(productId, details);
                window.location.reload();
            }
        },
        watch: {
            amount: function (amount) {
                this.setProductData(amount);
                this.buildFormData();
            },
            size: function () {
                this.buildFormData();
            }
        }
    }
</script>

<style lang="css" scoped>
    .configurator {
        background: #d9eaf0 url("https://adworqs.sprintflow.io/wp-content/uploads/2019/10/background-pattern.png");
        background-size: cover;
        padding: 50px 10px;
    }

    .flex-container {
        display: flex;
        align-content: stretch;
        flex-wrap: wrap;
        margin-bottom: 15px;
    }

    .label-box {
        padding: 10px;
    }

    .label-box.title {
        font-weight: bold;
        text-transform: uppercase;
        padding-right: 15px;
    }

    .size input {
        width: 100px;
        text-align: center;
        font-weight: bold;
    }

    input, select {
        border: none;
        -webkit-box-shadow: 0 0 5px rgba(0,0,0,0.2);
        -moz-box-shadow: 0 0 5px rgba(0,0,0,0.2);
        box-shadow: 0 0 5px rgba(0,0,0,0.2);
    }

    select {
        width: 340px;
        font-weight: normal;
        text-transform: none;
    }
    .configurator-price {
        font-weight: bold;
        font-size: 18px;
        padding-left: 10px;
    }
    .configurator-price-info {
        display: block;
        font-weight: normal;
        font-size: 12px;
    }
</style>
