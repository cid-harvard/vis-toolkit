      case "geomap":

        vars.params = {

          x_scale: [{
              name: "linear",
              func: d3.scale.linear()
                      .range([vars.margin.left, vars.width-vars.margin.left-vars.margin.right])
                      .domain(d3.extent(vars.new_data, function(d) { return d[vars.var_x]; })).nice()
            }, {
              name: "linear_sparkline",
              func: d3.scale.linear()
                      .range([0, 100])
                      .domain(d3.extent(vars.data, function(d) { return d[vars.time.var_time]; })).nice()
            }
          ],

          x_ticks: 10,

          y_scale: [{
              name: "linear",
              func: d3.scale.linear()
                      .range([vars.height-vars.margin.top-vars.margin.bottom, vars.margin.top])
                      .domain(d3.extent(vars.data, function(d) { return d[vars.var_y]; })).nice(),
            }, {
              name: "linear_sparkline",
              func: d3.scale.linear()
                      .range([100, 0])
                      .domain(d3.extent(vars.data, function(d) { return d[vars.var_y]; })).nice(),
            }
          ],

          r_scale: d3.scale.linear()
                      .range([10, 30])
                      .domain(d3.extent(vars.new_data, function(d) { return d[vars.var_r]; })),

          connect: {
            type: null
          },

          items: [{
            attr: "country",
            marks: [{
                type: "circle",
                rotate: "0",
                radius: 5                
              }, {
                type: "text",
                rotate: "30",
                translate: null
              }]
            }, {
            attr: "continent",
            marks: [{
                type: "circle",
                rotate: "0",
                radius: 20
                // TODO: add specific r_scale
            }, {
              type: "arc"
                // TODO: add specific r_scale              
            }, {
                type: "text",
                rotate: "-30",
                translate: null
                // TODO: move away according to r_scale                
            }]
          }],

          connect: [{
            attr: vars.time.var_time,
            marks: [{
                type: "path",
                rotate: "0",
                func: d3.svg.line()
                     .interpolate(vars.interpolate)
                     .x(function(d) { return vars.x_scale[1]["func"](d[vars.time.var_time]); })
                     .y(function(d) { return vars.y_scale[1]["func"](d[vars.var_y]); }),
              }]
          }]

        };

        // REGISTER EVENTS
        vars.evt.register("highlightOn", function(d) { });
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

        // We override the current color scale to make it linear
        vars.color = d3.scale.linear()
          .domain([d3.min(vars.new_data, function(d) { return d[vars.var_color]; }), d3.max(vars.new_data, function(d) { return d[vars.var_color]; })])
          .range(["red", "green"]);

        function redraw() {
            vars.gSvg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }

        queue()
            .defer(d3.json, "../shapefiles/world/world-110m.json")
            .defer(d3.tsv, "../data/world-country-names.tsv")
            .await(ready);

        function ready(error, world, names) {

          var countries = topojson.object(world, world.objects.countries).geometries,
              neighbors = topojson.neighbors(world, countries),
              i = -1,
              n = countries.length;

          countries.forEach(function(d) { 

            console.log("DDD", d, countries)
            // Retrieve the country name based on its id
            d._name = names.filter(function(n) { return d.id === n.id; })[0].name; 

            // TODO: should merge on a more reliable join (e.g. 2-char)
            d.data = vars.new_data.filter(function(n) { return d._name === n.name; })[0];

          });

          // TODO: see above
          countries = countries.filter(function(d) {
            return typeof d.data !== "undefined";
          });


          // PRE-UPDATE
          var gItems = vars.gSvg.selectAll(".mark__group")
                           .data(countries, function(d, i) { return i; });

          // ENTER

          // Add a group for marks
          var gItems_enter = gItems.enter()
                          .append("g")
                          .each(vistk.utils.items_group);

          // Add a graphical mark
          gItems_enter.each(vistk.utils.items_mark)
              .select("path")
              .attr("title", function(d,i) { return d[vars.var_text]; })
              .on("mouseenter", function(d, i) {
                vars.dispatch.highlightOn(d);
                tooltip
                 .classed("hidden", false);
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

          }

          break;
