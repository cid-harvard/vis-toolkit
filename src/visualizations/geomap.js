 vars.default_params["geomap"] = function(scope) {

  var params = {};

  params.var_x = 'x';
  params.var_y = 'y';

  params.accessor_data = function(d) { return d; };
  params.accessor_values = function(d) { return d.data.values; };

  if(vars.init) {

    // countries contains bot the data and coordinates for shapes drawing
    vars.countries = topojson.object(vars.topology, vars.topology.objects.countries).geometries;
    vars.neighbors = topojson.neighbors(vars.topology, vars.countries);

    vars.countries.forEach(function(d) {

      // Retrieve the country name based on its id
      d[vars.var_id] = vars.names.filter(function(n) {
        return d.id == n.id;
      })[0][vars.var_id];

      // TODO: should merge on a more reliable join (e.g. 2-char)
      d.data = vars.new_data.filter(function(n) {
        return d[vars.var_id] === n[vars.var_id];
      })[0];

      // Two reasons why it is not defined
      // 1/ No data
      // 2/ Current country
      if(typeof d.data == "undefined") {

        var data = {}
        data[vars.var_id] = d[vars.var_id];
        d.data = data;

      }

      d.__redraw = true;

    });


    vars.new_data = vars.countries.map(function(d) {

      d[vars.var_color] = d.data[vars.var_color];
      d[vars.var_group] = d.data[vars.var_group];
      if(typeof d.x === 'undefined') { d.x = 0; }
      if(typeof d.y === 'undefined') { d.y = 0; }
      return d;
    });

    vars.projection = d3.geo.equirectangular()
                    .scale(100);

    // This is the main function that draws the shapes later on
    vars.path = d3.geo.path()
        .projection(vars.projection);

    // Pr-process the shapes and calculate their BBox here and assign to x

    vars.new_data.forEach(function(d) {
      var a = vars.svg.append("path").attr("id", "geomap__pre-render").attr("d", vars.path(d))
      d.x = 200;// a.node().getBBox().x;
      d.y = 50; //a.node().getBBox().y;
      a.remove();
    })

  }

  params.x_scale = [{
    func: d3.scale.linear()
            .domain(d3.extent(vars.new_data, function(d) { return d[params.var_x]; }))
            .range([scope.margin.left, scope.width - scope.margin.left - scope.margin.right])
  }];

  params.y_scale = [{
    func: d3.scale.linear()
            .domain(d3.extent(vars.new_data, function(d) { return d[params.var_y]; }))
            .range([scope.margin.top, scope.height - scope.margin.top - scope.margin.bottom])
  }];

  params.items = [{
    marks: [{
      type: "shape",
      fill: d3.scale.linear()
              .domain([
                d3.min(vars.new_data, function(d) { return d[scope.var_color]; }),
                d3.max(vars.new_data, function(d) { return d[scope.var_color]; })
              ])
              .range(["red", "green"])
    }]
  }];

  return params;

};
