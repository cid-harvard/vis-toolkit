
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

  }, 100);

  vars.this_chart = chart;

  return chart;
}

