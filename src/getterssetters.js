
  chart.params = function(x) {
    if(!arguments.length) return vars;
    vars._user_vars = x;    
    return chart;
  };

  chart.param = function(attr, value) {
    if(arguments.length < 2) return vars["attr"];
    vars[attr] = value;    
    return chart;
  };

  chart.container = function(x) {
    if(!arguments.length) return vars.container;
    vars.container = x;
    return chart;
  };
