/**
 * Creates a new AnimUnit.
 *
 * An AnimUnit occupies a location in an animation frame. Typically,
 * called from Anim and passed a location, scale and color.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @constructor
 */
function AnimUnit(opt_options) {
  var options = opt_options || {};
  options.name = 'AnimUnit';
  Item.call(this, options);
}
Utils.extend(AnimUnit, Item);

/**
 * Initializes the AnimUnit.
 * @param {Object} options Initial options.
 */
AnimUnit.prototype.init = function(options) {
  if (!options.location) {
    throw new Error('AnimUnit.init: location required.');
  }
  this.location = options.location;
  this.scale = options.scale || 1;
  this.color = options.color || [100, 100, 100];
  this.zIndex = options.zIndex || 1; // the default value must be > 0
  this.currentFrame = 0;
};

/**
 * Checks if parent Anim is advancing the frame. If so,
 * this object destoys itself.
 */
AnimUnit.prototype.step = function() {
  var parent = System.getItem(this.parentId);
  if (parent._frameCount >= parent.frameDuration) {
    BitShadowMachine.System.destroyItem(this);
  }
};
