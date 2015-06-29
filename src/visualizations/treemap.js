      case "treemap":

        vars.params = {
          x_scale: [{
              name: "linear",
              func: d3.scale.linear()
                      .range([vars.margin.left, vars.width-vars.margin.left-vars.margin.right])
                      .domain(vars.new_data.map(function(d) { return d.x; })),
            }
          ],

          y_scale: [{
            name: "linear",
            func: d3.scale.linear()
                    .range([vars.height-vars.margin.top-vars.margin.bottom, vars.margin.top])
                    .domain([0, d3.max(vars.new_data, function(d) { return d.y; })]),
          }],

          items: [{
            attr: "depth_2",
            marks: [{
              type: "rect",
              rotate: "0"
            }]
          }],

          x_ticks: 10,

        };

        vars = vistk.utils.merge(vars, vars.params);

          // LOAD USER PARAMS
        vars.items = vistk.utils.merge(vars.items, vars.user_vars.items);

        vars.treemap = d3.layout.treemap()
            .padding(vars.padding)
            .sticky(true)
            .sort(function(a,b) { return a[vars.var_sort] - b[vars.var_sort]; })
            .size([vars.width, vars.height])
            .value(function(d) { return d[vars.var_size]; });

        // PRE-UPDATE
        var gItems = vars.svg.data([vars.root]).selectAll("g")
            .data(vars.treemap.nodes, function(d, i) { return d[vars.var_id]; });

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

          gItems_enter
                .filter(function(d, j) {
                    return (vars.mark.type == "rect" && d.depth == 2) || (vars.mark.type == "text" && d.depth == 1);
                  })
                .each(vistk.utils.items_mark)

          gItems.select("rect")
                .transition().duration(vars.duration)
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", function(d) { return d.dx; })
                .attr("height", function(d) { return d.dy; });

          // Only label the parents
          gItems_enter
                 .filter(function(d, j) {
                   return d.depth == 1 &&  d.dx > 30 && d.dy > 30;
                 })
                 .append("foreignObject")
                 .attr("width", function(d) { return (d.dx - vars.padding) + "px"; })
                 .attr("height", function(d) { return (d.dy - 2*vars.padding) + "px"; })
               .append("xhtml:body")
                 .style("font", "14px 'Helvetica Neue'")
               .append("div")
                 .style("padding-top", function(d) { return (vars.padding/2)+"px"; })
                 .style("width", function(d) { return (d.dx - 2*vars.padding) + "px"; })
                 .style("height", function(d) { return (d.dy - 2*vars.padding) + "px"; })
                 .style({"text-overflow": "ellipsis", "overflow": "hidden"})
                 .html(function(d) {
                   return vars.accessor_data(d)[vars.var_text];
                 })

          // SVG wrap
          // new_items.selectAll("text").call(vistk.utils.wrap);

        });

        // ITEMS EXIT
        var gItems_exit = gItems.exit().remove();


        // Removed because of Div wrap
        //  vars.svg.selectAll("text")
        //      .call(vistk.utils.wrap);

        vistk.utils.background_label(vars.title);

      break;
      
