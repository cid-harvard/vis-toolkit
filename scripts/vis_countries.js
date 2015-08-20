var fs = require('fs');
var system = require('system');

var LOAD_WAIT_TIME = 2000;
var THUMBS_DIR = "../thumbs/";
var SCREENSHOT_WIDTH = 600; 
var SCREENSHOT_HEIGHT = 400; 
var VIS_LIST = ['dotplot', 'sparkline', 'barchart', 'default'];

var inputFileName = "../examples/default.html";
var outpoutFileName = THUMBS_DIR + "gallery.html";

var html = "";

fs.removeTree(THUMBS_DIR);
fs.makeDirectory(THUMBS_DIR);

console.log("Generating: " + inputFileName);

var takeScreenshot = function(index) {

  var html_start = '<html><body> <meta http-equiv="refresh" content="0.5">';
  var html_start_no_refresh = '<html><body>';
  var html_end = '</body></html>';
  var page = require("webpage").create();

  page.open(inputFileName)

  console.log("waiting for page to load...")

  page.onLoadFinished = function() {
    
    page.evaluate(function(type) { 

      visualization.params({
        type: type,
        margin: {top: 10, right: 10, bottom: 30, left: 30},
        width: 600,
        height: 400,
        title: type,
        ui: {default: false}
      });

      d3.select(visualization.container()).call(visualization); 

    }, VIS_LIST[index]);

    setTimeout(function(){

      var outputImageFileName = THUMBS_DIR + VIS_LIST[index] + ".png";

      page.clipRect = {
          top: 0,
          left: 0, 
          width: SCREENSHOT_WIDTH, 
          height: SCREENSHOT_HEIGHT
      };

      page.render(outputImageFileName);
      console.log("Page rendered")

      html += '<a href="' + outputImageFileName + '"><img src="' + outputImageFileName + '" height=100></a>';

      // Generates an HTML file containing the various charts
      fs.write(outpoutFileName, html_start + html + html_end, function(err) {

        if(err) {
          return console.log(err);
        }

        console.log("The file was saved!");

      });

      // If last
      if(index >= VIS_LIST.length) {

        fs.write(outpoutFileName, html_start_no_refresh + html + html_end, function(err) {
          if(err) { return console.log(err); }
          console.log("The file was saved!");
        });

        phantom.exit();

      } else {
        takeScreenshot(index + 1);
      }

    }, LOAD_WAIT_TIME)

  }
}

takeScreenshot(0);
