/*var Item = require('../src/item'),
    FPSDisplay = require('fpsdisplay'),
    System = require('burner').System,
    World = require('../src/world'),
    System, obj;*/
var test = require('tape');
var System, obj;

function beforeTest() {

}

test('load System.', function(t) {
  System = require('../src/system.js');
  t.ok(System, 'object loaded');
  t.end();
});

test('check static properties.', function(t) {
  beforeTest();
  t.equal(typeof System.Classes, 'object', 'has a Classes object.');
  t.equal(typeof System._worlds, 'object', 'has a _worlds object.');
  t.equal(typeof System._buffers, 'object', 'has a _buffers object.');
  t.equal(typeof System.zSort, 'number', 'has a zSort property.');
  t.equal(typeof System.recordData, 'boolean', 'has a recordData property.');
  t.equal(typeof System.recordStartFrame, 'number', 'has a recordStartFrame property.');
  t.equal(typeof System.recordEndFrame, 'number', 'has a recordStartFrame property.');
  t.equal(typeof System.recordItemProperties, 'object', 'has a recordItemProperties object.');
  t.equal(typeof System.recordWorldProperties, 'object', 'has a recordWorldProperties object.');
  t.equal(typeof System.recordedData, 'object', 'has a recordedData array.');
  t.end();
});

