vars.default_params['productspace'] = function(scope) {

  var params = {};

  if(vars.init || vars.refresh) {

    // Links between items ussed to build graph
    if(vars.links !== null && vars.type === 'productspace') {

      vars.links.forEach(function(d, i) {

        if(typeof d.source === 'string') {
          d.source = vistk.utils.find_node_by_id(vars.nodes, d.source);
        }

        if(typeof d.target === 'string') {
          d.target = vistk.utils.find_node_by_id(vars.nodes, d.target);
        }

        d.__redraw = true;

      });

    }

    // Flagging missing nodes with __missing true attribute
    if(typeof vars.nodes !== 'undefined') {

      vars.new_data = utils.join(vars.nodes, vars.new_data, vars.var_node_id, vars.var_id, function(new_data, node) {

          var r = new_data;

          if(typeof node === 'undefined') {
            return;
          }

          // Update all time points
          vars.time.points.forEach(function(time) {

            if(typeof(r.values[time]) === 'undefined') {
              r.values[time] = {};
              r.values[time][vars.var_id] = vars.var_id;
            }

            r.values[time].x = node.x;
            r.values[time].y = node.y;
          });

          // Keep the metadata
          r.x = node.x;
          r.y = node.y;

          r.__redraw = true;
          return r;
      });

      // Remove missing nodes
      // vars.new_data = vars.new_data.filter(function(d) {
      //  return !d.__missing;
      // });

      // Go through again the list of nodes
      // to make sure we display all the nodes
      vars.nodes.forEach(function(d, i) {

        var node = vistk.utils.find_node_coordinates_by_id(vars.new_data, vars.var_id, d[vars.var_node_id]);

        if(typeof node === 'undefined') {

          d.values = [];
          d[vars.var_r] = 0;
          d[vars.var_id] = d.id;

          vistk.utils.init_item(d);
          d.__redraw = true;

          vars.new_data.push(d);

        }

      });

    }

  }

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

  //params.r_scale = d3.scale.linear()
  //            .range([10, 30])
  //            .domain(d3.extent(vars.new_data, function(d) { return accessor_values(d)[vars.var_r]; }));

  params.items = [{
    marks: [{
      type: 'circle',
      fill: function(d) {
        return vars.color(scope.accessor_data(d)[vars.var_color]);
      }
    }, {
      type: 'text'
    }]
  }];

  params.connect = [{
    marks: [{
      type: "line",
      func: null,
    }]
  }];

  params.x_axis_show = false;
  params.x_grid_show = false;

  params.y_axis_show = false;
  params.y_grid_show = false;


  if(vars.init) {

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

    // Custom highlight function to highlight neighbors
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

    // Persistent selection to show neighbors
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
  }

  return params;

};
