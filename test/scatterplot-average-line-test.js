var jsdom = require("jsdom");
var test = require('tape');
var path = require("path")

jsdom.env({
  file: path.join(__dirname, "../examples/scatterplot_average_line.html"),
  features: { QuerySelector:true },
  done: function (err, window) {

    var d3 = window.d3;
    var vistk = window.vistk;

    setTimeout(function() {

      test('we should have 120 circles', function (t) {

        t.plan(1);
        t.equal(d3.select("#viz").selectAll('circle')[0].length, 120);

      });

      test('we should have 1 single horizontal line', function (t) {

        t.plan(1);
        t.equal(d3.select('#viz').selectAll('.mark__line_horizontal')[0].length, 1);

      });

    }, 1000)

  }
});
