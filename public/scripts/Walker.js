/*global BitShadowMachine, document */
/**
 * Creates a new Walker.
 *
 * Walkers have no seeking, steering or directional behavior and just randomly
 * explore their World. Use Walkers to create wandering objects or targets
 * for Agents to seek. They are not affected by gravity or friction.
 *
 * @constructor
 * @extends BitShadowMachine.Item
 * @param {Object} [opt_options=] A map of initial properties.
 */
function Walker(opt_options) {
  var options = opt_options || {};
  options.name = options.name || 'Walker';
  BitShadowMachine.Item.call(this, options);
}
BitShadowMachine.Utils.extend(Walker, BitShadowMachine.Item);

/**
 * Initializes an instance.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {boolean} [opt_options.perlin = true] If set to true, object will use Perlin Noise to calculate its location.
 * @param {boolean} [opt_options.remainsOnScreen = false] If set to true and isPerlin = true, object will avoid world edges.
 * @param {number} [opt_options.perlinSpeed = 0.005] If isPerlin = true, perlinSpeed determines how fast the object location moves through the noise space.
 * @param {number} [opt_options.perlinTime = 0] Sets the Perlin Noise time.
 * @param {number} [opt_options.perlinAccelLow = -0.075] The lower bound of acceleration when isPerlin = true.
 * @param {number} [opt_options.perlinAccelHigh = 0.075] The upper bound of acceleration when isPerlin = true.
 * @param {number} [opt_options.offsetX = Math.random() * 10000] The x offset in the Perlin Noise space.
 * @param {number} [opt_options.offsetY = Math.random() * 10000] The y offset in the Perlin Noise space.
 * @param {boolean} [opt_options.random = false] Set to true for walker to move in a random direction.
 * @param {number} [opt_options.randomRadius = 100] If isRandom = true, walker will look for a new location each frame based on this radius.
 * @param {string|Array} [opt_options.color = 255, 150, 50] Color.
 * @param {boolean} [opt_options.avoidWorldEdges = false] If set to true, object steers away from
 *    world boundaries.
 * @param {number} [opt_options.avoidWorldEdgesStrength = 0] The distance threshold for object
 *    start steering away from world boundaries.
 */
Walker.prototype.init = function(opt_options) {

  var options = opt_options || {};

  this.perlin = typeof options.perlin === 'undefined' ? true : options.perlin;
  this.remainsOnScreen = !!options.remainsOnScreen;
  this.perlinSpeed = typeof options.perlinSpeed === 'undefined' ? 0.005 : options.perlinSpeed;
  this.perlinTime = options.perlinTime || 0;
  this.perlinAccelLow = typeof options.perlinAccelLow === 'undefined' ? -0.075 : options.perlinAccelLow;
  this.perlinAccelHigh = typeof options.perlinAccelHigh === 'undefined' ? 0.075 : options.perlinAccelHigh;
  this.offsetX = typeof options.offsetX === 'undefined' ? Math.random() * 10000 : options.offsetX;
  this.offsetY = typeof options.offsetY === 'undefined' ? Math.random() * 10000 : options.offsetY;
  this.random = !!options.random;
  this.randomRadius = typeof options.randomRadius === 'undefined' ? 100 : options.randomRadius;
  this.avoidWorldEdges = !!options.avoidWorldEdges;
  this.avoidWorldEdgesStrength = typeof options.avoidWorldEdgesStrength === 'undefined' ?
      50 : options.avoidWorldEdgesStrength;

  //

  this.acceleration = options.acceleration || new BitShadowMachine.Vector();
  this.velocity = options.velocity || new BitShadowMachine.Vector();
  this.location = options.location || new BitShadowMachine.Vector(this.world.width / 2, this.world.height / 2);
  this.mass = options.mass || 10;
  this._force = new BitShadowMachine.Vector();

  this.maxSpeed = typeof options.maxSpeed === 'undefined' ? 10 : options.maxSpeed;
  this.minSpeed = options.minSpeed || 0;
  this.bounciness = options.bounciness || 1;

  this.checkWorldEdges = typeof options.checkWorldEdges === 'undefined' ? true : options.checkWorldEdges;
  this.wrapWorldEdges = true;
  this.life = options.life || 0;
  this.lifespan = typeof options.lifespan === 'undefined' ? -1 : options.lifespan;
};

/**
 * Updates properties.
 */
