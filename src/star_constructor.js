  chart = function(selection) {

    // Create the top level element conaining the visualization
    if(!vars.svg) {
       if(vars.type !== "table") {
       
        vars.svg = d3.select(vars.container).append("svg")
          .attr("width", vars.width + vars.margin.left + vars.margin.right)
          .attr("height", vars.height + vars.margin.top + vars.margin.bottom)
          .append("g")
            .attr("transform", "translate(" + vars.margin.left + "," + vars.margin.top + ")");

      } else {
        // HTML Container for table
        vars.svg = d3.select(vars.container).append("div")
            .style({height: vars.height+"px", width: vars.width+"px", overflow: "scroll"});

      }
    }
