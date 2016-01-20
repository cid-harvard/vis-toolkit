var jsdom = require("jsdom");
var test = require('tape');

jsdom.env({
  html:'<html><body><div id="viz"></div></body></html>',
  scripts: ["https://cid-harvard.github.io/vis-toolkit/js/d3.js",
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
        t.equal(typeof visualization.params(), 'object');

    });

    test('default container is #viz', function (t) {

        t.plan(1);
        var visualization = vistk.viz().params({});
        t.equal(visualization.params().container, "#viz");

    });

    test('a dataset of same size is returned by VisTK', function (t) {

        t.plan(1);
        var data = ['A', 'B', 'C'];
        var visualization = vistk.viz().params({data: data});
        d3.select("#viz").call(visualization);

        t.equal(visualization.params().new_data.length, data.length);

    });

    test('a dataset with no attribute is augmented with attributes', function (t) {

        t.plan(1);
        var data = ['A', 'B', 'C'];
        var visualization = vistk.viz().params({data: data});
        d3.select("#viz").call(visualization);

        // Default ids
        t.equal(visualization.params().new_data[0].__id, 0);

    });

    test('if the dataset is temporal, then 1 item is created', function (t) {

        t.plan(1);
        var data = [{id: 1, time: 0}, {id: 1, time: 1}];
        var visualization = vistk.viz().params({
            data: data,
            var_id: 'id',
        });
        d3.select("#viz").call(visualization);

        t.equal(visualization.params().new_data.length, 1);

    });

    test('if the dataset is temporal, then item has 2 time values', function (t) {

        t.plan(1);
        var data = [{id: 1, time: 0, value: 0}, {id: 1, time: 1, value: 1}];
        var visualization = vistk.viz().params({
            data: data,
            var_id: 'id',
            time: {
              var_time: 'time',
              current_time: 0
            },
        });
        d3.select("#viz").call(visualization);

        t.equal(visualization.params().new_data[0].values.length, 2);

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

        t.equal(d3.select(visualization.params().container).selectAll('text')[0].length, 10);

    });

  }
});
