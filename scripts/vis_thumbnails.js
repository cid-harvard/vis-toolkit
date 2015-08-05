
var URLS = ['dotplot', 'sparkline', 'treemap', 'barchart'];
var STATIC_URL = 'http://cid-harvard.github.io/vis-toolkit/examples/';
var OUTPUT_DIR = '../img/'
var SCREENSHOT_WIDTH = 800; 
var SCREENSHOT_HEIGHT = 600; 
var LOAD_WAIT_TIME = 5000; 

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
        top:0,
        left:0, 
        width: SCREENSHOT_WIDTH, 
        height: pageHeight
    };

    page.render(OUTPUT_DIR + element + ".png");
    
    console.log("rendered:", element + ".png")
}

var exitIfLast = function(index,array){
    console.log(array.length - index-1, "more screenshots to go!")
    console.log("~~~~~~~~~~~~~~")
    if (index == array.length-1){
        console.log("exiting phantomjs")
        phantom.exit();
    }
}

var takeScreenshot = function(element){

    console.log("opening URL:", element)

    var page = require("webpage").create();

    page.viewportSize = {width: SCREENSHOT_WIDTH, height: SCREENSHOT_HEIGHT};

    page.open(STATIC_URL + element); 

    console.log("waiting for page to load...")

    page.onLoadFinished = function() {
        setTimeout(function(){
            console.log("that's long enough")
            renderPage(page, element)
            exitIfLast(index,URLS)
            index++; 
            takeScreenshot(URLS[index]);
        },LOAD_WAIT_TIME)
    }

}

var index = 0; 

takeScreenshot(URLS[index]);
