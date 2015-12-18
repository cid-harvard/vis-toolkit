var vows = require("vows"),
    assert = require("assert");

var d3 = require("d3");

var suite = vows.describe("vistk");

require("../build/vistk.js");



suite.addBatch({
  "vistk": {
    "is not a global": function() {
      assert.equal("vistk" in global, false);
    }
  }
});

suite.addBatch({
  "vistk.version": {
    "is not a string": function() {
      assert.isString(vistk.version, true);
    }
  }
});

suite.export(module);
