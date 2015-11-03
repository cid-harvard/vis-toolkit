var fs = require('fs');
var system = require('system');
var d3 = require("d3");


var process = require("child_process")
var execFile = process.execFile

var LOAD_WAIT_TIME = 5000;
var THUMBS_DIR = "../thumbs/";
var SCREENSHOT_WIDTH = 800;
var SCREENSHOT_HEIGHT = 600;


var inputFileName = "../examples/scatterplot_productspace_atlas.html";

fs.removeTree(THUMBS_DIR);
fs.makeDirectory(THUMBS_DIR);

var default_dataset = "../data/thai_exports_1960_2013.json";

/*
"../data/bgd_exports_1960_2013.json";
"../data/deu_exports_1960_2013.json";
"../data/sau_exports_1960_2013.json";
"../data/usa_exports_1960_2013.json";
*/

var PS_INTRO = [

  {
    label: "755 Products",
    group: "intro"
  },
  {
    label: "By proximity",
    group: "intro"
  },
  {
    label: "Color by category",
    group: "intro"
  },
  {
    label: "Machinery",
    group: "intro"
  },
  {
    label: "Textile",
    group: "intro"
  },
  {
    label: "Garnments",
    group: "intro"
  },
  {
    label: "Electronics",
    group: "intro"
  }
]

var LIST_PARAMS = [

// TIME
  {
    time: {
      current_time: 1985
    },
    filter: [],
    label: "1985",
    group: "time"
  },

  {
    time: {
      current_time: 1990
    },
    filter: [],
    label: "1990",
    group: "time"
  },

// COUNTRIES
// Uses different datasets
  {
    time: {
      current_time: 1995
    },
    filter: [],
    label: "Germany 1995",
    group: "country",
    data: '../data/..'
  },
  {
    time: {
      current_time: 2000
    },
    filter: [],
    label: "Germany 2000",
    group: "country"
  },

// CATEGORY
  {
    time: {
      current_time: 2000
    },
    filter: ['Machinery'],
    label: "Machinery",
    group: "category"
  }

// CATEGORY

];

LIST_PARAMS = d3.range((2013-1960)).map(function(d, i) {
  o = {};
  o.time = {};
  o.time.current_time = 1960 + i;
  o.filter = [];
  o.label = "Thailand " + (1960 + i) + "";
  o.group = 'year';
  return o;
})


var takeScreenshot = function(index) {
        console.log('Page loaded', index);
  var page = require("webpage").create();

  page.open(inputFileName, function    (status) {

    if (status !== 'success') {

        console.log('Unable to load the address!');

    } else {

      console.log('success~')

        window.setTimeout(function () {

            page.evaluate(function (PARAMS) {

              visualization.params().ui.default = false;

              //if(typeof PARAMS.time !== "undefined") {
              visualization.params().time.current_time = PARAMS.time.current_time;
              visualization.params().refresh = true;

             // }

              //if(typeof PARAMS.filter !== "undefined") {
              //  visualization.params().filter = PARAMS.filter;
              //}

              visualization.params().refresh = true;

              document.body.bgColor = 'white';
              d3.select("#viz").call(visualization);
              d3.select('.year').text(PARAMS.label);

            }, LIST_PARAMS[index]);


            window.setTimeout(function () {

              page.clipRect = {
                  top:    0,
                  left:   0,
                  width:  SCREENSHOT_WIDTH,
                  height: SCREENSHOT_HEIGHT
              };

              var outputImage = THUMBS_DIR + LIST_PARAMS[index].group + '_' + pad(index) + '.png';
              page.render(outputImage);

              console.log("writing file ", outputImage)

              if(index >= LIST_PARAMS.length - 1) {

                execFile("convert", ["-delay", "20", "-loop", 0, THUMBS_DIR, "*.png", "result_ph.gif"], null, function (err, stdout, stderr) {
                  phantom.exit();
                });

              } else {
                takeScreenshot(index + 1);
              }

            }, LOAD_WAIT_TIME);

        }, LOAD_WAIT_TIME);
    }
   });
}

takeScreenshot(0);

function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}
