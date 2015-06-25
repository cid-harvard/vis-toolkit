    vars.items_data = [];

    // In case we use custom variables as X/Y variables 
    if(typeof vars.var_x !== "string" && typeof vars.var_x === "function") {
      vars.data.forEach(function(d, i) {
        d._var_x = vars.var_x();
      });
      vars.var_x = "_var_x";
    }

    if(typeof vars.var_y !== "string" && typeof vars.var_y === "function") {
      vars.data.forEach(function(d, i) {
        d._var_y = vars.var_y();
      });
      vars.var_y = "_var_y";
    }

    // Calculate vars.new_data which should contain two things
    // 1/ The list of all items (e.g. countries, products)
    // 2/ The metadata for each items
    if(vars.new_data === null || vars.refresh) {

      vars.time.interval = d3.extent(vars.data, function(d) { return d[vars.time.var_time]; });
      vars.time.points = d3.set(vars.data.map(function(d) { return d[vars.time.var_time]; })).values();

      // Get a copy of the whole dataset
      vars.new_data = vars.data;

      if(typeof vars.time.filter != "undefined" && vars.time.filter.length > 0) {

        console.log("[vars.time.filter]", vars.time.filter);

        vars.new_data = vars.new_data.filter(function(d, i) {
          return vars.time.filter.indexOf(d[vars.time.var_time]) > -1;
        });
       
      }

      // Filter data by attribute
      // TODO: not sure we should remove data, but add an attribute instead would better
      if(vars.filter.length > 0) {

        console.log("[vars.filter]", vars.filter);

        vars.new_data = vars.new_data.filter(function(d) {
          // We don't keep values that are not in the vars.filter array
          return vars.filter.indexOf(d[vars.var_group]+"") > -1;
        });

      }

      vars.unique_items = d3.set(vars.new_data.map(function(d) { return d[vars.var_id]; })).values();

      vars.unique_data = [];

      // Towards a unique variable for wrangled data
      vars.unique_items.forEach(function(item_id, i) {

        // METADATA
        var d = vars.new_data.filter(function(e, j) {
          return e[vars.var_id] == item_id && e[vars.time.var_time] == vars.time.current_time;
        })[0];

        // TODO: it can happen there is no item for the current year (but for others)
        if(typeof d === "undefined")
          return;

        // TIME VALUES
        d.values = vars.new_data.filter(function(e) {
          return item_id === e[vars.var_id];
        })
        .map(function(d) {

          // Below is what we need for time values
          var v = {}; 
          v[vars.time.var_time] = d[vars.time.var_time];
          v[vars.var_y] = d[vars.var_y];
          v[vars.var_x] = d[vars.var_x];

          if(typeof vars.items !== "undefined" && JSON.stringify(vars.items) != '{}') {

            // Make sure we retrieve the data for nested charts (if any)
            vars.items.forEach(function(item) {
              item.marks.forEach(function(params) {
                v[params.var_y] = d[params.var_y];
                v[params.var_x] = d[params.var_x];
              })
            })
          }

          return v;
        })

        if(vars.filter.indexOf(d[vars.var_group]) < 0)
          d.__filtered = false;
        else
          d.__filtered = true;

        if(vars.highlight.indexOf(item_id) < 0)
          d.__highlighted = false;
        else
          d.__highlighted = true;

        if(vars.selection.indexOf(item_id) < 0)
          d.__selected = false;
        else
          d.__selected = true;

        d.__aggregated = false;

        vars.unique_data.push(d);

      });

      vars.new_data = vars.unique_data;

      // Flag that forces to re-wrangle data
      vars.refresh = false;
    }

    if(typeof vars.nodes != "undefined") {
      // Merge node positions with products
      vars.new_data.forEach(function(d, i) {
        var node = vistk.utils.find_node_coordinates_by_id(vars.nodes, d.product_id);
        d.x = node.x;
        d.y = node.y;
      });

    }


    // Aggregate data
    if(vars.aggregate === vars.var_group) {

      console.log("[vars.aggregate]", vars.aggregate);

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

          aggregation[vars.var_id] = leaves[0][vars.var_group];

          aggregation[vars.var_text] = leaves[0][vars.var_group];

          aggregation[vars.var_group] = leaves[0][vars.var_group];

          aggregation[vars.var_x] = d3.mean(leaves, function(d) {
            return d[vars.var_x];
          });

          aggregation[vars.var_y] = d3.mean(leaves, function(d) {
            return d[vars.var_y];
          });

          aggregation[vars.var_r] = d3.sum(leaves, function(d) {
            return d[vars.var_r];
          });

          aggregation.piescatter = [];
          aggregation.piescatter[0] = {};
          aggregation.piescatter[1] = {};

          aggregation.values = [];

          aggregation.__aggregated = true;
          aggregation.__selected = false;
          aggregation.__highlighted = false;

          aggregation.piescatter[0][vars.var_share] = d3.sum(leaves, function(d) {

            if(vars.share_cutoff(d)) {
              return 1;
            } else {
              return 0;
            }
          });

          aggregation.piescatter[1][vars.var_share] = d3.sum(leaves, function(d) {

            if(!vars.share_cutoff(d)) {
              return 1;
            } else {
              return 0;
            }
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

    // Chart specific metadata: stacked
    if(vars.type === "stacked") {

      // Make sure all items and all ranks are there
      vars.new_data.forEach(function(c) {

        vars.time.points.forEach(function(y) {
          var is_year = false;

          c.values.forEach(function(v) {

            if(v[vars.time.var_time] == y) {
              is_year = true;
            }
          });

          if(!is_year) {

            // Set missing values to null
            var v = {date: y, year: y};

            v[vars.time.var_time] = y;
            v[vars.var_y] = 0;
            c.values.push(v);

          }

        });

      });

      vars.stack = d3.layout.stack()
          .values(function(d) { return d.values; })
//          .order(function(a) { console.log(a[0][0][1]); return a[0][0][1]; })
          .x(function(d) { return d[vars.time.var_time]; })          
          .y(function(d) { return d[vars.var_y]; })

       vars.new_data = vars.stack(vars.new_data);
    }

    // Links between items
    // Used for product space
    if(vars.links !== null) {

      vars.links.forEach(function(d, i) {

        d.source = vistk.utils.find_node_by_id(d.source);
        d.target = vistk.utils.find_node_by_id(d.target);

      });

    }

    // Chart specific metadata: treemap
    if(vars.type === "treemap") {

      // Create the root node
      vars.root = {};
      vars.root[vars.var_text]= "root";
      vars.root.depth = 0;

      vars.groups = [];

      vars.unique_groups = [];

      // Creates the groups here
      vars.new_data.map(function(d, i) {

        // If group doesn't exist, we create it
        if(vars.unique_groups.indexOf(d[vars.var_group]) < 0) {
          vars.unique_groups.push(d[vars.var_group]);
          vars.groups[vars.unique_groups.indexOf(d[vars.var_group])] = [];
        }

        var n = {year: d.year, id: i};
        n[vars.var_size] = d[vars.var_size];
        n[vars.var_group] = d[vars.var_group];
        n[vars.var_id] = d[vars.var_id];
        n[vars.var_text] = d[vars.var_text];
        vars.groups[vars.unique_groups.indexOf(d[vars.var_group])].push(n);

      });

      // Make sure there is no empty elements
     vars.groups = vars.groups.filter(function(n) { return n !== "undefined"; }); 

      // Add group elements are root children
      vars.root.children = vars.groups.map(function(d, i) {

        node = {};
        node[vars.var_text] = d[0][vars.var_text];
        node[vars.var_group] = d[0][vars.var_group];

        // Create the children nodes var
        node.children = d.map(function(e, j) {
          var n = {year: e.year, id: e.id};
          n[vars.var_text] = e[vars.var_text];
          n[vars.var_size] = e[vars.var_size]; 
          n[vars.var_group] = e[vars.var_group];
          n[vars.var_id] = e[vars.var_id];
          return n;
        });

        return node;

      });

    }

    if(typeof vars.var_sort !== "undefined") {

       console.log("[updating sort]", vars.var_sort, vars.var_sort_asc, vars.user_vars)

      if(typeof vars.var_sort_asc !== "undefined" && !vars.var_sort_asc) {
        vars.new_data = vars.new_data.sort(function(a, b) { return d3.ascending(a[vars.var_sort], b[vars.var_sort]);});
      } else {
        vars.new_data = vars.new_data.sort(function(a, b) { return d3.descending(a[vars.var_sort], b[vars.var_sort]);});
      }
    }
    

    if(typeof vars.view != "undefined") {

      vars.old_data = vars.new_data;
      vars.new_data = vars.view;

    } else {


    }


    // Chart specific metadata: grid
    // Generates x and y attributes to display items as a 2D grid
    if(vars.type == "grid") {

      //.sort(function(a, b) { return a[vars.var_sort] - b;}) 

      var nb_dimension =  Math.ceil(Math.sqrt(vars.new_data.length));

      // Create foci for each dimension
      // TOFIX: should update children, not necessary replace
      d3.range(nb_dimension).map(function(d, i) {
         d3.range(nb_dimension).map(function(e, j) {

          var index = i * nb_dimension + j;
          // To make sure we don't update more points than necessary
          if(index < vars.new_data.length) {
            // IMPORTANT to clone the _params here
            var datum = vars.new_data[index];
            datum.x = i;
            datum.y = j;
            datum.index = index;
          }
        });

      });

    }

