vistk.utils.items_group = function(d, i) {

  d3.select(this).append("g")
                  .attr("class", "mark__group")
                  .on("mouseover",function(d) {
                    vars.evt.call("highlightOn", d);
                  })
                  .on("mouseleave", function(d) {
                    vars.evt.call("highlightOut", d);
                  })
                  .on("click", function(d) {
                     vars.evt.call("selection", d);
                  });

}

vistk.utils.items_mark = function(d, i) {

  if(typeof vars.mark === "undefined") {
    vars.mark = {};
    vars.mark.type = "circle";
  }

  switch(vars.mark.type) {

    case "rect":

      d3.select(this).append("rect")
                      .attr("height", vars.mark.height)
                      .attr("width", vars.mark.width)                              
                      .attr("x", -vars.mark.width/2)
                      .attr("y", -vars.mark.height/2)
                      .classed("items__mark__rect", true)
                      .style("fill", function(d) { return vars.color(d[vars.var_color]); });

      break;

    case "diamond":

      d3.select(this).append("rect")
                      .attr("height", vars.mark.height)
                      .attr("width", vars.mark.width)                              
                      .attr("x", -vars.mark.width/2)
                      .attr("y", -vars.mark.height/2)
                      .classed("items__mark__diamond", true)
                      .classed("selected", function(d) { return vars.selection.indexOf(d[vars.var_text]) >= 0; })
                      .classed("highlighted", function(d) { return vars.highlight.indexOf(d[vars.var_text]) >= 0; })
                      .attr("transform", "rotate(45)");

      break;

    case "text":

      d3.select(this).append("text")
                      .attr("x", 10)
                      .attr("y", 0)
                      .attr("dy", ".35em")
                      .classed("items__mark__text", true)
                      .attr("transform", "rotate(-30)")
                      .text(function(d) { return d[vars.var_text]; });

      break;


    case "circle":
    default:

      d3.select(this).append("circle")
                      .attr("r", 5)
                      .attr("cx", 0)
                      .attr("cy", 0)
                      .classed("items__mark__circle", true)
                      .style("fill", function(d) { return vars.color(d[vars.var_color]); });
      break;

  }

}

vistk.utils.connect_mark = function(d, i) {

  if(typeof vars.connect != "undefined") {

    switch(vars.connect.type) {

      case "line":
      default:

        d3.select(this).append('path')
            .attr('class', 'sparkline')
            .attr('d', function(d) {
              console.log(d)
              return vars.line(d);
            });

      break;
    }

  }
}

vistk.utils.make_x_axis = function() {        
    return d3.svg.axis()
        .scale(vars.x_scale)
         .orient("bottom")
         .ticks(10);
}

// TODO: add accessor as argument and var_time
vistk.utils.flatten_years = function(data) {
    var flat = [];

    //for each country
    data.forEach(function(root) {
      
        //for each year in each country
        root.years.forEach(function(year) {
            //extend the year object with the common properties stored just once in the country object

          var current_year = merge(root, year);
          delete current_year.years;

            //add it to the final flat array
            flat.push(current_year);
        })
    });

    return flat;
}

// UTIS FUNCTIONS

// http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
var merge = function() {
    var obj = {},
        i = 0,
        il = arguments.length,
        key;
    for (; i < il; i++) {
        for (key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) {
                obj[key] = arguments[i][key];
            }
        }
    }
    return obj;
};

// One way to wrap text.. but creates too many elements..
// http://bl.ocks.org/mbostock/7555321

vistk.utils.wrap = function(text, width) {

  text.each(function() {

    width = d3.select(this).data()[0].dx;

    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

function find_node_by_id(id) {
  var res = vars.nodes.filter(function(d) {
    return d.id == id;
  })[0];

  if(typeof res == "undefined")
    console.log("id not found", id)

  return res;
}

function find_data_by_id(id) {
  var res = vars.new_data.filter(function(d) {
    return d[vars.var_id] == +id;
  })[0];

  if(typeof res == "undefined")
    console.log("Data id not found", id)

  return res;
}

vistk.utils.update_filters = function(value, add) {
  if(vars.dev) console.log("[update_filters]", value);  
  // If we add a new value to filter
  if(add) {
    if(vars.filter.indexOf(value) < 0) {
      vars.filter.push(value)
    }
  } else {
    var index = vars.filter.indexOf(value)
    if(index > -1)
      vars.filter.splice(index, 1);
  }
}
