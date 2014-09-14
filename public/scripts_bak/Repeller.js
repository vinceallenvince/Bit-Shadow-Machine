/*global BitShadowMachine, document */
/**
 * Creates a new Repeller.
 *
 *
 * @constructor
 * @extends BitShadowMachine.Item
 * @param {Object} [opt_options=] A map of initial properties.
 */
function Repeller(opt_options) {
  var options = opt_options || {};
  options.name = options.name || 'Repeller';
  BitShadowMachine.Item.call(this, options);
}
BitShadowMachine.Utils.extend(Repeller, BitShadowMachine.Item);

/**
 * Initializes an instance.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.G = 1] Universal Gravitational Constant.
 * @param {number} [opt_options.mass = 1000] Mass. Increase for a greater gravitational effect.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.scale = 20] Scale.
 * @param {number} [opt_options.opacity = 0.75] The object's opacity.
 * @param {Array} [opt_options.color = 250, 105, 0] Color.
 */
Repeller.prototype.init = function(opt_options) {

  var options = opt_options || {};

  this.G = typeof options.G === 'undefined' ? -10 : options.G;
  this.mass = typeof options.mass === 'undefined' ? 1000 : options.mass;
  this.isStatic = typeof options.isStatic === 'undefined' ? true : options.isStatic;
  this.scale = typeof options.scale === 'undefined' ? 20 : options.scale;
  this.opacity = typeof options.opacity === 'undefined' ? 0.75 : options.opacity;
  this.color = options.color || [250, 105, 0];

  this.acceleration = options.acceleration || new BitShadowMachine.Vector();
  this.velocity = options.velocity || new BitShadowMachine.Vector();
  this.location = options.location || new BitShadowMachine.Vector(this.world.width / 2, this.world.height / 2);

  this.maxSpeed = typeof options.maxSpeed === 'undefined' ? 10 : options.maxSpeed;
  this.minSpeed = options.minSpeed || 0;
  this.width = 20;
  this.height = 20;
  this.angle = 0;

  BitShadowMachine.System.updateCache(this);
};

/**
 * Updates properties.
 */
Repeller.prototype.step = function() {
  if (this.beforeStep) {
    this.beforeStep.call(this);
  }
};


