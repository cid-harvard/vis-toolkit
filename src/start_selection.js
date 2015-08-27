
    selection.each(function(d) {

      // Trigger the previous visualization updates (e.g. to clear animations)
      vars.evt.call("clearAnimations", null); 

      switch(vars.type) {

        case 'raw':

        // Display the current dataset
         vars.svg.append("span")
             .html(JSON.stringify(vars.new_data));

        break;
