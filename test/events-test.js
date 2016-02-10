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

    test('VisTK triggers start and finish events', function (t) {

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


    test('background message appears when loading and disappears when finish', function (t) {

      var data = ['A', 'B', 'C'];
      var v = vistk.viz().params({
        data: data
      });

      var test_evt_start = function() {
        var display = d3.select('#viz').selectAll(".message")[0][0].style.display;
        t.equal(display, 'block');
      }

      var test_evt_finish = function() {
        var display = d3.select('#viz').selectAll(".message")[0][0].style.display;
        t.equal(display, 'none');
      }

      t.plan(2);

      d3.select("#viz").call(v);

      v.params().evt.register('start', test_evt_start);
      v.params().evt.register('start', test_evt_finish);

      d3.select("#viz").call(v);


    });

    // highlightOn
    // highlightOut

    // Groups / marks classes related to events
    // mouseover → highlightOn → highlighted

    // mouseleave → highlightOut → highlighted
    // highlightOn → highlighted → h̶i̶g̶h̶l̶i̶g̶h̶t̶e̶d̶

  }
});
