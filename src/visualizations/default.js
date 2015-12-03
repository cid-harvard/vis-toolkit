      default:

        if(typeof vars.default_params[vars.type] === "undefined") {
           console.log("No params for chart " + vars.type);
        }

        if(vars.dev) { console.log("[init.vars.default]", vars); }

        // If there is an existing configuration
        if(vars.list.type.indexOf(vars.type) >= 0) {

          var scope = {};

          scope = vars.default_params[vars.type](vars);

          vars = vistk.utils.merge(vars, scope);

          // Disabled since merging is more complex than that
          //if(vars.type !== "stacked")
          //  vars.items = vistk.utils.merge(vars.items, vars.user_vars.items);

          // Enabling a more simple option
          if(typeof vars.user_vars.items !== "undefined") {
            vars.items = vars.user_vars.items;
          }

        } else {

          // LOAD CHART PARAMS
          vars = vistk.utils.merge(vars, vars.default_params[vars.type]);

          // LOAD USER PARAMS
          vars.items = vistk.utils.merge(vars.items, vars.user_vars.items);

        }

        vars.svg.call(utils.draw_chart, vars, vars.new_data);

      break;

    }
