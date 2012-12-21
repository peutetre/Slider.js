/*
 * slider.js - a slider for touch enable browsers
 */

(function (w) {

    /* helpers */
    var $ = function (elt) { return w.document.getElementById(elt); },
        createDOMElt = function (tag) { return w.document.createElement(tag); },
        toPx = function (x) { return x + "px"; },
        getTimeStamp = function () { return (new w.Date()).getTime(); },
        css = function (elt, s) { for (var a in s) { elt.style[a] = s[a]; } },
        addClass = w.document.classList ? function (elt, c) { elt.classList.add(c); } : function (elt, c) { elt.className += " " + c; },
        rmClass = w.document.classList ? function (elt, c) { elt.classList.remove(c); } :function (elt, c) { elt.className = elt.className.replace(new RegExp(c, 'g'), ""); },
        id = function (v) { return v; },
        bind = id.bind ?
                 function (f, c) { return f.bind(c); }
               : function (f, c) {
                     return function () {
                         return f.apply(c, Array.prototype.slice.call(arguments));
                     };
                 };

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

        this.on = true;
        this.min = this.options.min  || DEFAULT_MIN;
        this.max = this.options.max  || DEFAULT_MAX;
        this.step = this.options.step  || DEFAULT_STEP;
        this.width = this.options.width || DEFAULT_WIDTH;
        this.height = this.options.height || DEFAULT_HEIGHT;
        this.buttonWidth = this.options.buttonWidth || DEFAULT_BUTTON_WIDTH;
        this.labelHeight = this.options.labelHeight || DEFAULT_LABEL_HEIGHT;
        this.hasLabel = this.options.label || false;
        if (this.hasLabel)
            this.labelf = this.options.labelf || function (val) { return val; };
        this.hasProgress = this.options.progress || false;
        if (this.hasProgress)
            this.progressHeight = this.options.progressHeight || this.buttonWidth/2;
        this.hasSnapToStep = this.options.snapToStep || false;
        this.f = this.options.f || function () {};
        this.initPos = this.options.initPos || this.min;

        this.range = this.max - this.min;
        this.pxRange = this.width - this.buttonWidth;

        this.sliderCls = this.options.sliderCls || "slider";
        this.labelCls = this.options.labelCls || "slider-label";
        this.barCls = this.options.barCls || "slider-bar";
        this.btnCls = this.options.btnCls || "slider-button";
        this.progressCls = this.options.progressCls || "slider-progress";
        this.progressValCls = this.options.progressValCls || "slider-progress-val";
        this.activeCls = this.options.activeCls || "slider-active";

        this.elt = createDOMElt("div");
        this.bar = createDOMElt("div");
        this.button = createDOMElt("div");

        css(this.elt, {
            width:toPx(this.width), margin:"auto",
            position:"relative", boxSizing: "border-box",
            webkitTransform:"translate3d(0,0,0)"
        });

        css(this.bar, {
            display:"block", margin:"auto", position : "relative",
            width:"100%", height: toPx(this.buttonWidth),
            webkitTransform:"translate3d(0,0,0)"
        });

        css(this.button, {
            display:"block", margin:"auto",
            width:toPx(this.buttonWidth), height: "100%",
            position : "absolute", top:0, left : 0,
            webkitTransform:"translate3d(0,0,0)"
        });

        if (this.hasLabel) {
            this.label = createDOMElt("div");
            css(this.label, {
                display:"block", margin:"auto",
                width:"100%", height: toPx(this.labelHeight),
                textAlign : "center", webkitTransform:"translate3d(0,0,0)"
            });
            addClass(this.label, this.labelCls);
            this.elt.appendChild(this.label);
        }

        if (this.hasProgress) {
            this.progress = createDOMElt("div");
            this.progressVal = createDOMElt("div");
            css(this.progress, {
                width:"100%",
                height: toPx(this.progressHeight),
                position:"absolute", webkitTransform:"translate3d(0,0,0)",
                bottom : toPx((this.buttonWidth - this.progressHeight) /2)
            });
            css(this.progressVal, {
                width:"100%",
                height: "100%",
                position:"absolute",
                bottom : 0,
                webkitTransform:"translate3d(0,0,0)"
            });
            addClass(this.progress, this.progressCls);
            addClass(this.progressVal, this.progressValCls);
            this.progress.appendChild(this.progressVal);
            this.bar.appendChild(this.progress);
        }

        addClass(this.button, this.btnCls);
        addClass(this.bar, this.barCls);
        addClass(this.elt, this.sliderCls);

        this.bar.appendChild(this.button);
        this.elt.appendChild(this.bar);
        this.container.appendChild(this.elt);

        this.set(this.initPos, true, true);
        this.timestamp = getTimeStamp();

        this._onButtonTouchStart = bind(this.onButtonTouchStart, this);
        this._onButtonTouchMove = bind(this.onButtonTouchMove, this);
        this._onButtonTouchEnd = bind(this.onButtonTouchEnd, this);
        return this;
    };

    w.Slider.prototype.bind = function () {
        this.button.addEventListener("touchstart", this._onButtonTouchStart, true);
        return this;
    };

    w.Slider.prototype.unbind = function () {
        this.button.removeEventListener("touchstart", this.onButtonTouchStart);
        return this;
    };

    w.Slider.prototype.onButtonTouchStart = function (evt) {
        if (this.on) {
            evt.preventDefault();
            evt.stopPropagation();
            this.button.addEventListener("touchmove", this._onButtonTouchMove, true);
            this.button.addEventListener("touchend", this._onButtonTouchEnd, true);

            var touch = evt.targetTouches.item(0);
            this.startX = touch.clientX;
            this.touchId = touch.identifier;
            addClass(this.button, this.activeCls);
        }
    };

    w.Slider.prototype.onButtonTouchMove = function (evt) {
        var touch = evt.targetTouches.item(0),
            delta = touch.clientX - this.startX;

        if (touch.identifier == this.touchId) {
            evt.preventDefault();
            evt.stopPropagation();
            var x = this.pos + delta;

            if (x <= 0) this.delta = 0;
            else if (x > this.pxRange) this.delta = this.pxRange;
            else this.delta = x;
            this._translate(this.delta);
            this._renderBar(this.delta);
            this._update();
        }
    };

    w.Slider.prototype.onButtonTouchEnd = function (evt) {
        var touch = evt.changedTouches.item(0);
        if (touch.identifier === this.touchId) {
            this.pos = this.delta;
            if(this.hasSnapToStep) this._update(true, false, true);
            else this._update(true);
            rmClass(this.button, this.activeCls);
            this.button.removeEventListener("touchmove", this._onButtonTouchMove);
            this.button.removeEventListener("touchend", this._onButtonTouchEnd);
        }
    };

    w.Slider.prototype.val = function () {
        return this._toStep((this.range / this.pxRange) * this.delta + this.min);
    };

    w.Slider.prototype.set = function (val, force, noCallback) {
        if (val >= this.min && val <= this.max) {
            val = this._toStep(val);
            this.pos = this._toPos(val);
            this.delta = this.pos;
            this._translate(this.pos);
            this._renderBar(this.pos);
            this.lastVal = val;
            this._update(force, noCallback);
        }
    };

    w.Slider.prototype._translate = function (val) {
        this.button.style.webkitTransform = "translate3d(" + val  + "px, 0,0)";
    };

    w.Slider.prototype.start = function () { this.on = true; };
    w.Slider.prototype.stop = function () { this.on = false; };

    w.Slider.prototype._update = function (force, noCallback, snap) {
        if (force || getTimeStamp() - this.timestamp >= TIME_BETWEEN_2_UPDATE) {
            var val = this.val();
            if (snap) {
                this._renderBar(this.pos = this._toPos(val));
                this._translate(this.pos);
            }
            if (!noCallback && val != this.lastVal) this.f(this.lastVal = val);
            if (this.hasLabel) this.label.innerText = this.labelf(val);
            this.timestamp = getTimeStamp();
        }
    };

    w.Slider.prototype._renderBar = function (val) {
        var self = this;
        if (this.hasProgress) {
            setTimeout(function () {
                self.progressVal.style.width = (val + 10 ) + "px";
            }, 0);
        }
    };

    w.Slider.prototype._toStep = function (val) {
        return Math.round(val / this.step) * this.step;
    };

    w.Slider.prototype._toPos = function (val) {
        return Math.round((val - this.min) * this.pxRange / this.range);
    };

})(window);
