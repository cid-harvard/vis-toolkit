vars.default_params["matrix"] = function(scope) {

  var params = {};

  // vars.new_data = miserabels

  // A matrix is a permutation of two ordinal scales
  // Each cell is a graphical mark


  if(vars.refresh) {

    // Prepare data

    // Duplicate and create


  }



  params.connect = [{
    marks: [{
      type: "rect"
    }]
  }];

// Horizontal ordinal scale
// var x = d3.scale.ordinal().rangeBands([0, vars.width]),
var z = d3.scale.linear().domain([0, 4]).clamp(true),
    c = d3.scale.category10().domain(d3.range(10));

  // TODO: Re-use previous scales
  // vars.default_params["ordinal_vertical"]
  // vars.default_params["ordinal_horizontal"]
  params.x_scale = [{
    func: d3.scale.ordinal()
            .domain(d3.set(vars.new_data.map(function(d) { return d[vars.var_x]; })).values())
            .rangeBands([scope.margin.left, scope.width - scope.margin.left - scope.margin.right]),
  }];

  /* Prototyping ideal configuration
  params.items = [{
    marks: [{
      type: 'text'
    }],
    marks: [{
      type: 'text'
    }]
   }];
  */

  var matrix = [],
      nodes = vars.nodes,
      n = vars.nodes.length;

  // Compute index per node.
  nodes.forEach(function(node, i) {
    node.index = i;
    node.count = 0;
    matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0}; });
  });

  // Convert links to matrix; count character occurrences.
  vars.links.forEach(function(link) {
    matrix[link.source][link.target].z += link.value;
    matrix[link.target][link.source].z += link.value;
    matrix[link.source][link.source].z += link.value;
    matrix[link.target][link.target].z += link.value;
    nodes[link.source].count += link.value;
    nodes[link.target].count += link.value;
  });

  // Precompute the orders.
  var orders = {
    name: d3.range(n).sort(function(a, b) { return d3.ascending(nodes[a].name, nodes[b].name); }),
    count: d3.range(n).sort(function(a, b) { return nodes[b].count - nodes[a].count; }),
    group: d3.range(n).sort(function(a, b) { return nodes[b].group - nodes[a].group; })
  };

  // The default sort order.
  params.x_scale[0]['func'].domain(orders.name);

  vars.svg.append("rect")
      .attr("class", "background")
      .attr("width", vars.width)
      .attr("height", vars.height);

  var row = vars.svg.selectAll(".row")
      .data(matrix)
    .enter().append("g")
      .attr("class", "row")
      .attr("transform", function(d, i) { return "translate(0," + params.x_scale[0]['func'](i) + ")"; })
      .each(row);

  row.append("line")
      .attr("x2", vars.width);

  row.append("text")
      .attr("x", -6)
      .attr("y", params.x_scale[0]['func'].rangeBand() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "end")
      .text(function(d, i) { return nodes[i].name; });

  var column = vars.svg.selectAll(".column")
      .data(matrix)
    .enter().append("g")
      .attr("class", "column")
      .attr("transform", function(d, i) { return "translate(" + params.x_scale[0]['func'](i) + ")rotate(-90)"; });

  column.append("line")
      .attr("x1", -vars.width);

  column.append("text")
      .attr("x", 6)
      .attr("y", params.x_scale[0]['func'].rangeBand() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "start")
      .text(function(d, i) { return nodes[i].name; });

  function row(row) {
    var cell = d3.select(this).selectAll(".cell")
        .data(row.filter(function(d) { return d.z; }))
      .enter().append("rect")
        .attr("class", "cell")
        .attr("x", function(d) { return params.x_scale[0]['func'](d.x); })
        .attr("width", params.x_scale[0]['func'].rangeBand())
        .attr("height", params.x_scale[0]['func'].rangeBand())
        .style("fill-opacity", function(d) { return z(d.z); })
        .style("fill", function(d) { return nodes[d.x].group == nodes[d.y].group ? c(nodes[d.x].group) : null; })

  }

  return params;

};
