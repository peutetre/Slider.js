window.document.addEventListener("DOMContentLoaded", function (){
    console.log("starting...");

    function $(elt) { return window.document.getElementById(elt); }

    window.document.body.addEventListener("touchstart", function (evt) {
        evt.preventDefault();
    }, false);

    window.a = new Slider({
        min : 0,
        max : 300,
        step : 1,
        width : 200,
        container : $("container1"),
        f : function (val) {
            console.log(val);
        }
    }).bind();

    window.b = new Slider({
        min : 0,
        max : 200,
        step : 1,
        width : 200,
        buttonWidth: 50,
        labelHeight : 100,
        container : $("container2"),
        f : function (val) {
            console.log(val);
        }
    }).bind();

    window.c = new Slider({
        min : 0,
        max : 100,
        step : 1,
        initPos : 50,
        width : 200,
        label : true,
        labelf : function (val) {
            return val + "%";
        },
        container : $("container3"),
        progress : true,
        f : function (val) {
            console.log("Slider value: " + val);
        }
    }).bind();

}, false);
