class Enum {
    static values() {
        let values = [];
        for (let key in this) {
            values.push(this[key]);
        }
        return values;
    }
}