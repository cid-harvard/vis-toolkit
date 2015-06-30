      case "geomap":


        var geomap_params = function(scope) {

          var params = {};

          params.x_scale = [{
            name: "linear",
            func: d3.scale.linear()
                    .range([vars.margin.left, vars.width-vars.margin.left-vars.margin.right])
                    .domain(d3.extent(vars.countries, function(d) { return d[vars.var_x]; }))
          }];

          params.y_scale = [{
            name: "linear",
            func: d3.scale.linear()
                    .range([vars.height-vars.margin.top-vars.margin.bottom, vars.margin.top])
                    .domain(d3.extent(vars.countries, function(d) { return d[vars.var_y]; }))
          }];

          params.items = [{
            attr: "country",
            marks: [{
              type: "shape",
              fill: d3.scale.linear()
                      .domain([d3.min(vars.new_data, function(d) { return d[vars.var_color]; }), d3.max(vars.new_data, function(d) { return d[vars.var_color]; })])
                      .range(["red", "green"]),
              rotate: 0
            }]
          }];

          params.accessor_data = function(d) { return d.data; };
          params.accessor_values = function(d) { return d.data.values; };

          return params;

        };

        vars = vistk.utils.merge(vars, geomap_params(vars));

        // LOAD USER PARAMS
        vars.items = vistk.utils.merge(vars.items, vars.user_vars.items);

        // http://techslides.com/demos/d3/d3-world-map-colors-tooltips.html
        vars.projection = d3.geo.mercator()
                        .translate([vars.width/2, vars.height/2])
                        .scale(100);

        // This is the main function that draws the shapes later on
        vars.path = d3.geo.path()
            .projection(vars.projection);

        vars.gSvg = vars.svg
            .call(d3.behavior.zoom()
            .on("zoom", redraw))
            .append("g");

        function redraw() {
            vars.gSvg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }

        // PRE-UPDATE ITEMS
        var gItems = vars.svg.selectAll(".mark__group")
                        .data(vars.new_data, function(d, i) { return i; });

        // ENTER ITEMS
        var gItems_enter = gItems.enter()
                       .append("g")
                         .attr("transform", function(d) {
                           return "translate(" + [0, 0] + ")";
                         })
                         .each(utils.items_group);

        // APPEND AND UPDATE ITEMS MARK
        vars.items[0].marks.forEach(function(params) {
          gItems_enter.call(utils.draw_mark, params);
          gItems.call(utils.draw_mark, params);
        });

        // ITEMS EXIT
        var gItems_exit = gItems.exit().remove();

      break;
