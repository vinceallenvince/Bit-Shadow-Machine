var Item = BitShadowMachine.Item,
    System = BitShadowMachine.System,
    Utils = BitShadowMachine.Utils,
    Vector = BitShadowMachine.Vector;

/**
 * Creates a new Mover.
 *
 * Movers are the root object for any item that moves. They are not
 * aware of other Movers or stimuli. They have no means of locomotion
 * and change only due to external forces. You will never directly
 * implement Mover.
 *
 * @constructor
 * @extends Item
 */
function Mover(opt_options) {
  Item.call(this);
}
Utils.extend(Mover, Item);

/**
 * Initializes an instance of Mover.
 * @param  {Object} world An instance of World.
 * @param  {Object} opt_options A map of initial properties.
 * @param {string|Array} [opt_options.color = 255, 255, 255] Color.
 * @param {number} [opt_options.borderRadius = 100] Border radius.
 * @param {number} [opt_options.borderWidth = 2] Border width.
 * @param {string} [opt_options.borderStyle = 'solid'] Border style.
 * @param {Array} [opt_options.borderColor = 60, 60, 60] Border color.
 * @param {boolean} [opt_options.pointToDirection = true] If true, object will point in the direction it's moving.
 * @param {boolean} [opt_options.draggable = false] If true, object can move via drag and drop.
 * @param {Object} [opt_options.parent = null] A parent object. If set, object will be fixed to the parent relative to an offset distance.
 * @param {boolean} [opt_options.pointToParentDirection = true] If true, object points in the direction of the parent's velocity.
 * @param {number} [opt_options.offsetDistance = 30] The distance from the center of the object's parent.
 * @param {number} [opt_options.offsetAngle = 0] The rotation around the center of the object's parent.
 * @param {function} [opt_options.afterStep = null] A function to run after the step() function.
 * @param {function} [opt_options.isStatic = false] Set to true to prevent object from moving.
 * @param {Object} [opt_options.parent = null] Attach to another Flora object.
 */
Mover.prototype.init = function(world, opt_options) {
  Mover._superClass.init.call(this, world, opt_options);

  var options = opt_options || {};

  this.color = options.color || [255, 255, 255];
  this.borderRadius = options.borderRadius || 0;
  this.borderWidth = options.borderWidth || 0;
  this.borderStyle = options.borderStyle || 'none';
  this.borderColor = options.borderColor || [0, 0, 0];
  this.pointToDirection = typeof options.pointToDirection === 'undefined' ? true : options.pointToDirection;
  this.draggable = !!options.draggable;
  this.parent = options.parent || null;
  this.pointToParentDirection = typeof options.pointToParentDirection === 'undefined' ? true : options.pointToParentDirection;
  this.offsetDistance = typeof options.offsetDistance === 'undefined' ? 0 : options.offsetDistance;
  this.offsetAngle = options.offsetAngle || 0;
  this.isStatic = !!options.isStatic;

  var me = this;

  this.isMouseOut = false;
  this.isPressed = false;
  this.mouseOutInterval = false;
  this._friction = new Vector();

  if (this.draggable) {

    Utils.addEvent(this.el, 'mouseover', (function() {
      return function(e) {
        Mover.mouseover.call(me, e);
      };
    }()));

    Utils.addEvent(this.el, 'mousedown', (function() {
      return function(e) {
        Mover.mousedown.call(me, e);
      };
    }()));

    Utils.addEvent(this.el, 'mousemove', (function() {
      return function(e) {
        Mover.mousemove.call(me, e);
      };
    }()));

    Utils.addEvent(this.el, 'mouseup', (function() {
      return function(e) {
        Mover.mouseup.call(me, e);
      };
    }()));

    Utils.addEvent(this.el, 'mouseout', (function() {
      return function(e) {
        Mover.mouseout.call(me, e);
      };
    }()));
  }
};

/**
 * Handles mouseup events.
 */
Mover.mouseover = function() {
  this.isMouseOut = false;
  clearInterval(this.mouseOutInterval);
};

/**
 * Handles mousedown events.
 */
Mover.mousedown = function() {
  this.isPressed = true;
  this.isMouseOut = false;
};

/**
 * Handles mousemove events.
 * @param  {Object} e An event object.
 */
Mover.mousemove = function(e) {

  var x, y;

  if (this.isPressed) {

    this.isMouseOut = false;

    if (e.pageX && e.pageY) {
      x = e.pageX - this.world.el.offsetLeft;
      y = e.pageY - this.world.el.offsetTop;
    } else if (e.clientX && e.clientY) {
      x = e.clientX - this.world.el.offsetLeft;
      y = e.clientY - this.world.el.offsetTop;
    }

    if (x & y) {
      this.location = new Vector(x, y);
    }

    this._checkWorldEdges();
  }

};

