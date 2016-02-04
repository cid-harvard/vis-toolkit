var jsdom = require("jsdom");
var test = require('tape');

jsdom.env({
  html:'<html><body><div id="viz"></div></body></html>',
  scripts: ["js/d3.js",
    "build/vistk.js"],
  features: { QuerySelector:true },
  done: function (err, window) {

    var d3 = window.d3;
    var vistk = window.vistk;

    test('vistk version should be defined and defined as a string', function (t) {

        t.plan(1);
        t.equal(typeof vistk.version, 'string', vistk.version);

    });

    test('an empty configuration object returns an object with default values', function (t) {

        t.plan(1);
        var visualization = vistk.viz().params({});
        d3.select("#viz").call(visualization);
        t.equal(typeof visualization.params(), 'object');

    });

    test('default container is #viz', function (t) {

        t.plan(1);
        var visualization = vistk.viz().params({});
        d3.select("#viz").call(visualization);
        t.equal(visualization.params().container, "#viz");

    });

    test('default var_x is "__var_x"', function (t) {

        t.plan(1);
        var visualization = vistk.viz().params({});
        d3.select("#viz").call(visualization);
        t.equal(visualization.params().var_x, "__var_x");

    });

    test('default var_y is "__var_y"', function (t) {

        t.plan(1);
        var visualization = vistk.viz().params({});
        d3.select("#viz").call(visualization);
        t.equal(visualization.params().var_y, "__var_y");

    });

    test('default chart type is "none"', function (t) {

        t.plan(1);
        var visualization = vistk.viz().params({});
        d3.select("#viz").call(visualization);
        t.equal(visualization.params().type, "none");

    });

    test('if chart type is "function" then run it', function (t) {

        t.plan(1);
        var visualization = vistk.viz().params({
            type: function() { return 'scatterplot'; }
        });
        d3.select("#viz").call(visualization);
        t.equal(visualization.params().type, "scatterplot");

    });

    test('check if selection and highlight classes are set', function (t) {

        t.plan(2);
        var data = ['A', 'B', 'C'];
        var selection = [data[0]];
        var highlight = [data[0], data[1]];

        var visualization = vistk.viz().params({
            data: data,
            selection: selection,
            highlight: highlight
        });

        d3.select("#viz").call(visualization);

        // check if internal state of the toolkit matches the cfg
        t.equal(visualization.params().selection, selection);
        t.equal(visualization.params().highlight, highlight);

    });

    test('check if marks are created properly', function (t) {

        t.plan(1);
        var data = ['A', 'B', 'C'];

        var visualization = vistk.viz()
            .params({
              type: 'ordinal_horizontal',
              data: data,
              var_x: '__id',
              var_y: '__id',
              items: [{
                marks: [{
                  type: "text",
                 }]
              }]
            });

        d3.select("#viz").call(visualization);

        t.equal(d3.select("#viz").selectAll('text')[0].length, data.length);

    });

  }
});
