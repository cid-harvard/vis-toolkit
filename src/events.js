
  vars.evt.register = function(evt, f) {

    if(vars.dev) { console.log("[vars.evt.register]", evt); }

    if(typeof evt === "string") {
      evt = [evt];
    }

    evt.forEach(function(e) {

      if(typeof vars.evt[e] === "undefined") {
        vars.evt[e] = [];
      }

      vars.evt[e].push([f]);

    });

  };

  vars.evt.call = function(evt, a) {

    if(vars.dev) { console.log("[vars.evt.call]", evt, a); }

    if(typeof vars.evt[evt] === "undefined") {
      if(vars.dev) { console.warn("No callback for event", evt, a); }
      return;
    }

    vars.evt[evt].forEach(function(e) {
      if(vars.dev) { console.log("[calling evt]", e); }
      if(typeof(e[0]) !== "undefined") {
        e[0](a);
      }
    });
  };

  if (!vars.data) { vars.data = []; }

  vars.width = parseInt(d3.select("body").style('width').substring(0, d3.select("body").style('width').length-2));
  vars.width = vars.width - vars.margin.left - vars.margin.right;
  vars.height = vars.width * vars.ratio;

  // List of events
  vars.dispatch = d3.dispatch('init', 'end', 'highlightOn', 'highlightOut', 'selection', 'resize', 'clearAnimations');

  // Default events
  d3.select(window).on('resize', function(d) {
    vars.evt.call("resize", d);
  });

  vars.evt.register("highlightOn", function(d) {
    d.__highlighted = true;
    d.__redraw = true;
  });

  vars.evt.register("highlightOut", function(d) {
    d.__highlighted = false;
    d.__redraw = true;
/*
    var adjacent_nodes = utils.find_adjacent_nodes(d, vars.links);

    adjacent_nodes.forEach(function(e) {

        // Redraw adjacent nodes
        e.__highlighted__adjacent = false;
        e.__redraw = true;

       vars.new_data.forEach(function(f, k) {

         if(f[vars.var_id] === e.target[vars.var_id]) {
          // Redraw adjacent links
           f.__highlighted__adjacent = false;
           f.__redraw = true;
           console.log("OUT")
         }

       });

    });
*/
  });

  vars.evt.register("selection", function(d) {

    // Toggle selection for current node
    // d.__selected = !d.__selected;
    // d.__redraw = true;

    // Cases
    // No node has been selected before (first selection)

    // One node has already been selected, but select on another one
    // Click on background unselects everything
    if(vars.type == "productspace") {

      // Make sure the highlighted node is above other nodes
      //vars.svg.selectAll('.mark__group').sort(function(a, b) { return a.__highlighted ;})

      var current_node = d.__selected;

      // Current node already selected, unselect it and adjacents links/nodes
      if(current_node) {

        d.__selected = false;
        d.__redraw = true;

        var adjacent_links = utils.find_adjacent_links(d, vars.links);

        adjacent_links.forEach(function(e) {

            // Update links
            e.__selected = false;
            e.__redraw = true;

            vars.new_data.forEach(function(f, k) {

              if(f[vars.var_id] === e.target[vars.var_id]) {

                // Update nodes
                f.__selected = false;
                f.__redraw = true;
              }

            });

        });

      } else {

        d.__selected = true;
        d.__redraw = true;

        var adjacent_links = utils.find_adjacent_links(d, vars.links);

        adjacent_links.forEach(function(e) {

            // Update links
            e.__selected = true;
            e.__redraw = true;

            vars.new_data.forEach(function(f, k) {

              if(f[vars.var_id] === e.target[vars.var_id]) {

                // Update nodes
                f.__selected = true;
                f.__redraw = true;
              }

            });

        });

      }


    }

    d3.select(vars.container).call(vars.this_chart);

  });

  // Reset selection/zoom when click SVG canvas
//  vars.svg
