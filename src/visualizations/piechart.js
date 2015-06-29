      case "piechart":

        vars.params = {

          x_scale: [],

          r_scale: d3.scale.linear(),

          items: [{
            attr: "country",
            marks: [{
                type: "arc"
              }]
          }],

          accessor_data: function(d) { return d.data; }
        };

        vars.accessor_data = function(d) { return d.data; }

        vars = vistk.utils.merge(vars, vars.params);

        // LOAD USER PARAMS
        vars.items = vistk.utils.merge(vars.items, vars.user_vars.items);


        // Special arc for labels centroids
        // var arc = d3.svg.arc().outerRadius(vars.radius).innerRadius(vars.radius);

        // Bind data to groups
        var gItems = vars.svg.selectAll(".mark__group")
                         .data(vars.new_data, function(d, i) { return i; });

        vars.r_scale.range([0, vars.width/6])
                    .domain([0, d3.max(vars.new_data, function(d) { return d.data[vars.var_share]; })]);

       

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
