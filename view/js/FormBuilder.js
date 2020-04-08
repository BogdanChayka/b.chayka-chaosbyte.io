import Format from '../../helpers/Format';
import Product from '../../services/Product';

const product = new Product();

export default class FormBuilder {

    init() {
        jQuery('#copr_editor').append('<div id="detaileditor"></div>');
        let index = this.getIndex();
        let productData = copr_productdata[index];
        let detailEditor = jQuery('#detaileditor');

        this.cleanUpDetailForm(detailEditor);
        this.buildFormFieldsByType(productData, detailEditor);

        jQuery('#detaileditor select').change(function () {
            product.formChanged(productData);
        });
        jQuery('#detaileditor select').last().change(); // wtf is that for?

    }


    /**
     * get the index
     * @returns {*|jQuery}
     */
    getIndex() {
        let amount = jQuery('#copr_amount');
        return amount.find('option[value="' + amount.val() + '"]').attr('data-id');
    }

    /**
     *
     */
    addQuantity() {
        // hiding the regular quantity
        jQuery('.input-text.qty,form.cart > label,form.cart > .quantity').hide();

        // appending option field with amount
        jQuery('#copr_editor').append(this.addSelectField('Menge', 'copr_amount'));

        // add options to amount
        for (let i = 0; i < copr_productdata.length; i++) {
            jQuery('#copr_editor').find('#copr_amount').append('<option value="' + i + '" data-value="' + copr_productdata[i].Menge + '" data-id="' + i + '">' + Format.price(copr_productdata[i].Menge, 0) + '</option>');
        }
    }

    /**
     * Iterate through each object of the JSON File
     * @param productData
     * @param detailEditor
     */
    buildFormFieldsByType(productData, detailEditor) {
        for (let productDataColumn in productData) {
            if (typeof productData[productDataColumn] === 'object') {
                if (productDataColumn === 'Height') {
                    this.createField(productData, productDataColumn, detailEditor, 'input')
                } else if (productDataColumn === 'Bilder') {
                    // do nothing?
                } else {
                    this.createField(productData, productDataColumn, detailEditor, 'select');
                }
            }
        }
    }

    /**
     * Add select to field
     * @param label
     * @param name
     * @returns {string}
     */
    addSelectField(label, name) {
        return '<p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">' +
            '<label for="' + name + '">' + label + '</label>' +
            '<select class="woocommerce-Input input-text" name="' + name + '" id="' + name + '"></select>' +
            '</p>';
    }

    /**
     * Add input field to form
     * @param label
     * @param name
     * @returns {string}
     */
    addInputField(label, name) {
        return '<p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">' +
            '<label for="' + name + '">' + label + '</label>' +
            '<input class="woocommerce-Input input-text" name="' + name + '" id="' + name + '">' +
            '</p>';
    }

    /**
     * Add fields to form
     * @param productData
     * @param _id
     */
    createField(productData, productDataColumn, detailEditor, type) {

        let _id = Format.slug(productDataColumn);
        if (type === 'select') {
            detailEditor.append(this.addSelectField(productData[productDataColumn].label, _id));
            this.fillFieldData(productData, productDataColumn);
        } else if (type === 'input') {
            detailEditor.append(this.addInputField(productData[productDataColumn].label, _id));
        }

    }

    /**
     * Fill the option fields with data
     * @param productDataColumnValues
     * @param productData
     * @param _id
     */
    fillFieldData(productData, productDataColumn) {
        let productDataColumnValues = productData[productDataColumn].values;
        let _id = Format.slug(productDataColumn);
        let amount = parseInt(productData.Menge) / 1000;
        /** fill fields with data **/
        for (let productDataColumnValue in productDataColumnValues) {
            let isPT = false;
            let p = productDataColumnValues[productDataColumnValue].value;
            if (p.indexOf('p.t') >= 0) {
                isPT = true;
                p = p.replace('p.t', '');
            }
            p = parseFloat(p.trim());
            if (isPT) p = p * amount;
            jQuery('#detaileditor #' + _id).append('<option value="' + productDataColumnValue + '" data-realvar="' + productDataColumnValues[productDataColumnValue].label + '" data-price="' + p + '">' + productDataColumnValues[productDataColumnValue].label + ' (+' + Format.price(p) + ' €)</option>');
        }
    }

    /**
     * Clean up the detail form after reindexing
     * @param detailEditor
     */
    cleanUpDetailForm(detailEditor) {
        detailEditor.html('');
    }
}