/**
 * Handles mouseup events.
 */
Mover.mouseup = function() {
  this.isPressed = false;
  // TODO: add mouse to obj acceleration
};

/**
 * Handles mouse out events.
 */
Mover.mouseout = function() {

  var x, y, me = this, mouse = System.mouse;

  if (this.isPressed) {

    this.isMouseOut = true;

    this.mouseOutInterval = setInterval(function () { // if mouse is too fast for block update, update via an interval until it catches up

      if (me.isPressed && me.isMouseOut) {

        x = mouse.location.x - me.world.el.offsetLeft;
        y = mouse.location.y - me.world.el.offsetTop;

        me.location = new Vector(x, y);
      }
    }, 16);
  }
};

Mover.prototype.step = function() {

  var i, max, x = this.location.x,
      y = this.location.y;

  this.beforeStep.call(this);

  if (this.isStatic || this.isPressed) {
    return;
  }

  // start apply forces

  if (this.world.c) { // friction
    this._friction.x = this.velocity.x;
    this._friction.y = this.velocity.y;
    this._friction.mult(-1);
    this._friction.normalize();
    this._friction.mult(this.world.c);
    this.applyForce(this._friction);
  }
  this.applyForce(this.world.gravity); // gravity

  // attractors
  var attractors = System.getAllItemsByName('Attractor');
  for (i = 0, max = attractors.length; i < max; i += 1) {
    if (this.id !== attractors[i].id) {
      this.applyForce(attractors[i].attract(this));
    }
  }

  // repellers
  var repellers = System.getAllItemsByName('Repeller');
  for (i = 0, max = repellers.length; i < max; i += 1) {
    if (this.id !== repellers[i].id) {
      this.applyForce(repellers[i].attract(this));
    }
  }

  // draggers
  var draggers = System.getAllItemsByName('Dragger');
  for (i = 0, max = draggers.length; i < max; i += 1) {
    if (this.id !== draggers[i].id && Utils.isInside(this, draggers[i])) {
      this.applyForce(draggers[i].drag(this));
    }
  }

  if (this.applyAdditionalForces) {
    this.applyAdditionalForces.call(this);
  }

  this.velocity.add(this.acceleration); // add acceleration

  this.velocity.limit(this.maxSpeed, this.minSpeed);

  this.location.add(this.velocity); // add velocity

  if (this.pointToDirection) { // object rotates toward direction
    if (this.velocity.mag() > 0.1) {
      this.angle = Utils.radiansToDegrees(Math.atan2(this.velocity.y, this.velocity.x));
    }
  }

  if (this.wrapWorldEdges) {
    this._wrapWorldEdges();
  } else if (this.checkWorldEdges) {
    this._checkWorldEdges();
  }

  if (this.controlCamera) {
    this._checkCameraEdges(x, y, this.location.x, this.location.y);
  }

  if (this.parent) { // parenting

    if (this.offsetDistance) {

      r = this.offsetDistance; // use angle to calculate x, y
      theta = Utils.degreesToRadians(this.parent.angle + this.offsetAngle);
      x = r * Math.cos(theta);
      y = r * Math.sin(theta);

      this.location.x = this.parent.location.x;
      this.location.y = this.parent.location.y;
      this.location.add(new Vector(x, y)); // position the child

      if (this.pointToParentDirection) {
        this.angle = Utils.radiansToDegrees(Math.atan2(this.parent.velocity.y, this.parent.velocity.x));
      }

    } else {
      this.location.x = this.parent.location.x;
      this.location.y = this.parent.location.y;
    }
  }

  this.acceleration.mult(0);

  if (this.life < this.lifespan) {
    this.life += 1;
  } else if (this.lifespan !== -1) {
    System.remove(this);
    return;
  }

  this.afterStep.call(this);
};

//
//
//

function Agent(opt_options) {
  Mover.call(this);
}
Utils.extend(Agent, Mover);

