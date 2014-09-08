/*var Item = require('../src/item'),
    FPSDisplay = require('fpsdisplay'),
    System = require('burner').System,
    World = require('../src/world'),
    System, obj;*/
var test = require('tape');
var Item = require('../src/item');
var System, obj;

function beforeTest() {
  Item._idCount = 0;
  System.setupFunc = function() {};
  System._resetSystem();
  System.frameFunction = null;
  document.body.innerHTML = '';
  var world = document.createElement('div');
  world.id = 'world';
  world.style.position = 'absolute';
  world.style.top = '0';
  world.style.left = '0';
  document.body.appendChild(world);
}

test('load System.', function(t) {
  System = require('../src/system.js');
  t.ok(System, 'object loaded');
  t.end();
});

test('check static properties.', function(t) {
  beforeTest();
  t.equal(typeof System.Classes, 'object', 'has a Classes object.');
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

test('getAllWorlds() should return all worlds.', function(t) {

  beforeTest();

  var worldB = document.createElement('div');
  worldB.id = 'worldB';
  worldB.style.position = 'absolute';
  worldB.style.top = '0';
  worldB.style.left = '0';
  document.body.appendChild(worldB);

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    var world = this.add('World', {
      el: document.getElementById('worldB'),
      width: 400,
      height: 300
    });
    var item = this.add('Item');
  });

  var worlds = System.getAllWorlds();
  t.equal(worlds.length, 2, 'worlds has 2 world.');

  t.end();
});

test('getAllBuffers() should return all buffers.', function(t) {

  beforeTest();

  var worldB = document.createElement('div');
  worldB.id = 'worldB';
  worldB.style.position = 'absolute';
  worldB.style.top = '0';
  worldB.style.left = '0';
  document.body.appendChild(worldB);

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    var world = this.add('World', {
      el: document.getElementById('worldB'),
      width: 400,
      height: 300
    });
    var item = this.add('Item');
  });
  System.loop();

  var buffers = System.getAllBuffers();

  t.assert(typeof buffers.World1 !== 'undefined' && typeof buffers.World2 !== 'undefined', 'buffers has keys for 2 worlds.');

  t.end();
});