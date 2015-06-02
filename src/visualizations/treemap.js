      case "treemap":

        vars.params = {
          x_scale: [{
              name: "linear",
              func: d3.scale.ordinal()
                      .rangeRoundBands([0, vars.width], .1)
                      .domain(vars.data.map(function(d) { return d[vars.var_x]; })),
            }
          ],

          x_ticks: 10,

          y_scale: [{
              name: "linear",
              func: d3.scale.linear()
                      .range([vars.height, 0])
                      .domain([0, d3.max(vars.data, function(d) { return d[vars.var_y]; })]),
            }
          ],

          items: [{
            attr: "depth2",
            marks: [{
                type: "rect",
                rotate: "0"
              },{
                attr: "depth1",
                type: "text",
                rotate: "0"
              }]
          }],

          connect: [{
            attr: "depth1",
            type: "text",
            rotate: "0"
          }],
        };

        vars = vistk.utils.merge(vars, vars.params);

        vars.evt.register("highlightOn", function(d) {
          vars.svg.selectAll("rect")
            .filter(function(e, j) { return e === d; })
            .classed("focus", true);
        });

        vars.evt.register("highlightOut", function(d) {
          vars.svg.selectAll("rect")
            .classed("focus", false);
        });

        var treemap = d3.layout.treemap()
            .padding(vars.padding)
            .sticky(true)
            .size([vars.width, vars.height])
            .value(function(d) { return d[vars.var_size]; });

/*
        // Connect marks
        var gConnect = vars.svg.selectAll(".connect__group")
                        .data(treemap.nodes);
      
        var gConnect_enter = gConnect.enter()
                        .append("g")
                        .attr("class", "connect__group");

        vars.connect[0].marks.forEach(function(d) {
          
          vars.mark.type = d.type;
          vars.mark.rotate = d.rotate;
          gConnect_enter.each(vistk.utils.connect_mark);

        });
*/
        // PRE-UPDATE
        var gItems = vars.svg.data([vars.r]).selectAll("g")
            .data(treemap.nodes);

        // ENTER
        var gItems_enter = gItems.enter()
                        .append("g")
                        .each(vistk.utils.items_group)
                        .attr("transform", function(d) { 
                          return "translate(" + d.x + "," + d.y + ")"; 
                        });

        // Add graphical marks
        vars.items[0].marks.forEach(function(d) {

          vars.mark.type = d.type;
          vars.mark.rotate = d.rotate;

          // vars.mark.height = function(d) { return d.dx; };
          // vars.mark.width = function(d) { return d.dy; };

          var new_items = gItems_enter
                .filter(function(d, j) {
                    return (vars.mark.type == "rect" && d.depth == 2) || (vars.mark.type == "text" && d.depth == 1);
                  })
                .each(vistk.utils.items_mark)

          new_items.select("rect")
                .transition().duration(2000)
                .attr("width", function(d) { return d.dx; })
                .attr("height", function(d) { return d.dy; });

          new_items.select("text")
                .call(vistk.utils.wrap);

        });

/*
        // TODO: Add items labels
        // Make them fit the parent element
        vars.mark.type = "text";

        gItems_enter
            .filter(function(d, j) { 
              return d.depth == 1;
            })
            .each(vistk.utils.items_mark);
*/

/*

        vars.mark.type = "text";

        // Add items graphical mark (DEPTH 2)
        gItems_enter
            .filter(function(d, j) { 
              return d.depth === 1;
            })
            .each(vistk.utils.items_mark)
            .select("rect")
            /*
            .style("fill", function(d) {
              return vars.color(d[vars.var_color]);
//              return d.children ? vars.color(d[vars.var_color]) : null; 
            })
      */
      /*
            .attr("width", function(d) { return d.dx; })
            .attr("height", function(d) { return d.dy; })
            .call(vistk.utils.wrap, 100);


        vars.mark.type = "rect";

        // Add items graphical mark (DEPTH 2)
        gItems_enter
            .filter(function(d, j) { 
              return d.depth === 2;
            })
            .each(vistk.utils.items_mark)
            .select("rect")
            .style("fill", function(d) {

              return vars.color(d[vars.var_color]);
//              return d.children ? vars.color(d[vars.var_color]) : null; 
            })
            .attr("width", function(d) { return d.dx; })
            .attr("height", function(d) { return d.dy; });


        cell_enter.append("rect")
            .attr("width", function(d) { return d.dx; })
            .attr("height", function(d) { return d.dy; })
            .style("fill", function(d) {
              return d.children ? vars.color(d[vars.var_color]) : null; 
            });

        cell_enter.append("text")
            .attr("x", function(d) { return 10; })
            .attr("y", function(d) { return 10; })
            .attr("dy", ".35em")
            .attr("text-anchor", "left")
            .style("font-size", 15)
            .text(function(d) { 
              if(d.depth === 1) {
                return d.name;
              } else {
                return "";
              }
            //  return d.children ? null : d[vars.var_text].slice(0, 3)+"..."; 
            })


        cell.select("rect")
            .attr("width", function(d) { return d.dx; })
            .attr("height", function(d) { return d.dy; })
            .style("fill", function(d) {
              return d.children ? vars.color(d[vars.var_color]) : null; 
            })
            .classed("focus", function(d, i) { return d.focus; });

        cell.select("text")
            .call(wrap);
*/
      break;
      