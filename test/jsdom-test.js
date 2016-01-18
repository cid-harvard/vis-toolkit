d3 = require("d3");
var jsdom = require("jsdom");
var vistk = require("../build/vistk.js");

var document = jsdom.jsdom();
var svg = d3.select(document.body).append("div").attr("id", "viz");


//var visualization = vistk.viz().params({});

d3.selectAll("#viz");//.call(visualization);
