
  chart = function(selection) {

    if(!vars.svg) {
       if(vars.type != "table") {
       
        vars.svg = d3.select(vars.container).append("svg")
          .attr("width", vars.width + vars.margin.left + vars.margin.right)
          .attr("height", vars.height + vars.margin.top + vars.margin.bottom)
          .append("g")
            .attr("transform", "translate(" + vars.margin.left + "," + vars.margin.top + ")");

      } else {
        // HTML Container for table
        vars.svg = d3.select(vars.container).append("div").style({height: vars.height+"px", width: vars.width+"px", overflow: "scroll"})

      }
    }

    // Get a copy of the whole dataset
    new_data = vars.data;

    // Filter data by time
    if(typeof vars.var_time != "undefined" && vars.current_time != null) {

      console.log("[time.filter]", vars.var_time, vars.current_time)
      new_data = new_data.filter(function(d) {
        return d[vars.var_time] == vars.current_time;
      })

    }

    // Init
    if(vars.focus.length > 0) {
      
      new_data.forEach(function(d, i) {
          if(i == vars.focus[0])
            d.focus = true;
          else
            d.focus = false;

        })
    }

    // Filter data by attribute
    // TODO: not sure we should remove data, but add an attribute instead would better
    if(vars.filter.length > 0) {

      new_data = new_data.filter(function(d) {
        // We don't keep values that are not in the vars.filter array
        return vars.filter.indexOf(d[vars.var_group]) > -1;
      })
    
    }

    // Aggregate data
    if(vars.aggregate == vars.var_group) {

      accessor_year = vars.accessor_year;

      // Do the nesting
      // Should make sure it works for a generc dataset
      // Also for time or none-time attributes
      nested_data = d3.nest()
        .key(function(d) {
          return d[vars.var_group];
        })
        .rollup(function(leaves) {
          // Generates a new dataset with aggregated data

          var aggregation = {};

          aggregation[vars.var_text] = leaves[0][vars.var_group];

          aggregation[vars.var_group] = leaves[0][vars.var_group];

          aggregation[vars.var_x] = d3.mean(leaves, function(d) {
            return d[vars.var_x];
          });

          aggregation[vars.var_y] = d3.mean(leaves, function(d) {
              return d[vars.var_y];
            })

          vars.columns.forEach(function(c) {
            if(c == vars.var_text || c == vars.var_group)
              return;

            aggregation[c] = d3.mean(leaves, function(d) {
              return d[c];
            })
          })

          return aggregation;
        })
        .entries(new_data);

      // Transform key/value into values tab only
      new_data = nested_data.map(function(d) { return d.values});
    }

    selection.each(function() {

      switch(vars.type) {

        case 'undefined':

        // Basic dump of the data we have
         vars.svg.append("span")
          .html(JSON.stringify(vars.data));

        break;