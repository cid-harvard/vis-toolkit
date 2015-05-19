      case "piechart":

        var r = vars.width/6;

        var vis = vars.svg.append("g")
                    .attr("transform", "translate(" + vars.width/2 + "," + vars.height/2 + ")");
        
        var pie = d3.layout.pie().value(function(d) { return d[vars.var_share]; }); // equal share

        var arc = d3.svg.arc().outerRadius(r);

        var arcs = vis.selectAll("g.slice")
                      .data(pie(vars.new_data))
                    .enter()
                      .append("svg:g")
                      .attr("class", "slice");
        
        arcs.append("svg:path")
            .attr("fill", function(d, i) {
              return vars.color(d[vars.var_color]);
            })
            .attr("d", arc);

        arcs.append("text")
            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .text(function(d) { return d[vars.var_text]; });

        break;