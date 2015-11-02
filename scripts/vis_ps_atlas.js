var fs = require('fs');
var system = require('system');

var LOAD_WAIT_TIME = 10000;
var THUMBS_DIR = "../thumbs/";
var SCREENSHOT_WIDTH = 800;
var SCREENSHOT_HEIGHT = 600;

var inputFileName = "../examples/scatterplot_productspace_atlas.html";

fs.removeTree(THUMBS_DIR);
fs.makeDirectory(THUMBS_DIR);

var LIST_PARAMS = [

  {time: {
    var_time: "year",
    current_time: 1985,
    parse: function(d) { return d; }
  },
  label: "1985"
  },
  {time: {
    var_time: "year",
    current_time: 1990,
    parse: function(d) { return d; }
  },
  label: "1990"
  },
  {time: {
    var_time: "year",
    current_time: 1995,
    parse: function(d) { return d; }
  },
  label: "Germany (1995)"
  },
  {time: {
    var_time: "year",
    current_time: 2000,
    parse: function(d) { return d; }
  },
  label: "Germany (2000)"
  }
];

var takeScreenshot = function(index) {

  var page = require("webpage").create();

  page.open(inputFileName, function    (status) {

    if (status !== 'success') {

        console.log('Unable to load the address!');

    } else {

        window.setTimeout(function () {

            page.evaluate(function (PARAMS) {

              if(PARAMS.time !== "undefined") {
                visualization.params({
                  time: PARAMS.time,
                  ui: {default: false}
                });
              }

              d3.select("#viz").call(visualization);
              d3.select('.year').text(visualization.params().time.current_time + PARAMS.label);

            }, LIST_PARAMS[index]);

            page.clipRect = {
                top:    0,
                left:   0,
                width:  800,
                height: 500
            };

            var outputImage = THUMBS_DIR + 'capture' + index + '.png';
            page.render(outputImage);

            console.log("writing file ", outputImage)

            if(index >= LIST_PARAMS.length) {
              phantom.exit();
            } else {
              takeScreenshot(index + 1);
            }

        }, LOAD_WAIT_TIME);
    }
   });
}

takeScreenshot(0);
