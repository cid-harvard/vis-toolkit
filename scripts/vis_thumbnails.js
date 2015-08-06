
var URLS = ['dotplot', 'sparkline', 'treemap', 'barchart', 'scatterplot_productspace', 'scatterplot', 'linechart', 'stacked', 'grid_occu', 'piechart', 'slopegraph', 'default'];
var STATIC_URL = 'http://cid-harvard.github.io/vis-toolkit/examples/';
var THUMBS_DIR = '../thumbs/'
var SCREENSHOT_WIDTH = 800; 
var SCREENSHOT_HEIGHT = 600; 
var LOAD_WAIT_TIME = 2000; 

var fs = require('fs');
var system = require('system');
var args = system.args;

var groupby = false;
var aggregate = true;

var getPageTitle = function(page){
    var documentTitle = page.evaluate(function(){
        return document.title; 
    })
    console.log("getting title:", documentTitle)
    return documentTitle; 
}

var getPageHeight = function(page){
    var documentHeight = page.evaluate(function() { 
        return document.body.offsetHeight; 
    })
    console.log("getting height:", documentHeight)
    return documentHeight; 
}

var renderPage = function(page, element) {

    var pageHeight = getPageHeight(page); 

    page.clipRect = {
        top: 0,
        left: 0, 
        width: SCREENSHOT_WIDTH, 
        height: pageHeight
    };

    page.render(THUMBS_DIR + element + ".png");
    
    console.log("rendered:", element + ".png")
}

var exitIfLast = function(index,array){
    console.log(array.length - index-1, "more screenshots to go!")
    console.log("~~~~~~~~~~~~~~")
    if (index == array.length-1) {
        console.log("exiting phantomjs")
        phantom.exit();
    }
}

var takeScreenshot = function(element){

    console.log("opening URL:", element)

    var page = require("webpage").create();

    page.viewportSize = {width: SCREENSHOT_WIDTH, height: SCREENSHOT_HEIGHT};

    // Build the URL query string here

    var query_string = '';

    if(aggregate) {
      query_string = '?aggregate=continent';
    }

    page.open(STATIC_URL + element); 

    console.log("waiting for page to load...")

    page.onLoadFinished = function() {
      setTimeout(function(){
          console.log("that's long enough")
          renderPage(page, element)
          exitIfLast(index,URLS)
          index++; 
          takeScreenshot(URLS[index]);
      }, LOAD_WAIT_TIME)
    }

}

var getAllExamples = function() {

  URLS = [];

  var path = "../examples/";

  var list = fs.list(path);

  for(var x = 0; x < list.length; x++) {

      var file = path + list[x];
      if(fs.isFile(file)) {
        var name = file.replace('../examples/', '').replace('.html', '');
        URLS.push(name)
      }
  }

}

var createGallery = function() {

  var html = '<html><body>';

  URLS.forEach(function(d) {

    if(groupby) {
      html += '<h2>' + d + '</h2>';
    }

    html += '<a href="examples/' + d + '.html"><img src="thumbs/' + d + '.png" style="max-height: 300" /></a>';
  })

  html += '</body></html>';

  fs.write("../gallery.html", html, function(err) {

    if(err) {
      return console.log(err);
    }

    console.log("The file was saved!");

  }); 

}

var index = 0; 

if (args.length === 1) {

  console.log('No argument found, running with default params');

} else {

  args.forEach(function(arg, i) {

    if(arg === 'all') {
      console.log('Generate thumbnails for all examples');
      getAllExamples();
    }

    if(arg === 'groupby') {
      console.log('Grouping examples by type of visualization');
      groupby = true;
    }

    if(arg === 'aggregate') {
      console.log('Aggregation actived');
      aggregate = true;
    }

  });
}

takeScreenshot(URLS[index]);
createGallery();
