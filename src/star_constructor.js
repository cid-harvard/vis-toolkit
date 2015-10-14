  function chart(selection) {

    // Merging the various user params
    vars.user_vars = vistk.utils.merge(vars.user_vars, vars._user_vars);

    // Merging with current charts parameters set by the user in the HTML file
    vars = vistk.utils.merge(vars, vars.user_vars);

    // Create the top level element conaining the visualization
    if(!vars.svg) {
       if(vars.type !== "table") {

        vars.svg = d3.select(vars.container).append("svg")
          .attr("width", vars.width)
          .attr("height", vars.height)
          .style('overflow', 'visible')
          .style('z-index', 0)
          .on("click", function(d) {

            if(vars.type === "productspace") {

              vars.links.forEach(function(e) {
                e.__selected = false;
                e.__redraw = true;
              });

              vars.new_data.forEach(function(f, k) {
                f.__selected = false;
                f.__redraw = true;
              });

              vars.zoom = [];
              vars.init = true;
              vars.refresh = true;
              console.log("REFH", vars, vars.init, vars.refresh)
              d3.select(vars.container).call(vars.this_chart);
            }

          })
        .append("g")
          .attr("transform", "translate(" + vars.margin.left + "," + vars.margin.top + ")rotate(" + vars.rotate + ")")


      } else {
        // HTML Container for table
        vars.svg = d3.select(vars.container).append("div")
            .style({height: vars.height+"px", width: vars.width+"px", overflow: "scroll"});

      }
   }
