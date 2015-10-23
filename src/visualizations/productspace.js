vars.default_params["productspace"] = function(scope) {

  var params = {};

  params.x_scale = [{
    func: d3.scale.linear()
            .range([0, vars.width-vars.margin.left-vars.margin.right])
            .domain(d3.extent(vars.new_data, function(d) { return d[vars.var_x]; })).nice()
  }];

  params.y_scale = [{
    func: d3.scale.linear()
            .range([vars.height-vars.margin.top-vars.margin.bottom, vars.margin.top])
            .domain(d3.extent(vars.new_data, function(d) { return d[vars.var_y]; })).nice(),
  }];

  params.r_scale = d3.scale.linear()
              .range([10, 30])
              .domain(d3.extent(vars.new_data, function(d) { return d[vars.var_r]; }));

  params.items = [{
    marks: [{
      type: "circle",
      r_scale: d3.scale.linear()
                  .range([10, 30])
                  .domain(d3.extent(vars.new_data, function(d) { return d[vars.var_r]; })),
      fill: function(d) { return vars.color(vars.accessor_items(d)[vars.var_color]); }
    }, {
      type: "text",
      rotate: "30",
      translate: null
    }]
  }];

  params.connect = [{
    attr: "links",
    type: "items",
    marks: [{
      type: "line",
      rotate: "0",
      func: null,
    }]
  }];

  params.x_axis_show = false;
  params.x_grid_show = false;

  params.y_axis_show = false;
  params.y_grid_show = false;

  vars.evt.register("highlightOn", function(d) {

    // Make sure the highlighted node is above other nodes
    vars.svg.selectAll('.mark__group').sort(function(a, b) { return a.__highlighted ;})

    var adjacent_links = utils.find_adjacent_links(d, vars.links);

    adjacent_links.forEach(function(e) {

        // Redraw adjacent links
        e.__highlighted__adjacent = true;
        e.__redraw = true;

       vars.new_data.forEach(function(f, k) {

         if(f[vars.var_id] === e.target[vars.var_id] || f[vars.var_id] === e.source[vars.var_id]) {
          // Redraw adjacent nodes
           f.__highlighted__adjacent = true;
           f.__redraw = true;
         }

       });

    });

  });

  vars.evt.register("highlightOut", function(d) {

    vars.new_data.forEach(function(f, k) {
      if(f.__highlighted__adjacent) {
        f.__highlighted__adjacent = false;
        f.__redraw = true;
      }
    });

    vars.links.forEach(function(f, k) {
      if(f.__highlighted__adjacent) {
        f.__highlighted__adjacent = false;
        f.__redraw = true;
      }
    });

    d3.select(vars.container).selectAll(".connect__line")
      .classed("highlighted", function(d, i) { return false; })
      .classed("highlighted__adjacent", function(d, i) { return false; })

    d3.select(vars.container).selectAll("circle")
      .classed("highlighted", function(d, i) { return false; })
      .classed("highlighted__adjacent", function(d, i) { return false; })

  });

  vars.evt.register("selection", function(d) {

    // Make sure the highlighted node is above other nodes
    // vars.svg.selectAll('.mark__group').sort(function(a, b) { return a.__highlighted ;})

    vars.new_data.forEach(function(f, k) {
      if(f.__selected) {
        f.__selected = false;
        f.__redraw = true;
      }

      if(f.__selected__adjacent) {
        f.__selected__adjacent = false;
        f.__redraw = true;
      }

    });

    vars.links.forEach(function(f, k) {
      if(f.__selected) {
        f.__selected = false;
        f.__redraw = true;
      }

      if(f.__selected__adjacent) {
        f.__selected__adjacent = false;
        f.__redraw = true;
      }

    });

    d.__selected = true;
    d.__redraw = true;

    var adjacent_links = utils.find_adjacent_links(d, vars.links);

    adjacent_links.forEach(function(e) {

      // Update links
      e.__selected = true;
      e.__selected__adjacent = true;
      e.__redraw = true;

      vars.new_data.forEach(function(f, k) {

        if(f[vars.var_id] === e.target[vars.var_id] || f[vars.var_id] === e.source[vars.var_id]) {

          // Update nodes
          f.__selected = true;
          f.__selected__adjacent = true;
          f.__redraw = true;
        }

      });

    });

    d3.select(vars.container).selectAll(".connect__line")
      .classed("selected", function(d, i) { return d.__selected; })
      .classed("selected__adjacent", function(d, i) { return d.__selected__adjacent; })

    d3.select(vars.container).selectAll("circle")
      .classed("selected", function(d, i) { return d.__selected; })
      .classed("selected__adjacent", function(d, i) { return d.__selected__adjacent; })

  });

  return params;

};
