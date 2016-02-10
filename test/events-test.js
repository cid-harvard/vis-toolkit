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

    test('VisTK triggers a start event', function (t) {

      var test_evt_start = function() { t.pass('start'); }
      var test_evt_finish = function() { t.pass('finish'); }

      t.plan(2);

      var data = ['A', 'B', 'C'];
      var v = vistk.viz().params({
        data: data
      });

      d3.select("#viz").call(v);

      v.params().evt.register('start', test_evt_start);
      v.params().evt.register('start', test_evt_finish);

      d3.select("#viz").call(v);

    });

  }
});
