/*
 * slider.js - a slider for touch enable browsers
 */

(function (w) {

    /* helpers */
    var $ = function (elt) { return w.document.getElementById(elt); },
        createDOMElt = function (tag) { return w.document.createElement(tag); },
        toPx = function (x) { return x + "px"; },
        getTimeStamp = function () { return (new w.Date()).getTime(); },
        css = function (elt, s) { for (var a in s) { elt.style[a] = s[a]; } };

    /* default */
    var TIME_BETWEEN_2_UPDATE = 100,
        DEFAULT_MIN = 0,
        DEFAULT_MAX = 100,
        DEFAULT_STEP = 1,
        DEFAULT_WIDTH = 300,
        DEFAULT_HEIGHT = 50,
        DEFAULT_BUTTON_WIDTH = 20,
        DEFAULT_LABEL_HEIGHT = 30;

    /* the slider */
    w.Slider = function (options) {
        this.options = options || {};
        if (this.options.container) this.container = this.options.container;
        else throw new Error("Slider.js: need a container DOM element!");

        this.min = this.options.min  || DEFAULT_MIN;
        this.max = this.options.max  || DEFAULT_MAX;
        this.step = this.options.step  || DEFAULT_STEP;
        this.hasLabel = this.options.label || false;
        if (this.hasLabel) this.labelf = this.options.labelf || function (val) { return val; };
        this.hasProgress = this.options.progress || false;
        this.f = this.options.f || function () {};
        this.initPos = this.options.initPos || this.min;

        this.width = this.options.width || DEFAULT_WIDTH;
        this.height = this.options.height || DEFAULT_HEIGHT;
        this.buttonWidth = this.options.buttonWidth || DEFAULT_BUTTON_WIDTH;
        this.labelHeight = this.options.labelHeight || DEFAULT_LABEL_HEIGHT;

        this.sliderCls = this.options.sliderCls || "slider";
        this.labelCls = this.options.labelCls || "slider-label";
        this.barCls = this.options.barCls || "slider-bar";
        this.btnCls = this.options.btnCls || "slider-button";
        this.progressCls = this.options.progressCls || "slider-progress";

        this.elt = createDOMElt("div");
        this.bar = createDOMElt("div");
        this.button = createDOMElt("div");

        css(this.elt, {
            width:toPx(this.width), margin:"auto",
            position:"relative", boxSizing: "border-box"
        });

        css(this.bar, {
            display:"block", margin:"auto", position : "relative",
            width:"100%", height: toPx(this.buttonWidth)
        });

        css(this.button, {
            display:"block", margin:"auto",
            width:toPx(this.buttonWidth), height: "100%",
            position : "absolute", top:0, left : 0
        });

        if (this.hasLabel) {
            this.label = createDOMElt("div");
            css(this.label, {
                display:"block", margin:"auto",
                width:"100%", height: toPx(this.labelHeight),
                textAlign : "center"
            });
            this.label.classList.add(this.labelCls);
            this.elt.appendChild(this.label);
        }

        if (this.hasProgress) {
            this.progress = createDOMElt("div");
            css(this.progress, {
                width:"100%",
                height: toPx(this.buttonWidth/2),
                position:"absolute",
                bottom : toPx(this.buttonWidth/4)
            });
            this.progress.classList.add(this.progressCls);
            this.bar.appendChild(this.progress);
        }

        this.button.classList.add(this.btnCls);
        this.elt.classList.add(this.sliderCls);

        this.bar.appendChild(this.button);
        this.elt.appendChild(this.bar);
        this.container.appendChild(this.elt);

        this.set(this.initPos, true, true);
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

        if (touch.identifier == this.touchId) {
            evt.preventDefault();
            var x = this.pos + delta;

            if (x <= 0) this.delta = 0;
            else if (x > this.width - this.buttonWidth) this.delta = this.width - this.buttonWidth;
            else this.delta = x;
            this._translate(this.delta);
            this._update();
        }
    };

    w.Slider.prototype.onButtonTouchEnd = function (evt) {
        var touch = evt.changedTouches.item(0);
        if (touch.identifier === this.touchId) {
            this.pos = this.delta;
            this._update(true);
            this.button.removeEventListener("touchmove", this._onButtonTouchMove);
            this.button.removeEventListener("touchend", this._onButtonTouchEnd);
        }
    };

    w.Slider.prototype.val = function () {
        return parseInt((this.max - this.min) / (this.width-this.buttonWidth) * this.delta + this.min, 10);
    };

    w.Slider.prototype.set = function (val, force, noCallback) {
        if (val >= this.min && val <= this.max) {
            this.pos = parseInt( (val - this.min) * (this.width-this.buttonWidth) / (this.max - this.min), 10);
            this.delta = this.pos;
            this._translate(this.pos);
            this._update(force, noCallback);
            this.lastVal = val;
        }
    };

    w.Slider.prototype._translate = function (val) {
        this.button.style.webkitTransform = "translate3d(" + val  + "px, 0,0)";
    };

    w.Slider.prototype._update = function (force, noCallback) {
        if (force || getTimeStamp() - this.timestamp >= TIME_BETWEEN_2_UPDATE) {
            var val = this.val();
            if (!noCallback && val != this.lastVal) this.f(this.lastVal = val);
            if (this.hasLabel) this.label.innerText = this.labelf(this.val());
            this.timestamp = getTimeStamp();
        }
    };
})(window);
