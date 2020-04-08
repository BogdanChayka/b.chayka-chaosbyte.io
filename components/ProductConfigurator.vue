<template>
    <div>
        <amount-product v-if="type === 'amount'" :product-data-collection="productDataCollection"></amount-product>
        <size-product v-if="type === 'size'" :product-data-collection="productDataCollection"></size-product>
    </div>
</template>

<script>
    import Product from "../services/Product";

    export default {
        name: "ProductConfigurator",
        data() {
            return {
                type: '',
                product: new Product(),
                amount: 0,
                productDataCollection: [],
            }
        },
        mounted() {
            this.setProductDataCollection();
            this.type = this.productDataCollection[this.amount].type;
        },
        methods: {
            setProductDataCollection() {
                this.productDataCollection = this.product.getProductDataCollection();
            },
        }
    }
</script>
