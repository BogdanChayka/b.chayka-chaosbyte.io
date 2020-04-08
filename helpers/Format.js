export default class Format {
    /**
     * Format the price
     * @param number
     * @param decimals
     * @returns {string}
     */
    static price(number, decimals) {
        decimals = (typeof decimals == 'undefined' ? 2 : decimals);
        number = parseFloat(number);

        let decPoint = ',';
        let thousandsSep = '.';

        let roundedNumber = Math.round(Math.abs(number) * ('1e' + decimals)) + '';
        let numbersString = decimals ? roundedNumber.slice(0, decimals * -1) : roundedNumber;
        let decimalsString = decimals ? roundedNumber.slice(decimals * -1) : '';
        let formattedNumber = "";

        while (numbersString.length > 3) {
            formattedNumber += thousandsSep + numbersString.slice(-3)
            numbersString = numbersString.slice(0, -3);
        }

        let nr = (number < 0 ? '-' : '') + numbersString + formattedNumber + (decimalsString ? (decPoint + decimalsString) : '');
        if (nr.indexOf(',') === 0 || nr.indexOf('.') === 0) nr = '0' + nr;
        if (nr == '0,0' && decimals == 2) nr += '0';
        return nr;
    }

    /**
     * Format the slug
     * @param str
     * @returns {string}
     */
    static slug(str) {
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        let from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
        let to = "aaaaeeeeiiiioooouuuunc------";

        for (let i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    }

    static squareMeter(value) {
        return value / 10000;
    }

    /**
     * Checks if number is in between 2 numbers
     * @param x
     * @param min
     * @param max
     * @return {boolean}
     */
    static between(x, min, max) {
        return x >= min && x < max;
    }

    /**
     *
     * @param value
     * @returns {number}
     */
    parseMeter(value) {
        return value / 100;
    }

    static formatPrice(value) {
        return `${this.price(value)} €`
    }
}
