      case "nodelink":

        var min_x = Infinity, max_x = 0, min_y = Infinity, max_y = 0;

        vars.nodes.forEach(function(d, i) {

          if(d.x < min_x) {
            min_x = d.x;
          }

          if(d.y < min_y) {
            min_y = d.y;
          }

          if(d.x > max_x) {
            max_x = d.x;
          }

          if(d.y > max_y) {
            max_y = d.y;
          }

          // Find the value in vars.data
          d.data = vistk.utils.find_data_by_id(d.id);

          if(typeof d.data === "undefined") {
            d.data = {};
            d.data.category = 0;
          }

        });

        vars.params = {

          x_scale: [{
              name: "linear",
              func: d3.scale.linear()
                      .range([0, vars.width])
                      .domain([min_x, max_x])
          }],

          y_scale: [{
              name: "linear",
              func: d3.scale.linear()
                    .range([0, vars.height])
                    .domain([min_y, max_y])
          }],

          items: [{
            attr: "year",
            marks: [{
                type: "circle",
                rotate: "0",
              }, {
                type: "text",
                rotate: "30",
                translate: null
              }]
          }],

          connect: [{
            attr: "",
            marks: [{
                type: "line",
                rotate: "0",
                func: null,
              }]
          }],

        };

        vars = vistk.utils.merge(vars, vars.params);

        vars.connect.type = "line";
        vars.accessor_values = function(d) { return d.data; };

        vars.evt.register("highlightOn", function(d) {

          // Highlight nodes
          vars.svg.selectAll(".mark__group").style("opacity", 0.1);
          vars.svg.selectAll(".mark__group").filter(function(e, j) { return e === d; }).style("opacity", 1);

          // Highlight Links
          vars.svg.selectAll(".link").style("opacity", 0.1);
          
          vars.svg.selectAll(".source_"+d.id).each(function(e) {
              vars.svg.select("#node_"+e.target.id).style("opacity", 1) 
            })
            .style("opacity", 1)
            .style("stroke-width", function(d) { return 3; });

          vars.svg.selectAll(".target_"+d.id).each(function(e) {
            vars.svg.select("#node_"+e.source.id).style("opacity", 1);
          })
          .style("opacity", 1)
          .style("stroke-width", function(d) { return 3; });

          // TODO: quick fix to coordinate with a table
          vars.svg.selectAll(".mark__group").filter(function(e, j) { return e.data === d; }).style("opacity", 1);
          vars.svg.selectAll(".source_"+d.product_id).each(function(e) {
            vars.svg.select("#node_"+e.target.data.product_id).style("opacity", 1) 
          })
          .style("opacity", 1)
          .style("stroke-width", function(d) { return 3; });

          vars.svg.selectAll(".target_"+d.product_id).each(function(e) {
            vars.svg.select("#node_"+e.source.data.product_id).style("opacity", 1) 
          })
          .style("opacity", 1)
          .style("stroke-width", function(d) { return 3; });

        });

        vars.evt.register("highlightOut", function(d) {

          vars.svg.selectAll(".mark__group").style("opacity", 1);
          vars.svg.selectAll(".link")
            .style("opacity", .4)
            .style("stroke-width", function(d) { return 1; });

        });

        vars.links.forEach(function(d, i) {

          d.source = vistk.utils.find_node_by_id(d.source);
          d.target = vistk.utils.find_node_by_id(d.target);

        });

        // Connect marks
        var gConnect = vars.svg.selectAll(".connect__group")
                        .data(vars.links);
      
        var gConnect_enter = gConnect.enter()
                        .append("g")
                        .attr("class", "connect__group");

        vars.connect[0].marks.forEach(function(d) {
          
          vars.mark.type = d.type;
          vars.mark.rotate = d.rotate;
          gConnect_enter.each(vistk.utils.connect_mark)
                        .style("stroke", function(d) { 
                            return vars.color(d[vars.var_color]); 
                        })
                        .attr("class", function(d) {
                          return "link source_"+d.source.id+" target_"+d.target.id;
                        })
                        .style("stroke-width", function(d) { return Math.sqrt(d.value); })
                        .style("opacity", .4);

        });

        var gItems = vars.svg.selectAll(".items__group")
                        .data(vars.nodes, function(d) { return d.id; });

        // ENTER
        var gItems_enter = gItems.enter()
                        .append("g")
                        .each(vistk.utils.items_group)
                        .attr("transform", function(d) { 
                          return "translate(" + vars.x_scale[0]["func"](d.x) + "," + vars.y_scale[0]["func"](d.y) + ")"; 
                        });

        // Items marks
        vars.items[0].marks.forEach(function(d) {

          vars.mark.type = d.type;
          vars.mark.rotate = d.rotate;
          gItems_enter.each(vistk.utils.items_mark)
          .attr("id", function(d) { return "node_" + d.id; })


        });

        var gItems_exit = gItems.exit().style({opacity: 0.1});

      break;
