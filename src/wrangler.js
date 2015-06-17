
    vistk.utils.init_data = function() {

      // Init states for data from the chart parameters
      vars.data.forEach(function(d, i) {

        if(vars.filter.indexOf(d[vars.var_id]) < 0)
          d.__filtered = false;
        else
          d.__filtered = true;

        if(vars.highlight.indexOf(d[vars.var_id]) < 0)
          d.__highlighted = false;
        else
          d.__highlighted = true;

        if(vars.selection.indexOf(d[vars.var_id]) < 0)
          d.__selected = false;
        else
          d.__selected = true;

      });

    }

    // Calculate vars.new_data which should contain two things
    // 1/ The list of all items (e.g. countries, products)
    // 2/ The metadata for each items
    if(vars.new_data === null) {

      vistk.utils.init_data();

    }

    // Get a copy of the whole dataset
    vars.new_data = vars.data;

    // Filter vars.new_data by time
    // Thus, vars.new_data is always a unique time slice of the dataset
    if(typeof vars.time !== "undefined" && typeof vars.time.current_time !== "undefined" && vars.time.current_time != null) {

      console.log("[time.filter]", vars.time.var_time, vars.time.current_time);

      vars.new_data = vars.new_data.filter(function(d) {
        return d[vars.time.var_time] === vars.time.current_time;
      });

    }

    // Filter data by attribute
    // TODO: not sure we should remove data, but add an attribute instead would better
    if(vars.filter.length > 0) {

      console.log("[vars.filter]", vars.time.var_time, vars.time.current_time);

      vars.new_data = vars.new_data.filter(function(d) {
        // We don't keep values that are not in the vars.filter array
        return vars.filter.indexOf(d[vars.var_group]) > -1;
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

    vars.time.interval = d3.extent(vars.data, function(d) { return d[vars.time.var_time]; });
    vars.time.points = d3.set(vars.data.map(function(d) { return d[vars.time.var_time]; })).values();

    // vars.time_data format
    // {id:, name:, values: [{date: d[vars.time.var_time], rank:, year:]}
    if(vars.type === "sparkline" || vars.type === "stacked") {

      if(vars.time_data === null) {
        // Parse time in raw data
        vars.data.forEach(function(d) {
          d[vars.time.var_time] = vars.time.parse(d[vars.time.var_time]);
        });

        // Retriev the unique items from the raw data
        vars.unique_items = d3.set(vars.new_data.map(function(d) { return d[vars.var_text]; })).values();

      }

      // Find unique items and create ids
      vars.time_data = vars.unique_items.map(function(c, i) {

        var time_values = vars.data.filter(function(d) {
          return d[vars.var_text] === c;
        });

        // Init with corresponding time slice
        var m = vars.new_data[i];

        // Create time values
        var data_values = time_values.map(function (d) {
            
              var v = {}; 
              v[vars.time.var_time] = d[vars.time.var_time];
              v[vars.var_y] = d[vars.var_y];
              v[vars.var_x] = d[vars.var_x];
              v[vars.var_id] = d[vars.var_id];
              return v;
            
          })

        m.values = data_values;
        vars.new_data[i].values = data_values;

        return m;
      });

    }

    // Towards a unique variable for wrangled data
    vars.new_data.forEach(function(d, i) {

      d.values = vars.data.filter(function(e) {
        return d[vars.var_id] === e[vars.var_id];
      });

    });

    if(vars.type === "stacked") {

      // Make sure all items and all ranks are there
      vars.time_data.forEach(function(c) {

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
          .x(function(d) { return d[vars.time.var_time]; })          
          .y(function(d) { return d[vars.var_y]; });

       vars.time_data = vars.stack(vars.time_data);
    }
      // Find the number or years

/*
      unique_years = d3.set(vars.data.data.map(function(d) { return d.year;})).values();

      data = [];

      unique_years.forEach(function(d) {

        a = {};

        vars.data.data.filter(function(e) {
          return e.year == d;
        })
        .map(function(e) {
          a[e.abbrv] = e.share;
    //      return a;
        })

        a.date = vars.time.parse(d);
        data = data.concat(a);

      });

      vars.new_data = stack(d3.keys(data[0]).filter(function(key) { return key !== "date"; }).map(function(name) {
        return {
          name: name,
          values: data.map(function(d) {
            return {date: d.date, y: d[name]};
          })
        };
      }));


    }
*/

    if(vars.links !== null) {

      vars.links.forEach(function(d, i) {

        d.source = vistk.utils.find_node_by_id(d.source);
        d.target = vistk.utils.find_node_by_id(d.target);

      });

    }

    if(vars.type === "treemap") {

      // Create the root node
      vars.root = {};
      vars.root.name = "root";
      vars.root.depth = 0;

      vars.groups = [];
/*
      // Make sure each node has a parent attribute
      vars.new_data.forEach(function(d) {
        d.parent = d.var_parent;
      });


    // create a name: node map
    var dataMap = exports.data.reduce(function(map, node) {
        map[node.name] = node;
        return map;
    }, {});

    // create the tree array
    treeData = [];

    exports.data.forEach(function(node) {
        var parent = dataMap[node.parent];
        if (parent) {
            // create child array if it doesn't exist
            (parent.children || (parent.children = []))
                // add node to child array
                .push(node);
        } else {
            // parent is null or missing
            treeData.push(node);
        }
    });
*/
      vars.unique_groups = [];

      // Creates the groups here
      vars.new_data.map(function(d, i) {

        if(vars.unique_groups.indexOf(d[vars.var_group]) < 0) {
          vars.unique_groups.push(d[vars.var_group]);
          vars.groups[vars.unique_groups.indexOf(d[vars.var_group])] = [];
        }

        var n = {name: d[vars.var_text], group: d[vars.var_group], year: d.year, id: i};
        n[vars.var_size] = d[vars.var_size];
        n[vars.var_group] = d[vars.var_group];
        vars.groups[vars.unique_groups.indexOf(d[vars.var_group])].push(n);

      });

      // Make sure there is no empty elements
     vars.groups = vars.groups.filter(function(n) { return n !== "undefined"; }); 

      // Add group elements are root children
      vars.root.children = vars.groups.map(function(d, i) {

        node = {};
        node.name = d[0].name;
        node.group = d[0].group;

        // Create the children nodes var
        node.children = d.map(function(e, j) {
          var n = {name: e.name, group: e.group, year: e.year, id: e.id};
          n[vars.var_size] = e[vars.var_size]; 
          n[vars.var_group] = e[vars.var_group];
          return n;
        });

        return node;

      });

    }

    if(vars.type == "grid") {

      vars.new_data = [];

      var nb_dimension =  Math.ceil(Math.sqrt(vars.data.length));
      
      // Create foci for each dimension
      // TOFIX: should update children, not necessary replace
      d3.range(nb_dimension).map(function(d, i) {
         d3.range(nb_dimension).map(function(e, j) {

          // To make sure we don't update more points than necessary
          if(i * nb_dimension + j < vars.data.length) {
            // IMPORTANT to clone the _params here
            var index = i * nb_dimension + j;
            var datum = vars.data[index];
            datum.x = i;
            datum.y = j;
            datum.index = index;
            vars.new_data.push(datum);
          }
        });

      });

    }
