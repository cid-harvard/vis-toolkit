vistk = window.vistk || {};

window.vistk = vistk;

vistk.viz = function() {

	// Plenty of default params here
  vars = {
    "container" : "#viz",
    "dev" : true,
    "id" : "id",
    "id_var" : "id",
    "data"  : [],
    "year"  : 1995,
    "columns": ["Rank", "year", "Abbrv", "Country"],
    "title": "Ranking table",
    "solo": [],
    "nesting": null,
    "nesting_aggs": {},
  }

  vars.parent = d3.select(vars.container);

  if (vars.dev) console.log("Init")

  // TODO: remove visualization
	d3.select("#viz").select("table").remove();

	if (!vars.data) vars.data = []

	// Constructor
	chart  = function(selection) {	

    selection.each(function(data_passed) {


    	d3.select("#viz").append("span").html(JSON.stringify(vars.data))

  	});

  }

  // Public Variables
  chart.id = function(x) {
    if (!arguments.length) return vars.id;
    vars.id = x;
    return chart;
  };

  chart.id_var = function(x) {
    if (!arguments.length) return vars.id_var;
    vars.id_var = x;
    return chart;
  };

  chart.year = function(x) {
    if (!arguments.length) return vars.year;
    vars.year = x;
    return chart;
  };

  chart.columns = function(x) {
    if (!arguments.length) return vars.columns;
    vars.columns = x;
    return chart;
  };

	chart.height = function(x) {
	  if (!arguments.length) return vars.table_height;
	  vars.table_height = x;
	  return chart;
	};

  chart.width = function(x) {
    if (!arguments.length) return vars.table_width;
    vars.table_width = x;
    return chart;
  };

  chart.container = function(x) {
    if (!arguments.length) return vars.container;
    vars.container = x;
    return chart;
  };

  chart.title = function(x) {
    if (!arguments.length) return vars.title;
    vars.title = x;
    return chart;
  };

  chart.data = function(x) {
    if (!arguments.length) return vars.data;
    vars.data = x;
    return chart;
  };

	chart.solo = function(x) {
	  if (!arguments.length) return vars.solo;

	  console.log("solo", x);

	  if(x instanceof Array) {
	    vars.solo = x;
	  } else {
	    if(vars.solo.indexOf(x) > -1){
	      vars.solo.splice(vars.solo.indexOf(x), 1)
	    } else {
	      vars.solo.push(x)
	    }
	  }

	  return chart;
	};

	chart.nesting = function(x) {
	  if (!arguments.length) return vars.nesting;
	  vars.nesting = x;
	  return chart;
	};

	chart.nesting_aggs = function(x) {
	  if (!arguments.length) return vars.nesting_aggs;
	  vars.nesting_aggs = x;
	  return chart;
	};

	chart.depth = function(x) {
	  if (!arguments.length) return vars.depth;
	  vars.depth = x;
	  return chart;
	};

	if(vars.dev)   
		console.log("update", chart.year())

  return chart;

}