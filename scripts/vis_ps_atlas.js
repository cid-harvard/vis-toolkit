// For arguments and file writing
var fs = require('fs');
var system = require('system');
var args = system.args;
var process = require("child_process")
var execFile = process.execFile

// Useful utils stuff
var d3 = require("d3");

var LOAD_WAIT_TIME = 5000;
var THUMBS_DIR = "../thumbs/";
var SCREENSHOT_WIDTH = 800;
var SCREENSHOT_HEIGHT = 600;

var inputFileName = "../examples/scatterplot_productspace_atlas.html";

// Remove temporary directory
fs.removeTree(THUMBS_DIR);
fs.makeDirectory(THUMBS_DIR);

var default_dataset = "../data/thai_exports_1960_2013.json";

var rca_fill = function(d) {
  if(d.rca > 1) {
    return d.color;
  } else {
    return "#fff";
  }
}

var color_fill = function(d) { return d.color; }
var white_fill = function() { return "#fff"; }

// INTRODUCTION

var PS_INTRO = [
  {
    label: "The Product Space",
    group: "intro",
    fill: color_fill,
    filter: []
  },
  {
    label: "755 Products",
    group: "intro",
    fill: white_fill,
    filter: []
  },
  {
    label: "Distance by Similarity",
    group: "intro",
    fill: color_fill,
    filter: []
  },
  {
    label: "Color by Category",
    group: "intro",
    fill: color_fill,
    filter: []
  }
];

PS_INTRO.forEach(function(d) {
  d.time = {};
  d.time.current_time = 2013;
})

// CATEGORY DESCRIPTION

CATEGORY_INTRO = [
  {
    label: "16 Categories",
    group: "category",
    fill: function(d) { return d.color; },
    filter: []
  },
  {
    label: "Machinery",
    group: "category",
    fill: function(d) { return d.color; },
    filter: ["Machinery"]
  },
  {
    label: "Garnments",
    group: "category",
    fill: color_fill,
    filter: ["Garnments"]
  },
  {
    label: "Electronics",
    group: "category",
    fill: color_fill,
    filter: ["Electronics"]
  }
];

CATEGORY_INTRO.forEach(function(d) {
  d.time = {};
  d.time.current_time = 2013;
})

// COUNTRY DESCRIPTION

LIST_COUNTRY = [
  {
    name: 'Germany',
    accr: 'deu'
  },
  {
    name: 'Saudi Arabia',
    accr: 'sau'
  },
  {
    name: 'United States',
    accr: 'usa'
  }
];

COUNTRY_INTRO = LIST_COUNTRY.map(function(d) {
  o = {};
  o.time = {};
  o.time.current_time = 2013;
  o.filter = [];
  o.dataset = "../data/" + d.accr + "_exports_1960_2013.json";
  o.label = d.name + " " + o.time.current_time + "";
  o.group = 'country';
  return o;
});

YEAR_INTRO = d3.range((2013-1960)).map(function(d, i) {
  o = {};
  o.time = {};
  o.time.current_time = 1960 + i;
  o.filter = [];
  o.label = "Thailand " + (1960 + i) + "";
  o.group = 'year';
  return o;
})

var captureScreen = function(index, LIST_PARAMS) {

  var page = require("webpage").create();

  page.open(inputFileName, function    (status) {

    if (status !== 'success') {

        console.log('Unable to load the address!');

    } else {

      console.log('Page loaded for ', index, LIST_PARAMS[index].group);

        window.setTimeout(function () {

            page.evaluate(function (PARAMS, rca_fill) {

              visualization.params().ui.default = false;

              //if(typeof PARAMS.time !== "undefined") {
              visualization.params().time.current_time = PARAMS.time.current_time;
              visualization.params().refresh = true;

             // }

              if(typeof PARAMS.filter !== "undefined") {
                visualization.params().filter = PARAMS.filter;
              } else {
                visualization.params().filter = [];
              }

              if(typeof PARAMS.fill !== "undefined") {
                visualization.params().items[0].marks[0].fill = PARAMS.fill;
              } else {
                visualization.params().items[0].marks[0].fill = rca_fill;
              }

              visualization.params().refresh = true;

              document.body.bgColor = 'white';
              d3.select("#viz").call(visualization);
              d3.select('.year').text(PARAMS.label);

            }, LIST_PARAMS[index], rca_fill);

            window.setTimeout(function () {

              page.clipRect = {
                  top:    0,
                  left:   0,
                  width:  SCREENSHOT_WIDTH,
                  height: SCREENSHOT_HEIGHT
              };

              var outputImage = THUMBS_DIR + LIST_PARAMS[index].group + '_' + pad(index) + '.png';
              page.render(outputImage);

              console.log("Writing file ", outputImage)

              if(index >= LIST_PARAMS.length - 1) {

                console.log("Create GIF")

                execFile("convert", ["-delay", "20", "-loop", 0, THUMBS_DIR, "*.png", "result_ph.gif"], null, function (err, stdout, stderr) {
                  phantom.exit();
                });

              } else {
                console.log("Next image ", index + 1);
                captureScreen(index + 1, LIST_PARAMS);
              }

            }, LOAD_WAIT_TIME);

        }, LOAD_WAIT_TIME);
    }
   });
}

if (args.length === 1) {
  console.log('Try to pass some arguments: intro, category, country, year.');
  phantom.exit();
} else {
  if(args[1] === "intro") {
    console.log("Loading introduction");
    captureScreen(0, PS_INTRO);
  } else if(args[1] === "category") {
    console.log("Loading category")
    captureScreen(0, PS_CATEGORY);
  } else if(args[1] === "country") {
    console.log("Loading country")
    captureScreen(0, PS_COUNTRY);
  } else if(args[1] === "year") {
    console.log("Loading year")
    captureScreen(0, PS_YEAR);
  } else {
    console.log("Unknown parameters, pick: intro, category, country, year.");
    phantom.exit();
  }
}

// UTILS FUNCTIONS

// Add leading zeros
function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}
