    // Get a copy of the whole dataset
    vars.new_data = vars.data;

    // Filter data by time
    if(typeof vars.time !== "undefined" && typeof vars.time.current_time !== "undefined" && vars.time.current_time != null) {

      console.log("[time.filter]", vars.time.var_time, vars.time.current_time);

      vars.new_data = vars.new_data.filter(function(d) {
        return d[vars.time.var_time] === vars.time.current_time;
      });

    }

    // Init
    if(vars.focus.length > 0) {
      
      vars.new_data.forEach(function(d, i) {
          if(i === vars.focus[0]) {
            d.focus = true;
          } else {
            d.focus = false;
          }
        });
    }

    // Filter data by attribute
    // TODO: not sure we should remove data, but add an attribute instead would better
    if(vars.filter.length > 0) {

      vars.new_data = vars.new_data.filter(function(d) {
        // We don't keep values that are not in the vars.filter array
        return vars.filter.indexOf(d[vars.var_group]) > -1;
      });
    
    }

    // Aggregate data
    if(vars.aggregate === vars.var_group) {

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
          });

          vars.columns.forEach(function(c) {
            if(c === vars.var_text || c === vars.var_group) {
              return;
            }

            aggregation[c] = d3.mean(leaves, function(d) {
              return d[c];
            });
          });

          return aggregation;
        })
        .entries(vars.new_data);

      // Transform key/value into values tab only
      vars.new_data = nested_data.map(function(d) { return d.values; });
    }

    if(vars.type === "linechart") {

      // Parse data
      vars.new_data.forEach(function(d) {
        d[vars.var_time] = vars.time.parse(d.year);
      });

      all_years = d3.set(vars.new_data.map(function(d) { return d.year;})).values();

      var unique_countries = d3.set(vars.new_data.map(function(d) { return d[vars.var_text]; })).values();

      // Find unique countries and create ids
      countries = unique_countries.map(function(c) {
        return {
          id: c.replace(" ", "_"),
          name: c,
          values: vars.new_data.filter(function(d) {
            return d[vars.var_text] == c;
          }).map(function (d) {
            return {date: vars.time.parse(d.year), rank: +d.rank, year: d.year};
          })
        };
      })

      // Make sure all countries and all ranks are there
      countries.forEach(function(c) {

        all_years.forEach(function(y) {
          var is_year = false;
          c.values.forEach(function(v) {
            if(v.year == y)
              is_year = true;
          })
          if(!is_year) {
            c.values.push({date: vars.time.parse(y), rank: null, year: y})
          }
        });

      });

    }

    if(vars.type == "sparkline") {

      vars.new_data = [];

      // Flatten the data here
      // Or do something to build the temporal data? Should it happen here?
      vars.data.forEach(function(d) {

        if(d.dept_name === "Antioquia") {
          vars.new_data.push({name: d.dept_name, year: vars.time.parse(d.year), realgdp: d.realgdp});
        }

      });

    }

    if(vars.type == "treemap") {

      // Create the root node
      r = {}
      r.name = "root";
      groups = [];

      // Creates the groups here
      vars.new_data.map(function(d, i) {

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

    }
 
    selection.each(function() {

      switch(vars.type) {

        case 'undefined':

        // Basic dump of the data we have
         vars.svg.append("span")
          .html(JSON.stringify(vars.data));

        break;