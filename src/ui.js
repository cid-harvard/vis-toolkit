      }

      if(vars.ui) {

        // BUILDING THE UI elements
        d3.select(vars.container).selectAll(".break").data([vars.var_id])
          .enter()
            .append("p")
            .attr("class", "break");

        if(vars.var_group) {

          unique_categories = d3.set(vars.new_data.map(function(d) { return d[vars.var_group]; })).values();

          label_checkboxes = d3.select(vars.container).selectAll(".checkboxes").data(unique_categories)
            .enter()
              .append("label")
              .attr("class", "checkboxes")

          label_checkboxes.append("input")
              .attr("type", "checkbox")
              .attr("value", function(d) { return d; })
              .property("checked", false)
              .on("change", function(d) { 

                vistk.utils.update_filters(this.value, this.checked);
                /*
                vars.data = vars.data.filter(function(e, j) {
                  console.log(e[vars.var_group], d)
                  return e[vars.var_group] == d;
                })
                */

                d3.select("#viz").call(visualization);

              })

          label_checkboxes.append("span")
              .html(function(d) { 
                var count = vars.new_data.filter(function(e, j) { return e[vars.var_group] == d; }).length;
                return d + " (" + count + ")";
              })

        }

        if(typeof vars.var_id == "object") {

          var label_radios = d3.select(vars.container).selectAll(".aggregations").data(vars.var_id)
            .enter()
              .append("label")
              .attr("class", "aggregations")

          // TODO: find levels of aggregation
          label_radios.append("input")
                     .attr("type", "radio")
                     .attr("id", "id")  
                     .attr("value", function(d) { return d; })
                     .attr("name", "radio-nest")
                     .property("checked", true)
                     .on("change", function(d) { 

                       vars.aggregate=d;
                       d3.select("#viz").call(visualization);

                     });

          label_radios.append("span")
              .html(function(d) { 
  //              var count = vars.data.filter(function(e, j) { return e[vars.var_group] == d; }).length;
                // TODO
                var count = "";
                return d + " (" + count + ")";
              });

        }

        if(vars.var_time) {

          var label_slider = d3.select(vars.container).selectAll(".slider").data([vars.var_id])
            .enter()
              .append("label")
              .attr("class", "slider")

          // Assuming we have continuous years
          unique_years = d3.set(vars.data.map(function(d) { return d[vars.var_time];})).values();

          // TODO: find time range
          label_slider.append("input")
                        .attr("type", "range")
                        .attr("class", "slider-random")
                        .property("min", d3.min(unique_years))
                        .property("max", d3.max(unique_years))
                        .property("value", vars.current_time)
                        .attr("step", 1)
                        .on("input", function() {
                          vars.current_time = +this.value;
                          d3.select("#viz").call(visualization);
                        })
                        .style("width", "100px");

        }

     if(vars.ui.options) {

      // Currently options for dotplot
      // ..but should be made generic enough to work with any chart

      // Additional options below
      d3.select("#viz").append("select")
        .attr("id", "select_var_x")
        .on("change", function(d) {

          visualization.params({
            var_x: this.value
          })
          d3.select("#viz").call(visualization)

        })
        .selectAll("option")
        .data(d3.keys(vars.data[0]))
      .enter()
        .append("option")
        .attr("value", function(d) { return d; })
        .html(function(d) { return d; })

        var label_radios = d3.select("#viz").selectAll(".aggregations").data(["index", "linear"])
          .enter()
            .append("label")
            .attr("class", "aggregations")

        // TODO: find levels of aggregation
        label_radios.append("input")
                   .attr("type", "radio")
                   .attr("id", "id")  
                   .attr("value", function(d) { return d; })
                   .attr("name", "radio-nest")
                   .property("checked", true)
                   .on("change", function(d) { 
                      visualization.params({
                        x_type: d
                      })
                      d3.select("#viz").call(visualization)
                   });

        label_radios.append("span")
            .html(function(d) { 
              return d ;
            });

     }

      // Highlight 
      var label_litems = d3.select(vars.container).selectAll(".items").data([vars.var_id])
        .enter()
          .append("label")
          .attr("class", "items")

      label_litems.append("select")
        .attr("id", "select_items")
        .style("width", vars.width/2)
        .on("change", function(d, i) {

          // Focus on a sepecifc item
          var id_focus = vars.new_data.map(function(d) {return d[vars.var_text]; }).indexOf(this.value);
          visualization.focus(1);

          d3.select("#viz").call(visualization);

        })
        .selectAll("option")
        .data(vars.new_data)
      .enter()
        .append("option")
        .attr("value", function(d) { return d[vars.var_text]; })
        .html(function(d) { return d[vars.var_text]; });

      d3.select(vars.container).selectAll(".clearSelection").data([vars.var_id]).enter().append("button")
             .attr("type", "button")
             .attr("class", "clearSelection")
             .on("click", function() {

                vars.svg.selectAll(".selected").classed("selected", false);
                vars.selection = [];
                d3.select("#viz").call(visualization);

              })
             .html("Clear selection");

      d3.select(vars.container).selectAll(".clearHighlight").data([vars.var_id]).enter().append("button")
             .attr("type", "button")
             .attr("class", "clearHighlight")
             .on("click", function() {

                vars.svg.selectAll(".highlighted").classed("highlighted", false);
                vars.highlight = [];                
                d3.select("#viz").call(visualization);

              })
             .html("Clear highlight");

    }

  });
}

/* LOADING DATASETS

      var label_loader = d3.select(vars.container).selectAll(".loader").data([vars.var_id])
        .enter()
          .append("label")
          .attr("class", "loader")

      label_loader.append("select")
        .attr("id", "select_var_x")
        .on("change", function(d) {
          vars.var_x = this.value;
          ds.update(vars.current_view);
        })
        .selectAll("option")
        .data(["../data/exports_2012.json"])
      .enter()
        .append("option")
        .attr("value", function(d) { return d; })
        .html(function(d) { return d; })
*/
