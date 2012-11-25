window.document.addEventListener("DOMContentLoaded", function (){
    console.log("starting...");

    function $(elt) { return window.document.getElementById(elt); }

    window.document.addEventListener("touchstart", function (evt) { evt.preventDefault(); }, false);

    window.b = new Slider({
        min : 0,
        max : 200,
        step : 10,
        width : 200,
        buttonWidth: 50,
        labelHeight : 30,
        snapToStep : true,
        label : true,
        labelf : function (val) {
            return val + " ml";
        },
        container : $("container2"),
        f : function (val) {
            console.log(val);
        }
    }).bind();

    window.c = new Slider({
        min : 0,
        max : 100,
        step : 25,
        initPos : 50,
        width : 200,
        buttonWidth: 40,
        label : true,
        snapToStep : true,
        labelf : function (val) {
            return val + "%";
        },
        container : $("container3"),
        progress : true,
        f : function (val) {
            console.log("Slider value: " + val);
        },
        barCls:"another-slider-bar",
        btnCls:"another-btn"
    }).bind();

    window.d = new Slider({
        min : 0,
        max : 100,
        step : 1,
        initPos : 50,
        width : 200,
        buttonWidth: 40,
        label : true,
        labelf : function (val) {
            return val + "%";
        },
        container : $("container4"),
        progress : true,
        f : function (val) {
            console.log("Slider d value: " + val);
        },
        barCls:"another-slider-bar",
        btnCls:"another-btn"
    }).bind();

    window.e = new Slider({
        min : 0,
        max : 300,
        step : 1,
        width : 200,
        label : true,
        labelf : function (val) {
            return val + " g";
        },
        buttonWidth: 30,
        container : $("container5"),
        f : function (val) {
            console.log(val);
        }
    }).bind();

    window.f = new Slider({
        min : 0,
        max : 100,
        step : 1,
        initPos : 50,
        width : 200,
        buttonWidth: 30,
        label : true,
        labelf : function (val) {
            return val + "%";
        },
        container : $("container6"),
        progress : true,
        f : function (val) {
            console.log("Slider d value: " + val);
        },
        sliderCls:"orange",
        barCls:"orange",
        progressCls:"orange-slider",
        btnCls:"orange-button",
        progressValCls:"orange-progress"
    }).bind();

}, false);
