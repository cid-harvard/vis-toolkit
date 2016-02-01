var jsdom = require("jsdom");
var test = require('tape');

jsdom.env({
  html:'<html><body><div id="viz"></div></body></html>',
  features: { QuerySelector:true }, //you need query selector for D3 to work
  scripts: ["js/d3.js", "build/vistk.js"],
  done: function (err, window) {

    var d3 = window.d3;
    var vistk = window.vistk;

    var data = [{id: 'AA', x: 10, y: 20, group: 'A'},
                {id: 'AB', x: 12, y: 22, group: 'A'},
                {id: 'AC', x: 15, y: 22, group: 'A'},
                {id: 'BA', x: 22, y: 51, group: 'B'},
                {id: 'BB', x: 22, y: 55, group: 'B'},
                {id: 'BC', x: 24, y: 51, group: 'B'},
                {id: 'CA', x: 20, y: 20, group: 'C'},
                {id: 'CB', x: 22, y: 20, group: 'C'},
                {id: 'CC', x: 20, y: 25, group: 'C'}
               ];

    var  visualization = vistk.viz()
        .params({
          dev: true,
          type: 'scatterplot',
          margin: {top: 10, right: 10, bottom: 30, left: 30},
          container: '#viz',
          data: data,
          var_id: 'id',
          var_group: 'group',
          var_color: 'id',
          var_x: 'x',
          var_y: 'y',
          var_r: 'x',
          items: [{
            marks: [{
              var_mark: '__aggregated',
              type: d3.scale.ordinal().domain([true, false]).range(["piechart", "none"]),
            }, {
              type: d3.scale.ordinal().domain([true, false]).range(["text", "none"]),
              rotate: "-30"
            }]
          }],
          set: {
            __aggregated: true
          }
        });

    d3.select("#viz").call(visualization);

    test('we have 3 more transactions (aggregated values)', function (t) {

      t.plan(1);
      t.equal(visualization.params().new_data.length, data.length + 3);

    });

    test('we should have 3 pie charts', function (t) {

      t.plan(1);
      t.equal(d3.select("#viz").selectAll('.piechart')[0].length, 3);

    });

    // Position of pie charts (e.g. position of aggregated points)
    // Number of wedges for each pie chart
    // Time changes
    // Filter changes
    // Un-aggregate should remove the pie charts

  }
});
