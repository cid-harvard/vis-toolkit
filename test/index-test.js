var test = require('tape');

d3 = require("d3");
vistk = require("../build/vistk.js");

test('VisTK metadata checks', function (t) {

    t.plan(1);
    t.equal(typeof vistk.version, 'string');

});

test('An empty configuration object returns an object with default values', function (t) {

    t.plan(1);
    var visualization = vistk.viz().params({});
    t.equal(typeof visualization.params(), 'object');

});

test('A dataset with no attribute is augmented with attributes', function (t) {

    t.plan(1);
    var data = ['A', 'B', 'C'];
    var visualization = vistk.viz().params({data: data});

    // Default ids
    t.equal(visualization.params().new_data[0].__id, 0);

});
