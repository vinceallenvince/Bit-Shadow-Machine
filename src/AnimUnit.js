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
  BitShadowMachine.Item.call(this, options);
}
BitShadowMachine.Utils.extend(AnimUnit, BitShadowMachine.Item);

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
  this.currentFrame = 0;
};

/**
 * Updates properties.
 */
AnimUnit.prototype.step = function() {};
