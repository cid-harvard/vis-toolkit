
  setTimeout(function() {

    vars.evt.register("highlightOn", function(d) {

      // POST-RENDERING STUFF
      // Usually aimed at updating the rendering order of elements
      vars.z_index.forEach(function(d) {

        // Filter events
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

      if(vars.type !== "productspace") {
        d3.select(vars.container).call(vars.this_chart);
      }

      vars.z_index.forEach(function(d) {

        // Filter events
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

    vars.root_svg.on("click", function(d) {

      if(vars.type === "productspace") {

        vars.links.forEach(function(e) {
          e.__selected = false;
          e.__highlighted = false;
          e.__redraw = true;
        });

        vars.new_data.forEach(function(f, k) {
          f.__selected = false;
          f.__highlighted = false;
          f.__redraw = true;
        });

        vars.zoom = [];
        vars.selection = [];
        vars.highlight = [];

        utils.zoom_to_nodes(vars.zoom);

        vars.init = true;
        vars.refresh = true;

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

      }

    })

  }, 100)

  vars.this_chart = chart;

  return chart;
}

