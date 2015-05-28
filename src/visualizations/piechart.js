      case "piechart":

        vars.params = {

          x_scale: [],

          r_scale: d3.scale.linear(),

          items: [{
            attr: "country",
            marks: [{
                type: "arc"
              }]
          }]

        };

        vars = vistk.utils.merge(vars, vars.params);

        // Events handlers
        vars.evt.register("highlightOn", function(d) { });
        vars.evt.register("highlightOut", function(d) { });
        vars.evt.register("selection", function(d) { });
        vars.evt.register("resize", function(d) { });

        var pie = d3.layout.pie().value(function(d) { return d[vars.var_share]; }); // equal share

        // Special arc for labels centroids
        // var arc = d3.svg.arc().outerRadius(vars.radius).innerRadius(vars.radius);

        // Bind data to groups
        var gItems = vars.svg.selectAll(".mark__group")
                         .data(pie(vars.new_data), function(d, i) { return i; });

        vars.r_scale.range([0, vars.width/6])
                    .domain([0, d3.max(vars.new_data, function(d) { return d[vars.var_share]; })]);

        vars.radius = vars.r_scale(500);

        // ENTER

        // Add a group for marks
        var gItems_enter = gItems.enter()
                        .append("g")
                          .attr("transform", "translate(" + vars.width/2 + "," + vars.height/2 + ")")
                          .each(vistk.utils.items_group);

        vars.items[0].marks.forEach(function(d) {

              vars.mark.type = d.type;
              vars.mark.rotate = d.rotate;
              gItems_enter.each(vistk.utils.items_mark);

        });
/*
        // Add a graphical mark
        gPoints_enter.each(vistk.utils.items_mark)
                        .select("*")
                        .attr("transform", function(d) { 
                          return "translate(" + arc.centroid(d) + ")"; 
                        });
*/
        // Add an other graphical mark (e.g. text labels)

        break;