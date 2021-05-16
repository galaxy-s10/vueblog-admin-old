class CacheModel {
    constructor(a, b) {
        this.a = a
        this.b = b
    }

    say(txt) {
        console.log(txt)
    }
    bye = function (txt) {
        console.log(txt)
    }

}

export default new CacheModel()