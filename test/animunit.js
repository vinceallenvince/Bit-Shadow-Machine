var test = require('tape'),
    Anim = require('../src/anim'),
    System = require('../src/system'),
    Utils = require('drawing-utils-lib'),
    Vector = require('vector2d-lib'),
    World = require('../src/world'),
    AnimUnit, obj;

function beforeTest() {
  System.setupFunc = function() {};
  System._resetSystem();

  document.body.innerHTML = '';
  var world = document.createElement('div');
  world.id = 'world';
  world.style.position = 'absolute';
  world.style.top = '0';
  world.style.left = '0';
  document.body.appendChild(world);
}

test('load AnimUnit.', function(t) {
  AnimUnit = require('../src/animunit');
  t.ok(AnimUnit, 'object loaded');
  t.end();
});

test('init() should require an instance of World.', function(t) {

  System.Classes = {
    AnimUnit: AnimUnit
  };

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    var animunit = new AnimUnit();
    t.throws(function () {
      animunit.init(world);
    }, 'should throw exception when not passed a parent or location.');

    t.throws(function () {
      animunit.init(world, {
        location: new Vector(10, 10)
      });
    }, 'should throw exception when not passed a parent.');

    t.throws(function () {
      animunit.init(world, {
        parent: new Anim()
      });
    }, 'should throw exception when not passed a location.');

  });
  t.end();
});

test('init() should initialize with default properties.', function(t) {

  beforeTest();

  System.Classes = {
    AnimUnit: AnimUnit
  };

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('AnimUnit', {
      parent: new Anim(),
      location: new Vector(10, 10)
    });
  });
  t.equal(obj.name, 'AnimUnit');
  t.ok(obj.parent instanceof Anim, 'parent.');
  t.equal(obj.location.x, 10, 'location.x.');
  t.equal(obj.location.y, 10, 'location.y.');
  t.equal(obj.scale, 1, 'default scale.');
  t.equal(obj.zIndex, 1, 'default zIndex.');
  t.assert(obj.color[0] === 100 && obj.color[1] === 100 && obj.color[2] === 100, 'default color.');
  t.equal(obj.currentFrame, 0, 'default currentFrame.');

  t.end();
});

test('init() should initialize with custom properties.', function(t) {

  beforeTest();

  System.Classes = {
    AnimUnit: AnimUnit
  };

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('AnimUnit', {
      parent: new Anim(),
      location: new Vector(10, 10),
      scale: 2,
      zIndex: 10,
      color: [10, 20, 30]
    });
  });
  t.equal(obj.name, 'AnimUnit');
  t.ok(obj.parent instanceof Anim, 'parent.');
  t.equal(obj.location.x, 10, 'location.x.');
  t.equal(obj.location.y, 10, 'location.y.');
  t.equal(obj.scale, 2, 'custom scale.');
  t.equal(obj.zIndex, 10, 'custom zIndex.');
  t.assert(obj.color[0] === 10 && obj.color[1] === 20 && obj.color[2] === 30, 'custom color.');
  t.equal(obj.currentFrame, 0, 'custom currentFrame.');

  t.end();
});

test('setup() checks internal frame count agaist frameDuration to see if we should advance the frame.', function(t) {

  var len, lenA, lenB;
  var frames = [
    {
      "items":
      [
        {"x": 4, "y": 30, "color": [255, 255, 255], "opacity": 1, "scale": 1},
        {"x": 6, "y": 30, "color": [255, 255, 255], "opacity": 1, "scale": 1}
      ]
    },
    {
      "items":
      [
        {"x": 5, "y": 31, "color": [255, 255, 255], "opacity": 1, "scale": 1},
        {"x": 7, "y": 31, "color": [255, 255, 255], "opacity": 1, "scale": 1}
      ]
    },
    {
      "items":
      [
        {"x": 6, "y": 32, "color": [255, 255, 255], "opacity": 1, "scale": 1},
        {"x": 8, "y": 32, "color": [255, 255, 255], "opacity": 1, "scale": 1}
      ]
    }
  ];

  beforeTest();

  System.Classes = {
    Anim: Anim,
    AnimUnit: AnimUnit
  };

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('Anim', {
      loop: true,
      frames: frames
    });

  });
  System.loop();
  System.loop();
  System.loop();

  len = System._records.length;

  System.loop();

  lenA = System._records[3].step();
  lenB = System._records[2].step();

  t.assert(len > lenA, len > lenB, 'If parent anim advances frame, System removes anim units.');

  t.end();
});
