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

  }
});
