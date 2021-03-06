var test = require('tape');
var FPSDisplay = require('fpsdisplay');
var Item = require('../src/item');
var Vector = require('burner').Vector;
var System, obj;

function beforeTest() {
  Item._idCount = 0;
  System.setupFunc = function() {};
  System._resetSystem();

  System.frameFunction = null;
  System.Classes = {
    'Item': Item
  };
  System._buffers = {};
  System.zSort = 0;
  System.saveData = false;
  System.saveStartFrame = -1;
  System.saveEndFrame = -1;
  System.saveItemProperties = {
    id: true,
    name: true,
    scale: true,
    location: true,
    velocity: true,
    angle: true,
    minSpeed: true,
    maxSpeed: true,
    hue: true,
    saturation: true,
    lightness: true,
    color: true,
    opacity: true
  };
  System.saveWorldProperties = {
    id: true,
    name: true,
    width: true,
    height: true,
    resolution: true,
    colorMode: true
  };
  System.data = null;

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

// this test must be run directly after 'load System.'
test('not implementing a saveDataComplete function throws error.', function(t) {

  beforeTest();

  var world;

  System.setup(function() {
    world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300,
      colorMode: 'hsl'
    });
    var item = this.add('Item', {
      color: [100, 0.5, 0.75],
      opacity: 0.5
    });
  });

  System.saveData = true;
  System.saveStartFrame = 0;
  System.saveEndFrame = 10;

  t.throws(function() {
    System.saveDataComplete();
  });

  t.end();
});

test('check static properties.', function(t) {
  beforeTest();
  t.equal(typeof System.Classes, 'object', 'has a Classes object.');
  t.equal(typeof System._buffers, 'object', 'has a _buffers object.');
  t.equal(typeof System.zSort, 'number', 'has a zSort property.');
  t.equal(typeof System.saveData, 'boolean', 'has a saveData property.');
  t.equal(typeof System.saveStartFrame, 'number', 'has a saveStartFrame property.');
  t.equal(typeof System.saveEndFrame, 'number', 'has a saveStartFrame property.');
  t.equal(typeof System.saveItemProperties, 'object', 'has a saveItemProperties object.');
  t.equal(typeof System.saveWorldProperties, 'object', 'has a saveWorldProperties object.');
  t.equal(typeof System.data, 'object', 'has a data object.');
  t.equal(typeof System.saveDataTimeoutLength, 'number', 'has a saveDataTimeoutLength property.')
  t.end();
});

test('unknown class adds an Item by default.', function(t) {

  beforeTest();

  var world;

  System.setup(function() {
    world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300,
      colorMode: 'hsb'
    });
    var item = this.add('Hello');
  });

  System.saveDataComplete = function(num, data) {};

  t.ok(System._records[1] instanceof Item, 'Adds an Item.');

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

test('checkFramesSaved() should check total recorded frames.', function(t) {

  beforeTest();

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    var item = this.add('Item');
  });
  System.saveDataComplete = function(num, data) {};
  System.saveData = true;
  System.saveStartFrame = 2;
  System.saveEndFrame = 6;
  System.loop();
  System.loop();
  System.loop();
  System.loop();
  System.loop();
  System.loop();

  var framesRecorded = System.checkFramesSaved();
  t.equal(framesRecorded, true, 'returns true if all frames recorded.');

  System.loop();
  t.equal(System.clock, 6, 'exits loop if System.checkFramesSaved() returns true.');

  t.end();
});

test('System.data should update each frame.', function(t) {

  beforeTest();

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    var item = this.add('Item');
  });
  System.saveDataComplete = function(num, data) {};
  System.saveData = true;
  System.loop();
  t.assert(System.data.frame === 0 && typeof System.data.world !== 'undefined' && typeof System.data.items !== 'undefined', 'records frame number, world and items.');

  System.loop();
  t.assert(System.data.frame === 1 && typeof System.data.world !== 'undefined' && typeof System.data.items !== 'undefined', 'records frame number, world and items.');

  System.loop();
  t.assert(System.data.frame === 2 && typeof System.data.world !== 'undefined' && typeof System.data.items !== 'undefined', 'records frame number, world and items.');

  t.end();
});

