var jsdom = require("jsdom");
var test = require('tape');

jsdom.env({
  html:'<html><body><div id="viz"></div></body></html>',
  features: { QuerySelector:true }, //you need query selector for D3 to work
  scripts: ["https://cid-harvard.github.io/vis-toolkit/js/d3.js",
    "https://cid-harvard.github.io/vis-toolkit/build/vistk.js"],
  done: function (err, window) {

    var d3 = window.d3;
    var vistk = window.vistk;

    var data = [{__id: 'A'}, {__id: 'B'}, {__id: 'C'}];

    var visualization = vistk.viz()
        .params({
          dev: true,
          data: data,
          width: 800,
          height: 500,
          type: 'dotplot',
          var_x: '__id',
          var_y: function() { return this.height/2; },
          var_text: '__value'
        });

    d3.select("#viz").call(visualization);

    test('we should have 3 circles', function (t) {

      t.plan(1);
      t.equal(d3.select("#viz").selectAll('circle')[0].length, 3);

    });

    test('if filter, we should have 1 circle left', function (t) {

      t.plan(1);

      visualization.params().filter = ['A'];
      visualization.params().refresh = true;
      d3.select("#viz").call(visualization);

      t.equal(d3.select("#viz").selectAll('circle')[0].length, 1);

    });

    test('if time update, we should still have 2 circles', function (t) {

      t.plan(1);

      var data = [{id: 1, time: 0, value: 0},
                  {id: 1, time: 1, value: 1},
                  {id: 2, time: 0, value: 2},
                  {id: 2, time: 1, value: 3}
                  ];

      var visualization = vistk.viz().params({
          data: data,
          dev: true,
          data: data,
          width: 800,
          height: 500,
          type: 'dotplot',
          var_x: 'value',
          var_id: 'id',
          var_y: function() { return this.height/2; },
          var_text: 'value',
          time: {
            var_time: 'time',
            current_time: 0
          },
      });

      d3.select("#viz").call(visualization);

      t.equal(d3.select("#viz").selectAll('circle')[0].length, 2);

    });


    test('if no data, only show a text', function (t) {

      t.plan(1);

      var data = [];

      var visualization = vistk.viz().params({
          data: data,
          dev: true,
          data: data,
          width: 800,
          height: 500,
          type: 'dotplot',
          var_x: 'value',
          var_id: 'id',
          var_y: function() { return this.height/2; },
          var_text: 'value',
          time: {
            var_time: 'time',
            current_time: 0
          },
      });

      d3.select("#viz").call(visualization);

      t.equal(d3.select("#viz").selectAll('g')[0].length, 2);

    });

  }
});
