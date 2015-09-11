"use strict";
var CarFinder = (function () {
    function CarFinder() {
    }
    CarFinder.getInstance = function () {
        if (!this.instance)
            this.instance = new CarFinder();
        return this.instance;
    };
    CarFinder.prototype.findByPrice = function (min, max) {
        console.log("There are " + (max + min) / (max - min) + " cars between " + min + " and " + max + "15.");
    };
    CarFinder.instance = undefined;
    return CarFinder;
})();
module.exports = CarFinder;
