
    // 1 - Init and define default values [INIT]
    // 2 - Duplicates the dataset [INIT]
    // 3 - Mutate all_data with static metadata [INIT]
    // Filter by time values
    // Filter by attribute/ Selection
    // Find unique values from dataset
    // Remove missing data
    // Aggregates the data [REFRESH]
    // Sorts the data

    // 1 - Init and define default parameters
    vars.items_data = [];

    // Each item needs coordinates
    // 1/ In case we use functions for X/Y variables
    // 2/ Adds default attributes __var_x and __var_y if no coordinate exist

    if(typeof vars.var_x === "function") {
      vars.var_x = vars.var_x(vars);
    }

    if(typeof vars.var_x === "undefined") {
      // vars.data.forEach(function(d, i) {
      //   d.__var_x = vars.var_x(d, i, vars);
      // });
      vars.var_x = "__var_x";
    }

    if(typeof vars.var_y !== "string" && typeof vars.var_y === "function") {
      vars.data.forEach(function(d, i) {
        d.__var_y = vars.var_y(d, i, vars);
      });
      vars.var_y = "__var_y";
    }

    // In case the chart type is a function
    if(typeof vars.type !== "string" && typeof vars.type === "function") {
      vars.type = vars.type(vars);
    }

    if(typeof vars.type === 'undefined') {
      vars.type = 'none';
    };

    // In case the current_time is set dynamically
    if(typeof vars.time.current_time === "function") {
      vars.time.current_time = vars.time.current_time(vars.data);
    }

    // Duplicate the dataset to prevent mutation
    if(vars.init) {

      // Get a copy of the whole dataset
      vars.all_data = JSON.parse(JSON.stringify(vars.data));

    }

    // Calculate vars.new_data which should contain two things
    // 1/ The list of all items (e.g. countries, products)
    // 2/ The metadata for each items
    if(vars.init || vars.refresh) {

      // Creates default ids `__id` and `__value` for dataset without any id
      if(typeof vars.var_id === 'undefined') {

        if(vars.new_data === null) {
          vars.new_data = vars.all_data;
        }

        vars.new_data = vars.new_data.map(function(d, i) {

          if(typeof d !== 'object') {
            var e = {}
            e.__id = i;
            e.__value = d;
            d = e;
          }

          d.__id = i;
          return d;

        });

        vars.var_id = '__id';

        if(typeof vars.var_text === 'undefined') {
          vars.var_text = '__id';
        }

      } else {

        // Duplicate data to prevent mutation
        vars.new_data = JSON.parse(JSON.stringify(vars.all_data));

      }

      // If time filter parameter is set, then keep values for this time
      if(typeof vars.time.filter !== "undefined" && vars.time.filter.length > 0) {

        if(vars.dev) {
          console.log("[vars.time.filter]", vars.time.filter);
        }

        vars.new_data = vars.new_data.filter(function(d, i) {
          return vars.time.filter.indexOf(d[vars.time.var_time]) > -1;
        });

      }

      // If time filter interval is set, then keep values from this interval
      if(typeof vars.time.filter_interval != "undefined" && vars.time.filter_interval.length == 2) {

        if(vars.dev) {
          console.log("[vars.time.interval]", vars.time.filter_interval);
        }

        vars.new_data = vars.new_data.filter(function(d, i) {
          return (d[vars.time.var_time] >= vars.time.filter_interval[0]) && (d[vars.time.var_time] <= vars.time.filter_interval[1]);
        });

      }

      // Find unique values for various parameters
      vars.time.interval = d3.extent(vars.new_data, function(d) { return d[vars.time.var_time]; });
      vars.time.points = vistk.utils.find_unique_values(vars.new_data, vars.time.var_time);

      // In case no tempora values, change the accessor
      if(vars.time.var_time === null || vars.type === 'treemap') {
        vars.accessor_data = function(d) { return d; }
      }

      // Filter data by attribute
      // TODO: not sure we should remove data, but add an attribute instead would better
      if(vars.filter.length > 0) {

        if(vars.dev) {
          console.log("[vars.filter]", vars.filter);
        }

        vars.new_data = vars.new_data.filter(function(d) {
          // We don't keep values that are not in the vars.filter array
          return vars.filter.indexOf(d[vars.var_group]+"") > -1;
        });

      }

      var unique_data = [];

      var lookup_index = [];
      var lookup_size = 0;

      vars.lookup_index_time = [];
      var lookup_time_size = 0;

      vars.new_data.forEach(function(d, i) {

        var index = -1;

        if(typeof lookup_index[d[vars.var_id]] === 'undefined') {

          index = lookup_size;
          lookup_size++;

          lookup_index[d[vars.var_id]] = index;

          utils.init_item(d);

          if(vars.filter.indexOf(d[vars.var_group]) > -1) {
            d.__filtered = true;
          }
          if(vars.highlight.indexOf(vars.var_id) > -1) {
            d.__highlighted = true;
          }
          if(vars.selection.indexOf(vars.var_id) > -1) {
            d.__selected = true;
          }

          d.__redraw = true;

          d.__index = index;

          // Dup for metadata
          var dup = JSON.parse(JSON.stringify(d));
          dup.values = [];

          unique_data.push(dup);

        } else {

          index = lookup_index[d[vars.var_id]];

        }

        var v = {};
        v[vars.var_id] = d[vars.var_id];
        v[vars.time.var_time] = d[vars.time.var_time];
        v[vars.var_y] = d[vars.var_y];
        v[vars.var_x] = d[vars.var_x];
        v[vars.var_color] = d[vars.var_color];
        v[vars.var_size] = d[vars.var_size];
        v[vars.var_text] = d[vars.var_text];
        v[vars.var_r] = d[vars.var_r];

        // TODO: make sure there is no existing value for this time
        unique_data[index].values[d[vars.time.var_time]] = v;

      });

      vars.new_data = unique_data;

    }

    // Aggregate data
    if(typeof vars.set['__aggregated'] !== 'undefined' && vars.refresh) {

      if(vars.dev) {
        console.log("[vars.aggregate]", vars.aggregate);
      }

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

          // Quick fix in case var_x is an ordinal scale
          if(vars.var_x !== vars.var_id && vars.var_x !== vars.time.var_time && vars.var_x !== vars.var_group) {
            aggregation[vars.var_x] = d3.mean(leaves, function(d) {
              return d[vars.var_x];
            });
          } else {
            aggregation[vars.var_x] = leaves[0][vars.var_x];
          }

          if(vars.var_y !== vars.var_id && vars.var_y !== vars.time.var_time) {
            aggregation[vars.var_y] = d3.mean(leaves, function(d) {
              return d[vars.var_y];
            });
          } else {
            aggregation[vars.var_y] = leaves[0][vars.var_y];
          }

          aggregation[vars.var_r] = d3.sum(leaves, function(d) {
            return d[vars.var_r];
          });

          aggregation.piescatter = [];
          aggregation.piescatter[0] = {};
          aggregation.piescatter[1] = {};

          aggregation.values = [];

          // Assuming all the time values are present in all items
          vars.time.points.forEach(function(time, i) {

            var d = {};

           // if(vars.var_x === vars.time.var_time) {
           //   d[vars.var_x] = leaves[0].values[i][vars.var_x];
           // } else {
           //   d[vars.var_x] = 0;
           // }

            // Init values
            d[vars.var_x] = leaves[0].values[time][vars.var_x];
            d[vars.var_y] = leaves[0].values[time][vars.var_y];
            d[vars.var_r] = leaves[0].values[time][vars.var_r];
            d[vars.var_id] = leaves[0].values[time][vars.var_id];

            // Time var
            d[vars.time.var_time] = leaves[0].values[time][vars.time.var_time];

            aggregation.values[time] = d;

            //return d;
          });

          // Assuming we only aggregate var_x, var_y, var_r
          leaves.forEach(function(d, i) {

            vars.time.points.forEach(function(time, i) {

              if(vars.var_x !== vars.time.var_time) {
                aggregation.values[time][vars.var_x] += d.values[time][vars.var_x];
              }

              aggregation.values[time][vars.var_y] += d.values[time][vars.var_y];
              aggregation.values[time][vars.var_r] += d.values[time][vars.var_r];

            });
          });

          utils.init_item(aggregation);
          aggregation.__aggregated = true;
          aggregation.__redraw = true;

          if(typeof vars.share_cutoff != "undefined") {

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

          }

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
      if(typeof vars.set['__aggregated'] !== 'undefined' && vars.set['__aggregated']) {
        vars.new_data = vars.new_data.concat(nested_data.map(function(d) { return d.values; }));
      } else {
        vars.new_data = nested_data.map(function(d) { return d.values; });
      }

    }

    if(vars.init || vars.refresh) {

      // Links between items
      // Used for product space
      if(vars.links !== null && vars.type === 'productspace') {

        vars.links.forEach(function(d, i) {

          if(typeof d.source === "string") {
            d.source = vistk.utils.find_node_by_id(vars.nodes, d.source);
          }

          if(typeof d.target === "string") {
            d.target = vistk.utils.find_node_by_id(vars.nodes, d.target);
          }

          d.__redraw = true;

        });

      }

      // Flagging missing nodes with __missing true attribute
      if(typeof vars.nodes !== "undefined" && vars.type === 'productspace') {

        vars.new_data = utils.join(vars.nodes, vars.new_data, vars.var_node_id, vars.var_id, function(new_data, node) {
            var r = new_data;
            if(typeof node === 'undefined') {
              return;
            }

            // Update all time points
            vars.time.points.forEach(function(time) {

              if(typeof(r.values[time]) === 'undefined') {
                r.values[time] = {};
                r.values[time][vars.var_id] = vars.var_id;
              }

              r.values[time].x = node.x;
              r.values[time].y = node.y;
            });

            // Keep the metadata
            r.x = node.x;
            r.y = node.y;

            r.__redraw = true;
            return r;
        });

        // Remove missing nodes
        // vars.new_data = vars.new_data.filter(function(d) {
        //  return !d.__missing;
        // });

        // Go through again the list of nodes
        // to make sure we display all the nodes
        vars.nodes.forEach(function(d, i) {

          var node = vistk.utils.find_node_coordinates_by_id(vars.new_data, vars.var_id, d[vars.var_node_id]);

          if(typeof node === "undefined") {

            d.values = [];
            d[vars.var_r] = 0;
            d[vars.var_id] = d.id;

            utils.init_item(d);
            d.__redraw = true;

            vars.new_data.push(d);

          }

        })

      }

    }

    // Sorting the dataset
    if(typeof vars.var_sort !== "undefined" && vars.refresh) {

      if(vars.dev) {
         console.log("[updating sort]", vars.var_sort, vars.var_sort_asc, vars.user_vars)
      }

      if(typeof vars.var_sort_asc !== "undefined" && !vars.var_sort_asc) {
        vars.new_data = vars.new_data.sort(function(a, b) { return d3.ascending(a[vars.var_sort], b[vars.var_sort]);});
      } else {
        vars.new_data = vars.new_data.sort(function(a, b) { return d3.descending(a[vars.var_sort], b[vars.var_sort]);});
      }
    }

    vars.new_data = vars.new_data.filter(function(d) {
      return typeof vars.accessor_data(d)[vars.var_id] !== 'undefined';
    });

    if(vars.redraw_all) {
      vars.new_data.forEach(function(d) { d.__redraw = true; });
    }

    vars.redraw_all = false;
