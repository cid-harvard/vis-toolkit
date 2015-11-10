
    selection.each(function(d) {

      // Trigger the previous visualization updates (e.g. to clear animations)
      vars.evt.call("clearAnimations", null);
      vars.evt.call('start', null);

      // If no data, display a user friendly message telling
      if(!utils.check_data_display()) {

        d3.select(vars.container).selectAll(".message")
          .style('display', 'block')
          .text(vars.locales[vars.lang]['no-data']);

        vars.svg.style('visibility', 'hidden');

      } else {
        vars.svg.style('visibility', 'visible');
      }

      switch(vars.type) {

        case 'raw':

        // Display the current dataset
         vars.svg.append("span")
             .html(JSON.stringify(vars.new_data));

        break;
