var Item = require('./item');
var Utils = require('burner').Utils;
var Vector = require('burner').Vector;

/**
 * Creates a new World.
 *
 * @constructor
 */
function World() {
  Item.call(this);
  this.name = 'World';
  /**
   * Worlds do not have worlds. However, assigning an
   * object literal makes for less conditions in the
   * update loop.
   */
  this.world = {};
}
Utils.extend(World, Item);

/**
 * Resets all properties.
 * @function init
 * @memberof Item
 *
 * @param {Object} world A world.
 * @param {Object} [opt_options=] A map of initial properties.
 */
World.prototype.init = function(world, opt_options) {

  World._superClass.init.call(this, this.world, opt_options);

  var options = opt_options || {},
      viewportSize = Utils.getWindowSize();


  this.el = options.el || document.body;
  this.gravity = options.gravity || new Vector(0, 0.1);
  this.c = typeof options.c !== 'undefined' ? options.c : 0.1;
  this.pauseStep = !!options.pauseStep;
  this.pauseDraw = !!options.pauseDraw;
  this.el.className = this.name.toLowerCase();

  //

  this.resolution = options.resolution || 4;
  this.width = options.width / this.resolution || viewportSize.width / this.resolution;
  this.height = options.height / this.resolution || viewportSize.height / this.resolution;
  this.location = options.location || new Vector(((viewportSize.width - (this.width * this.resolution)) / 2),
      ((viewportSize.height - (this.height * this.resolution)) / 2));

  this.color = options.color || [0, 0, 0];

  //

  if (this.el !== document.body) {

    var container = document.createElement('div'),
        style = container.style;

    container.id = 'container_' + this.name.toLowerCase();
    container.className = 'worldContainer';
    style.left = this.location.x + 'px';
    style.top = this.location.y + 'px';
    style.width = this.width * this.resolution + 'px';
    style.height = this.height * this.resolution + 'px';
    style.zIndex = this.zIndex;
    style.backgroundColor = this.colorMode === 'rgb' ?
        'rgba(' + this.color[0] + ', ' + this.color[1] + ', ' + this.color[2] + ', ' + this.opacity + ')' :
        'hsla(' + this.color[0] + ', ' + (this.color[1] * 100) + '%, ' + (this.color[2] * 100) + '%, ' + this.opacity + ')';

    container.appendChild(this.el);

    document.body.appendChild(container);
  }
};

/**
 * A noop.
 * @function step
 * @memberof World
 */
World.prototype.step = function() {};

module.exports = World;
