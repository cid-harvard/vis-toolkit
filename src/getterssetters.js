
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

    // Go through all the dataset and vistk.utils.merge with the current one
    data.forEach(function(d, i) {

      vars.data.forEach(function(e, j) {

        if( (d[vars.var_join] == e[vars.var_join]) && (d.year == 2011)) {

//          console.log("vistk.utils.merge", d, e, vistk.utils.merge(d, e));
          return  vistk.utils.merge(d, e);

        }
      });
    });

    return chart;
  };

  // Generic parameters function
  chart.params = function(x) {
    if (!arguments.length) return vars;
    vars = vistk.utils.merge(vars, x);
    vars.user_config = x;    
    return chart;
  };


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
