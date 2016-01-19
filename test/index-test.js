var test = require('tape');

d3 = require("d3");
vistk = require("../build/vistk.js");

test('vistk version should be defined and defined as a string', function (t) {

    t.plan(1);
    t.equal(typeof vistk.version, 'string', vistk.version);

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

    t.equal(visualization.params().new_data[0].length, 1);
    t.equal(visualization.params().new_data[0].values.length, 2);

});

test('check if selection and highlight classes are set', function (t) {

    t.plan(2);
    var data = ['A', 'B', 'C'];
    var selection = [data[0]];
    var highlight = [data[0], data[1]];

    var visualization = vistk.viz().params({
        data: data,
        selection: selection,
        highlight: highlight
    });

    // check if internal state of the toolkit matches the cfg
    t.equal(visualization.params().selection, selection);
    t.equal(visualization.params().highlight, highlight);

});

test('check if selection and highlight classes are set', function (t) {

    t.plan(4);
    var data = ['A', 'B', 'C'];

    var items_rect = [{
        marks: [{
          type: "rect"
        }]
    }];

    var items_circle = [{
        marks: [{
          type: "circle"
        }]
    }];

    // we draw rectangles first
    var visualization = vistk.viz().params({data: data, items: items_rect});
    t.equal(d3.select(visualization.params().container).selectAll('rect')[0].length, data.length);
    t.equal(d3.select(visualization.params().container).selectAll('circle')[0].length, 0);

    // then we replace them by circles
    visualization.params({data: data, items: items_rect});
    t.equal(d3.select(visualization.params().container).selectAll('rect')[0].length, 0);
    t.equal(d3.select(visualization.params().container).selectAll('circle')[0].length, data.length);

});
