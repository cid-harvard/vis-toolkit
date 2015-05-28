      case "barchart":

        vars.params = {
          x_scale: [{
              name: "linear",
              func: d3.scale.ordinal()
                      .rangeRoundBands([0, vars.width], .1)
                      .domain(vars.data.map(function(d) { return d.letter; })),
            }
          ],

          x_ticks: 10,

          y_scale: [{
              name: "linear",
              func: d3.scale.linear()
                      .range([vars.height, 0])
                      .domain([0, d3.max(vars.data, function(d) { return d.frequency; })]),
            }
          ],

          connect: {
            type: null
          },

          items: [{
            attr: "country",
            marks: [{
                type: "circle",
                rotate: "0",
              }, {
                type: "text",
                rotate: "30",
                translate: null
              }]
            }, {
            attr: "continent",
            marks: [{
              type: "arc"
            }, {
                type: "text",
                rotate: "-30",
                translate: null
              }]
          }]

        };

        vars = vistk.utils.merge(vars, vars.params);

        // REGISTER EVENTS
        vars.evt.register("highlightOn", function(d) { });
        vars.evt.register("highlightOut", function(d) { });
        vars.evt.register("selection", function(d) { });
        vars.evt.register("resize", function(d) { });

        // AXIS
        vars.svg.call(vistk.utils.axis)
                .select(".x.axis")
                .attr("transform", "translate(0," + (vars.height - vars.margin.bottom - vars.margin.top) + ")")
              .append("text") // TODO: fix axis labels
                .attr("class", "label")
                .attr("x", vars.width-vars.margin.left-vars.margin.right)
                .attr("y", -6)
                .style("text-anchor", "end")
                .text(function(d) { return vars.var_x; });                

        vars.svg.call(vistk.utils.y_axis);

/*
        var xAxis = d3.svg.axis()
            .scale(vars.x_scale[0]["func"])
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(vars.y_scale[0]["func"])
            .orient("left")
            .ticks(10, "%");

        vars.svg.append("g")
            .attr("transform", "translate(" + vars.margin.left + "," + vars.margin.top + ")");

        vars.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + vars.height + ")")
            .call(xAxis);

        vars.svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Frequency");
*/

        vars.svg.selectAll(".bar")
            .data(vars.data)
          .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return vars.x_scale[0]["func"](d.letter); })
            .attr("width", vars.x_scale[0]["func"].rangeBand())
            .attr("y", function(d) { return vars.y_scale[0]["func"](d.frequency); })
            .attr("height", function(d) { return vars.height - vars.y_scale[0]["func"](d.frequency); });

        function type(d) {
          d.frequency = +d.frequency;
          return d;
        }
/*

        // PRE-UPDATE
        var gItems = vars.svg.selectAll(".mark__group")
                         .data(vars.new_data, function(d, i) { return i; });

        // ENTER

        // Add a group for marks
        var gItems_enter = gItems.enter()
                        .append("g")
                        .each(vistk.utils.items_group);


        // Add graphical marks
        vars.items.forEach(function(d) {

          // TODO: avoid doing this..
          vars.mark.type = d.type;
          vars.mark.rotate = d.rotate;
          gItems_enter.each(vistk.utils.items_mark);

        });

        // Add a connection mark
        gItems_enter.each(vistk.utils.connect_mark);

        // Adding axis
        vars.axes.forEach(function(d) {

          // TODO: provide properties to the axis
          gItems_enter.each(vistk.utils.axis);
        });
        // Add grid layer

        // EXIT
        var gItems_exit = gItems.exit();

        // POST-UPDATE
        gItems.transition();
*/
      break;
