      case "custom":

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
            attr: "attr",
            marks: [{
                type: "rect",
                rotate: "0"
              }, {
                type: "circle",
                r: "10"
            }]
          }],
          connect: []
        }

        // MERGE WITH GLOBAL VARS
        vars = vistk.utils.merge(vars, vars.params);

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

        // Add items marks
        vars.items[0].marks.forEach(function(d) {

          // TODO: avoid doing this..
          vars.mark.type = d.type;
          vars.mark.rotate = d.rotate;
          gItems_enter.each(vistk.utils.items_mark);

        });

        // Add connection marks
        vars.connect[0].marks.forEach(function(d) {
          
          gItems_enter.each(vistk.utils.connect_mark);

        });

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

      break;
