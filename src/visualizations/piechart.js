      case "piechart":

        // Events handlers
        vars.evt.register("highlightOn", function(d) { });
        vars.evt.register("highlightOut", function(d) { });
        vars.evt.register("selection", function(d) { });
        vars.evt.register("resize", function(d) { });

        var r = vars.width/6;

        var pie = d3.layout.pie().value(function(d) { return d[vars.var_share]; }); // equal share

        var arc = d3.svg.arc().outerRadius(r).innerRadius(r);

        // Bind data to groups
        var gPoints = vars.svg.selectAll(".mark__group")
                         .data(pie(vars.new_data), function(d, i) { return i; })

        // ENTER

        // Add a group for marks
        var gPoints_enter = gPoints.enter()
                        .append("g")
                          .attr("transform", "translate(" + vars.width/2 + "," + vars.height/2 + ")")
                          .each(vistk.utils.items_group);

        // Add a graphical mark
        gPoints_enter.each(vistk.utils.items_mark)
                        .select("*")
                        .attr("transform", function(d) { 
                          return "translate(" + arc.centroid(d) + ")"; 
                        });

        // Add an other graphical mark (e.g. text labels)

        break;