Agent.prototype.init = function(world, opt_options) {
  Agent._superClass.init.call(this, world, opt_options);

  var options = opt_options || {};

  this.name = options.type || 'Agent';
  this.followMouse = !!options.followMouse;
  this.maxSteeringForce = typeof options.maxSteeringForce === 'undefined' ? 5 : options.maxSteeringForce;
  this.seekTarget = options.seekTarget || null;
  this.flocking = !!options.flocking;
  this.separateStrength = typeof options.separateStrength === 'undefined' ? 0.3 : options.separateStrength;
  this.alignStrength = typeof options.alignStrength === 'undefined' ? 0.2 : options.alignStrength;
  this.cohesionStrength = typeof options.cohesionStrength === 'undefined' ? 0.1 : options.cohesionStrength;
  this.flowField = options.flowField || null;

  this.sensors = options.sensors || [];
  this.motorSpeed = options.motorSpeed || 0;

  this.color = options.color || [197, 177, 115];
  this.borderWidth = options.borderWidth || 0;
  this.borderStyle = options.borderStyle || 'none';
  this.borderColor = options.borderColor || [255, 255, 255];
  this.borderRadius = options.borderRadius || this.sensors.length ? 100 : 0;
  this.desiredSeparation = typeof options.desiredSeparation === 'undefined' ? this.width * 2 : options.desiredSeparation;

  //

  this.separateSumForceVector = new Vector(); // used in Agent.separate()
  this.alignSumForceVector = new Vector(); // used in Agent.align()
  this.cohesionSumForceVector = new Vector(); // used in Agent.cohesion()
  this.followTargetVector = new Vector(); // used in Agent.applyAdditionalForces()
  this.followDesiredVelocity = new Vector(); // used in Agent.follow()
  this.motorDir = new Vector(); // used in Agent.applyAdditionalForces()

  if (!this.velocity.mag()) {
    this.velocity.x = 1; // angle = 0;
    this.velocity.y = 0;
    this.velocity.normalize();
    this.velocity.rotate(Utils.degreesToRadians(this.angle));
    this.velocity.mult(this.motorSpeed);
  }

  // TODO: test this
  for (var i = 0, max = this.sensors.length; i < max; i++) {
    this.sensors[i].parent = this;
  }
};

/**
 * Applies Agent-specific forces.
 *
 * @returns {Object} This object's acceleration vector.
 */
Agent.prototype.applyAdditionalForces = function() {

  var i, max, sensorActivated, sensor, r, theta, x, y;

  if (this.sensors.length > 0) { // Sensors
    for (i = 0, max = this.sensors.length; i < max; i += 1) {

      sensor = this.sensors[i];

      r = sensor.offsetDistance; // use angle to calculate x, y
      theta = Utils.degreesToRadians(this.angle + sensor.offsetAngle);
      x = r * Math.cos(theta);
      y = r * Math.sin(theta);

      sensor.location.x = this.location.x;
      sensor.location.y = this.location.y;
      sensor.location.add(new Vector(x, y)); // position the sensor

      if (i) {
        sensor.borderStyle = 'none';
      }

      if (sensor.activated) {
        if (typeof sensor.behavior === 'function') {
          this.applyForce(sensor.behavior.call(this, sensor, sensor.target));
        } else {
          this.applyForce(sensor.getBehavior().call(this, sensor, sensor.target));
        }
        sensorActivated = true;
      }

    }
  }

  /**
   * If no sensors were activated and this.motorSpeed != 0,
   * apply a force in the direction of the current velocity.
   */
  if (!sensorActivated && this.motorSpeed) {
    this.motorDir.x = this.velocity.x;
    this.motorDir.y = this.velocity.y;
    this.motorDir.normalize();
    if (this.velocity.mag() > this.motorSpeed) { // decelerate to defaultSpeed
      this.motorDir.mult(-this.motorSpeed);
    } else {
      this.motorDir.mult(this.motorSpeed);
    }
    this.applyForce(this.motorDir); // constantly applies a force
  }

  // TODO: cache a vector for new location
  if (this.followMouse) { // follow mouse
    var t = {
      location: new Vector(System.mouse.location.x,
          System.mouse.location.y)
    };
    this.applyForce(this._seek(t));
  }

  if (this.seekTarget) { // seek target
    this.applyForce(this._seek(this.seekTarget));
  }

  if (this.flowField) { // follow flow field
    var res = this.flowField.resolution,
      col = Math.floor(this.location.x/res),
      row = Math.floor(this.location.y/res),
      loc, target;

    if (this.flowField.field[col]) {

      loc = this.flowField.field[col][row];
      if (loc) { // sometimes loc is not available for edge cases
        this.followTargetVector.x = loc.x;
        this.followTargetVector.y = loc.y;
      } else {
        this.followTargetVector.x = this.location.x;
        this.followTargetVector.y = this.location.y;
      }
      target = {
        location: this.followTargetVector
      };
      this.applyForce(this._follow(target));
    }

  }

  if (this.flocking) {
    this._flock(System.getAllItemsByName(this.name));
  }

  return this.acceleration;
};

