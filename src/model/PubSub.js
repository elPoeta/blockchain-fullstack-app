"use strict";
exports.__esModule = true;
var redis_1 = require("redis");
var CHANNELS = {
    TEST: "TEST"
};
var PubSub = /** @class */ (function () {
    function PubSub() {
        var _this = this;
        this.publisher = redis_1["default"].createClient();
        this.subscriber = redis_1["default"].createClient();
        this.subscriber.subscribe(CHANNELS.TEST, function (message) {
            console.log(message);
        });
        this.subscriber.on("message", function (channel, message) {
            return _this.handleMessage(channel, message);
        });
    }
    PubSub.prototype.handleMessage = function (channel, message) {
        console.log("Message recieve from channel ".concat(channel, ". Message: ").concat(message));
    };
    return PubSub;
}());
var testPubSub = new PubSub();
testPubSub.publisher.publish(CHANNELS.TEST, "foo");
