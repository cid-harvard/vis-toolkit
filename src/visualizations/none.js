      case "none":

        vars.params = {

          x_scale: [{
              name: "linear",
              func: d3.scale.linear()
                      .range([vars.margin.left, vars.width-vars.margin.left-vars.margin.right])
                      .domain(d3.extent(vars.new_data, function(d) { return d[vars.var_x]; })).nice()
            }
          ],

          x_ticks: 10,

          y_scale: [{
              name: "linear",
              func: d3.scale.linear()
                      .range([vars.height-vars.margin.top-vars.margin.bottom, vars.margin.top])
                      .domain(d3.extent(vars.data, function(d) { return d[vars.var_y]; })).nice(),
            }
          ],

          r_scale: d3.scale.linear(),

          var_r: "total_piescatter",

          connect: {
            type: null
          },

          items: [{
            attr: "country",
            marks: [{
                type: "circle",
                rotate: "0",
                radius: 5                
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
                fill: "#fff"
            }, {
              type: "arc"
            }, {
                type: "text",
                rotate: "-30",
                translate: null
            }]
          }]

        };

        vars = vistk.utils.merge(vars, vars.params);

        // In case we don't have (x, y) coordinates for nodes'
        vars.force = d3.layout.force()
            .size([vars.width, vars.height])
            .charge(-50)
            .linkDistance(10)
            .on("tick", tick)
            .on("start", function(d) {})
            .on("end", function(d) {})

        vars.var_x = 'x';
        vars.var_y = 'y';

        vars.force.nodes(vars.new_data).start();

        // In case we change visualization before the nodes are settled
        vars.evt.register("clearAnimations", function(d) {
          vars.force.nodes(vars.new_data).stop();
        });

        // PRE-UPDATE
        var gItems = vars.svg.selectAll(".mark__group")
                         .data(vars.new_data, function(d, i) { return i; });

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
        var gItems_exit = gItems.exit().style("opacity", 0.1);

        // POST-UPDATE

        function tick(duration) {

          vars.svg.selectAll(".mark__group")
                          .attr("transform", function(d, i) {
                            return "translate(" + d.x + ", " + d.y + ")";
                          });

        }

        // Remove grid and axes
        vars.svg.selectAll(".x, .y").remove();

      break;
