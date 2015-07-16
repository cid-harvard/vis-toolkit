
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
    d3.select(vars.container).call(vars.this_chart);

    // Make sure the highlighted node is above other nodes
    if(vars.type == "productspace") {
      vars.svg.selectAll('.mark__group').sort(function(a, b) { return a.__highlighted ;})
    }
  });

  vars.evt.register("highlightOut", function(d) {
    d.__highlighted = false;
    d3.select(vars.container).call(vars.this_chart);
  });

  vars.evt.register("selection", function(d) {
    d.__selected = !d.__selected;
    d3.select(vars.container).call(vars.this_chart);
  });
