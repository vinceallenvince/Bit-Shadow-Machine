var Item = require('./item');
var System = require('./system');
var Utils = require('drawing-utils-lib');

/**
 * Creates a new AnimUnit.
 *
 * An AnimUnit occupies a location in an animation frame. Typically,
 * called from Anim and passed a location, scale and color.
 * @constructor
 */
function AnimUnit() {
  Item.call(this);
}
Utils.extend(AnimUnit, Item);

/**
 * Initializes the AnimUnit.
 * @param {Object} world A world.
 * @param {Object} options Initial options.
 */
AnimUnit.prototype.init = function(world, options) {
  if (!options.parent || !options.location) {
    throw new Error('AnimUnit.init: parent amd location required.');
  }
  AnimUnit._superClass.init.call(this, world, options);

  this.parent = options.parent;
  this.location = options.location;
  this.scale = options.scale || 1;
  this.color = options.color || [100, 100, 100];
  this.zIndex = options.zIndex || 1; // the default value must be > 0
  this.currentFrame = 0;
};

/**
 * Checks if parent Anim is advancing the frame. If so,
 * this object destoys itself.
 * @returns {number} Total system records.
 */
AnimUnit.prototype.step = function() {
  if (this.parent._frameCount >= this.parent.frameDuration) {
    System.remove(this);
    return System._records.length;
  }
};

module.exports = AnimUnit;