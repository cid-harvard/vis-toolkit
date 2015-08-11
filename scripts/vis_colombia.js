
// LOAD CSS and dataset

// Load dataset
d3.tsv("../data/COL_pop_realgdp_dept_2000-2013.txt", function(error, departments) {

  departments.forEach(function(d, i) {
    d.dept_pop = +d.dept_pop;
    d.year = +d.year;
    d.realgdp = +d.realgdp;
    d.realgdp_percap = +d.realgdp_percap;    
    d["sum(export_value)"] = +d["sum(export_value)"];
    d["value_added"] = +d["value_added"];
  });


})


var tests = [{
  name: "Create ordinal scale"
  params:[]
}]


// Run al the tests
// Capture a screenshot and build a gallery
