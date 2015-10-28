vars.default_marks["circle"] = function(scope) {

  var this_params = {};

  this_params.type = 'circle';
  this_params.rendering = 'svg';
  this_params.radius = 5;

  this_params.enter = function(selection, params, vars, mark_id) {

    var sel = selection.append("circle");

    sel.each(function(d, i) {

      var mark_params = utils.mark_params(params, vars, d, i);

      d3.select(this)
        .attr('id', mark_id)
        .classed("items__mark__circle", true)
        .attr("r", this_params.radius)
        .attr("transform", "translate(" +  mark_params.translate + ")rotate(" +  mark_params.rotate + ")");

    });

  };

  this_params.update = function(selection) {

    selection
        .classed("highlighted", function(d, i) { return d.__highlighted; })
        .classed("highlighted__adjacent", function(d, i) { return d.__highlighted__adjacent; })
        .classed("selected", function(d, i) { return d.__selected; })
        .classed("selected__adjacent", function(d, i) { return d.__selected__adjacent; })
    //    .attr("transform", "translate(" +  params_translate + ")rotate(" +  params_rotate + ")");
  };

  this_params.exit = function(selection) {
	  selection.remove();
  };

  return this_params;

}
