      case "geomap":


        // REGISTER EVENTS
        vars.evt.register("highlightOn", function(d) { 

          console.log(d);

        });
        vars.evt.register("highlightOut", function(d) { });
        vars.evt.register("selection", function(d) { });
        vars.evt.register("resize", function(d) { });

        // http://techslides.com/demos/d3/d3-world-map-colors-tooltips.html
        var projection = d3.geo.mercator()
                        .translate([vars.width/2, vars.height/2])
                        .scale(100);

        vars.path = d3.geo.path()
            .projection(projection);

        tooltip = d3.select(vars.container).append("div")
            .attr("class", "tooltip");

        vars.gSvg = vars.svg
            .call(d3.behavior.zoom()
            .on("zoom", redraw))
            .append("g");

        function redraw() {
            vars.gSvg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }

        queue()
            .defer(d3.json, "../data/world-110m.json")
            .defer(d3.tsv, "../data/world-country-names.tsv")
            .await(ready);

        function ready(error, world, names) {

          countries = topojson.object(world, world.objects.countries).geometries,
              neighbors = topojson.neighbors(world, countries),
              i = -1,
              n = countries.length;

          countries.forEach(function(d) { 

            // Retrieve the country name based on its id
            d._name = names.filter(function(n) { return d.id == n.id; })[0].name; 

            // TODO: should merge on a more reliable join (e.g. 2-char)
            d.data = vars.new_data.filter(function(n) { return d._name == n.name; })[0];

          });

          // TODO: see above
          countries = countries.filter(function(d) {
            return typeof d.data != "undefined";
          });


          // PRE-UPDATE
          var gItems = vars.svg.selectAll(".mark__group")
                           .data(countries, function(d, i) { return i; });

          // ENTER

          // Add a group for marks
          var gItems_enter = gItems.enter()
                          .append("g")
                          .each(vistk.utils.items_group);

          // Add a graphical mark
          gItems_enter.each(vistk.utils.items_mark)
              .select("path")
              .attr("title", function(d,i) { return d.name; });

          // We override the current color scale to make it linear
          vars.color = d3.scale.linear()
            .domain([d3.min(vars.new_data, function(d) { return d[vars.var_color]; }), d3.max(vars.new_data, function(d) { return d[vars.var_color]; })])
            .range(["red", "green"]);
/*
          //Show/hide tooltip
          country_enter
                .on("mouseenter", function(d, i) {
                  vars.dispatch.highlightOn(d);
                  tooltip
                   .classed("hidden", false)
                })
                .on("mousemove", function(d,i) {

                  var mouse = d3.mouse(vars.gSvg.node()).map(function(d) { return parseInt(d); });

                  tooltip
                    .attr("style", "left:"+(mouse[0]+25)+"px;top:"+mouse[1]+"px")
                    .html(d._name);

                })
                .on("mouseleave",  function(d,i) {
                  console.log("OUT")
                  vars.dispatch.highlightOut(d);             
                  tooltip.classed("hidden", true);
                });

            country_exit = country.exit().style({"display": "none"});
*/
          }

          break;
