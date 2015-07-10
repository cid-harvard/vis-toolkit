      }

      if(vars.ui.default) {

        // BUILDING THE UI elements
        d3.select(vars.container).selectAll(".break").data([vars.var_id])
          .enter()
            .append("p")
            .attr("class", "break");

        if(vars.var_group) {

          unique_categories = d3.set(vars.new_data.map(function(d) { return vars.accessor_data(d)[vars.var_group]; })).values();

          label_checkboxes = d3.select(vars.container).selectAll(".checkboxes").data(unique_categories)
            .enter()
              .append("label")
              .attr("class", "checkboxes");

          label_checkboxes.append("input")
              .attr("type", "checkbox")
              .attr("value", function(d) { return d; })
              .property("checked", function(d) {
                  return vars.filter.indexOf(d) > -1;
               })
              .on("change", function(d) { 

                utils.update_filters(this.value, this.checked);
                vars.refresh = true;
                d3.select(vars.container).call(vars.this_chart);

              });

          label_checkboxes.append("span")
              .html(function(d) { 
                var count = vars.new_data.filter(function(e, j) { return vars.accessor_data(e)[vars.var_group] == d; }).length;
                return d + " (" + count + ")";
              });

        }

        if(typeof vars.var_id == "object") {

          var label_radios = d3.select(vars.container).selectAll(".aggregations").data(vars.var_id)
            .enter()
              .append("label")
              .attr("class", "aggregations");

          // TODO: find levels of aggregation
          label_radios.append("input")
                     .attr("type", "radio")
                     .attr("id", "id")  
                     .attr("value", function(d) { return d; })
                     .attr("name", "radio-nest")
                     .property("checked", true)
                     .on("change", function(d) { 

                       vars.aggregate=d;
                       vars.refresh = true;
                       d3.select(vars.container).call(vars.this_chart);

                     });

          label_radios.append("span")
              .html(function(d) { 
  //              var count = vars.data.filter(function(e, j) { return e[vars.var_group] == d; }).length;
                // TODO
                var count = "";
                return d + " (" + count + ")";
              });

        }

      if(vars.time) {

        var label_slider = d3.select(vars.container)
          .selectAll(".slider")
          .data([vars.var_id])
        .enter()
          .append("label")
          .attr("class", "slider");

        // Assuming we have continuous years
        unique_years = d3.set(vars.data.map(function(d) { return d[vars.time.var_time];})).values();

        // TODO: find time range
        label_slider.append("input")
                      .attr("type", "range")
                      .attr("class", "slider-random")
                      .property("min", d3.min(unique_years))
                      .property("max", d3.max(unique_years))
                      .property("value", vars.time.current_time)
                      .attr("step", 1)
                      .on("input", function() {
                        vars.time.current_time = +this.value;
                        vars.refresh = true;
                        d3.select(vars.container).call(vars.this_chart);
                      })
                      .style("width", "100px");

      }

     if(vars.x_scale.length > 0) {

        // Additional options below
        d3.select(vars.container).selectAll("#select_var_x").data([vars.var_id])
          .enter()
            .append("select")
            .attr("id", "select_var_x")
            .on("change", function(d) {

              vars.this_chart.params({
                var_x: this.value
              })
              d3.select(vars.container).call(vars.this_chart)

            })
            .selectAll("option")
            .data(d3.keys(vars.data[0]))
          .enter()
            .append("option")
            .attr("value", function(d) { return d; })
            .html(function(d) { return d; })

            var label_radios = d3.select(vars.container).selectAll(".aggregations").data(["index", "linear"])
              .enter()
                .append("label")
                .attr("class", "aggregations");

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
                          d3.select(vars.container).call(vars.this_chart)
                       });

            label_radios.append("span")
                .html(function(d) { 
                  return d ;
                });

     }

     if(vars.ui.options) {

        var label_radios = d3.select(vars.container).selectAll(".aggregations_radio").data([vars.time.var_time, vars.var_group, vars.var_id])
          .enter()
            .append("label")
            .attr("class", "aggregations_radio")

        // TODO: find levels of aggregation
        label_radios.append("input")
                   .attr("type", "radio")
                   .attr("id", "id")  
                   .attr("value", function(d) { return d; })
                   .attr("name", "radio-nest")
                   .property("checked", function(d) { return vars.aggregate === d; })
                   .on("change", function(d) { 

                    if(d === vars.var_id) {

                      vars.set = [];
                      vars.refresh = true;
                      d3.select(vars.container).call(vars.this_chart)

                    } else if(d === vars.var_group) {

                      vars.this_chart.set('__aggregated', false);
                      vars.refresh = true;
                      d3.select(vars.container).call(vars.this_chart)

                    }

                   });

        label_radios.append("span")
            .html(function(d) { 
              return d ;
            });

     }

      // Sorting option
      if(vars.ui.sort) {

        d3.select(vars.container).selectAll(".label_sort").data([vars.ui.sort])
          .enter()
            .append("span")
            .classed("label_sort", true)
            .html("<br>Sort by")

        var label_radios = d3.select(vars.container).selectAll(".sort_radio").data(vars.ui.sort)
          .enter()
            .append("label")
            .attr("class", "sort_radio")

        // TODO: find levels of aggregation
        label_radios.append("input")
                   .attr("type", "radio")
                   .attr("id", "id")  
                   .attr("value", function(d) { return d; })
                   .attr("name", "radio-nest")
                   .property("checked", function(d) {
                      return d == vars.var_sort;
                   })
                   .on("click", function(d) { 

                     if(vars.var_sort == d)
                       vars._user_vars.var_sort_asc = !vars._user_vars.var_sort_asc;

                      vars._user_vars.var_sort = d;

                      vars.refresh = true;

                      d3.select(vars.container).call(vars.this_chart);
                   });

        label_radios.append("span")
            .html(function(d) { 
              return d ;
            });
      }

        d3.select(vars.container).selectAll(".label_highlight").data([vars.var_id])
          .enter()
            .append("span")
            .classed("label_highlight", true)
            .html("<br>Select/highlight");

      // Highlight 
      var label_litems = d3.select(vars.container).selectAll(".items").data([vars.var_id])
        .enter()
          .append("label")
          .attr("class", "items");

      label_litems.append("select")
        .attr("id", "select_items")
        .style("width", vars.width/2)
        .on("change", function(d, i) {

          // Focus on a sepecifc item
          var id_focus = vars.new_data.map(function(d) {return d[vars.var_text]; }).indexOf(this.value);
          vars.this_chart.focus(1);

          d3.select(vars.container).call(vars.this_chart);

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
                d3.select(vars.container).call(vars.this_chart);

              })
             .html("Clear selection");

      d3.select(vars.container).selectAll(".clearHighlight").data([vars.var_id]).enter().append("button")
             .attr("type", "button")
             .attr("class", "clearHighlight")
             .on("click", function() {

                vars.svg.selectAll(".highlighted").classed("highlighted", false);
                vars.highlight = [];                
                d3.select(vars.container).call(vars.this_chart);

              })
             .html("Clear highlight");

    }


    // Sorting option
    if(vars.ui.legend) {

      var width = vars.width;
      var legend_offset = vars.width / 3;

      var legend =  d3.select(vars.container).selectAll(".svg_legend").data(["legend"]).enter()
        .append("svg")
        .attr("class", "svg_legend")
        .attr("width", vars.width)
        .attr("height", 100)

      var nb_color = 3; // visualization.params().color.domain().length

      var items_mark_color = ["Low", "", "High"];
      var x_offset = legend_offset / nb_color;

      var legend_items_mark_color = legend.selectAll(".legend_items_mark_color")
          .data(items_mark_color)
        .enter().append("g")
          .attr("class", "legend_items_mark_color")
          .attr("transform", function(d, i) { return "translate(" + (i * x_offset) + ", 0)"; });

      legend_items_mark_color.append("rect")
          .attr("x", 0)
          .attr("width", x_offset)
          .attr("height", 18)
          .style("fill", function(d, i) { return vars.color(i); });

      legend_items_mark_color.append("text")
          .attr("x", 5)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "start")
          .text(function(d) { return d; });

      // Item marks and different stylings
      // Export / Non-export
      var items_mark = ["Export", "Non-Export"];
      x_offset = legend_offset / nb_color;

      var legend_items_mark = legend.selectAll(".legend_items_mark")
          .data(items_mark)
        .enter().append("g")
          .attr("class", "legend_items_mark")
          .attr("transform", function(d, i) { return "translate(" + (legend_offset + i * x_offset) + ", 0)"; })
          .on("mouseover", function(d) {
            // Filter by attribute
          });

      legend_items_mark.append("circle")
          .attr("cx", 10)
          .attr("cy", 10)
          .attr("r", 8)
          .attr("class", "items__mark__circle")
          .classed("highlighted", function(d, i) {
            return i == 0;
          })
          .style("stroke-width", "5");


      legend_items_mark.append("text")
          .attr("x", 25)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "start")
          .text(function(d) { return d;});

      // Connect marks and different stylings
      var connect_mark = ["Similarity link"];

      var width = 100;
      x_offset = legend_offset / vars.color.domain().length;

      var legend_connect_mark = legend.selectAll(".legend_connect_mark")
          .data(connect_mark)
        .enter().append("g")
          .attr("class", "legend_connect_mark")
          .attr("transform", function(d, i) { return "translate(" + (2 * legend_offset + i * x_offset) + ", 0)"; });

      legend_connect_mark.append("line")
          .attr("x1", 0)
          .attr("x2", 20)
          .attr("y1", 20)
          .attr("y2", 0)
          .attr("class", "connect__line")
          .style("stroke-width", "4");

      legend_connect_mark.append("text")
          .attr("x", 20)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "start")
          .text(function(d) { return d;});

    }

  });
}