Walker.prototype.step = function() {
  if (!this.isStatic) {
    if (this.applyForces) { // !! rename this
      this.applyForces();
    }
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed, this.minSpeed);
    this.location.add(this.velocity);
    if (this.checkWorldEdges) {
      this._checkWorldEdges();
    }
    this.acceleration.mult(0);
    if (this.life < this.lifespan) {
      this.life++;
    } else if (this.lifespan !== -1) {
      exports.System.destroyItem(this);
    }
  }
};

/**
 * Adds a force to this object's acceleration.
 *
 * @param {Object} force A Vector representing a force to apply.
 * @returns {Object} A Vector representing a new acceleration.
 */
Walker.prototype.applyForce = function(force) {
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
Walker.prototype._checkWorldEdges = function() {

  var x, y, worldRight = this.world.width,
      worldBottom = this.world.height,
      worldBounds = this.worldBounds,
      location = this.location,
      velocity = this.velocity,
      width = this.width,
      height = this.height,
      bounciness = this.bounciness;

  // transform origin is at the center of the object
  if (this.wrapWorldEdgesSoft) {

    x = location.x;
    y = location.y;

    if (location.x > worldRight) {
      location.x = -(worldRight - location.x);
      if (this.controlCamera) {
        this.world.location.x = this.world.location.x + x - location.x;
      }
    } else if (location.x < 0) {
      location.x = worldRight + location.x;
      if (this.controlCamera) {
        this.world.location.x = this.world.location.x + x - location.x;
      }
    }

    if (location.y > worldBottom) {
      location.y = -(worldBottom - location.y);
      if (this.controlCamera) {
        this.world.location.y = this.world.location.y + y - location.y;
      }
    } else if (location.y < 0) {
      location.y = worldBottom + location.y;
      if (this.controlCamera) {
        this.world.location.y = this.world.location.y + y - location.y;
      }
    }
  } else if (this.wrapWorldEdges) {

    x = location.x;
    y = location.y;

    if (location.x > worldRight) {
      location.x = 0;
      if (this.controlCamera) {
        this.world.location.x = this.world.location.x + x - location.x;
      }
    } else if (location.x < 0) {
      location.x = worldRight;
      if (this.controlCamera) {
        this.world.location.x = this.world.location.x + x - location.x;
      }
    }

    if (location.y > worldBottom) {
      location.y = 0;
      if (this.controlCamera) {
        this.world.location.y = this.world.location.y + y - location.y;
      }
    } else if (location.y < 0) {
      location.y = worldBottom;
      if (this.controlCamera) {
        this.world.location.y = this.world.location.y + y - location.y;
      }
    }
  } else {

    if (location.x + width / 2 > worldRight) {
      location.x = worldRight - width / 2;
      velocity.x *= -1 * bounciness;
    } else if (location.x < width / 2) {
      location.x = width / 2;
      velocity.x *= -1 * bounciness;
    }

    if (location.y + height / 2 > worldBottom) {
      location.y = worldBottom - height / 2;
      velocity.y *= -1 * bounciness;
    } else if (location.y < height / 2) {
      location.y = height / 2;
      velocity.y *= -1 * bounciness;
    }
  }
};

/**
 * If walker uses perlin noise, updates acceleration based on noise space. If walker
 * is a random walker, updates location based on random location.
 */
Walker.prototype.applyForces = function() {

  var Utils = BitShadowMachine.Utils;

  // walker use either perlin noise or random walk
  if (this.perlin) {

    this.perlinTime += this.perlinSpeed;

    this.acceleration.mult(0);
    this.velocity.mult(0);

    if (this.remainsOnScreen) {
      this.location.x =  Utils.map(SimplexNoise.noise(this.perlinTime + this.offsetX, 0, 0.1), -1, 1, 0, this.world.width);
      this.location.y =  Utils.map(SimplexNoise.noise(0, this.perlinTime + this.offsetY, 0.1), -1, 1, 0, this.world.height);
    } else {
      this.acceleration.x =  Utils.map(SimplexNoise.noise(this.perlinTime + this.offsetX, 0), -1, 1, this.perlinAccelLow, this.perlinAccelHigh);
      this.acceleration.y =  Utils.map(SimplexNoise.noise(0, this.perlinTime + this.offsetY), -1, 1, this.perlinAccelLow, this.perlinAccelHigh);
    }

  } else if (this.random) {
    this.seekTarget = { // find a random point and steer toward it
      location: BitShadowMachine.Vector.VectorAdd(this.location, new BitShadowMachine.Vector(Utils.getRandomNumber(-this.randomRadius, this.randomRadius), Utils.getRandomNumber(-this.randomRadius, this.randomRadius)))
    };
    this.applyForce(this._seek(this.seekTarget));
  }

  if (this.avoidWorldEdges) {
    this._checkAvoidEdges();
  }
};
