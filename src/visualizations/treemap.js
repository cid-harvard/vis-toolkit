      case "treemap":

        vars.params = {
          x_scale: [{
              name: "linear",
              func: d3.scale.ordinal()
                      .rangeRoundBands([0, vars.width], .1)
                      .domain(vars.new_data.map(function(d) { return d[vars.var_x]; })),
            }
          ],

          x_ticks: 10,

          y_scale: [{
              name: "linear",
              func: d3.scale.linear()
                      .range([vars.height, 0])
                      .domain([0, d3.max(vars.new_data, function(d) { return d[vars.var_y]; })]),
            }
          ],

          items: [{
            attr: "depth2",
            marks: [{
                type: "rect",
                rotate: "0"
              }
/*
                // Removed because of DIV wrap
              ,{
                attr: "depth1",
                type: "text",
                rotate: "0",
                translate: [5, 20]
              }
*/
              ]
          }],

          connect: [],
        };

        vars = vistk.utils.merge(vars, vars.params);

        vars.treemap = d3.layout.treemap()
            .padding(vars.padding)
            .sticky(true)
            .sort(function(a,b) { return a[vars.var_size] - b[vars.var_size]; })
            .size([vars.width, vars.height])
            .value(function(d) { return d[vars.var_size]; });

        // PRE-UPDATE
        var gItems = vars.svg.data([vars.root]).selectAll("g")
            .data(vars.treemap.nodes);

        // ENTER
        var gItems_enter = gItems.enter()
                      .insert("g", ":first-child")
                        .each(vistk.utils.items_group)
                        .attr("transform", function(d) { 
                          return "translate(" + d.x + "," + d.y + ")"; 
                        });

        gItems.transition().duration(vars.duration)
              .attr("transform", function(d) { 
                return "translate(" + d.x + "," + d.y + ")"; 
              });

        // Add graphical marks
        vars.items[0].marks.forEach(function(d) {

          vars.mark.type = d.type;
          vars.mark.rotate = d.rotate;
          vars.mark.translate = d.translate;

          var new_items = gItems_enter
                .filter(function(d, j) {
                    return (vars.mark.type == "rect" && d.depth == 2) || (vars.mark.type == "text" && d.depth == 1);
                  })
                .each(vistk.utils.items_mark)

          gItems.select("rect")
                .transition().duration(vars.duration)
                .attr("width", function(d) { return d.dx; })
                .attr("height", function(d) { return d.dy; })

          gItems_enter
           .filter(function(d, j) {
            return d.depth == 1 &&  d.dx > 30 && d.dy > 30;
           })
           .append("foreignObject")
                .attr("width", function(d) { return (d.dx - vars.padding) + "px"; })
                .attr("height", function(d) { return (d.dy - vars.padding) + "px"; })
              .append("xhtml:body")
                .style("font", "14px 'Helvetica Neue'")
                .append("div")
                .style("width", function(d) { return d.dx + "px"; })
                .style("height", function(d) { return d.dy + "px"; })
                .style({"text-overflow": "ellipsis", "overflow": "hidden"})
                  .html(function(d) {
                    return vars.accessor_data(d)[vars.var_text];
                  })

          // SVG wrap
          // new_items.selectAll("text").call(vistk.utils.wrap);

        });

        // Removed because of Div wrap
        //  vars.svg.selectAll("text")
        //      .call(vistk.utils.wrap);

        vistk.utils.background_label(vars.title);

      break;
      