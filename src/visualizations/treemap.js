vars.default_params["treemap"] = function(scope) {

  var params = {};

  if(vars.refresh) {

    // Create the root node
    vars.root = {};
    vars.root[vars.var_text]= "root";
    vars.root.depth = 0;

    vars.groups = [];

    vars.unique_groups = [];

    // Creates the groups here
    vars.new_data.map(function(d, i) {

      // If group doesn't exist, we create it
      if(vars.unique_groups.indexOf(d[vars.var_group]) < 0) {
        vars.unique_groups.push(d[vars.var_group]);
        vars.groups[vars.unique_groups.indexOf(d[vars.var_group])] = [];
      }

      var n = {year: d.year, id: i};
      n[vars.var_size] = d[vars.var_size];
      n[vars.var_group] = d[vars.var_group];
      n[vars.var_id] = d[vars.var_id];
      n[vars.var_text] = d[vars.var_text];
      vars.groups[vars.unique_groups.indexOf(d[vars.var_group])].push(n);

    });

    // Make sure there is no empty elements
    vars.groups = vars.groups.filter(function(n) { return n !== "undefined"; }); 

    // Add group elements are root children
    vars.root.children = vars.groups.map(function(d, i) {

      node = {};
      node[vars.var_text] = d[0][vars.var_text];
      node[vars.var_group] = d[0][vars.var_group];
      node[vars.var_id] = d[0][vars.var_group];
      node[vars.var_sort] = 0;
      node[vars.var_size] = 0;

      // Create the children nodes var
      node.children = d.map(function(e, j) {
        var n = {year: e.year, id: e.id};
        n[vars.var_text] = e[vars.var_text];
        n[vars.var_size] = e[vars.var_size]; 
        n[vars.var_group] = e[vars.var_group];
        n[vars.var_id] = e[vars.var_id];

        node[vars.var_sort] += e[vars.var_sort];
        node[vars.var_size] += e[vars.var_size];

        return n;
      });

      return node;

    });

    if(typeof vars.var_sort_asc !== "undefined" && !vars.var_sort_asc) {
      vars.root.children = vars.root.children.sort(function(a, b) { return d3.ascending(a[vars.var_sort], b[vars.var_sort]);});
    } else {
      vars.root.children = vars.root.children.sort(function(a, b) { return d3.descending(a[vars.var_sort], b[vars.var_sort]);});
    }

    vars.treemap = d3.layout.treemap()
        .padding(vars.padding)
        .sticky(true)
        .sort(function(a,b) { return a[vars.var_sort] - b[vars.var_sort]; })
        .size([vars.width, vars.height])
        .value(function(d) { return d[vars.var_size]; });

    vars.new_data = vars.treemap.nodes(vars.root);

    vars.new_data.forEach(function(d) { d.__redraw = true; });

  }

  params.x_scale = [{
    func: d3.scale.linear()
            .range([scope.margin.left, scope.width - scope.margin.left - scope.margin.right])
            .domain([0, d3.max(vars.new_data, function(d) { return d.x; })]),
  }];

  params.y_scale = [{
    func: d3.scale.linear()
            .range([scope.margin.top, scope.height - scope.margin.top - scope.margin.bottom])
            .domain([0, d3.max(vars.new_data, function(d) { return d.y; })]),
  }];

  params.items = [{
    marks: [{
      type: "divtext",
      filter: function(d, i) { return d.depth == 1 && d.dx > 30 && d.dy > 30; }
    }, {
      type: "rect",
      rotate: "10",
      filter: function(d, i) { return d.depth == 2; },
      x: 0,
      y: 0,
      width: function(d) { return d.dx; },
      height: function(d) { return d.dy; }
    }]
  }];

  params.var_x = 'x';
  params.var_y = 'y';

  return params;

};
