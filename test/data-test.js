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

    test('changing the whole dataset should be handled', function (t) {

        t.plan(2);
        var data1 = ['A', 'B', 'C'];
        var data2 = ['D', 'E', 'F'];

        var visualization = vistk.viz().params({data: data1});
        d3.select("#viz").call(visualization);

        // Default ids
        t.equal(visualization.params().new_data[0].__id, 0);

        visualization.params({data: data2});
        d3.select("#viz").call(visualization);

        // New default ids
        t.equal(visualization.params().new_data[0].__id, data1.length);

    });


    test('re-sorting dataset ↗ ↘', function (t) {

        t.plan(1);
        var data = [1, 2, 3, 4];

        var visualization = vistk.viz().params({
            data: data,
            var_sort: '__id',
            var_sort_asc: false,
        });

        d3.select("#viz").call(visualization);

        // First value is now the last data value
        t.equal(visualization.params().new_data[0].__id, data[data.length]);

    });

  }
});
