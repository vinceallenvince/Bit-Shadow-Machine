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
  System.Classes = {
    'Item': Item
  };
  System._buffers = {};
  System.zSort = 0;
  System.recordData = false;
  System.recordStartFrame = -1;
  System.recordEndFrame = -1;
  System.recordItemProperties = {
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
  System.recordWorldProperties = {
    id: true,
    name: true,
    width: true,
    height: true,
    resolution: true,
    colorMode: true
  };
  System.recordedData = null;

  System.saveFrameDataComplete = function(frameNumber, data) {
    throw new Error('System.saveFrameDataComplete not implemented. Override this function.');
  };

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

test('checkFramesRecorded() should check total recorded frames.', function(t) {

  beforeTest();

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    var item = this.add('Item');
  });
  System.saveFrameDataComplete = function(num, data) { console.log('frame number: ' + num); };
  System.recordData = true;
  System.recordStartFrame = 2;
  System.recordEndFrame = 6;
  System.loop();
  System.loop();
  System.loop();
  System.loop();
  System.loop();
  System.loop();

  var framesRecorded = System.checkFramesRecorded();

  t.equal(framesRecorded, true, 'returns true if all frames recorded.');

  t.end();
});

test('System.recordedData should update each frame.', function(t) {

  beforeTest();

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    var item = this.add('Item');
  });
  System.saveFrameDataComplete = function(num, data) { console.log('frame number: ' + num); };
  System.recordData = true;
  System.loop();
  t.assert(System.recordedData.frame === 0 && typeof System.recordedData.world !== 'undefined' && typeof System.recordedData.items !== 'undefined', 'records frame number, world and items.');

  System.loop();
  t.assert(System.recordedData.frame === 1 && typeof System.recordedData.world !== 'undefined' && typeof System.recordedData.items !== 'undefined', 'records frame number, world and items.');

  System.loop();
  t.assert(System.recordedData.frame === 2 && typeof System.recordedData.world !== 'undefined' && typeof System.recordedData.items !== 'undefined', 'records frame number, world and items.');

  t.end();
});

test('System._checkRecordFrame should check if System.clock is within recordStartFrame and recordEndFrame.', function(t) {

  beforeTest();

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    var item = this.add('Item');
  });
  System.saveFrameDataComplete = function(num, data) { console.log('frame number: ' + num); };
  System.recordData = true;
  System.recordStartFrame = 2;
  System.recordEndFrame = 6;
  System.loop();
  System.loop();
  System.loop();
  System.loop();
  System.loop();

  var checkRecordFrame = System._checkRecordFrame();
  t.equal(checkRecordFrame, true, 'returns true if clock is bw recordStartFrame and recordEndFrame.');

  t.end();
});


test('System._resetRecordedData() should reset System.recordedData.', function(t) {

  beforeTest();

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    var item = this.add('Item');
  });
  System.saveFrameDataComplete = function(num, data) { console.log('frame number: ' + num); };
  System.recordData = true;
  System.recordStartFrame = 0;
  System.recordEndFrame = 10;
  System.loop();
  System.loop();
  System.loop();
  System.loop();
  System.loop();

  var recordedData = System._resetRecordedData();

  t.equal(recordedData.frame, 5, 'sets frame = System.clock.');
  t.equal(recordedData.items.length, 0, 'removes all items.');

  t.end();
});

test('System._saveData() copies properties from an item to a map of properties.', function(t) {

  beforeTest();

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    var item = this.add('Item');
  });
  System.saveFrameDataComplete = function(num, data) { console.log('frame number: ' + num); };
  System.recordData = true;
  System.recordStartFrame = 0;
  System.recordEndFrame = 10;
  System.loop();
  System.loop();
  System.loop();
  System.loop();
  System.loop();

  System._resetRecordedData();
  var record = System._records[System._records.length - 1];
  System._saveData(0, record);

  t.equal(System.recordedData.frame, 4, 'frame = current System.clock value.');
  t.ok(System.recordedData.items[0].id, 'records item.id.');
  t.ok(System.recordedData.items[0].name, 'records item.name.');
  t.ok(System.recordedData.items[0].scale, 'records item.scale.');
  t.ok(System.recordedData.items[0].location, 'records item.location.');
  t.ok(System.recordedData.items[0].velocity, 'records item.velocity.');
  t.ok(System.recordedData.items[0].color, 'records item.color.');
  t.ok(typeof System.recordedData.items[0].minSpeed !== 'undefined', 'records item.minSpeed.');
  t.ok(typeof System.recordedData.items[0].maxSpeed !== 'undefined', 'records item.maxSpeed.');

  t.ok(System.recordedData.world.name, 'records world.name.');
  t.ok(System.recordedData.world.colorMode, 'records world.colorMode.');
  t.ok(System.recordedData.world.id, 'records world.id.');
  t.ok(System.recordedData.world.resolution, 'records world.resolution.');
  t.ok(System.recordedData.world.width, 'records world.width.');
  t.ok(System.recordedData.world.height, 'records world.height.');

  t.end();
});

test('System.saveFrameDataComplete() is called when frame completes rendering.', function(t) {

  beforeTest();

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    var item = this.add('Item');
  });

  t.throws(function() {
    System.saveFrameDataComplete();
  }, 'saveFrameDataComplete() should throw an error if an override is not implemented.');

  t.end();
});


