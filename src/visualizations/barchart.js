      case "barchart":

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, vars.width], .1);

        var y = d3.scale.linear()
            .range([vars.height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10, "%");

        vars.svg.append("g")
            .attr("transform", "translate(" + vars.margin.left + "," + vars.margin.top + ")");


        x.domain(vars.data.map(function(d) { return d.letter; }));
        y.domain([0, d3.max(vars.data, function(d) { return d.frequency; })]);

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

        vars.svg.selectAll(".bar")
            .data(vars.data)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.letter); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.frequency); })
            .attr("height", function(d) { return vars.height - y(d.frequency); });

        function type(d) {
          d.frequency = +d.frequency;
          return d;
        }
/*
        // CHART PARAMETERS
        vars.params = {
          scales: [{
            name: "linear",
            func: d3.scale.linear()
                    .range([vars.margin.left, vars.width-vars.margin.left-vars.margin.right])
                    .domain([0, d3.max(vars.data, function(d) { return d[vars.var_x]; })]).nice(),
            callback: function() {}
          }],
          axes: [],
          items: [{
            type: "rect",
            rotate: "0"
          }, {
            type: "circle",
            r: "10"
          }],
          connect: []          
        }

        // REGISTER EVENTS
        vars.evt.register("highlightOn", function(d) { });
        vars.evt.register("highlightOut", function(d) { });
        vars.evt.register("selection", function(d) { });
        vars.evt.register("resize", function(d) { });

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
