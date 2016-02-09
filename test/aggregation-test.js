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

    test('if the dataset not aggregated', function (t) {

        t.plan(1);
        var data = [{id: 0, group: 'A', value: 1},
                    {id: 1, group: 'B', value: 1},
                    {id: 2, group: 'A', value: 1},
                    {id: 3, group: 'A', value: 1},
                    {id: 4, group: 'A', value: 1},
                    {id: 5, group: 'B', value: 1}];

        var v = vistk.viz()
            .params({
              type: 'piechart',
              width: 600,
              height: 400,
              margin: {top: 10, right: 10, bottom: 30, left: 30},
              data: data,
              var_id: 'id',
              container: '#viz',
              var_color: 'id',
              var_group: 'group',
              var_x: function(d, i, vars) { return vars.width/2; },
              var_y: function(d, i, vars) { return vars.height/2; },
              var_share: 'value',
              duration: 0,
              items: [{
                marks: [{
                  var_mark: '__aggregated',
                  type: d3.scale.ordinal().domain([true, false]).range(['arc', 'none']),
                  fill: function(d, i, vars) {
                    return vars.color(vars.accessor_data(d)[vars.var_color]);
                  }
                }]
              }],
            });

        d3.select("#viz").call(v);

        t.equal(v.params().new_data.length, data.length);

    });


  }
});
