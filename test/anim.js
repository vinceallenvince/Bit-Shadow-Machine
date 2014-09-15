var test = require('tape'),
    System = require('../src/system'),
    Utils = require('burner').Utils,
    Vector = require('burner').Vector,
    World = require('../src/world'),
    Anim, obj;

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

test('load Anim.', function(t) {
  Anim = require('../src/anim');
  t.ok(Anim, 'object loaded');
  t.end();
});

test('init() should require an instance of World.', function(t) {


  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    var anim = new Anim();
    anim.init(world);
    t.equal(anim.scale, 0, 'default scale.');

  });
  t.end();
});

test('init() should initialize with default properties.', function(t) {

  beforeTest();

  System.Classes = {
    Anim: Anim
  };

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('Anim');

    t.equal(obj.name, 'Anim');
    t.equal(obj.scale, 0, 'default scale.');
    t.assert(obj.color[0] === 0 && obj.color[1] === 0 && obj.color[2] === 0, 'default color.');
    t.equal(obj.location.x, world.width / 2, 'default width.');
    t.equal(obj.location.y, world.height / 2, 'default height.');
    t.equal(obj.frames.length, 0, 'default frames.');
    t.equal(obj.currentFrame, 0, 'default currentFrame.');
    t.equal(obj.loop, true, 'default loop.');
    t.equal(obj.frameDuration, 3, 'default frameDuration.');
    t.equal(obj.zIndex, -1, 'default zIndex.');
    t.equal(obj._frameCount, 3, '_frameCount = frameDuration.');

  });

  t.end();
});

test('init() should initialize with default properties.', function(t) {

  beforeTest();

  System.Classes = {
    Anim: Anim
  };

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('Anim', {
      scale: 2,
      color: [10, 10, 10],
      location: new Vector(100, 100),
      frames: [{}, {}],
      currentFrame: 100,
      loop: false,
      frameDuration: 5,
      zIndex: 2
    });

    t.equal(obj.name, 'Anim');
    t.equal(obj.scale, 2, 'custom scale.');
    t.assert(obj.color[0] === 10 && obj.color[1] === 10 && obj.color[2] === 10, 'custom color.');
    t.equal(obj.location.x, 100, 'custom width.');
    t.equal(obj.location.y, 100, 'custom height.');
    t.equal(obj.frames.length, 2, 'custom frames.');
    t.equal(obj.currentFrame, 100, 'custom currentFrame.');
    t.equal(obj.loop, false, 'custom loop.');
    t.equal(obj.frameDuration, 5, 'custom frameDuration.');
    t.equal(obj.zIndex, -2, 'custom zIndex.');
  });

  t.end();
});

test('setup() checks internal frame count agaist frameDuration to see if we should advance the frame.', function(t) {

  beforeTest();

  System.Classes = {
    Anim: Anim
  };

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('Anim');

  });

  obj.step();
  t.equal(obj._frameCount, 0, 'If _frameCount < frameDuration, _frameCount increments.');

  obj.step();
  t.equal(obj._frameCount, 1, 'If _frameCount < frameDuration, _frameCount increments.');

  //

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
    Anim: Anim
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

  var len = System._records.length;

  obj.step();
  t.equal(obj._frameCount, 0, '_frameCount resets to 0.');

  obj.step();
  obj.step();
  obj.step();

  t.assert(System._records.length > len, 'Calls advanceFrame and adds items.');
  t.equal(obj.currentFrame, 1, 'Increments currentFrame.');

  obj.step();
  obj.step();
  obj.step();
  obj.step();
  t.equal(obj.currentFrame, 2, 'Increments currentFrame.');

  obj.step();
  obj.step();
  obj.step();
  obj.step();
  t.equal(obj.currentFrame, 0, 'Loop = true resets currentFrame = 0.');

  t.end();
});
