      case "piechart":

        var r = vars.width/6;
        
        var color = d3.scale.category20c();

        var vis = vars.svg.append("g")
                    .attr("transform", "translate(" + vars.width/2 + "," + vars.height/2 + ")");
        
        var pie = d3.layout.pie().value(function(d) { return d[vars.var_share]; }); // equal share

        // declare an arc generator function
        var arc = d3.svg.arc().outerRadius(r);

        // select paths, use arc generator to draw
        var arcs = vis.selectAll("g.slice")
                      .data(pie(vars.new_data))
                    .enter()
                      .append("svg:g")
                      .attr("class", "slice");
        
        arcs.append("svg:path")
            .attr("fill", function(d, i) {
              return color(i);
            })
            .attr("d", function (d) {
              return arc(d);
            });


        break;