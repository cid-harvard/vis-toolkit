var jsdom = require("jsdom");
var test = require('tape');

jsdom.env({
  html:'<html><body><div id="viz"></div></body></html>',
  features: { QuerySelector:true }, //you need query selector for D3 to work
  scripts: ["js/d3.js", "build/vistk.js"],
  done: function (err, window) {

    var d3 = window.d3;
    var vistk = window.vistk;

    var data = [{id: 'AA', x: 10, y: 20, group: 'A', value: 10},
                {id: 'AB', x: 12, y: 22, group: 'A', value: 10},
                {id: 'AC', x: 15, y: 22, group: 'A', value: 10},
                {id: 'BA', x: 22, y: 51, group: 'B', value: 10},
                {id: 'BB', x: 22, y: 55, group: 'B', value: 10},
                {id: 'BC', x: 24, y: 51, group: 'B', value: 10},
                {id: 'CA', x: 20, y: 20, group: 'C', value: 10},
                {id: 'CB', x: 22, y: 20, group: 'C', value: 10},
                {id: 'CC', x: 20, y: 25, group: 'C', value: 10}
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
          var_share: 'value',
          items: [{
            marks: [{
              var_mark: '__aggregated',
              type: d3.scale.ordinal().domain([true, false]).range(["piechart", "none"]),
              var_share: 'value',
              class: 'piechart'
            }, {
              type: d3.scale.ordinal().domain([true, false]).range(["text", "none"]),
            }]
          }],
          set: {
            __aggregated: true
          },
          ui: {
            default: true,
            options: ['community_name', 'product']
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

    test('pie charts should have a specific position', function (t) {

      t.plan(1);

      var pie1_coords = [662.6666666666667, 343.3333333333333];
      var pie2_coords = [735.6666666666666, 36.66666666666665];
      var pie3_coords = [358.5, 346.6666666666667];

      var pie1_node = d3.select(d3.select("#viz").selectAll('.piechart')[0][0]);
      var pie1 = d3.transform(pie1_node.attr('transform'));

      var pie2_node = d3.select(d3.select("#viz").selectAll('.piechart')[0][1]);
      var pie3 = d3.transform(pie2_node.attr('transform'));

      var pie3_node = d3.select(d3.select("#viz").selectAll('.piechart')[0][2]);
      var pie3 = d3.transform(pie3_node.attr('transform'));

      t.equal(pie1.translate, pie1_coords);
      t.equal(pie2.translate, pie2_coords);
      t.equal(pie3.translate, pie3_coords);

    });

    // Position of pie charts (e.g. position of aggregated points)
    test('we should have 3 wedges in each pie charts', function (t) {

      // Number of wedges for each pie chart
      t.plan(3);
      t.equal(d3.select(d3.select("#viz").selectAll('.piechart')[0][0]).selectAll('path')[0].length, 3);
      t.equal(d3.select(d3.select("#viz").selectAll('.piechart')[0][1]).selectAll('path')[0].length, 3);
      t.equal(d3.select(d3.select("#viz").selectAll('.piechart')[0][2]).selectAll('path')[0].length, 3);

    });

    // Time changes
    // Filter changes
    // Un-aggregate should remove the pie charts

  }
});
