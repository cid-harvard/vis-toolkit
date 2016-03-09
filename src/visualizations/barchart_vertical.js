vars.default_params['barchart_vertical'] = function(scope) {

  var params = {};

  // params.x_scale = vistk.utils.scale.linear(scope);

  params.x_scale = [{
    func: d3.scale.linear()
            .range([scope.width - scope.margin.left - scope.margin.right, scope.margin.left])
            .domain([d3.max(vars.new_data, function(d) {
              return scope.accessor_data(d)[vars.var_x];
            }), d3.min(vars.new_data, function(d) {
              return scope.accessor_data(d)[vars.var_x];
            })])
            .nice()
  }];

  params.y_scale = [{
    func: d3.scale.ordinal()
            .rangeRoundBands([scope.height - scope.margin.top - scope.margin.bottom, scope.margin.top], .1)
            .domain(vars.new_data.map(function(d) {
              return scope.accessor_data(d)[vars.var_y];
            }))
  }];

  params.items = [{
    marks: [{
      type: "rect",
      x: function(d) {
         return -params.x_scale[0]['func'](scope.accessor_data(d)[scope.var_x]) + scope.margin.left;
      },
      y: function(d) {
        return 0;
      },
      height: function(d) {
        return scope.mark.width;
      },
      width: function(d) {
        return params.x_scale[0]['func'](scope.accessor_data(d)[scope.var_x]) - scope.margin.left;
      },
      fill: function(d) {
        return scope.color(scope.accessor_data(d)[scope.var_color]);
      }
    }, {
      type: 'text',
      text: function(d) {
        return scope.accessor_data(d)[vars.var_x];
      },
      translate: [2, 5],
      text_anchor: 'start'
    }]
  }];

  params.x_axis_show = false;
  params.x_axis_translate = [0, scope.height - scope.margin.bottom - scope.margin.top];
  params.x_grid_show = false;

  params.y_axis_show = true;
  params.y_axis_translate = [scope.margin.left, 0];
  params.y_grid_show = true;

  return params;

};
