      case "treemap":

        vars.evt.register("highlightOn", function(d) {
          vars.svg.selectAll("rect")
            .filter(function(e, j) { return e === d; })
            .classed("focus", true);
        });

        vars.evt.register("highlightOut", function(d) {
          vars.svg.selectAll("rect")
            .classed("focus", false);
        });

        // Create the root node
        r = {}
        r.name = "root";
        groups = [];

        // Creates the groups here
        new_data.map(function(d, i) {

          if(typeof groups[d[vars.var_group]] == "undefined") {
            groups[d[vars.var_group]] = [];
          }

          groups[d[vars.var_group]]
           .push({name: d.name, size: d.value, attr: d.item_id, group: +d[vars.var_group], year: d.year, id: i, focus: d.focus});

        })

        // Make sure there is no empty elements
        groups = groups.filter(function(n){ return n != undefined }); 
        
        // Creates the parent nodes
        parents = groups.map(function(d, i) {

          node = {};
          node.name = d[0].name;
          node.group = d[0].group;

          // Create the children nodes
          node.children = d.map(function(e, j) {
            return {name: e.name, size: e.size, group: e.group, year: e.year, id: e.id, focus: e.focus}
          })

          return node;
        })

        // Add parents to the root
        r.children = parents;

        var treemap = d3.layout.treemap()
            .padding(4)
            .sticky(true)
            .size([vars.width, vars.height])
            .value(function(d) { return d[vars.var_size]; });

        // PRE-UPDATE
        var cell = vars.svg.data([r]).selectAll("g")
            .data(treemap.nodes);

        // ENTER
        var cell_enter = cell.enter().append("g")
            .attr("class", "cell")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        cell_enter.append("rect")
            .attr("width", function(d) { return d.dx; })
            .attr("height", function(d) { return d.dy; })
            .style("fill", function(d) {
              return d.children ? vars.color(d[vars.var_color]) : null; 
            })

        // TODO: persistent bug when hovering a cell
        cell
          .filter(function(d) { return d.depth == 2})
          .on("mousemove", function(d) {      
            vars.evt.call("highlightOn", d);
          }).on("mouseout", function(d) {
            vars.evt.call("highlightOut", d);
          })

        cell_enter.append("text")
            .attr("x", function(d) { return 10; })
            .attr("y", function(d) { return 10; })
            .attr("dy", ".35em")
            .attr("text-anchor", "left")
            .style("font-size", 15)
            .text(function(d) { 
              if(d.depth == 1)
                return d.name;
            //  return d.children ? null : d[vars.var_text].slice(0, 3)+"..."; 
            })
            .on("mouseenter", function(d, i) {                
              vars.dispatch.highlightOn(d)              
            }).on("mouseout", function(d) {
              vars.dispatch.highlightOut(d)  
            })

        // EXIT
        var cell_exit = cell.exit().remove();

        // UPDATE
        cell.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        cell.select("rect")
            .attr("width", function(d) { return d.dx; })
            .attr("height", function(d) { return d.dy; })
            .style("fill", function(d) {
              return d.children ? vars.color(d[vars.var_color]) : null; 
            })
            .classed("focus", function(d, i) { return d.focus; })

        cell.select("text")
            .call(wrap)

      break;