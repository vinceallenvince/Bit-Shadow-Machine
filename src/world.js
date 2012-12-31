/*global exports, document */
/**
 * Creates a new World.
 * @constructor
 */
function World(opt_options) {

  var el, options = opt_options || {},
      windowSize = exports.Utils.getWindowSize();

  this.gravity = options.gravity || new exports.Vector(0, 0.01);
  this.resolution = options.resolution || 8;
  this.width = options.width / this.resolution || windowSize.width / this.resolution;
  this.height = options.height / this.resolution || windowSize.height / this.resolution;
  this.colorMode = options.colorMode || 'rgba';

  // if no element is passed, use document.body
  if (!options.el) {
    el = document.body;
  } else {
    el = options.el;
  }

  this.el = el;
  this.name = 'world';
  this.id = this.name + exports.System._getNewId();

  /**
   * Object pool used to recycle objects.
   */
  this._pool = [];
}

exports.World = World;
