
    selection.each(function(d) {

      // Trigger the previous visualization updates (e.g. to clear animations)
      if(vars.init || vars.refresh) {
        vars.evt.call("clearAnimations", null);
        vars.evt.call('start', null);
      }

      // If no data, display a user friendly message telling
      if(!utils.check_data_display() && vars.init) {

        d3.select(vars.container).selectAll(".message")
          .style('display', 'block')
          .text(vars.locales[vars.lang]['no-data']);

        vars.svg.style('visibility', 'hidden');

      } else {

        // There is no data to display so we show a message
        vars.svg.style('visibility', 'visible');
      }

      switch(vars.type) {

        case 'raw':

        // Display the current dataset
         vars.svg.append("span")
             .html(JSON.stringify(vars.new_data));

        break;