test('System._checkSaveFrame should check if System.clock is within saveStartFrame and saveEndFrame.', function(t) {

  beforeTest();

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    var item = this.add('Item');
  });
  System.saveDataComplete = function(num, data) {};
  System.saveData = true;
  System.saveStartFrame = 2;
  System.saveEndFrame = 6;
  System.loop();
  System.loop();
  System.loop();
  System.loop();
  System.loop();

  var checkSaveFrame = System._checkSaveFrame();
  t.equal(checkSaveFrame, true, 'returns true if clock is bw saveStartFrame and saveEndFrame.');

  t.end();
});


test('System._resetData() should reset System.data.', function(t) {

  beforeTest();

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    var item = this.add('Item');
  });
  System.saveDataComplete = function(num, data) {};
  System.saveData = true;
  System.saveStartFrame = 0;
  System.saveEndFrame = 10;
  System.loop();
  System.loop();
  System.loop();
  System.loop();
  System.loop();

  var data = System._resetData();

  t.equal(data.frame, 5, 'sets frame = System.clock.');
  t.equal(data.items.length, 0, 'removes all items.');

  t.end();
});

test('System._saveItemProperties() copies properties from an item to a map of properties.', function(t) {

  beforeTest();

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    var item = this.add('Item');
  });
  System.saveDataComplete = function(num, data) {};
  System.saveData = true;
  System.saveStartFrame = 0;
  System.saveEndFrame = 10;
  System.loop();
  System.loop();
  System.loop();
  System.loop();
  System.loop();

  System._resetData();
  var record = System._records[System._records.length - 1];
  System._saveItemProperties(0, record);

  t.equal(System.data.frame, 4, 'frame = current System.clock value.');
  t.ok(System.data.items[0].id, 'records item.id.');
  t.ok(System.data.items[0].name, 'records item.name.');
  t.ok(System.data.items[0].scale, 'records item.scale.');
  t.ok(System.data.items[0].location, 'records item.location.');
  t.ok(System.data.items[0].velocity, 'records item.velocity.');
  t.ok(System.data.items[0].color, 'records item.color.');
  t.ok(typeof System.data.items[0].minSpeed !== 'undefined', 'records item.minSpeed.');
  t.ok(typeof System.data.items[0].maxSpeed !== 'undefined', 'records item.maxSpeed.');

  t.ok(System.data.world.name, 'records world.name.');
  t.ok(System.data.world.colorMode, 'records world.colorMode.');
  t.ok(System.data.world.id, 'records world.id.');
  t.ok(System.data.world.resolution, 'records world.resolution.');
  t.ok(System.data.world.width, 'records world.width.');
  t.ok(System.data.world.height, 'records world.height.');

  t.end();
});

test('System.saveDataComplete() is called when frame completes rendering.', function(t) {

  beforeTest();

  var val;

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    var item = this.add('Item');
  });

  System.saveDataComplete = function(num, data) {
    val = num;
  };

  System.saveData = true;
  System.saveStartFrame = 0;
  System.saveEndFrame = 10;
  System.loop();
  System.loop();
  System.loop();

  t.equal(val, 2, 'calls saveDataComplete().');
  t.end();
});

test('add() should add create a new item and add it to _records.', function(t) {

  beforeTest();

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    var itemA = this.add('Item');
    t.assert(typeof itemA === 'object' && itemA.name === 'Item', 'add() should return the new item.');
    t.equal(System._records.length, 2, 'should add a new item to _records. item + world = 2 records.');
  });

  t.end();
});

test('add() should pull from pull from System._pool if pooled items exist.', function(t) {

  beforeTest();

  function Obj() {
    this.name = 'Obj';
  }
  Obj.prototype.init = function() {};

  System.Classes = {
    Item: Item,
    Obj: Obj
  }

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });;

    var itemA = this.add('Obj');
    var itemB = this.add();
    var itemC = this.add();
    System.remove(itemA);
    System.remove(itemB);
    System.remove(itemC);
    t.assert(System._records.length === 1 && System._pool.length === 3, 'remove() should remove item from _records and add to _pool.');

    var itemD = this.add();
    t.assert(System._records.length === 2 && System._pool.length === 2, 'add() should check to splice items off _pool.');

  });

  t.end();
});

