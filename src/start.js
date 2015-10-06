"use strict";

var w = typeof window === "undefined" ? this : window;

var vistk = w.vistk || {};
w.vistk = vistk;

vistk.version = "{{ VERSION }}";
vistk.utils = {};

vistk.viz = function() {

// Init parameters for the current chart
var vars = {};

// Private functions
var utils ={};
