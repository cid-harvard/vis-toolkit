
  // If init, then dispatch those events
  // TODO: dispatch focus event here and highlight nodes
  if(vars.selection.length > 0) {

    var selection_points = gItems
      .filter(function(d, i) {
        return i === vars.selection[0];
      });

    selection_points.select(".dot__circle")
      .classed("selected", false);

    selection_points.select(".dot__label")
      .filter(function(d, i) {
        return i === vars.selection[0];
      })
      .classed("selected", true);

  }

  if(typeof vars.highlight !== undefined && vars.highlight.length > 0) {

    vars.evt.call("highlightOn", vars.new_data[vars.highlight]);
  
  }

  // Public Variables
  chart.id = function(x) {
    if (!arguments.length) return vars.var_id;
    vars.var_id = x;
    return chart;
  };

	chart.height = function(x) {
	  if (!arguments.length) return vars.height;
	  vars.height = x;
	  return chart;
	};

  chart.width = function(x) {
    if (!arguments.length) return vars.width;
    vars.width = x;
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

  chart.type = function(x) {
    if (!arguments.length) return vars.type;
    vars.type = x;
    return chart;
  };

  chart.data = function(x) {
    if (!arguments.length) return vars.data;
    vars.data = x;
    return chart;
  };

  chart.join = function(data, var_join) {

    if (!arguments.length) return vars.var_join;

    vars.var_join = var_join;

    join_data = data;

    // Go through all the dataset and merge with the current one
    data.forEach(function(d, i) {

      vars.data.forEach(function(e, j) {

        if( (d[vars.var_join] == e[vars.var_join]) && (d.year == 2011)) {

//          console.log("merge", d, e, merge(d, e));
          return  merge(d, e);

        }
      });
    });

    return chart;
  };

  chart.time = function(params) {
    if (!arguments.length) return vars.current_time;
    vars.var_time = params.var_time;
    vars.current_time = params.current_time;
    return chart;
  };

  chart.group = function(x) {
    if (!arguments.length) return vars.var_group;
    vars.var_group = x;
    return chart;
  };

  chart.text = function(x) {
    if (!arguments.length) return vars.var_text;
    vars.var_text = x;
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

	// RANKINGS
  chart.columns = function(x) {
    if (!arguments.length) return vars.columns;
    vars.columns = x;
    return chart;
  };

  // SCATTERPLOT
  chart.var_x = function(x) {
    if (!arguments.length) return vars.var_x;
    vars.var_x = x;
    return chart;
  };

  chart.var_y = function(y) {
    if (!arguments.length) return vars.var_y;
    vars.var_y = y;
    return chart;
  };

  // DOTPLOT
  chart.x_type = function(x) {
    if (!arguments.length) return vars.x_type;
    vars.x_type = x;
    return chart;
  }; 

  chart.y_scale = function(x) {
    if (!arguments.length) return vars.y_scale;
    vars.y_scale = x;
    return chart;
  }; 

  chart.connect = function(x) {
    if (!arguments.length) return vars.var_connect;
    vars.var_connect = x;
    return chart;
  }; 

  // NODELINK
  chart.size = function(size) {
    if (!arguments.length) return vars.var_size;
    vars.var_size = size;
    return chart;
  };

  chart.links = function(links) {
    if (!arguments.length) return vars.links;
    vars.links = links;
    return chart;
  };

  chart.nodes = function(nodes) {
    if (!arguments.length) return vars.nodes;
    vars.nodes = nodes;
    return chart;
  };

  // MISC
  chart.items = function(size) {
    if (!arguments.length) return vars.items;
    vars.items = size;
    return chart;
  };

  chart.color = function(x) {
    if (!arguments.length) return vars.var_color;
    vars.var_color = x;
    return chart;
  };

  chart.share = function(x) {
    if (!arguments.length) return vars.var_share;
    vars.var_share = x;
    return chart;
  };

  // TODO: register those evens
  chart.on = function(x, params) {
    if (!arguments.length) return x;
    // Trigger the corresponding event
    vars.evt.register("highlightOn", function(d) { 
      params(d);
    });
    return chart;
  };

  chart.ui = function(x) {
    if (!arguments.length) return vars.ui;
    vars.ui = x;
    return chart;
  };

  chart.vars = function(x) {
    if (!arguments.length) return vars;
    vars = x;
    return chart;
  };

  // Generic parameters function
  chart.params = function(x) {
    if (!arguments.length) return vars;
    vars = merge(vars, x);
    return chart;
  };

  // Mouse hover
  chart.focus = function(x) {
    if (!arguments.length) return vars.focus;

    vars.focus = [x];

/* Smart but should be done for selection

    if(x instanceof Array) {
      vars.focus = x;
    } else {
      if(vars.focus.indexOf(x) > -1){
        vars.focus.splice(vars.focus.indexOf(x), 1)
      } else {
        vars.focus.push(x)
      }
    }
*/
    return chart;
  };


  // Pre-selected list of items by id
  chart.selection = function(selection) {
    if (!arguments.length) return vars.selection;
    vars.selection = selection;
    return chart;
  };

  // Mouse click
  chart.highlight = function(highlight) {
    if (!arguments.length) return vars.highlight;
    vars.highlight = highlight;
    return chart;
  };