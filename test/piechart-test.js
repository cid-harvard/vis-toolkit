var jsdom = require("jsdom");
var test = require('tape');

jsdom.env({
  html:'<html><body><div id="viz"></div></body></html>',
  scripts: ["js/d3.js", "build/vistk.js"],
  features: { QuerySelector:true },
  done: function (err, window) {

    var d3 = window.d3;
    var vistk = window.vistk;

    var data = [{id: 'A', value: 11}, {id: 'B', value: 10}, {id: 'C', value: 9}];

    var visualization = vistk.viz()
        .params({
          type: 'piechart',
          data: data,
          var_id: 'id',
          container: '#viz',
          var_group: 'value',
          var_color: 'value',
          var_x: function(vars) { return vars.width/2; },
          var_y: function(vars) { return vars.height/2; },
          var_share: 'value',
        });

    d3.select("#viz").call(visualization);

    test('we should have 3 wedges', function (t) {

      t.plan(1);
      t.equal(d3.select("#viz").selectAll('path')[0].length, 3);

    });

    test('position should be in the middle of the SVG', function (t) {

      t.plan(1);
      var p = d3.transform(d3.select("#viz").select('.mark__group').attr("transform")).translate;
      t.equal(p[0].length, visualization.params().width/2);

    });

  }
});
