      case "scatterplot":

        vars.params = {

          x_scale: [{
              name: "linear",
              func: d3.scale.linear()
                      .range([vars.margin.left, vars.width-vars.margin.left-vars.margin.right])
                      .domain(d3.extent(vars.new_data, function(d) { return d[vars.var_x]; })).nice()
            }, {
              name: "linear_sparkline",
              func: d3.scale.linear()
                      .range([0, 100])
                      .domain(d3.extent(vars.data, function(d) { return d[vars.time.var_time]; })).nice()
            }
          ],

          x_ticks: 10,

          y_scale: [{
              name: "linear",
              func: d3.scale.linear()
                      .range([vars.height-vars.margin.top-vars.margin.bottom, vars.margin.top])
                      .domain(d3.extent(vars.data, function(d) { return d[vars.var_y]; })).nice(),
            }, {
              name: "linear_sparkline",
              func: d3.scale.linear()
                      .range([100, 0])
                      .domain(d3.extent(vars.data, function(d) { return d[vars.var_y]; })).nice(),
            }
          ],

          r_scale: d3.scale.linear()
                      .range([10, 30])
                      .domain(d3.extent(vars.new_data, function(d) { return d[vars.var_r]; })),

          items: [{
            attr: "country",
            marks: [{
                type: "circle",
                rotate: "0",
                radius: 5,
                fill: function(d) { return vars.color(vars.accessor_items(d)[vars.var_color]); }
              }, {
                type: "text",
                rotate: "30",
                translate: null
              }]
            }, {
            attr: "continent",
            marks: [{
                type: "circle",
                rotate: "0",
                radius: 20,
                fill: function(d) { return vars.color(vars.accessor_items(d)[vars.var_color]); }
                // TODO: add specific r_scale
            }, {
              type: "arc"
                // TODO: add specific r_scale              
            }, {
                type: "text",
                rotate: "-30",
                translate: null
                // TODO: move away according to r_scale                
            }]
          }],

          connect: [{
            attr: vars.time.var_time,
            marks: [{
                type: "path",
                rotate: "0",
                func: d3.svg.line()
                     .interpolate(vars.interpolate)
                     .x(function(d) { return vars.x_scale[1]["func"](d[vars.time.var_time]); })
                     .y(function(d) { return vars.y_scale[1]["func"](d[vars.var_y]); }),
              }]
          }, {
            attr: "",
            marks: [{
                type: "line",
                rotate: "0",
                func: null,
              }]
          }]

        };

        vars = vistk.utils.merge(vars, vars.params);

        // In case there are some links between items available
        if(vars.links !== null) {

          // Connect marks
          var gConnect = vars.svg.selectAll(".connect__group")
                          .data(vars.links);
        
          var gConnect_enter = gConnect.enter()
                          .append("g")
                          .attr("class", "connect__group");

          vars.connect[1].marks.forEach(function(d) {
            
            vars.connect.type = d.type;
            vars.connect.rotate = d.rotate;

            gConnect_enter.each(vistk.utils.connect_mark)
                          .attr("class", function(d) {
                            return "link source_"+d.source.id+" target_"+d.target.id;
                          })
                          .style("stroke-width", function(d) { return Math.sqrt(d.value); })
                          .style("opacity", .4);

          });

        }

        // Tentative to merge user and chart configurations 
        if(typeof vars.user_vars.x_scale !== "undefined" && typeof vars.user_vars.x_scale[0] !== "undefined")
          vars.params.x_scale[0]["func"].domain(vars.user_vars.x_scale[0].domain);

        if(typeof vars.user_vars.y_scale !== "undefined" && typeof vars.user_vars.y_scale[0] !== "undefined")
          vars.params.y_scale[0]["func"].domain(vars.user_vars.y_scale[0].domain);

        // AXIS
        vars.svg.call(vistk.utils.axis)
                .select(".x.axis")
                .style("display", function() { return vars.x_axis_show ? "block": "none"; })
                .attr("transform", "translate(0," + (vars.height - vars.margin.bottom - vars.margin.top) + ")")
              .append("text") // TODO: fix axis labels
                .attr("class", "label")
                .attr("x", vars.width - vars.margin.left - vars.margin.right)
                .attr("y", -6)
                .style("text-anchor", "end")
                .text(function(d) { return vars.var_x; });            

        vars.svg.call(vistk.utils.y_axis)
                .select(".y.axis")
                .style("display", function() { return vars.y_axis_show ? "block": "none"; })
        // GRID
        vars.svg.selectAll(".x.grid").data([vars.new_data])
          .enter()
            .append("g")
            .attr("class", "x grid")
            .style("display", function() { return vars.x_grid_show ? "block": "none"; })
            .attr("transform", "translate(0," + (vars.height-vars.margin.top-vars.margin.bottom) + ")");

        vars.svg.selectAll(".x.grid").transition()
            .duration(vars.duration)
            .call(vistk.utils.make_x_axis()
            .tickSize(-vars.height+vars.margin.top+vars.margin.bottom, 0, 0)
            .tickFormat(""));

        vars.svg.selectAll(".y.grid").data([vars.new_data])
          .enter()
            .append("g")
            .attr("class", "y grid")
            .style("display", function() { return vars.y_axis_show ? "block": "none"; })
            .attr("transform", "translate(" + vars.margin.left + ", 0)");

        vars.svg.selectAll(".y.grid").transition()
            .duration(vars.duration)
            .call(vistk.utils.make_y_axis()
            .tickSize(-vars.width+vars.margin.left+vars.margin.right, 0, 0)
            .tickFormat(""));

        var context = {
          width: vars.width/10,
          height: vars.height/10,
          x_scale: vars.params.x_scale[0]["func"],
          y_scale: vars.params.y_scale[0]["func"]
        };

        // PRE-UPDATE
        var gItems = vars.svg.selectAll(".mark__group")
                          .data(vars.new_data)//, function(d, i) {  return d[vars.var_id]; });

        // ENTER
        var gItems_enter = gItems.enter()
                        .append("g")
                          .each(vistk.utils.items_group)
                          .attr("transform", function(d, i) {
                            return "translate(" + vars.margin.left + ", " + vars.height/2 + ")";
                          })
                          .property("__context__", context);

        if(vars.aggregate === vars.var_group) {

          vars.pie = d3.layout.pie().value(function(d) { return d[vars.var_share]; });

          // vars.radius = vars.width/12;
          // vars.accessor_data = function(d) { return d.data; };

          gItems_enter.each(function(d, i) {

            if(vars.r_scale !== null) {  
              vars.mark.radius = vars.radius;
            } else {
              vars.mark.radius = vars.r_scale(d[vars.var_r]);
            }

            // Special arc for labels centroids
            var arc = d3.svg.arc().outerRadius(vars.mark.radius).innerRadius(vars.mark.radius);

            // Bind data to groups
            var gItems2 = vars.svg.selectAll(".mark__group2")
                             .data(vars.pie(d.piescatter), function(d, i) { return i; });

            // ENTER

            // Add a group for marks
            var gItems2_enter = gItems2.enter()
                            .append("g")
                          //  .attr("transform", "translate(" + vars.width/2 + "," + vars.height/2 + ")")
                            .each(vistk.utils.items_group)
                            .attr("transform", function(e, j) {

                              // Needed for the graphical mark
                              e[vars.var_group] = d[vars.var_group];
                              e[vars.var_text] = d[vars.var_text];
                              e.i = j;
                              e.total_piescatter = d.piescatter[0] + d.piescatter[1];

                              return "translate(" + vars.params.x_scale[0]["func"](d[vars.var_x]) + ", " + vars.params.y_scale[0]["func"](d[vars.var_y]) + ")";
                            });

            vars.items[1].marks.forEach(function(d, j) {

              if(j == 0 || i == 0)
                return;

              vars.mark.type = d.type;

              if(typeof d.fill !== "undefined") {
                vars.mark.fill = function() { return d.fill; };
              } else {
                vars.mark.fill = function(d) { return vars.color(vars.accessor_values(d)[vars.var_color]); };
              }

              vars.mark.rotate = d.rotate;

              gItems2_enter.each(vistk.utils.items_mark)
                .select("circle")
                .attr("r", vars.mark.radius);

            });

          });

        } else if(vars.aggregate === vars.time.var_time) {

          vars.accessor_values = function(d) { return d.values; };

          // PRE-UPDATE CONNECT
          var gConnect = vars.svg.selectAll(".connect__group")
                          .data(vars.time_data, function(d, i) { return i; });
        
          // ENTER CONNECT
          var gConnect_enter = gConnect.enter()
                          .append("g")
                          .attr("class", "connect__group")
                          .attr("transform", "translate(0,0)")
                          .property("__context__", context)
                          .attr("transform", function(d) {
                            return "translate(" + (vars.params.x_scale[0]["func"](vars.accessor_values(d)[0][vars.var_x])-5) + ", " + (vars.y_scale[0]["func"](vars.accessor_values(d)[0][vars.var_y])/1.25-5) + ")";
                          });

          // APPEND CONNECT MARK
          vars.connect[0].marks.forEach(function(d) {

            vars.mark.type = d.type;
            vars.mark.rotate = d.rotate;
            gConnect_enter.each(vistk.utils.connect_mark);

          });

        } else {

          vars.accessor_data = function(d) { return d; };

          // Add graphical marks
          vars.items[0].marks.forEach(function(d) {

            vars.mark.type = d.type;
            vars.mark.rotate = d.rotate;

            gItems_enter.each(vistk.utils.items_mark);

            // Update mark
            gItems.each(vistk.utils.items_mark);

          });

        }

        // EXIT
        var gItems_exit = gItems.exit().remove();

        // POST-UPDATE
        gItems
          .transition()
          .attr("transform", function(d) {
            return "translate(" + vars.params.x_scale[0]["func"](d[vars.var_x]) + ", " + vars.params.y_scale[0]["func"](d[vars.var_y]) + ")";
          });

        vistk.utils.background_label(vars.title);

      break;
        