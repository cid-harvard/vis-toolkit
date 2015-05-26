      case "nodelink":

        vars.connect.type = "line";

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

        // TODO: use in case we don't have (x, y) coordinates for nodes'
        var force = d3.layout.force()
            .charge(-120)
            .linkDistance(30)
            .size([vars.width, vars.height]);

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

        vars.links.forEach(function(d, i) {

          d.source = vistk.utils.find_node_by_id(d.source);
          d.target = vistk.utils.find_node_by_id(d.target);

        });

        vars.x_scale = d3.scale.linear().range([0, vars.width]);
        vars.y_scale = d3.scale.linear().range([0, vars.height]); // Reverted Scale!

        vars.x_scale.domain([min_x, max_x]);
        vars.y_scale.domain([min_y, max_y]);

        // TODO: add all the line and not just the filtered one
        var gConnect = vars.svg.selectAll(".connect__group")
                        .data(vars.links);//, function(d, i) { return i; });
      
        var gConnect_enter = gConnect.enter()
                        .append("g")
                        .each(vistk.utils.connect_group);

        // Enter connect graphical marks
        gConnect_enter.each(vistk.utils.connect_mark)
                        .style("stroke", function(d) { return vars.color(d[vars.var_color]); })
                        .attr("class", function(d) {
                                      return "link source_"+d.source.id+" target_"+d.target.id;
                        })
                        .style("stroke-width", function(d) { return Math.sqrt(d.value); })
                        .style("opacity", .4);

        var gItems = vars.svg.selectAll(".items__group")
                        .data(vars.nodes, function(d) { return d.id; });

        // ENTER

        // Items groups
        var gItems_enter = gItems.enter()
                      .append("g")
                        .each(vistk.utils.items_group);

        // Items marks (circle)
        gItems.each(vistk.utils.items_mark)
            .select("circle")
            .attr("id", function(d) { return "node_" + d.id; })
            .attr("r", 5)
            .style("fill", function(d) { 
              return vars.color(d.data[vars.var_color]); 
            });

        var gItems_exit = gItems.exit().style({opacity: 0.1});

        gItems.attr("transform", function(d) { 
          return "translate(" + vars.x_scale(d.x) + "," + vars.y_scale(d.y) + ")"; 
        });

      break;
