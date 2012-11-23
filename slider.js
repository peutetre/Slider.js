/*
 * slider.js - a slider for touch enable browsers
 */

(function (w) {

    var $ = function (elt) { return window.document.getElementById(elt); },
        createDOMElt = function (tag) { return window.document.createElement(tag); },
        toPx = function (x) { return x + "px"; },
        getTimeStamp = function () { return (new Date()).getTime(); };

    w.Slider = function (options) {
        this.options = options || {};
        this.min = this.options.min  || 0;
        this.max = this.options.max  || 100;
        this.step = this.options.step  || 1;

        if (this.options.container) this.container = this.options.container;
        else throw new Error("a slider need a container DOM element!");

        this.hasLabel = this.options.label || false;
        this.f = this.options.f || function () {};
        this.width = this.options.width || 300;
        this.height = this.options.height || 50;
        this.buttonWidth = this.options.buttonWidth || 20;
        this.labelHeight = this.options.labelHeight || 30;

        this.elt = createDOMElt("div");
        this.bar = createDOMElt("div");
        this.button = createDOMElt("div");

        this.elt.style.width = toPx(this.width);
        this.elt.style.margin = "auto";
        this.elt.style.position = "relative";
        this.elt.style.boxSizing = "border-box";

        this.bar.style.display = "block";
        this.bar.style.margin = "auto";
        this.bar.style.background = "blue";
        this.bar.style.width = "100%";
        this.bar.style.height = toPx(this.buttonWidth);
        this.bar.style.position = "relative";

        this.button.style.display = "block";
        this.button.style.margin = "auto";
        this.button.style.background = "green";
        this.button.style.width = toPx(this.buttonWidth);
        this.button.style.height = "100%";
        this.button.style.position = "absolute";
        this.button.style.top = 0;
        this.button.style.left = 0;

        if (this.hasLabel) {
            this.label = createDOMElt("div");
            this.label.style.display = "block";
            this.label.style.margin = "auto";
            this.label.style.background = "red";
            this.label.style.width = "100%";
            this.label.style.height = toPx(this.labelHeight);
            this.label.style.textAlign = "center";
            this.elt.appendChild(this.label);
        }

        this.bar.appendChild(this.button);
        this.elt.appendChild(this.bar);
        this.container.appendChild(this.elt);

        this.pos = 0;
        this.timestamp = getTimeStamp();

        this._onButtonTouchStart = this.onButtonTouchStart.bind(this);
        this._onButtonTouchMove = this.onButtonTouchMove.bind(this);
        this._onButtonTouchEnd = this.onButtonTouchEnd.bind(this);
    };

    w.Slider.prototype.bind = function () {
        this.button.addEventListener("touchstart", this._onButtonTouchStart, false);
        return this;
    };

    w.Slider.prototype.unbind = function () {
        this.button.removeEventListener("touchstart", this.onButtonTouchStart);
        return this;
    };

    w.Slider.prototype.onButtonTouchStart = function (evt) {
        this.button.addEventListener("touchmove", this._onButtonTouchMove, false);
        this.button.addEventListener("touchend", this._onButtonTouchEnd, false);

        var touch = evt.targetTouches.item(0);
        this.startX = touch.clientX;
        this.touchId = touch.identifier;
    };

    w.Slider.prototype.onButtonTouchMove = function (evt) {
        var touch = evt.targetTouches.item(0),
            delta = touch.clientX - this.startX;

        if (touch.identifier === this.touchId) {
            evt.preventDefault();
            var x = this.pos + delta;

            if (x <= 0) this.delta = 0;
            else if (x > this.width - this.buttonWidth) this.delta = this.width - this.buttonWidth;
            else this.delta = touch.clientX - this.startX + this.pos;
            this._updateLabel();
            this.button.style.webkitTransform = "translate3d(" + this.delta  + "px, 0,0)";
        }
    };

    w.Slider.prototype.onButtonTouchEnd = function (evt) {
        var touch = evt.changedTouches.item(0);
        if (touch.identifier === this.touchId) {
            this.pos = this.delta;
            this.button.removeEventListener("touchmove", this._onButtonTouchMove);
            this.button.removeEventListener("touchend", this._onButtonTouchEnd);
        }
    };

    w.Slider.prototype.val = function () {
        return parseInt((this.max - this.min) / (this.width-this.buttonWidth) * this.delta + this.min, 10);
    };

    w.Slider.prototype._updateLabel = function () {
        if (this.hasLabel && getTimeStamp() - this.timestamp >= 100) {
            this.label.innerText = this.val();
            this.timestamp = getTimeStamp();
        }
    };
})(window);
