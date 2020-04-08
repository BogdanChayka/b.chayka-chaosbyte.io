import _ from "lodash";
import Lang from '../language/Lang';
import Format from '../helpers/Format';
import Calculate from '../helpers/Calculate';
import StringHelper from '../helpers/StringHelper';

export default class Product {

    getProductId() {
        return jQuery('#current_id').data('id');
    }

    /**
     * This is the main data being generated as JSON format and printed as global variable
     * @returns {Promise<Array>}
     */
    getProductDataCollection() {
        return copr_productdata;
    }

    /**
     * @params productDataCollection, selectedAmount
     * @returns productData
     */
    getProductData(productDataCollection, selectedAmount) {
        return productDataCollection[selectedAmount];
    }

    /**
     *
     * @param productDataCollection
     * @return {Array}
     */
    getProductAmounts(productDataCollection) {

        const productAmounts = [];

        _.each(productDataCollection, (productDataCollection) => {
            productAmounts.push({value: productDataCollection[Lang.AMOUNT]})
        });

        return productAmounts;
    }

    /**
     * @param productData
     * @returns {Object}
     */
    getProductSizes(productData) {
        return productData[Lang.SIZE];
    }

    /**
     *
     * @param productData
     * @return {*}
     */
    getRequirements(productData) {
        return productData['Requirements'].values;
    }

    getAmounts(productDatacollection) {
        const productAmounts = [];
        _.each(productDatacollection, (productData) => {
            productAmounts.push(productData[Lang.AMOUNT].values);
        });
        return productAmounts;
    }

    /**
     * @returns {number}
     */
    getBasePrice(productSizes, size) {
        return productSizes.values[size].value;
    }

    getTotalPrice(basePrice, selectedFieldsSum) {
        const fieldsSum = selectedFieldsSum ? parseFloat(selectedFieldsSum) : 0;
        return parseFloat(basePrice) + parseFloat(fieldsSum);
    }

    /**
     * @param productData
     * @return {Array}
     */
    getProductSelectFields(productData) {

        const productSelectFields = [];

        _.each(productData, (productData, index) => {
            if (
                productData.label !== Lang.AMOUNT &&
                productData.label !== Lang.SIZE &&
                productData.label !== Lang.HEIGHT &&
                productData.label !== Lang.PICTURES &&
                productData.label !== 'Requirements' &&
                productData.label !== Lang.PRICE &&
                productData.label !== Lang.INFO &&
                productData.values
            ) {
                productSelectFields.push({
                    index: index,
                    label: productData.label,
                    values: productData.values,
                    selected: {index: 0, value: 0}
                });
            }
        });

        return productSelectFields;
    }


    /**
     *
     * @param productDataSelected
     * @return {number}
     */
    getSelectFieldsSum(productDataSelected) {
        let selectedFieldsSum = 0;

        _.each(productDataSelected, (selected) => {
            selectedFieldsSum += parseFloat(selected.value);
        });

        return parseFloat(selectedFieldsSum);
    }

    /**
     * This function outputs the value of each select field
     * that gets added on top of the base price
     * @param productSelectFields
     * @param size
     * @param basePrice
     * @returns {Array}
     */
    setProductDataSelected(productSelectFields, size = 0, basePrice = 0) {
        const productDataSelected = [];
        const stringHelper = new StringHelper();

        _.each(productSelectFields, (productSelectField) => {

            let productSelectValue = productSelectField.selected.value;

            if (stringHelper.isSquareMeterPrice(productSelectField.label)) {
                productSelectValue = Format.squareMeter(productSelectValue) * size;
            } else if (stringHelper.isPercentPrice(productSelectField.label)) {
                productSelectValue = basePrice * (productSelectValue / 100);
            }

            productDataSelected.push({
                index: productSelectField.selected.index,
                label: productSelectField.label,
                value: parseFloat(productSelectValue)
            });

        });

        return productDataSelected;
    }

    getSpecialFieldValue(productSelectFields) {
        let specialFieldValue = 0;

        _.each(productSelectFields, (productSelectField) => {
            if (productSelectField.label.indexOf('Veredelung (m2)') >= 0) {
                specialFieldValue = parseFloat(productSelectField.selected.value);
            }
        });

        return specialFieldValue;
    }


    getFixedPrice(productFieldValue) {
        return Format.formatPrice(productFieldValue);
    }

    getPercentPrice(productField, basePrice) {
        return Format.formatPrice(Calculate.percent(basePrice, productField.value));
    }

    getSquareMeterPrice(productFieldValue, size) {
        return Format.formatPrice(Calculate.squareMeter(productFieldValue, size));
    }

    getPrice(sum) {
        return Format.formatPrice(sum);
    }

    /**
     * @returns {boolean}
     */
    addToCart(productId, details) {
        jQuery.ajax({
            url: coprTarget,
            data: {
                quantity: 1,
                details: details,
                id: productId,
            },
            method: 'POST',
            success: function (data) {
                return data;
            },
            type: 'POST'
        });

        return false;
    }
}
