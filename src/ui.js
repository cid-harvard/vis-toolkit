
      // FUNCTIONS TO CREATE UI ELEMENTS
      // Those functions are companion to the charts, not required

      if(vars.ui.default) {

        // BUILDING THE UI elements
        d3.select(vars.container).selectAll(".break").data([vars.var_id])
          .enter()
            .append("p")
            .attr("class", "break");

        if(vars.var_group) {

          unique_categories = d3.set(vars.new_data
            .filter(function(d) {
              return typeof vars.accessor_data(d) !== 'undefined';
            })
            .map(function(d) { return vars.accessor_data(d)[vars.var_group]; })).values();

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
                var count = vars.new_data
                .filter(function(d) {
                  return typeof vars.accessor_data(d) !== 'undefined';
                })
                .filter(function(e, j) { return vars.accessor_data(e)[vars.var_group] == d; }).length;
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

                       vars.aggregate = d;
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

      if(vars.time.var_time !== null) {

        var label_slider = d3.select(vars.container)
          .selectAll(".slider")
          .data([vars.var_id])
        .enter()
          .append("label")
          .attr("class", "slider");

        // Assuming we have continuous years
        // unique_years = d3.set(vars.data.map(function(d) { return d[vars.time.var_time];})).values();

        all_values = vars.data.map(function(d) { return d[vars.time.var_time];});

         var u = {};
        unique_years = [];
         for(var i = 0, l = all_values.length; i < l; ++i){
            if(u.hasOwnProperty(all_values[i])) {
               continue;
            }
            unique_years.push(all_values[i]);
            u[all_values[i]] = 1;
         }

        // TODO: find time range
        label_slider.append("input")
                      .attr("type", "range")
                      .attr("class", "slider-random")
                      .property("min", d3.min(unique_years))
                      .property("max", d3.max(unique_years))
                      .property("value", vars.time.current_time)
                      .attr("step", 1)
                      .on("input", function() {
                        vars.redraw_all = true;
                        vars.evt.call("timeUpdate", +this.value);
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

                      delete vars.set['__aggregated'];
                      vars.refresh = true;
                      d3.select(vars.container).call(vars.this_chart)

                    } else if(d === vars.var_group) {

                      vars.set['__aggregated'] = false;
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



      d3.select(vars.container).selectAll(".toggleLanguage").data(["toggleLanguage"]).enter().append("button")
               .attr("type", "button")
               .attr("class", "toggleLanguage")
               .on("click", function() {

                  // Then move groups to their grid position
                  // visualization.param("refresh", true);

                  var new_lang = vars.var_text == "name_en" ? "name_es" : "name_en";

                  var new_lang_param = vars.var_text == "name_en" ? "en_US" : "es_ES";

                  vars.this_chart.params({
                    var_text: new_lang,
                    lang: new_lang_param
                  });

                  // visualization.params().refresh = true;
                  // visualization.params().init = true;

                  d3.select(vars.container.call(vars.this_chart));

                  d3.select(this).html(function() {
                    return "Current language: " + vars.lang;
                  })

                })
               .html("Current language: " + vars.lang);

    }

    // Legend for product space
    if(vars.ui.legend) {

      var width = vars.width;
      var legend_offset = vars.width / 4;

      var nb_color = 3; // visualization.params().color.domain().length

      var items_mark_color = [vars.locales[vars.lang]['low'], "", vars.locales[vars.lang]['high']];
      var x_offset = legend_offset / nb_color;

      var legend =  d3.select(vars.container).selectAll(".svg_legend").data(["legend"]);

      legend.enter()
        .append("svg")
        .attr("class", "svg_legend")
        .attr("width", vars.width)
        .attr("height", 100)
        .append("g")
        .attr("transform", "translate(20, 0)")
        .attr("class", "legend_group")

      var legend_items_mark_text = legend.selectAll(".legend_items_mark_text")
          .data([vars.locales[vars.lang]['complexity']]);

      legend_items_mark_text.enter().append("g")
          .attr("class", "legend_items_mark_text")
          .attr("transform", function(d, i) { return "translate(" + (legend_offset / 2) + ", 12)"; })
          .append('text')
          .style("text-anchor", 'end')
          .attr("transform", "translate(-10, 0)");

      legend_items_mark_text.select('text').text(function(d) { return d; });

      var legend_items_mark_color = legend.selectAll(".legend_items_mark_color")
          .data(items_mark_color);

      var legend_items_mark_color_enter = legend_items_mark_color.enter().append("g")
          .attr("class", "legend_items_mark_color")
          .attr("transform", function(d, i) { return "translate(" + (legend_offset / 2 + i * x_offset) + ", 0)"; })
          .on('mouseover', function(_, i) {
            var interval = vars.color.domain()[1] - vars.color.domain()[0];
            if(i == 0) {
              vars.svg.selectAll('.items__mark__circle').filter(function(d) {
                return d[vars.var_color] > interval / 3;
              }).style('display', 'none');
            } else if(i == 1) {
              vars.svg.selectAll('.items__mark__circle').filter(function(d) {
                return (d[vars.var_color] <= interval / 3) || (d[vars.var_color] > 2 * interval / 3);
              }).style('display', 'none');
            } else {
              vars.svg.selectAll('.items__mark__circle').filter(function(d) {
                return d[vars.var_color] <= 2 * interval / 3;
              }).style('display', 'none');
            }
          })
          .on('mouseleave', function(d, i) {
            vars.svg.selectAll('.items__mark__circle').style('display', 'block');
          })

      legend_items_mark_color_enter.append("rect")
          .attr("x", 0)
          .attr("width", x_offset)
          .attr("height", 18)
          .style("fill", function(d, i) {
            if(i === 0) {
              return vars.color(vars.color.domain()[0])
            } else if(i === 1) {
              return vars.color((vars.color.domain()[1] - vars.color.domain()[0]) / 2);
            } else {
              return vars.color(vars.color.domain()[1]);
            }

          });

      legend_items_mark_color_enter.append("text")
          .attr("x", 5)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "start");

      legend_items_mark_color.select('text').text(function(d) { return d; });

      // Item marks and different stylings
      // Export / Non-export
      var data_items_mark = [vars.locales[vars.lang]['export'], vars.locales[vars.lang]['non-export']];
      x_offset = legend_offset / nb_color;

      var legend_items_mark = legend.selectAll(".legend_items_mark")
          .data(data_items_mark);

      var legend_items_mark_enter = legend_items_mark.enter().append("g")
          .attr("class", "legend_items_mark")
          .attr("transform", function(d, i) { return "translate(" + (1.75 * legend_offset + i * x_offset * 1.5) + ", 0)"; })
          .on('mouseover', function(d, i) {
            if(i == 0) {
              vars.svg.selectAll('.items__mark__circle').filter(function(d) {
                return d['export_rca'] <= 1;
              }).style('display', 'none');
            } else {
              vars.svg.selectAll('.items__mark__circle').filter(function(d) {
                return d['export_rca'] > 1;
              }).style('display', 'none');
            }
          })
          .on('mouseleave', function(d, i) {
            vars.svg.selectAll('.items__mark__circle').style('display', 'block');
          })

      legend_items_mark_enter.append("circle")
          .attr("cx", 10)
          .attr("cy", 10)
          .attr("r", 8)
          .attr("class", "items__mark__circle")
          .style("fill", function(d, i) { return vars.color(0); })
          .classed("selected", function(d, i) {
            return i == 0;
          })
          .style("stroke-width", "5");

      legend_items_mark_enter.append("text")
          .attr("x", 25)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "start");

      legend_items_mark.select('text').text(function(d) { return d;});

      // Connect marks and different stylings
      var connect_mark = [vars.locales[vars.lang]['similarity_link']];

      var width = 100;
      x_offset = legend_offset / vars.color.domain().length;

      var legend_connect_mark = legend.selectAll(".legend_connect_mark")
          .data(connect_mark);

      var legend_connect_mark_enter = legend_connect_mark.enter().append("g")
          .attr("class", "legend_connect_mark")
          .attr("transform", function(d, i) { return "translate(" + (3 * legend_offset + i * x_offset) + ", 0)"; })
          .on('mouseover', function() {
            vars.svg.selectAll('.mark__group > circle').style('display', 'none');
          })
          .on('mouseleave', function() {
            vars.svg.selectAll('.mark__group > circle').style('display', 'block');
          })

      legend_connect_mark_enter.append("line")
          .attr("x1", 0)
          .attr("x2", 20)
          .attr("y1", 20)
          .attr("y2", 0)
          .attr("class", "connect__line")
          .style("stroke-width", "4");

      legend_connect_mark_enter.append("text")
          .attr("x", 20)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "start");

      legend_connect_mark.text(function(d) { return d;});

    }

  });


    vars.evt.call('finish', null);
}