/**
 * Calculates a steering force to apply to an object seeking another object.
 *
 * @param {Object} target The object to seek.
 * @returns {Object} The force to apply.
 * @private
 */
Agent.prototype._seek = function(target) {

  var world = this.world,
    desiredVelocity = Vector.VectorSub(target.location, this.location),
    distanceToTarget = desiredVelocity.mag();

  desiredVelocity.normalize();

  if (distanceToTarget < world.width / 2) { // slow down to arrive at target
    var m = Utils.map(distanceToTarget, 0, world.width / 2, 0, this.maxSpeed);
    desiredVelocity.mult(m);
  } else {
    desiredVelocity.mult(this.maxSpeed);
  }

  desiredVelocity.sub(this.velocity);
  desiredVelocity.limit(this.maxSteeringForce);

  return desiredVelocity;
};

/**
 * Calculates a steering force to apply to an object following another object.
 * Agents with flow fields will use this method to calculate a steering force.
 *
 * @param {Object} target The object to follow.
 * @returns {Object} The force to apply.
 */
Agent.prototype._follow = function(target) {

  this.followDesiredVelocity.x = target.location.x;
  this.followDesiredVelocity.y = target.location.y;

  this.followDesiredVelocity.mult(this.maxSpeed);
  this.followDesiredVelocity.sub(this.velocity);
  this.followDesiredVelocity.limit(this.maxSteeringForce);

  return this.followDesiredVelocity;
};

/**
 * Bundles flocking behaviors (separate, align, cohesion) into one call.
 *
 * @returns {Object} This object's acceleration vector.
 */
Agent.prototype._flock = function(items) {
  this.applyForce(this._separate(items).mult(this.separateStrength));
  this.applyForce(this._align(items).mult(this.alignStrength));
  this.applyForce(this._cohesion(items).mult(this.cohesionStrength));
  return this.acceleration;
};

/**
 * Loops through a passed items array and calculates a force to apply
 * to avoid all items.
 *
 * @param {array} items An array of Flora items.
 * @returns {Object} A force to apply.
 */
Agent.prototype._separate = function(items) {

  var i, max, item, diff, d,
  sum, count = 0, steer;

  this.separateSumForceVector.x = 0;
  this.separateSumForceVector.y = 0;
  sum = this.separateSumForceVector;

  for (i = 0, max = items.length; i < max; i += 1) {
    item = items[i];
    if (this.id !== item.id) {

      d = this.location.distance(item.location);

      if ((d > 0) && (d < this.desiredSeparation)) {
        diff = Vector.VectorSub(this.location, item.location);
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
  return new Vector(); // TODO: do we need this?
};

/**
 * Loops through a passed items array and calculates a force to apply
 * to align with all items.
 *
 * @param {array} items An array of Flora items.
 * @returns {Object} A force to apply.
 */
Agent.prototype._align = function(items) {

  var i, max, item, d,
    neighbordist = this.width * 2,
    sum, count = 0, steer;

  this.alignSumForceVector.x = 0;
  this.alignSumForceVector.y = 0;
  sum = this.alignSumForceVector;

  for (i = 0, max = items.length; i < max; i += 1) {
    item = items[i];
    d = this.location.distance(item.location);

    if ((d > 0) && (d < neighbordist)) {
      if (this.id !== item.id) {
        sum.add(item.velocity);
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
  return new Vector();
};

/**
 * Loops through a passed items array and calculates a force to apply
 * to stay close to all items.
 *
 * @param {array} items An array of Flora items.
 * @returns {Object} A force to apply.
 */
Agent.prototype._cohesion = function(items) {

  var i, max, item, d,
    neighbordist = 10,
    sum, count = 0, desiredVelocity, steer;

  this.cohesionSumForceVector.x = 0;
  this.cohesionSumForceVector.y = 0;
  sum = this.cohesionSumForceVector;

  for (i = 0, max = items.length; i < max; i += 1) {
    item = items[i];
    d = this.location.distance(item.location);

    if ((d > 0) && (d < neighbordist)) {
      if (this.id !== item.id) {
        sum.add(item.location);
        count += 1;
      }
    }
  }

  if (count > 0) {
    sum.div(count);
    sum.sub(this.location);
    sum.normalize();
    sum.mult(this.maxSpeed);
    sum.sub(this.velocity);
    sum.limit(this.maxSteeringForce);
    return sum;
  }
  return new Vector();
};


