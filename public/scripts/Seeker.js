/**
 * Creates a new Seeker.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @constructor
 */
function Seeker(opt_options) {

  var options = opt_options || {};
  options.name = 'Seeker';
  BitShadowMachine.Item.call(this, options);
}
BitShadowMachine.Utils.extend(Seeker, BitShadowMachine.Item);

/**
 * Initializes the Box.
 * @param {Object} options Initial options.
 */
Seeker.prototype.init = function(options) {
  this.width = options.width || 1;
  this.height = options.height || 1;
  this.color = options.color || [100, 100, 100];
  this.borderRadius = options.borderRadius || 0;

  this.acceleration = options.acceleration || new BitShadowMachine.Vector();
  this.velocity = options.velocity || new BitShadowMachine.Vector();
  this.location = options.location || new BitShadowMachine.Vector(this.world.width / 2, this.world.height / 2);
  this.mass = options.mass || 10;
  this._force = new BitShadowMachine.Vector();

  this.maxSpeed = typeof options.maxSpeed === 'undefined' ? 10 : options.maxSpeed;
  this.minSpeed = options.minSpeed || 0;
  this.bounciness = options.bounciness || 1;

  this.checkWorldEdges = typeof options.checkWorldEdges === 'undefined' ? true : options.checkWorldEdges;
  this.life = options.life || 0;
  this.lifespan = typeof options.lifespan === 'undefined' ? -1 : options.lifespan;

  this.maxSteeringForce = typeof options.maxSteeringForce === 'undefined' ? 10 : options.maxSteeringForce;
  this.seekTarget = options.seekTarget || null;
};


/**
 * Updates properties.
 */
Seeker.prototype.step = function() {

  var repellers = BitShadowMachine.System._caches.Repeller;

  if (this.beforeStep) {
    this.beforeStep.call(this);
  }

  if (!this.isStatic) {
    this.applyForce(this.world.gravity);
    if (this.seekTarget) {
      this.applyForce(this._seek(this.seekTarget));
    }
    if (repellers && repellers.list.length > 0) { // repeller
      for (i = 0, max = repellers.list.length; i < max; i += 1) {
        if (this.id !== repellers.list[i].id) {
          this.applyForce(this.attract(repellers.list[i]));
        }
      }
    }

    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed, this.minSpeed);
    this.angle = BitShadowMachine.Utils.radiansToDegrees(Math.atan2(this.velocity.y, this.velocity.x));
    this.location.add(this.velocity);
    if (this.checkWorldEdges) {
      this._checkWorldEdges();
    }
    this.acceleration.mult(0);
    if (this.life < this.lifespan) {
      this.life++;
    } else if (this.lifespan !== -1) {
      BitShadowMachine.System.destroyItem(this);
    }
  }
};

/**
 * Adds a force to this object's acceleration.
 *
 * @param {Object} force A Vector representing a force to apply.
 * @returns {Object} A Vector representing a new acceleration.
 */
Seeker.prototype.applyForce = function(force) {
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
 * Calculates a force to apply to simulate attraction on an object.
 *
 * @param {Object} attractor The attracting object.
 * @returns {Object} A force to apply.
 */
Seeker.prototype.attract = function(attractor) {

  var force = BitShadowMachine.Vector.VectorSub(attractor.location, this.location),
    distance, strength;

  distance = force.mag();
  distance = exports.Utils.constrain(distance, this.width * this.height, attractor.scale); // min = scale/8 (totally arbitrary); max = scale; the size of the attractor
  force.normalize();
  strength = (attractor.G * attractor.mass * this.mass) / (distance * distance);
  force.mult(strength);

  return force;
};

/**
 * Calculates a steering force to apply to an object seeking another object.
 *
 * @param {Object} target The object to seek.
 * @returns {Object} The force to apply.
 * @private
 */
Seeker.prototype._seek = function(target) {

  var world = this.world,
    desiredVelocity = BitShadowMachine.Vector.VectorSub(target.location, this.location),
    distanceToTarget = desiredVelocity.mag();

  desiredVelocity.normalize();

  /*if (distanceToTarget < world.width / 2) { // slow down to arrive at target
    var m = exports.Utils.map(distanceToTarget, 0, world.width / 2, 0, this.maxSpeed);
    desiredVelocity.mult(m);
  } else {*/
    desiredVelocity.mult(this.maxSpeed);
  //}

  desiredVelocity.sub(this.velocity);
  //desiredVelocity.limit(this.maxSteeringForce);

  return desiredVelocity;
};

/**
 * Determines if this object is outside the world bounds.
 *
 * @private
 */
Seeker.prototype._checkWorldEdges = function() {

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