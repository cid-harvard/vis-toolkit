var fs = require('fs');
var system = require('system');

var LOAD_WAIT_TIME = 2000;
var THUMBS_DIR = "../thumbs/";
var inputFileName = "../examples/default.html";
var outpoutFileName = THUMBS_DIR + "gallery.html";

fs.removeTree(THUMBS_DIR);
fs.makeDirectory(THUMBS_DIR);

console.log("Generating: " + inputFileName);

var html = '<html><body><img src=\'test.png\'></body></html>';
var page = require("webpage").create();

page.open(inputFileName)

console.log("waiting for page to load...")

page.onLoadFinished = function() {
  
  page.evaluate(function() { 
    visualization.params({type: "grid"});
    d3.select(visualization.container()).call(visualization); 
  });

  setTimeout(function(){

    page.render(THUMBS_DIR + "test.png");
    console.log("Page rendered")

    phantom.exit();

  }, LOAD_WAIT_TIME)

}

// Generates an HTML file containing the various charts
fs.write(outpoutFileName, html, function(err) {

  if(err) {
    return console.log(err);
  }

  console.log("The file was saved!");

});
