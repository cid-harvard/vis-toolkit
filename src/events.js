
  vars.evt.register = function(evt, f, d) {

    if(vars.dev) { console.log("[vars.evt.register]", evt); }

    if(typeof evt === "string") {
      evt = [evt];
    }

    evt.forEach(function(e) {
      if(typeof vars.evt[e] === "undefined") {
        vars.evt[e] = [];
      }

      vars.evt[e].push([f,d]);
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

    // Make sure the highlighted node is above other nodes
    if(vars.type == "productspace") {
      vars.svg.selectAll('.mark__group').sort(function(a, b) { return a.__highlighted ;})

      // Find all the connect marks which source or targets are linked to the current item
      vars.links.forEach(function(e) {

        if(e.source[vars.var_id] === d[vars.var_id]) {

          e.__highlighted = true;
          e.__redraw = true;

          vars.new_data.forEach(function(f, k) {
            if(f[vars.var_id] === e.target[vars.var_id]) {
              f.__highlighted__adjacent = true;
              f.__redraw = true;
            }

          });

        }

        if(e.target[vars.var_id] === d[vars.var_id]) {

          e.__highlighted = true;
          e.__redraw = true;

          vars.new_data.forEach(function(f, k) {
            if(f[vars.var_id] === e.source[vars.var_id]) {
              f.__highlighted__adjacent = true;
              f.__redraw = true;
            }

          });

        }

      })
    }

    // POST-RENDERING STUFF
    // Usually aimed at updating the rendering order of elements
    vars.z_index.forEach(function(d) {

      if(vars.type === d.type && d.event === 'highlightOn') {
        vars.svg.selectAll(d.selector)
          .filter(function(e) {
            if(typeof d.attribute !== 'undefined') {
              return e[d.attribute];
            } else {
              return true;
            }
          })
          .each(function() {
            this.parentNode.appendChild(this);
          });
      }

    });

    d3.select(vars.container).call(vars.this_chart);

  });

  vars.evt.register("highlightOut", function(d) {
    d.__highlighted = false;
    d.__redraw = true;

    // Make sure the highlighted node is above other nodes
    if(vars.type == "productspace" || vars.type == "dotplot") {

      d3.select(vars.container).selectAll(".connect__line").classed("highlighted", false);
      d3.select(vars.container).selectAll("circle").classed("highlighted__adjacent", false);

      // Temporary settings to prevent chart redraw for product space
      d3.select(vars.container).selectAll(".items__mark__text").remove();
      d3.select(vars.container).selectAll(".items__mark__div").remove();

      // Reset all the highlighted nodes
      vars.links.forEach(function(e) {
        e.__highlighted = false;
 //       e.__redraw = true;
      })
/*
      // Reset all the highlighted adjacent nodes
      vars.new_data.forEach(function(e) {
        e.__highlighted__adjacent = false;
        e.__redraw = true;
      })
    }
*/

    }

    if(vars.type !== "productspace") {
      d3.select(vars.container).call(vars.this_chart);
    }

    // Duplicate
    vars.z_index.forEach(function(d) {

      if(vars.type === d.type && d.event === 'highlightOut') {
        vars.svg.selectAll(d.selector)
          .filter(function(e) {
            if(typeof d.attribute !== 'undefined') {
              return e[d.attribute];
            } else {
              return true;
            }
          })
          .each(function() {
            this.parentNode.appendChild(this);
          });
      }

    });

  });

  vars.evt.register("selection", function(d) {
    d.__selected = !d.__selected;
    d3.select(vars.container).call(vars.this_chart);
  });
