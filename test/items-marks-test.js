var jsdom = require("jsdom");
var test = require('tape');

jsdom.env({
  html:'<html><body><div id="viz"></div></body></html>',
  features: { QuerySelector:true },
  scripts: ["js/d3.js", "build/vistk.js"],
  done: function (err, window) {

    var d3 = window.d3;
    var vistk = window.vistk;

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

      t.plan(1);
      t.equal(d3.select("#viz").selectAll('.items__mark__circle')[0].length, data.length);

    });

    // FILL
    test('default circles have no fill', function (t) {

      t.plan(1);
      t.equal(d3.selectAll('.items__mark__circle')[0][0].style.fill, "");

    });

  }
});
