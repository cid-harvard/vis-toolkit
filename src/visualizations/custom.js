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

        // PRE-UPDATE ITEMS
        var gItems = vars.svg.selectAll(".mark__group")
                         .data(vars.new_data, function(d, i) { return i; });

        // ENTER ITEMS
        var gItems_enter = gItems.enter()
                        .append("g")
                        .each(vistk.utils.items_group);

        // APPEND AND UPDATE ITEMS MARKS
        vars.items[0].marks.forEach(function(d) {

          // TODO: avoid doing this..
          vars.mark.type = d.type;
          vars.mark.rotate = d.rotate;
          gItems_enter.each(vistk.utils.items_mark);

          // Update existing marks
          gItems.each(vistk.utils.items_mark);

        });

        // TODO: decide if we attach to items or connect selection
        // Add connection marks
        vars.connect[0].marks.forEach(function(d) {
          
          gItems_enter.each(vistk.utils.connect_mark);
          
          // Update existing marks
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
