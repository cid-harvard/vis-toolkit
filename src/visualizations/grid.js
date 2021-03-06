vars.default_params["grid"] = function(scope) {

  var params = {};

  params.accessor_data = function(d) { return d; };

  // Chart specific metadata: grid
  // Generates x and y attributes to display items as a 2D grid
  if(vars.refresh) {

    var nb_dimension =  Math.ceil(Math.sqrt(vars.new_data.length));

    if(typeof scope.width_grid === 'undefined') {
      scope.width_grid = nb_dimension;
    }

    if(typeof scope.height_grid === 'undefined') {
      scope.height_grid = nb_dimension;
    }

    // Create foci for each dimension
    // TOFIX: should update children, not necessary replace
    d3.range(scope.width_grid).map(function(d, i) {

       d3.range(scope.height_grid).map(function(e, j) {

        var index = i * scope.height_grid + j;

        // To make sure we don't update more points than necessary
        if(index < vars.new_data.length) {

          vars.new_data[index].grid_x = i;
          vars.new_data[index].grid_y = j;
          vars.new_data[index].grid_index = index;

        }
      });

    });

  }

  params.x_scale = [{
    func: d3.scale.linear()
          .domain([0, scope.width_grid])
          .range([scope.margin.left, scope.width - scope.margin.left - scope.margin.right])
  }];

  params.y_scale = [{
    func: d3.scale.linear()
          .domain([0, scope.height_grid])
          .range([scope.height - scope.margin.top - scope.margin.bottom, scope.margin.top])
  }];

  params.items = [{
    marks: [{
      type: "rect",
    }]
  }];

  params.var_x = "grid_x";
  params.var_y = "grid_y";

  params.x_axis_show = false;
  params.y_axis_show = false;

  return params;

};
