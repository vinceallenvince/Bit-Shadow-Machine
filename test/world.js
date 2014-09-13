var test = require('tape'),
    Item = require('../src/item'),
    Utils = require('drawing-utils-lib'),
    Vector = require('vector2d-lib'),
    World, obj;

test('load World.', function(t) {
  World = require('../src/world');
  t.ok(World, 'object loaded');
  t.end();
});

test('new World() creates a new World.', function(t) {
  var obj = new World();
  t.equal(obj.el, document.body, 'should by default use document.body as a view.');
  t.equal(obj.name, 'World', 'should have a name.');

  var view  = document.createElement('div');
  var obj = new World({el: view});
  t.equal(obj.el, view, 'can pass a DOM element as a view.');
  t.end();
});

test('init() should initialize with default properties.', function(t) {

  var viewportSize = Utils.getWindowSize();

  var view = document.createElement('div');
  view.style.position = 'absolute';
  document.body.appendChild(view);

  obj = new World({el: view});
  obj.init();
  t.equal(obj.gravity.x, 0, 'Default gravity x.');
  t.equal(obj.gravity.y, 0.1, 'Default gravity y.');
  t.equal(obj.c, 0.1, 'Default c.');
  t.equal(obj.pauseStep, false, 'Default pauseStep.');
  t.equal(obj.pauseDraw, false, 'Default pauseDraw.');
  t.equal(obj.el.className, 'world', 'Should have className based on name.');
  t.assert(obj.color[0] === 0 && obj.color[1] === 0 && obj.color[2] === 0, 'Default color.');
  t.equal(obj.resolution, 4, 'Default resolution.');
  t.equal(obj.width, viewportSize.width / obj.resolution, 'Default width.');
  t.equal(obj.height, viewportSize.height / obj.resolution, 'Default height.');

  var w = document.querySelector('.worldContainer');
  t.ok(w, 'appends world view.');
  t.equal(w.style.width, '400px', 'view has width style.');
  t.equal(w.style.height, '300px', 'view has height style.');
  t.equal(w.style.zIndex, '0', 'view has zIndex style.');
  t.equal(w.style.backgroundColor, 'rgb(0, 0, 0)', 'view has background-color style.');

  // TODO: fix
  //t.ok(obj.location.x, 'Default location x.');
  //t.ok(obj.location.y, 'Default location y.');
  t.end();
});
