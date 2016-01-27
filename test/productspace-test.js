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

  test('we should have 759 circles', function (t) {

    t.plan(2);

     d3.json("https://cid-harvard.github.io/vis-toolkit-datasets/data/colombia_product_space.json", function(graph) {
      d3.json("https://cid-harvard.github.io/vis-toolkit-datasets/data/colombia_products_location930_2012.json", function(exports) {

        var visualization = vistk.viz()
          .params({
            type: "productspace",
            container: "#viz",
            width: 800,
            height: 500,
            nodes: graph.nodes,
            links: graph.edges,
            data: exports.data,
            var_x: 'x',
            var_y: 'y',
            var_color: 'product_id',
            var_group: 'group_name_en',
            x_axis_show: false,
            x_grid_show: false,
            y_axis_show: false,
            y_grid_show: false,
            y_invert: true,
            radius: 4,
            var_id: "product_id",
            time: {
              var_time: "year",
              current_time: "2012",
              parse: function(d) { return d; }
            },
          });

          t.pass('Successul loading');

          d3.select("#viz").call(visualization);

      });

    });



  });


  }
});
