      case "none":

        var none_params = function(scope) {

          var params = {};
          params.accessor_data = function(d) { return d; };

          params.x_scale = [{
            func: d3.scale.identity()
          }];

          params.y_scale = [{
            func: d3.scale.identity(),
          }];

          params.items = [{
            marks: [{
                type: "circle",
                radius: 5
              }, {
                type: "text",
                rotate: "30",
                translate: null
              }]
          }];

          return params;

        };

        vars = vistk.utils.merge(vars, none_params(vars));

        // LOAD USER PARAMS
        vars.items = vistk.utils.merge(vars.items, vars.user_vars.items);

        // In case we don't have (x, y) coordinates for nodes'
        vars.force = d3.layout.force()
            .size([vars.width, vars.height])
            .charge(-50)
            .linkDistance(10)
            .on("tick", tick)
            .on("start", function(d) {
              // TODO: register the clearAnimation here
            })
            .on("end", function(d) {
              // TODO: un-register the clearAnimation here
            })

        vars.var_x = 'x';
        vars.var_y = 'y';

        vars.force.nodes(vars.new_data).start();

        // In case we change visualization before the nodes are settled
        vars.evt.register("clearAnimations", function(d) {
          vars.force.nodes(vars.new_data).stop();
        });

        var index_item = 0;
        var accessor_data = function(d) { return d; };

        // PRE-UPDATE
        var gItems = vars.svg.selectAll(".mark__group")
                        .data(vars.new_data, function(d, i) {
                          d._index_item = index_item;
                          return accessor_data(d)[vars.var_id] + "_" + index_item;
                        });

        // ENTER
        var gItems_enter = gItems.enter()
                        .append("g")
                        .each(utils.items_group)
                        .attr("transform", function(d, i) {
                          return "translate(" + vars.margin.left + ", " + vars.height/2 + ")";
                        });

       // APPEND AND UPDATE ITEMS MARK
        vars.items[0].marks.forEach(function(params) {
          gItems_enter.call(utils.draw_mark, params);
          gItems.call(utils.draw_mark, params);
        });

        // EXIT
        var gItems_exit = gItems.exit().remove()  ;

        // POST-UPDATE

        function tick(duration) {

          vars.svg.selectAll(".mark__group")
                          .attr("transform", function(d, i) {
                            return "translate(" + d.x + ", " + d.y + ")";
                          });

        }

      break;
