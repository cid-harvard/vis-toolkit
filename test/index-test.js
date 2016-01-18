var test = require('tape');

d3 = require("d3");
vistk = require("../build/vistk.js");

test('vistk version should be defined and defined as a string', function (t) {

    t.plan(1);
    t.equal(typeof vistk.version, 'string');

});

test('an empty configuration object returns an object with default values', function (t) {

    t.plan(1);
    var visualization = vistk.viz().params({});
    t.equal(typeof visualization.params(), 'object');

});

test('the same dataset is returned by VisTK', function (t) {

    t.plan(1);
    var data = ['A', 'B', 'C'];
    var visualization = vistk.viz().params({data: data});
    t.equal(visualization.params().new_data, data);

});

test('a dataset with no attribute is augmented with attributes', function (t) {

    t.plan(1);
    var data = ['A', 'B', 'C'];
    var visualization = vistk.viz().params({data: data});

    // Default ids
    t.equal(visualization.params().new_data[0].__id, 0);

});

test('if the dataset is temporal, then only items are returned', function (t) {

    t.plan(2);
    var data = [{id: 1, time: 0}, {id: 1, time: 1}];
    var visualization = vistk.viz().params({data: data});

    // Default ids
    t.equal(visualization.params().new_data[0].length, 1);
    t.equal(visualization.params().new_data[0].values.length, 2);

});
