
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
  
