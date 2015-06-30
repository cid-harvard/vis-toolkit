
  chart.params = function(x) {
    if(!arguments.length) return vars;
    vars._user_vars = x;    
    return chart;
  };

  chart.container = function(x) {
    if(!arguments.length) return vars.container;
    vars.container = x;
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

          return  vistk.utils.merge(d, e);

        }
      });
    });

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
