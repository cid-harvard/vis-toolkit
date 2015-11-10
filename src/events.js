
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

    vars.evt[evt].forEach(function(e, i) {
      if(vars.dev) { console.log("[calling evt]", e); }
      if(typeof(e[0]) !== "undefined") {
        e[0](a, 0, vars);
      }
    });
  };

  if (!vars.data) { vars.data = []; }

  vars.width = parseInt(d3.select("body").style('width').substring(0, d3.select("body").style('width').length-2));
  vars.width = vars.width - vars.margin.left - vars.margin.right;
  vars.height = vars.width * vars.ratio;

  // List of events
  vars.dispatch = d3.dispatch('init', 'start', 'finish', 'end', 'highlightOn', 'highlightOut', 'selection', 'resize', 'clearAnimations', 'timeUpdate');

  vars.evt.register('start', function(d) {
    if(vars.dev) { console.log("[vars.evt.call] start rendering"); }
    d3.select(vars.container).selectAll(".message").style('display', 'block').text('Loading...');
  });

  vars.evt.register('finish', function(d) {
    if(vars.dev) { console.log("[vars.evt.call] end rendering"); }
    if(utils.check_data_display()) {
      d3.select(vars.container).selectAll(".message").style('display', 'none');
    }
  });

  // Default events
  d3.select(window).on('resize', function(d) {
    vars.evt.call("resize", d);
  });

  vars.evt.register("highlightOn", function(d) {
    d.__highlighted = true;
    d.__redraw = true;
  });

  vars.evt.register("highlightOn", function(d) {
    if(vars.dev) { console.log("[vars.evt.call] selection"); }
  });

  vars.evt.register("highlightOut", function(d) {
    d.__highlighted = false;
    d.__redraw = true;

    // Temporary settings to prevent chart redraw for product space tooltip
    d3.select(vars.container).selectAll(".items__mark__text").remove();
    d3.select(vars.container).selectAll(".items__mark__div").remove();

  });

  vars.evt.register("timeUpdate", function(new_time) {
    if(vars.dev) { console.log("[vars.evt.call] timeUpdate"); }

    vars.time.current_time = new_time;

    d3.select(vars.container).call(vars.this_chart);

  });
