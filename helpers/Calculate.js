import Format from './Format';
export default class Calculate {
    /**
     *
     * @param price
     * @param value
     * @returns {number}
     */
    static percent(price, value) {
        return price * (value / 100);
    }

    static squareMeter(productFieldValue, size) {
        return Format.squareMeter(productFieldValue) * size;
    }
}