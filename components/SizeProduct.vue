<template>
    <div class="configurator">
        <div class="flex-container size">
            <div class="label-box title" style="flex-basis: 160px; text-align: right;">
                <label>Format (B*H)</label>
            </div>
            <div style="flex-basis: 100px">
                <div class="height">
                    <label for="height-input">
                        <input class="slider-input" name="height" type="number" id="height-input" :maxlength="maxHeight"
                               v-model="height">
                    </label>
                </div>
            </div>
            <div class="label-box" style="flex-basis: 50px; text-align: center;">
                x
            </div>
            <div style="flex-basis: 100px">
                <div class="width">
                    <label for="height-input">
                        <input class="slider-input" name="width" type="number" id="width-input" :maxlength="maxWidth"
                               v-model="width">
                    </label>
                </div>
            </div>
            <div class="label-box" style="flex-basis: 50px; text-align: center;">
                cm
            </div>
        </div>
        <!--<div>
            <strong>{{format.parseMeter(height) * format.parseMeter(width)}} m2 <br/>
                {{height*width}} cm2</strong>
        </div>-->

        <div class="flex-container"
             v-for="productFields in productSelectFields"
             v-if="stringHelper.isSquareMeterPrice(productFields.label)">
            <div class="label-box title" style="flex-basis: 160px; text-align: right;">
                <label>{{stringHelper.clear(productFields.label)}}</label>
            </div>
            <div>
                <select v-model="productFields.selected"
                        @change="onProductFieldValueChanged()">
                    <option v-for="(productField, index) in productFields.values"
                            v-html="`${productField.label} (+ ${product.getSquareMeterPrice(productField.value, size)})`"
                            :value="{index: index, value: productField.value}">
                    </option>
                </select>
            </div>
        </div>

        <div class="flex-container" v-for="productFields in productSelectFields"
             v-if="stringHelper.isFixedPrice(productFields.label)">
            <div class="label-box title" style="flex-basis: 160px; text-align: right;">
                <label>{{stringHelper.clear(productFields.label)}}</label>
            </div>
            <div>
                <select v-model="productFields.selected"
                        @change="onProductFieldValueChanged()">
                    <option v-for="(productField, index) in productFields.values"
                            v-html="`${productField.label} (+ ${product.getFixedPrice(productField.value)})`"
                            :value="{index: index, value: productField.value}">
                    </option>
                </select>
            </div>
        </div>

        <div class="flex-container" v-for="productFields in productSelectFields"
             v-if="stringHelper.isPercentPrice(productFields.label)">
            <div class="label-box title" style="flex-basis: 160px; text-align: right;">
                <label>{{stringHelper.clear(productFields.label)}}</label>
            </div>
            <div>
                <select v-model="productFields.selected"
                        @change="onProductFieldValueChanged()">
                    <option v-for="(productField, index) in productFields.values"
                            v-html="`${productField.label} (+ ${product.getPercentPrice(productField, basePrice + specialFieldValue)})`"
                            :value="{index: index, value: productField.value}">
                    </option>
                </select>
            </div>
        </div>
        <div class="flex-container">
            <div class="label-box title" style="flex-basis: 160px; text-align: right;">

            </div>
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
        name: 'SizeProduct',
        props: {
            productDataCollection: Array
        },
        data() {
            return {
                minHeight: Number,
                maxHeight: Number,
                minWidth: Number,
                maxWidth: Number,
                height: Number,
                width: Number,
                lang: Lang,
                product: new Product(),
                productData: Array,
                productAmounts: Array,
                productSizes: Array,
                productSelectFields: Array,
                productInputFields: Array,
                productDataSelected: Array,
                index: 0,
                size: 0,
                selectedFieldsSum: Number,
                basePrice: Number,
                requirements: Array,
                format: new Format(),
                stringHelper: new StringHelper(),
                specialFieldValue: 0,
                totalSum: 0,
            }
        },

        mounted() {

            this.setProductData(this.index);
            this.setProductPicture();
            this.setRequirements(this.productData);
            this.setSize(this.minHeight, this.minWidth);
            this.buildFormData();

            // One-Time initiation
            Render.hideQuantity(); // The regular WooCommerce quantity has to be hidden
            this.setAmounts();
        },

        methods: {
            /**
             * Building the form based on the productData
             */
            buildFormData() {
                this.setProductSelectFields();
                this.setBasePrice(this.productData, this.size);
                this.setProductDataSelected();
                this.setTotalPrice();
            },

            /**
             * From the productDataCollection the productData Object ist being extracted
             */
            setProductData(amount) {
                this.productData = this.product.getProductData(this.productDataCollection, amount);
                //console.log(this.productData);
            },

            setRequirements(productData) {
                this.requirements = this.product.getRequirements(productData);
                this.minHeight = _.find(this.requirements, {label: 'minHeight'}).value;
                this.maxHeight = _.find(this.requirements, {label: 'maxHeight'}).value;
                this.minWidth = _.find(this.requirements, {label: 'minWidth'}).value;
                this.maxWidth = _.find(this.requirements, {label: 'maxWidth'}).value;

                this.height = this.minHeight;
                this.width = this.minWidth;
            },

            setSize(height, width) {
                this.size = height * width;
            },

            /**
             *
             */
            setAmounts() {
                this.productAmounts = this.product.getAmounts(this.productDataCollection);
            },

            /**
             * Setting the object, that shows which fields are selected (except size & amount)
             * and calculating the sum of the fields, which is added on top of the base price
             */
            setProductDataSelected() {
                this.specialFieldValue = this.product.getSpecialFieldValue(this.productSelectFields);
                let price = this.basePrice + this.specialFieldValue;
                this.productDataSelected = this.product.setProductDataSelected(this.productSelectFields, this.size, price);
                this.selectedFieldsSum = this.product.getSelectFieldsSum(this.productDataSelected);
            },

            setProductSelectFields() {
                this.productSelectFields = this.product.getProductSelectFields(this.productData);
            },


            setBasePrice(productData, size) {
                this.basePrice = productData[Lang.PRICE].values[0].value * Format.squareMeter(size);
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

            /**
             *
             * @param size
             */
            getIndexOfSize(size) {
                _.each(this.productAmounts, (productAmount, index) => {
                    let fromValue = productAmount[0].value;
                    let toValue = productAmount[1].value;
                    if (Format.between(size, fromValue, toValue)) {
                        this.index = index;
                        this.setProductData(index);
                        this.setSize(this.height, this.width);
                        this.buildFormData();
                    }
                });
            },

            /**
             *  When a product field is changed in value
             */
            onProductFieldValueChanged() {
                this.setProductDataSelected();
                this.setTotalPrice();
            },

            setProductPicture() {
                let productPicture = this.productData[Lang.PICTURES].values[0].value;
                Render.picture(productPicture);
            },

            validation(height, maxHeight) {
                console.log(parseFloat(height), parseFloat(maxHeight));
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
            height: function (height) {
                if (parseFloat(height) <= 0) this.height = 1;
                if (parseFloat(height) > this.maxHeight) this.height = this.maxHeight;

                this.setSize(height, this.width);
                this.getIndexOfSize(this.size);
            },
            width: function (width) {
                if (parseFloat(width) <= 0) this.width = 1;
                if (parseFloat(width) > this.maxWidth) this.width = this.maxWidth;

                this.setSize(this.height, width);
                this.getIndexOfSize(this.size);
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
