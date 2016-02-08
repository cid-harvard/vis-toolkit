var jsdom = require("jsdom");
var test = require('tape');

jsdom.env({
  // In case we want to test with CSS <link href="../css/vistk.css" rel="stylesheet">
  html:'<html><body><div id="viz"></div></body></html>',
  features: { QuerySelector:true },
  scripts: ["js/d3.js", "build/vistk.js"],
  done: function (err, window) {

    var d3 = window.d3;
    var vistk = window.vistk;
    var document = window.document;

    var data = ["rect", "circle", "triangle", "tick", "star", "diamond", "polygon", "marker"];

    var visualization = vistk.viz()
        .params({
          height: 200,
          width: 500,
          margin: {top: 30, right: 100, bottom: 30, left: 10},
          type: 'ordinal_horizontal',
          data: data,
          container: '#viz',
          var_x: '__id',
          var_y: '__id',
          items: [{
            marks: [{
              var_mark: '__value',
              type: function(d) { return d; }
            }]
          }]
        });

    d3.select("#viz").call(visualization);

    test('we should have ' + data.length + ' marks drawn', function (t) {

      t.plan(data.length);
      data.forEach(function(mark) {
        t.equal(d3.select("#viz").selectAll('.items__mark__' + mark)[0].length, 1, mark);
      })

    });

    // fill
    test('default circles have no JS fill', function (t) {

      t.plan(data.length);
      data.forEach(function(mark) {
        t.equal(d3.selectAll('.items__mark__' + mark)[0][0].style.fill, "", mark);
      })

    });

    test('default circles have no CSS fill', function (t) {

      t.plan(data.length);
      data.forEach(function(mark) {

        var mark_el = document.getElementsByClassName('items__mark__' + mark);
        var mark_el_style = window.getComputedStyle(mark_el[0]);
        var mark_el_style_css = mark_el_style.fill;

        t.equal(mark_el_style_css, "", mark);
      })

    });

    // height
    // width
    // rotate
    // scale
    // stroke
    // stroke-width
    // stroke-opacity
    // offsets x y top right
    // transform

    // MARKS SPECIFIC
    // text-anchor
    // x y
    // dx dy
    // cx cy
    // pointer-events (for text?)
    // text-overflow (div)
  }
});
