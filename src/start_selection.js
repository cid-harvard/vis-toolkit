
    selection.each(function(d) {

      // Trigger the previous visualization updates (e.g. to clear animations)
      vars.evt.call("clearAnimations", null); 

      switch(vars.type) {

        case 'undefined':

        // Basic dump of the data we have
         vars.svg.append("span")
          .html(JSON.stringify(vars.data));

        break;
