      case 'table':

       vars.svg.select("table").remove();

       function row_data(row, i) {

        // Creates an array first of the size of the desired rows
        // Then fills the array with the appropriate data
        // Applies some formatting depending on the index of the column
        return vars.columns.map(function(column, i) {
          
          // console.log( vars.accessor_year(row)[vars.columns[i]], i, vars.columns, row["group"], row[vars.columns[i]])

           return row[column];      
/*
          if(i==0 || i==1) {

            return row[column];      

           } else if(i == 4) {

            var million_scale = 1;
            var population = vars.accessor_year(row)[vars.columns[i]];

            return d3.format(",")(population);//+d3.formatPrefix(million_scale).symbol;
          
           } else if(i == 3) {

            return parseFloat(vars.accessor_year(row)[vars.columns[i]]).toFixed(1);

          } else if(i == 2) {

            var gdp = vars.accessor_year(row)[vars.columns[i]];
            var million_scale = 1000000000;
            return d3.round(d3.formatPrefix(million_scale, 1).scale(gdp), 1)+d3.formatPrefix(million_scale).symbol;
          
          // Extra attribute that we manually added
          } else {

            return vars.var_year;

          }
          */
        });
      }

      vars.evt.register("highlightOn", function(d) {
        vars.svg.selectAll("tr")
                .filter(function(e, j) { return e === d; })
                .style("background-color", "#F3ED86");
      });

      vars.evt.register("highlightOut", function(d) {
        tbody.selectAll("tr")
          .style("background-color", null);
      });

      function create_table(data) {

        if(vars.debug) { console.log("[create_table]"); }

        var table = vars.svg.append("table").style("overflow-y", "scroll"),
          thead = table.append("thead").attr("class", "thead");
        tbody = table.append("tbody");

        if(vars.title != null) {

          var title = vars.title;

          if(typeof vars.current_time !== "undefined") {
            title += " (" + vars.time.current_time + ")";
          }

          table.append("caption")
            .html(title);
        }

        thead.append("tr").selectAll("th")
          .data(vars.columns)
        .enter()
          .append("th")
          .text(function(d) { return d; })
          .on("click", function(header, i) {

            click_header(header);
            paint_zebra_rows(tbody.selectAll("tr.row"));

          });

        var rows = tbody.selectAll("tr.row")
          .data(data)
        .enter()
          .append("tr")
          .attr("class", "row");

        var cells = rows.selectAll("td")
          .data(row_data)
        .enter()
          .append("td")
          .text(function(d) { return d; })
          .on("mouseover", function(d, i) {
            vars.evt.call("highlightOn", d3.select(this.parentNode).data()[0]);
          })
          .on("mouseout", function(d) {
            vars.evt.call("highlightOut", d3.select(this.parentNode).data()[0]);
          })
          .on("click", function(d) {

            var data = d3.select(this.parentNode).data()[0];
            var index = vars.selection.indexOf(data);

            if(index <0) {
              vars.selection.push(data);
            } else {
              vars.selection.splice(index, 1);
            }

          });

        }

       // Function that orders the rows of the table
        function sort_by(header) {

          if(vars.debug) { console.log("[sort_by]", header); }

          vars.sort_by.column = header;
          vars.sort_by.is_sorted = !vars.sort_by.is_sorted;
/*
          if(vars.aggregate == 'continent') {
            vars.accessor_year = accessor_year_agg;
          } else {
            vars.accessor_year = accessor_year;
          }
  */
          d3.select(".thead").selectAll("th").attr("id", null);

          // For those specific columns, we are sorting strings
          if (header === "continent" || header === "name") {

            tbody.selectAll("tr").sort(function(a, b) {
              var ascending = d3.ascending(a[header], b[header]);
              return vars.sort_by.is_sorted ? ascending : - ascending;
            });

          // For the others, we sort numerical values
          } else {

            tbody.selectAll("tr").sort(function(a, b) {

              a = vars.accessor_year(a)[header];
              b = vars.accessor_year(b)[header];
              var ascending =  a > b ? 1 : a === b ? 0 : -1;

              return vars.sort_by.is_sorted ? ascending : - ascending;
            });

          }
        }


        function click_header(header) {

          var this_node = d3.selectAll("th").filter(function(d) {
              return d === header;
            });

          var is_sorted = (this_node.attr("class") === "sorted");

          d3.selectAll("th").text(function(d) {
            return d.replace("▴", "");
          });

          d3.selectAll("th").text(function(d) {
            return d.replace("▾", "");
          });

          if(!is_sorted) {
            this_node.classed("sorted", true)
                      .text(this_node.text()+"▾");
          }
          else {
            this_node.classed("sorted", false)
                     .text(this_node.text()+"▴");
          }

          if(vars.dev) { console.log("[click_header]", is_sorted); }

         // vars.sort_by.is_sorted = !vars.sort_by.is_sorted;
          sort_by(header);

        }

        function paint_zebra_rows(rows) {
          rows.filter(function() {
            return d3.select(this).style("display") !== "none";
          })
            .classed("odd", function(d, i) { return (i % 2) === 0; });
        }

        // If no column have been specified, take all columns
        // vars.columns = d3.keys(vars.data[0])

        // Basic dump of the data we have
        create_table(vars.new_data);

        paint_zebra_rows(tbody.selectAll("tr.row"));
        // Now update the table

        break;