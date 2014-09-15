var test = require('tape'),
    Item = require('../src/item'),
    System = require('../src/system'),
    Utils = require('burner').Utils,
    Vector = require('burner').Vector,
    World, obj;

function beforeTest() {
  System.setupFunc = function() {};
  System._resetSystem();
  document.body.innerHTML = '';
}

test('load World.', function(t) {
  World = require('../src/world');
  t.ok(World, 'object loaded');
  t.end();
});

test('init() should initialize with default properties.', function(t) {

  beforeTest();

  var world = new World();
  world.init({});
  t.equal(world.el, document.body);
  t.end();

});

test('init() should initialize with default properties.', function(t) {

  beforeTest();

  var viewportSize = Utils.getWindowSize();

  System.setup(function() {
    var world = this.add('World');

    t.equal(world.name, 'World');
    t.equal(world.el, document.body);
    t.equal(world.gravity.x, 0, 'Default gravity x.');
    t.equal(world.gravity.y, 0.1, 'Default gravity y.');
    t.equal(world.c, 0.1, 'Default c.');
    t.equal(world.pauseStep, false, 'Default pauseStep.');
    t.equal(world.pauseDraw, false, 'Default pauseDraw.');
    t.equal(world.el.className, 'world', 'Should have className based on name.');
    t.assert(world.color[0] === 0 && world.color[1] === 0 && world.color[2] === 0, 'Default color.');
    t.equal(world.resolution, 4, 'Default resolution.');
    t.equal(world.width, viewportSize.width / world.resolution, 'Default width.');
    t.equal(world.height, viewportSize.height / world.resolution, 'Default height.');
  });

  t.end();
});

test('init() should initialize with custom properties.', function(t) {

  beforeTest();

  var view = document.createElement('div');
  view.style.position = 'absolute';
  document.body.appendChild(view);

  System.setup(function() {
    var world = this.add('World', {
      el: view,
      gravity: new Vector(1, 2),
      c: 0.5,
      pauseStep: true,
      pauseDraw: true,
      color: [200, 200, 200],
      resolution: 2,
      width: 400,
      height: 300
    });

    t.equal(world.gravity.x, 1, 'custom gravity x.');
    t.equal(world.gravity.y, 2, 'custom gravity y.');
    t.equal(world.c, 0.5, 'custom c.');
    t.equal(world.pauseStep, true, 'custom pauseStep.');
    t.equal(world.pauseDraw, true, 'custom pauseDraw.');
    t.assert(world.color[0] === 200 && world.color[1] === 200 && world.color[2] === 200, 'custom color.');
    t.equal(world.resolution, 2, 'custom resolution.');
    t.equal(world.width, 200, 'custom width.');
    t.equal(world.height, 150, 'custom height.');

    var w = document.querySelector('.worldContainer');
    t.ok(w, 'appends world view to a container.');
    t.equal(w.style.width, '400px', 'view has width style.');
    t.equal(w.style.height, '300px', 'view has height style.');
    t.equal(w.style.zIndex, '0', 'view has zIndex style.');
    t.equal(w.style.backgroundColor, 'rgb(200, 200, 200)', 'view has background-color style.');
  });

  t.end();
});
