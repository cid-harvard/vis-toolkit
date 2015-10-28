vars.default_mark["circle"] = function(scope) {

  var params = {};

  params.type = 'circle';
  params.rendering = 'canvas';
  params.enter = function() {

     var dataBinding = dataContainer.selectAll("custom.rect")
        .data(data, function(d) { return d; });

    dataBinding.enter()
      .append("custom")
      .classed("rect", true)
      .attr("x", scale)
      .attr("y", 100)
      .attr("size", 8)
      .attr("fillStyle", "red");

  };

  params.update = function() {

    dataBinding
      .attr("size", 8)
      .transition()
      .duration(1000)
      .attr("size", 15)
      .attr("fillStyle", "green");

    d3.timer(drawCanvas);
    drawCustom([1,2,13,20,23]);

  };

  params.exit = function() {

    dataBinding.exit()
      .attr("size", 8)
      .transition()
      .duration(1000)
      .attr("size", 5)
      .attr("fillStyle", "lightgrey");

     mark.remove();
  };

  params.render = function() {

    context.fillStyle = "#fff";
    context.rect(0,0,chart.attr("width"),chart.attr("height"));
    context.fill();

    context.beginPath();
    context.fillStyle = node.attr("fillStyle");
    context.rect(node.attr("x"), node.attr("y"), node.attr("size"), node.attr("size"));
    context.fill();
    context.closePath();

  }

  return params;

}

d3.timer(drawCanvas);
drawCustom([1,2,13,20,23]);

function drawCanvas() {

  // clear canvas

  var elements = dataContainer.selectAll("custom.rect");
  elements.each(function(d) {

    // Render
    //    var node = d3.select(this);

  });
}

