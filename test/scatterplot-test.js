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
          var_share: "avg_products",
          share_cutoff: function(d) { return d.avg_products > 30; },
          var_text: 'name_2char',
          time: {
            var_time: "year",
            current_time: "1995",
            parse: function(d) { return d; }
          },
          x_scale: [{
            domain: [0, 700]
          }],
          items: [{
            attr: "name",
            marks: [{
              var_mark: '__aggregated',
              type: d3.scale.ordinal().domain([true, false]).range(["none", "circle"]),
              rotate: "0"
            }, {
              var_mark: '__selected',
              type: d3.scale.ordinal().domain([true, false]).range(["star", "none"]),
              rotate: "0"
            }, {
              var_mark: '__aggregated',
              type: d3.scale.ordinal().domain([true, false]).range(["circle", "none"]),
              var_r: "nb_products",
              var_fill: "nb_products",
              rotate: 0,
              var_share: "avg_products"
            }, {
              type: "text",
              rotate: "-30"
            }]
          }],
          ui: {
            default: true,
            options: ["country", "continent"]
          },
          selection: ["France"],
          highlight: ["France", "Germany"],
          title: "World Countries"
        });

      d3.select("#viz").call(visualization);

      test('we should have 120 circles', function (t) {

          t.plan(1);
          t.equal(d3.selectAll('circle')[0].length, 120);

      });


    });

  }
});
