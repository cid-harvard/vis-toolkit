      case "geomap":

        vars.params = {

          x_scale: [],

          y_scale: [],

          connect: {
            type: null
          },

          items: [{
            attr: "country",
            marks: [{
                type: "shape",
                fill: d3.scale.linear()
                        .domain([d3.min(vars.new_data, function(d) { return d[vars.var_color]; }), d3.max(vars.new_data, function(d) { return d[vars.var_color]; })])
                        .range(["red", "green"]),
                rotate: "0",
                radius: 5                
              }],
          }],

          connect: [],

          accessor_data: function(d) { return d.data; }

        };

        vars = vistk.utils.merge(vars, vars.params);

        // LOAD USER PARAMS
        vars.items = vistk.utils.merge(vars.items, vars.user_vars.items);

        // http://techslides.com/demos/d3/d3-world-map-colors-tooltips.html
        var projection = d3.geo.mercator()
                        .translate([vars.width/2, vars.height/2])
                        .scale(100);

        // This is the main function that draws the shapes later on
        vars.path = d3.geo.path()
            .projection(projection);

        vars.gSvg = vars.svg
            .call(d3.behavior.zoom()
            .on("zoom", redraw))
            .append("g");

        function redraw() {
            vars.gSvg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }

        // countries contains bot the data and coordinates for shapes drawing
        var countries = topojson.object(vars.topology, vars.topology.objects.countries).geometries,
            neighbors = topojson.neighbors(vars.topology, countries),
            i = -1,
            n = countries.length;

        countries.forEach(function(d) { 

          // Retrieve the country name based on its id
          d._name = vars.names.filter(function(n) { return d.id == n.id; })[0].name; 

          // TODO: should merge on a more reliable join (e.g. 2-char)
          d.data = vars.new_data.filter(function(n) { return d._name === n.name; })[0];

          // Two reasons why it is not defined
          // 1/ No data
          // 2/ Current country
          if(typeof d.data == "undefined") {
            var data = {}
            data.share = 0;
            d.data = data;
          }

        });

        // PRE-UPDATE ITEMS
        var gItems = vars.svg.selectAll(".mark__group")
                        .data(countries, function(d, i) { return i; });

        // ENTER ITEMS
        var gItems_enter = gItems.enter()
                       .append("g")
                         .attr("transform", function(d) {
                           return "translate(" + [0, 0] + ")";
                        })
                         .each(vistk.utils.items_group);

        // APPEND AND UPDATE ITEMS MARK
        vars.items[0].marks.forEach(function(params) {
          gItems_enter.call(vistk.utils.draw_mark, params);
          gItems.call(vistk.utils.draw_mark, params);
        });

        // ITEMS EXIT
        var gItems_exit = gItems.exit().remove();

      break;
