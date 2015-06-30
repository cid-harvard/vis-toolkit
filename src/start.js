"use strict";

var vistk = window.vistk || {};
window.vistk = vistk;

vistk.version = "0.2";
vistk.utils = {};

vistk.viz = function() {

  if(typeof nb_viz === "undefined") {
    nb_viz = 0;
    global = {};
    global.evt = [];
  }

  // Contains parameters for the current chart
  var vars = {}, utils ={};
