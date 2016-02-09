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

    test('if the dataset is temporal, then 1 item is created algong with 2 time values', function (t) {

        t.plan(2);
        var data = [{id: 1, time: 0}, {id: 1, time: 1}];
        var v = vistk.viz().params({
            data: data,
            var_id: 'id',
        });

        d3.select("#viz").call(v);

        t.equal(v.params().new_data.length, 1);
        t.equal(d3.keys(v.params().new_data[0].values).length, 2);

    });

    test('if time has changed make sure it actually has', function (t) {

        t.plan(3);
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

        t.equal(visualization.params().time.var_time, 'time', 'var_time begins is time');
        t.equal(visualization.params().time.current_time, 0, 'current_time begins at 0');

        visualization.params({
            time: {
              var_time: 'time',
              current_time: 1
            },
        });

        d3.select("#viz").call(visualization);

        t.equal(visualization.params().time.current_time, 1, 'current_time is now 1');

    });

    test('if the dataset is temporal, then item has 2 time values', function (t) {

        t.plan(2);
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

        // Make sure we don't create undefined index
        t.equal(d3.keys(visualization.params().new_data[0].values[2012]).indexOf('undefined'), -1);

    });

    // Time interval
    // Time points
    // Time parsing
    // ..

  }
});
