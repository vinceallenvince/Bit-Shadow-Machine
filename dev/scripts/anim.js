var Anim = {}, exports = Anim;

(function(exports) {

  // create BitShadowMachine namespace
  exports.BitShadowMachine = {};

  // pass in the namespace and parent object
  new BitShadowMachine(exports.BitShadowMachine, exports);

  /**
   * Creates a new Mover.
   * @constructor
   */
  function Mover(options) {

    var bsm = exports.BitShadowMachine, utils = exports.BitShadowMachine.Utils;

    bsm.Element.call(this, options);

    this.world = options.world;

    this.id = options.id;
    this.width = options.width || 1;
    this.height = options.height || 1;
    this.mass = options.mass || 1;
    this.color = options.color || [0, 0, 0];
    this.opacity = options.opacity || 1;

    this.acceleration = utils.getDataType(options.acceleration) === 'function' ?
        options.acceleration() : options.acceleration || new bsm.Vector();

    this.velocity = utils.getDataType(options.velocity) === 'function' ?
        options.velocity() : options.velocity || new bsm.Vector();

    this.location = utils.getDataType(options.location) === 'function' ?
        options.location() : options.location || new bsm.Vector();

    this.maxSpeed = options.maxSpeed || 16;
    this.maxSteeringForce = options.maxSteeringForce || 10;

    this.separateStrength = options.separateStrength || this.width;
    this.desiredSeparation = options.desiredSeparation || this.width;
    this.flocking = options.flocking || true;

    this.hue = options.hue || 180;
    this.saturation = options.saturation || 1;
    this.lightness = options.lightness || 0.5;

    this.blur = options.blur || 0;

    this.forceVector = new bsm.Vector();
    this.name = 'element';

    return this;
  }
  exports.BitShadowMachine.Utils.extend(Mover, exports.BitShadowMachine.Element);

  /**
   * Called every frame, step() updates the instance's properties.
   */
  Mover.prototype.step = function() {

    var bsm = exports.BitShadowMachine, utils = exports.BitShadowMachine.Utils;

    this.applyForce(this.world.gravity); // gravity

    if (this.seekTarget) { // seek target
      this.applyForce(this.seek(this.seekTarget));
    }

    if (this.flocking) {
      this.flock(exports.BitShadowMachine.System._records.list);
    }

    this.velocity.add(this.acceleration); // add acceleration

    if (this.maxSpeed) {
      this.velocity.limit(this.maxSpeed); // check if velocity > maxSpeed
    }

    this.lightness = utils.map(this.location.distance(this.seekTarget.location),
        0, this.world.width, 0.85, 0);
    this.opacity = utils.map(this.velocity.mag(), 0, this.maxSpeed, 1, 0);

    this.location.add(this.velocity); // add velocity

    this.checkEdges();

    this.acceleration.mult(0); // reset acceleration
  };

  /**
   * Applies a force to this object's acceleration via F = M * A.
   *
   * @param {Object} force The force to be applied (expressed as a vector).
   */
  Mover.prototype.applyForce = function(force) {
    this.forceVector.x = force.x;
    this.forceVector.y = force.y;
    this.forceVector.div(this.mass);
    this.acceleration.add(this.forceVector);
  };

  /**
   * Checks if this object is outside the world bounds.
   */
  Mover.prototype.checkEdges = function() {

    if (this.location.y - this.height/2 < 0) { // top
      this.velocity.mult(-1);
      this.location.y = this.height/2;
    }

    if (this.location.x + this.width/2 > this.world.width) { // right
      this.velocity.mult(-1);
      this.location.x = this.world.width - this.width/2;
    }

    if (this.location.y + this.height/2 > this.world.height) { // bottom
      this.velocity.mult(-1);
      this.location.y = this.world.height - this.height/2;
    }

    if (this.location.x - this.width/2 < 0) { // left
      this.velocity.mult(-1);
      this.location.x = this.width/2;
    }

  };

  /**
   * Calculates a steering force to apply to an object seeking another object.
   *
   * @param {Object} target The object to seek.
   * @returns {Object} The force to apply.
   */
  Mover.prototype.seek = function(target) {

    var m, world = this.world,
        desiredVelocity = bsm.Vector.VectorSub(target.location, this.location),
        distanceToTarget = desiredVelocity.mag();

    desiredVelocity.normalize();

    if (distanceToTarget < world.width / 2) {
      m = bsm.Utils.map(distanceToTarget, 0, world.width / 2, 0, this.maxSpeed);
      desiredVelocity.mult(m);
    } else {
      desiredVelocity.mult(this.maxSpeed);
    }

    desiredVelocity.sub(this.velocity);
    desiredVelocity.limit(this.maxSteeringForce);

    return desiredVelocity;
  };

  /**
   * Applies separation force.
   *
   * @param {array} elements An array of elements.
   */
  Mover.prototype.flock = function(elements) {
    this.applyForce(this.separate(elements).mult(this.separateStrength));
  };

  /**
   * Loops through a passed elements array and calculates a force to apply
   * to avoid all elements.
   *
   * @param {array} elements An array of elements.
   * @returns {Object} A force to apply.
   */
  Mover.prototype.separate = function(elements) {

    var i, max, element, diff, d,
    sum = new bsm.Vector(), count = 0, steer;

    for (i = 0, max = elements.length; i < max; i += 1) {
      element = elements[i];
      if (element.location && this.name === element.name && this.id !== element.id) {

        d = this.location.distance(element.location);

        if ((d > 0) && (d < this.desiredSeparation)) {
          diff = bsm.Vector.VectorSub(this.location, element.location);
          diff.normalize();
          diff.div(d);
          sum.add(diff);
          count += 1;
        }
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxSpeed);
      sum.sub(this.velocity);
      sum.limit(this.maxSteeringForce);
      return sum;
    }
    return new bsm.Vector();
  };
  exports.Mover = Mover;

}(exports));
