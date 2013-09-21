/**
 * Creates a new Box.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @constructor
 */
function Box(opt_options) {

  var options = opt_options || {};
  options.name = 'Box';
  exports.Item.call(this, options);
}
exports.Utils.extend(Box, Item);

/**
 * Initializes the ball.
 * @param {Object} options Initial options.
 */
Box.prototype.init = function(options) {
  this.width = options.width || 20;
  this.height = options.height || 20;
  this.color = options.color || [100, 100, 100];
  this.borderRadius = options.borderRadius || 0;

  this.acceleration = options.acceleration || new exports.Vector();
  this.velocity = options.velocity || new exports.Vector();
  this.location = options.location || new exports.Vector(this.world.width / 2, this.world.height / 2);
  this.initLocation = new exports.Vector();
  this.mass = options.mass || 10;
};


/**
 * Updates properties.
 */
Box.prototype.step = function() {
  if (!this.isStatic) {
    this.applyForce(this.world.gravity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed, this.minSpeed);
    this.location.add(this.velocity);
    this._checkWorldEdges();
    this.acceleration.mult(0);
  }
};

/**
 * Adds a force to this object's acceleration.
 *
 * @param {Object} force A Vector representing a force to apply.
 * @returns {Object} A Vector representing a new acceleration.
 */
Box.prototype.applyForce = function(force) {
  // calculated via F = m * a
  if (force) {
    this._force.x = force.x;
    this._force.y = force.y;
    this._force.div(this.mass);
    this.acceleration.add(this._force);
    return this.acceleration;
  }
};

/**
 * Determines if this object is outside the world bounds.
 *
 * @private
 */
Box.prototype._checkWorldEdges = function() {

  if (this.location.y < 0) { // top
    this.velocity.mult(-this.bounciness);
    this.location.y = 0;
    return;
  }

  if (this.location.x > this.world.width) { // right
    this.velocity.mult(-this.bounciness);
    this.location.x = this.world.width;
    return;
  }

  if (this.location.y > this.world.height) { // bottom
    this.velocity.mult(-this.bounciness);
    this.location.y = this.world.height;
    return;
  }

  if (this.location.x < 0) { // left
    this.velocity.mult(-this.bounciness);
    this.location.x = 0;
    return;
  }
};