test('loop() should increment item life property.', function(t) {

  window.requestAnimationFrame = function() {};

  beforeTest();

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    this.add('Item', {
      location: new Vector(100, 100),
      lifespan: 10
    });
  });
  System.loop();
  t.equal(System._records[System._records.length - 1].life, 1, 'step() should increment life.');
  t.equal(System.clock, 1, 'loop() should increment clock.');

  //
  //

  beforeTest();

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    this.add('Item', {
      location: new Vector(100, 100),
      life: 10,
      lifespan: 10
    });
  });
  System.loop();
  t.equal(System._records.length, 1, 'step() should remove object if life >= lifespan.');

  t.end();
});

test('System.zSort = true should sort _records by zIndex value.', function(t) {

  beforeTest();
  System.zSort = true;
  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    var itemA = this.add('Item', {
      zIndex: 3
    });
    var itemB = this.add('Item', {
      zIndex: 2
    });
    var itemC = this.add('Item', {
      zIndex: 1
    });
  });

  System.loop();
  t.equal(System._records[1].zIndex, 1, 'Item with lowest zIndex value is at the beginning of the records array.');

  t.end();
});

test('hsl color mode should save hue, saturation and lightness.', function(t) {

  beforeTest();

  var world;

  System.setup(function() {
    world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300,
      colorMode: 'hsl'
    });
    var item = this.add('Item', {
      color: [100, 0.5, 0.75],
      opacity: 0.5
    });
  });

  System.saveDataComplete = function(num, data) {};
  System.saveData = true;
  System.saveStartFrame = 0;
  System.saveEndFrame = 10;
  System.loop();
  System.loop();
  System.loop();
  System.loop();
  System.loop();

  t.notEqual(world.el.style.boxShadow.search('rgba'), -1, 'hsl color converted to rgb when assigned to world element. Including opacity converts rgb -> rgba.');

  t.end();
});

test('unknown color mode throws error.', function(t) {

  beforeTest();

  var world;

  System.setup(function() {
    world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300,
      colorMode: 'hsb'
    });
    var item = this.add('Item', {
      color: [100, 0.5, 0.75],
      opacity: 0.5
    });
  });

  System.saveDataComplete = function(num, data) {};
  System.saveData = true;
  System.saveStartFrame = 0;
  System.saveEndFrame = 10;

  t.throws(function() {
    System.loop();
  });

  t.end();
});

test('_keyup() should catch keyup events.', function(t) {

  // RESET

  beforeTest();

  System.setup(function() {
    world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    this.add('Item', {
      location: new Vector(100, 100)
    });
    this.add('Item', {
      location: new Vector(100, 100)
    });
  });
  System.setupFunc = function() {};
  System._keyup({
    keyCode: 82 // reset
  });

  t.equal(System._records.length, 0, 'should remove all items.');

  // PLAY/PAUSE

  beforeTest();

  System.setup(function() {
    world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    this.add('Item', {
      location: new Vector(100, 100)
    });
  });
  System._keyup({
    keyCode: 80 // pause/play
  });
  t.equal(System._records[0].pauseStep, true, 'keyCode 80 should set world.pauseStep = true.');
  System._keyup({
    keyCode: 80 // pause/play
  });
  t.equal(System._records[0].pauseStep, false, 'keyCode 80 should set world.pauseStep = false.');

  // FPSDISPLAY

  beforeTest();

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    this.add('Item', {
      location: new Vector(100, 100)
    });
  });

  System._keyup({
    keyCode: 83 // fpsDisplay
  });
  t.ok(FPSDisplay.active, 'should activate.');

  // test that we're sending FPSDisplay a length value
  // 2 records, world and item added above
  System.loop();
  t.equal(FPSDisplay.totalItems, 2, 'should display records length.');

  FPSDisplay.fps = 1;
  System._keyup({
    keyCode: 83
  });
  t.notOk(FPSDisplay.active, 'should deactivate.');

  t.end();
});

