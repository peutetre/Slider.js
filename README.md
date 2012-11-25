Slider.js
=========

A horizontal slider for webkit touch enable browsers

# Usage

``` javascript
    var aSlider = new Slider({
        min : 0,
        max : 100,
        step : 1,
        initPos : 50,
        width : 200,
        buttonWidth: 30,
        progressHeight : 15,
        label : true,
        labelf : function (val) {
            return val + "%";
        },
        container : aDomElt,
        progress : true,
        f : function (val) {
            console.log("Slider d value: " + val);
        }
    }).bind();
```
