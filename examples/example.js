window.document.addEventListener("DOMContentLoaded", function (){
    console.log("starting...");

    function $(elt) { return window.document.getElementById(elt); }

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
        width : 200,
        label : true,
        container : $("container3"),
        f : function (val) {
            console.log(val);
        }
    }).bind();

}, false);
