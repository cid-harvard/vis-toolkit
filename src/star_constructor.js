  function chart(selection) {

    // Merging the various user params
    vars.user_vars = vistk.utils.merge(vars.user_vars, vars._user_vars);

    // Merging with current charts parameters set by the user in the HTML file
    vars = vistk.utils.merge(vars, vars.user_vars);

    // Create the top level element conaining the visualization
    if(!vars.svg) {
       if(vars.type !== "table") {

        vars.root_svg = d3.select(vars.container).append("svg")
          .attr("width", vars.width)
          .attr("height", vars.height)
          .style('overflow', 'visible')
          .style('z-index', 0)
          .on("click", function(d) {

            if(vars.type === "productspace") {

              vars.links.forEach(function(e) {
                e.__selected = false;
                e.__selected__adjacent = false;
                e.__highlighted = false;
                e.__highlighted__adjacent = false;
                e.__redraw = true;
              });

              vars.new_data.forEach(function(f, k) {
                f.__selected = false;
                f.__selected__adjacent = false;
                f.__highlighted = false;
                f.__highlighted__adjacent = false;
                f.__redraw = true;
              });

              vars.zoom = [];
              vars.selection = [];
              vars.highlight = [];

            //  vars.init = true;
            //  vars.refresh = true;

              d3.select(vars.container).selectAll(".connect__line")
                .classed("highlighted", function(d, i) { return false; })
                .classed("highlighted__adjacent", function(d, i) { return false; })
                .classed("selected", function(d, i) { return false; })
                .classed("selected__adjacent", function(d, i) { return false; });

              d3.select(vars.container).selectAll("circle")
                .classed("highlighted", function(d, i) { return false; })
                .classed("highlighted__adjacent", function(d, i) { return false; })
                .classed("selected", function(d, i) { return false; })
                .classed("selected__adjacent", function(d, i) { return false; });

                utils.zoom_to_nodes(vars.zoom);
            // d3.select(vars.container).call(vars.this_chart);

            }

          })

        vars.svg = vars.root_svg.append("g")
          .attr("transform", "translate(" + vars.margin.left + "," + vars.margin.top + ")rotate(" + vars.rotate + ")");

      } else {
        // HTML Container for table
        vars.svg = d3.select(vars.container).append("div")
            .style({height: vars.height+"px", width: vars.width+"px", overflow: "scroll"});

      }
   }
