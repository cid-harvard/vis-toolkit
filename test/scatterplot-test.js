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

    d3.json("https://cid-harvard.github.io/vis-toolkit-datasets/data/diversification_ubiquity_hs4_1995_2012.json", function(error, countries) {

      var flat_years = vistk.utils.flatten_years(countries);

      visualization = vistk.viz()
        .params({
          dev: true,
          type: 'scatterplot',
          margin: {top: 10, right: 10, bottom: 30, left: 30},
          container: '#viz',
          data: flat_years,
          var_id: 'name',
          var_group: 'continent',
          var_color: 'continent',
          var_x: 'nb_products',
          var_y: 'avg_products',
          var_r: 'nb_products',
          time: {
            var_time: "year",
            current_time: "1995",
            parse: function(d) { return d; }
          },
          x_scale: [{
            domain: [0, 700]
          }],
          items: [{
            marks: [{
              type: 'circle',
            }]
          }]
        });

      d3.select("#viz").call(visualization);

      test('we should have 120 circles', function (t) {

        t.plan(1);
        t.equal(d3.selectAll('circle')[0].length, 120);

      });

      test('if time changes, we should still have 120 circles', function (t) {

        visualization.params().time.current_time = 2012;
        d3.select("#viz").call(visualization);

        t.plan(2);
        t.equal(visualization.params().time.current_time, 2012);
        t.equal(d3.selectAll('circle')[0].length, 120);

      });

      test('if filter by continent Oceania only 3 circles left', function (t) {

        visualization.params().filter = ['Oceania'];
        d3.select("#viz").call(visualization);

        t.plan(2);
        t.deepEqual(visualization.params().filter, ['Oceania']);
        t.equal(d3.selectAll('circle')[0].length, 3);

      });

      test('if filter is reset, back to 120 circles', function (t) {

        visualization.params().filter = [];
        visualization.params().refresh = true;
        d3.select("#viz").call(visualization);

        t.plan(2);
        t.deepEqual(visualization.params().filter, []);
        t.equal(d3.selectAll('circle')[0].length, 120);

      });

      test('if aggregate by continent, only 120 circles', function (t) {

        visualization.params().filter = [];
        d3.select("#viz").call(visualization);

        t.plan(2);
        t.deepEqual(visualization.params().filter, []);
        t.equal(d3.selectAll('circle')[0].length, 120);

      });

    });

  }
});
