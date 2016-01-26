var jsdom = require("jsdom");
var test = require('tape');

jsdom.env({
  html:'<html><body><div id="viz"></div><div id="viz_2"></div></body></html>',
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
          duration: 0,
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
        t.equal(d3.select("#viz").selectAll('circle')[0].length, 120);

      });

      test('if time changes, we should still have 120 circles', function (t) {

        visualization.params().time.current_time = 2012;
        d3.select("#viz").call(visualization);

        t.plan(2);
        t.equal(visualization.params().time.current_time, 2012);
        t.equal(d3.select("#viz").selectAll('circle')[0].length, 120);

      });

      test('if filter by continent Oceania only 3 circles left', function (t) {

        visualization.params().filter = ['Oceania'];
        d3.select("#viz").call(visualization);

        t.plan(2);
        t.deepEqual(visualization.params().filter, ['Oceania']);
        t.equal(d3.select("#viz").selectAll('circle')[0].length, 3);

      });

      test('if filter is reset, back to 120 circles', function (t) {

        visualization.params().filter = [];
        visualization.params().refresh = true;
        d3.select("#viz").call(visualization);

        t.plan(2);
        t.deepEqual(visualization.params().filter, []);
        t.equal(d3.select("#viz").selectAll('circle')[0].length, 120);

      });

      test('if aggregate by continent, only 5 circles', function (t) {

        visualization.params().set['__aggregated'] = false;
        visualization.params().aggregate = 'continent';
        visualization.params().refresh = true;
        d3.select("#viz").call(visualization);

        t.plan(2);
        t.deepEqual(visualization.params().aggregate, visualization.params().var_group);
        t.equal(d3.select("#viz").selectAll('circle')[0].length, 5);

      });

      var flat_years = vistk.utils.flatten_years(countries);

      var visualization_2 = vistk.viz()
        .params({
          dev: true,
          type: 'scatterplot',
          margin: {top: 10, right: 10, bottom: 30, left: 30},
          container: '#viz_2',
          data: flat_years,
          var_id: 'name',
          var_group: 'continent',
          var_color: 'continent',
          var_x: 'nb_products',
          var_y: 'avg_products',
          var_r: 'nb_products',
          duration: 0,
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
                var_mark: '__highlighted',
                type: d3.scale.ordinal().domain([true, false]).range(["line_horizontal", "none"]),
                offset_right: function(d, i, vars) {
                    return vars.x_scale[0]["func"].range()[1] - vars.x_scale[0]["func"](d[vars.var_x]) + vars.r_scale(d[vars.var_r]);
                }
              }, {
                var_mark: '__highlighted',
                type: d3.scale.ordinal().domain([true, false]).range(["line_vertical", "none"]),
                offset_top: function(d, i, vars) {
                    return vars.r_scale(d[vars.var_r]);
                }
              }, {
              type: 'circle'
            }]
          }],
          highlight: ['France']
        });

      d3.select("#viz_2").call(visualization_2);

      test('if highlight axis line values has been set', function (t) {

        t.plan(5);
        t.deepEqual(visualization_2.params().highlight, ['France']);
        t.equal(d3.select('#viz_2').selectAll('.mark__line_horizontal')[0].length, 2);
        t.equal(d3.select('#viz_2').selectAll('.mark__line_vertical')[0].length, 2);
        t.equal(d3.select('#viz_2').selectAll('.items__mark__text.highlighted')[0].length, 2);
        t.equal(d3.select('#viz_2').selectAll('.items__mark__rect.highlighted')[0].length, 2);
      });

      test('if highlight axis line values has been unset', function (t) {

        visualization_2.params().highlight = [];
        visualization_2.params().refresh = true;
        d3.select("#viz_2").call(visualization_2);

        t.plan(5);
        t.deepEqual(visualization_2.params().highlight, []);
        t.equal(d3.select('#viz_2').selectAll('.mark__line_horizontal')[0].length, 0);
        t.equal(d3.select('#viz_2').selectAll('.mark__line_vertical')[0].length, 0);
        t.equal(d3.select('#viz_2').selectAll('.items__mark__text.highlighted')[0].length, 0);
        t.equal(d3.select('#viz_2').selectAll('.items__mark__rect.highlighted')[0].length, 0);
      });

    });

  }
});
