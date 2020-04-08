export default class StringHelper {
    isSquareMeterPrice(value) {
        return value.indexOf('(m2)') >= 0;
    }

    isFixedPrice(value) {
        return value.indexOf('*') >= 0;
    }

    isPercentPrice(value) {
        return value.indexOf('%') >= 0;
    }

    clear(value) {
        return value.replace('*', '').replace('%', '').replace(' ', '').replace('(m2)', '');
    }
}
