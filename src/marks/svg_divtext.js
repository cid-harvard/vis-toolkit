vars.default_marks["divtext"] = function(scope) {

  var params = {};

  params.type = 'text';
  params.rendering = 'svg';

  params.enter = function(selection, params, vars, mark_id) {

    var sel = selection.append("text");

    sel.each(function(d, i) {

      var mark_params = utils.mark_params(params, vars, d, i);

      d3.select(this)
        .attr('id', mark_id)
        .classed("items__mark__text", true)
        .text(mark_params.text)
        .attr("text-anchor", mark_params.text_anchor)
        .attr("x", mark_params.x)
        .attr("y", mark_params.y)
        .classed("highlighted", function(d, i) { return d.__highlighted; })
        .classed("selected", function(d, i) { return d.__selected; })
        .attr("dy", ".35em")
        .attr("transform", "translate(" +  mark_params.translate + ")rotate(" +  mark_params.rotate + ")")
        .each(utils.bind_events);

    });

  };

  params.update = function(selection, params, vars, mark_id) {

    selection.each(function(d, i) {

      var mark_params = utils.mark_params(params, vars, d, i);

      d3.select(this)
        .classed("highlighted", function(d, i) { return d.__highlighted; })
        .classed("highlighted__adjacent", function(d, i) { return d.__highlighted__adjacent; })
        .classed("selected", function(d, i) { return d.__selected; })
        .classed("selected__adjacent", function(d, i) { return d.__selected__adjacent; })
        .transition().duration(vars.duration)
        .attr("transform", "translate(" +  mark_params.translate + ")rotate(" +  mark_params.rotate + ")");

    });

  };

  params.exit = function(selection, mark_params, vars, mark_id) {

    selection.each(function(d, i) {

      var mark_params = utils.mark_params(params, vars, d, i);

      d3.select(this).remove();

    });

  };

  return params;

}
