"use strict";

var vistk = window.vistk || {};
window.vistk = vistk;

vistk.version = "{{ VERSION }}";
vistk.utils = {};

vistk.viz = function() {

  // Contains parameters for the current chart
  var vars = {}, utils ={};
