/*
Bit Shadow Machine
Copyright (c) 2012 Vince Allen
vince@vinceallen.com
http://www.vinceallen.com
https://github.com/foldi/Bit-Shadow-Machine

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
/* Version: 1.0.2 */
/* Build time: December 31, 2012 04:13:19 */
/** @namespace */
function BitShadowMachine(exports, opt_parent) {

'use strict';

/**
* If using BitShadowMachine as a renderer in a
* parent object, pass a reference to the parent
* via the opt_parent param.
*/
var parent = opt_parent || null;
/*global window */
/**
 * RequestAnimationFrame shim layer with setTimeout fallback
 * @param {function} callback The function to call.
 * @returns {function|Object} An animation frame or a timeout object.
 */
window.requestAnimFrame = (function(callback){

  'use strict';

  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(callback) {
            window.setTimeout(callback, 1000 / 60);
          };
})();
/*global exports, document, window */
/*jshint supernew:true */

/**
 * @namespace
 */
var Utils = {};

/**
 * Use to extend the properties and methods of a superClass
 * onto a subClass.
 */
Utils.extend = function(subClass, superClass) {

  function F() {}
  F.prototype = superClass.prototype;
  subClass.prototype = new F;
  subClass.prototype.constructor = subClass;
};

/**
 * Re-maps a number from one range to another.
 *
 * @param {number} value The value to be converted.
 * @param {number} min1 Lower bound of the value's current range.
 * @param {number} max1 Upper bound of the value's current range.
 * @param {number} min2 Lower bound of the value's target range.
 * @param {number} max2 Upper bound of the value's target range.
 * @returns {number} A number.
 */
Utils.map = function(value, min1, max1, min2, max2) { // returns a new value relative to a new range

  'use strict';

  var unitratio = (value - min1) / (max1 - min1);
  return (unitratio * (max2 - min2)) + min2;
};

/**
 * Returns the data type of the passed argument.
 *
 * @param {*} element The variable to test.
*/
Utils.getDataType = function(element) {

  if (Object.prototype.toString.call(element) === '[object Array]') {
    return 'array';
  }

  if (Object.prototype.toString.call(element) === '[object NodeList]') {
    return 'nodeList';
  }

  return typeof element;
};

/**
 * Use to get the browser window's width and height.
 *
 * @returns {Object} The current window width and height.
 * @example getWindowDim() returns {width: 1024, height: 768}
 */
Utils.getWindowSize = function() {

  var d = {
    'width' : false,
    'height' : false
  };
  if (typeof(window.innerWidth) !== "undefined") {
    d.width = window.innerWidth;
  } else if (typeof(document.documentElement) !== "undefined" &&
      typeof(document.documentElement.clientWidth) !== "undefined") {
    d.width = document.documentElement.clientWidth;
  } else if (typeof(document.body) !== "undefined") {
    d.width = document.body.clientWidth;
  }
  if (typeof(window.innerHeight) !== "undefined") {
    d.height = window.innerHeight;
  } else if (typeof(document.documentElement) !== "undefined" &&
      typeof(document.documentElement.clientHeight) !== "undefined") {
    d.height = document.documentElement.clientHeight;
  } else if (typeof(document.body) !== "undefined") {
    d.height = document.body.clientHeight;
  }
  return d;
};

/**
 * Generates a psuedo-random number within a range.
 *
 * @param {number} low The low end of the range.
 * @param {number} high The high end of the range.
 * @param {boolean} [flt] Set to true to return a float.
 * @returns {number} A number.
 */
Utils.getRandomNumber = function(low, high, flt) {

  'use strict';

  if (flt) {
    return Math.random()*(high-(low-1)) + low;
  }
  return Math.floor(Math.random()*(high-(low-1))) + low;
};

/**
 * Add an event listener to a DOM element.
 *
 * @param {Object} target The element to receive the event listener.
 * @param {string} eventType The event type.
 * @param {function} The function to run when the event is triggered.
 */
Utils.addEvent = function(target, eventType, handler) {

  'use strict';

  if (target.addEventListener) { // W3C
    this.addEvent = function(target, eventType, handler) {
      target.addEventListener(eventType, handler, false);
    };
  } else if (target.attachEvent) { // IE
    this.addEvent = function(target, eventType, handler) {
      target.attachEvent("on" + eventType, handler);
    };
  }
  this.addEvent(target, eventType, handler);
};

/**
 * Removes an event listener from a DOM element.
 *
 * @param {Object} target The element with the event listener.
 * @param {string} eventType The event type.
 * @param {function} The function to run when the event is triggered.
 */
Utils.removeEvent = function (target, eventType, handler) {
  if (target.removeEventListener) { // W3C
    this.removeEvent = function (target, eventType, handler) {
      target.removeEventListener(eventType, handler, false);
    };
  } else if (target.detachEvent) { // IE
    this.removeEvent = function (target, eventType, handler) {
      target.detachEvent("on" + eventType, handler);
    };
  }
  this.removeEvent(target, eventType, handler);
};

exports.Utils = Utils;
/*global exports */
/**
 * Creates a new Element.
 * @constructor
 */
function Element(opt_options) {

  this.options = opt_options || {};
  this.options.name = 'element';
  this.options.id = this.options.name + exports.System._getNewId();

  this.options.blur = 0;

  return this;
}

/**
 * Sets element's properties via initial options.
 * @private
 */
Element.prototype._init = function() {

  var i, options = this.options;

  if (!options.world || exports.Utils.getDataType(options.world) !== 'object') {
    throw new Error('Element: A valid instance of the World class is required for a new Element.');
  }

  // re-assign all options
  for (i in options) {
    if (options.hasOwnProperty(i)) {
      if (exports.Utils.getDataType(options[i]) === 'function') {
        this[i] = options[i]();
      } else {
        this[i] = options[i];
      }
    }
  }
};

exports.Element = Element;
/*global exports */
/*jshint supernew:true */
/**
 * Creates a new Vector.
 *
 * @param {number} [opt_x = 0] The x location.
 * @param {number} [opt_y = 0] The y location.
 * @constructor
 */
function Vector(opt_x, opt_y) {
  'use strict';
  var x = opt_x || 0,
      y = opt_y || 0;
  this.x = x;
  this.y = y;
}

/**
 * Subtract two vectors.
 *
 * @param {number} v1 The first vector.
 * @param {number} v2 The second vector.
 * @returns {Object} A new Vector.
 */
Vector.VectorSub = function(v1, v2) {
  'use strict';
  return new Vector(v1.x - v2.x, v1.y - v2.y);
};

/**
 * Add two vectors.
 *
 * @param {number} v1 The first vector.
 * @param {number} v2 The second vector.
 * @returns {Object} A new Vector.
 */
Vector.VectorAdd = function(v1, v2) {
  'use strict';
  return new Vector(v1.x + v2.x, v1.y + v2.y);
};

/**
 * Multiply a vector by a scalar value.
 *
 * @param {number} v A vector.
 * @param {number} n Vector will be multiplied by this number.
 * @returns {Object} A new Vector.
 */
Vector.VectorMult = function(v, n) {
  'use strict';
  return new Vector(v.x * n, v.y * n);
};

/**
 * Divide two vectors.
 *
 * @param {number} v A vector.
 * @param {number} n Vector will be divided by this number.
 * @returns {Object} A new Vector.
 */
Vector.VectorDiv = function(v, n) {
  'use strict';
  return new Vector(v.x / n, v.y / n);
};

/**
 * Calculates the distance between two vectors.
 *
 * @param {number} v1 The first vector.
 * @param {number} v2 The second vector.
 * @returns {number} The distance between the two vectors.
 */
Vector.VectorDistance = function(v1, v2) {
  'use strict';
  return Math.sqrt(Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2));
};

/**
 * Get the midpoint between two vectors.
 *
 * @param {number} v1 The first vector.
 * @param {number} v2 The second vector.
 * @returns {Object} A new Vector.
 */
Vector.VectorMidPoint = function(v1, v2) {
  'use strict';
  return Vector.VectorAdd(v1, v2).div(2); // midpoint = (v1 + v2)/2
};

/**
 * Get the angle between two vectors.
 *
 * @param {number} v1 The first vector.
 * @param {number} v2 The second vector.
 * @returns {number} An angle.
 */
Vector.VectorAngleBetween = function(v1, v2) {
  'use strict';
  var dot = v1.dot(v2),
  theta = Math.acos(dot / (v1.mag() * v2.mag()));
  return theta;
};

Vector.prototype.name = 'Vector';

/**
* Returns an new vector with all properties and methods of the
* old vector copied to the new vector's prototype.
*
* @returns {Object} A vector.
*/
Vector.prototype.clone = function() {
  'use strict';
  function F() {}
  F.prototype = this;
  return new F;
};

/**
 * Adds a vector to this vector.
 *
 * @param {Object} vector The vector to add.
 * @returns {Object} This vector.
 */
Vector.prototype.add = function(vector) {
  'use strict';
  this.x += vector.x;
  this.y += vector.y;
  return this;
};

/**
 * Subtracts a vector from this vector.
 *
 * @param {Object} vector The vector to subtract.
 * @returns {Object} This vector.
 */
Vector.prototype.sub = function(vector) {
  'use strict';
  this.x -= vector.x;
  this.y -= vector.y;
  return this;
};

/**
 * Multiplies this vector by a passed value.
 *
 * @param {number} n Vector will be multiplied by this number.
 * @returns {Object} This vector.
 */
Vector.prototype.mult = function(n) {
  'use strict';
  this.x *= n;
  this.y *= n;
  return this;
};

/**
 * Divides this vector by a passed value.
 *
 * @param {number} n Vector will be divided by this number.
 * @returns {Object} This vector.
 */
Vector.prototype.div = function(n) {
  'use strict';
  this.x = this.x / n;
  this.y = this.y / n;
  return this;
};

/**
 * Calculates the magnitude of this vector.
 *
 * @returns {number} The vector's magnitude.
 */
Vector.prototype.mag = function() {
  'use strict';
  return Math.sqrt((this.x * this.x) + (this.y * this.y));
};

/**
 * Limits the vector's magnitude.
 *
 * @param {number} high The upper bound of the vector's magnitude.
 * @returns {Object} This vector.
 */
Vector.prototype.limit = function(high) {
  'use strict';
  if (this.mag() > high) {
    this.normalize();
    this.mult(high);
  }
  return this;
};

/**
 * Divides a vector by its magnitude to reduce its magnitude to 1.
 * Typically used to retrieve the direction of the vector for later manipulation.
 *
 * @returns {Object} This vector.
 */
Vector.prototype.normalize = function() {
  'use strict';
  var m = this.mag();
  if (m !== 0) {
    return this.div(m);
  }
};

/**
 * Calculates the distance between this vector and a passed vector.
 *
 * @param {Object} vector The target vector.
 * @returns {Object} The distance between the two vectors.
 */
Vector.prototype.distance = function(vector) {
  'use strict';
  return Math.sqrt(Math.pow(vector.x - this.x, 2) + Math.pow(vector.y - this.y, 2));
};

/**
 * Rotates a vector using a passed angle in radians.
 *
 * @param {number} radians The angle to rotate in radians.
 * @returns {Object} This vector.
 */
Vector.prototype.rotate = function(radians) {
  'use strict';
  var cos = Math.cos(radians),
    sin = Math.sin(radians),
    x = this.x,
    y = this.y;

  this.x = x * cos - y * sin;
  this.y = x * sin + y * cos;
  return this;
};

/**
 * Calculates the midpoint between this vector and a passed vector.
 *
 * @param {Object} v1 The first vector.
 * @param {Object} v1 The second vector.
 * @returns {Object} A vector representing the midpoint between the passed vectors.
 */
Vector.prototype.midpoint = function(vector) {
  'use strict';
  return Vector.VectorAdd(this, vector).div(2);
};

/**
 * Calulates the dot product.
 *
 * @param {Object} vector The target vector.
 * @returns {Object} A vector.
 */
Vector.prototype.dot = function(vector) {
  'use strict';
  if (this.z && vector.z) {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }
  return this.x * vector.x + this.y * vector.y;
};

exports.Vector = Vector;
/*global exports, window, document, parent */
/**
 * Creates a new System.
 * @constructor
 */
function System() {
  this.name = 'system';
}

/**
 * Stores references to all elements in the system.
 * @private
 */
System._records = {
  lookup: {},
  list: []
};

/**
 * Stores references to all worlds in the system.
 * @private
 */
System._worldsCache = {
  list: [],
  buffers: {}
};

/**
 * Used to create unique ids.
 * @private
 */
System._idCount = 0;

/**
 * Holds the current and last mouse position relative
 * to the browser window.
 */
System.mouse = {
  location: new exports.Vector()
};

/**
 * Stores the time in milliseconds of the last
 * resize event. Used to pause renderer during resize
 * and resume when resize is complete.
 *
 * @private
 */
System._resizeTime = 0;

/**
 * Increments idCount and returns the value. Use when
 * generating a unique id.
 * @private
 */
System._getNewId = function() {
  this._idCount++;
  return this._idCount;
};

/**
 * Returns the current id count.
 * @private
 */
System._getIdCount = function() {
  return this._idCount;
};

/**
 * Initializes the system.
 *
 * @param {Function} opt_setup A function to run before System's _update loop starts.
 * @param {Object|Array} opt_worlds A single reference or an array of
 *    references to DOM elements representing System worlds. If no value is supplied,
 *    the System will use document.body.
 * @param {boolean} opt_noStart If true, _update is not called. Use to setup a System
 *    and start the _update loop at a later time.
 */
System.create = function(opt_setup, opt_worlds, opt_noStart) {

  var me = System, i, max, records = System._records.list,
      setup = opt_setup || function() {},
      worlds = opt_worlds, world,
      noStart = opt_noStart, utils = exports.Utils,
      worldsCache = System._worldsCache.list,
      worldsCacheBuffer = System._worldsCache.buffers;

  System._setup = setup;
  System._worlds = worlds;
  System._noStart = opt_noStart;

  // if no world element is passed, new World will use document.body.
  if (!worlds) {
    records[records.length] = new exports.World();
    worldsCache[worldsCache.length] = records[records.length - 1];
    worldsCacheBuffer[worldsCache[worldsCache.length - 1].id] = '';
  // if one world is passed
  } else if (utils.getDataType(worlds) === 'object') {
    records[records.length] = new exports.World(worlds);
    worldsCache[worldsCache.length] = records[records.length - 1];
    worldsCacheBuffer[worldsCache[worldsCache.length - 1].id] = '';
  // if an array of worlds is passed
  } else if (utils.getDataType(worlds) === 'array' && worlds.length) {
    for (i = 0, max = worlds.length; i < max; i++) {
      world = worlds[i];
      if (utils.getDataType(world) === 'object') {
        records[records.length] = new exports.World(world);
        worldsCache[worldsCache.length] = records[records.length - 1];
        worldsCacheBuffer[worldsCache[worldsCache.length - 1].id] = '';
      }
    }
  }

  // run the initial setup function
  if (utils.getDataType(System._setup) === 'function') {
    System._setup.call(this);
  }

  // if system is meant to start immediately, start it.
  if (!noStart) {
    System._update();
  }

  // center the initial mouse loc
  System.mouse.location = new exports.Vector((utils.getWindowSize().width / 2) / System._records.list[0].resolution,
      (utils.getWindowSize().height / 2) / System._records.list[0].resolution);

  // save the current and last mouse position
  utils.addEvent(window, 'mousemove', function(e) {
    System._recordMouseLoc.call(System, e);
  });

  // listen for window resize
  utils.addEvent(window, 'resize', function(e) {
    System._resize.call(System, e);
  });

  // listen for keyup
  utils.addEvent(document, 'keyup', function(e) {
    System._keyup.call(System, e);
  });

};

/**
 * Resets and starts the System.
 * @private
 */
System.reset = function() {

  var utils = exports.Utils;

  this._records = {
    lookup: {},
    list: []
  };

  this._worldsCache = {
    list: [],
    buffers: {}
  };

  this._idCount = 0;

  this.mouse = {
    location: new exports.Vector()
  };

  this._resizeTime = 0;

  // TODO: remove events

  this.create(this._setup, this._worlds, this._noStart);
};

/**
 * Saves the mouse location relative to the browser window.
 * @private
 */
System._recordMouseLoc = function (e) {

  var resolution = this._records.list[0].resolution;

  if (e.pageX && e.pageY) {
    this.mouse.location.x = e.pageX / resolution;
    this.mouse.location.y = e.pageY / resolution;
  } else if (e.clientX && e.clientY) {
    this.mouse.location.x = e.clientX / resolution;
    this.mouse.location.y = e.clientY / resolution;
  }
};

/**
 * Executes functions based on the keyup event's keycode.
 * @private
 */
System._keyup = function(e) {

  var i, max, worlds = this.allWorlds(),
      records = this.allElements;

  if (e.keyCode === 80) { // 'p'; pause
    for (i = 0, max = worlds.length; i < max; i++) {
      worlds[i].pauseStep = !worlds[i].pauseStep;
    }
  }
};

/**
 * Called from a window resize event, resize() repositions all elements relative
 * to the new window size.
 * @private
 */
System._resize = function(e) {

  var i, max, loc, records = this._records.list, record, world,
      screenDimensions = exports.Utils.getWindowSize(),
      windowWidth = screenDimensions.width,
      windowHeight = screenDimensions.height,
      worldsCache = this._worldsCache.list;

  // set _resizeTime; checked in _update for resize stop
  this._resizeTime = new Date().getTime();

  // set pauseStep for all worlds
  for (i = 0, max = worldsCache.length; i < max; i += 1) {
    worldsCache[i].pauseStep = true;
  }

  for (i = 0, max = records.length; i < max; i += 1) {

    record = records[i];

    if (record.name !== 'world') {

      loc = record.location;
      world = record.world;

      if (loc) {
        loc.x = (windowWidth * (loc.x / world.width)) / world.resolution;
        loc.y = (windowHeight * (loc.y / world.height)) / world.resolution;
      }
    }
  }

  // reset the bounds of all worlds
  for (i = 0, max = worldsCache.length; i < max; i += 1) {
    worldsCache[i].width = windowWidth / worldsCache[i].resolution;
    worldsCache[i].height = windowHeight / worldsCache[i].resolution;
  }
};

/**
 * Iterates over _records array to update properties and render
 * their corresponding box shadow.
 * @private
 */
System._update = function() {

  var i, max, update,
      records = this._records.list, record,
      worlds = this._worldsCache.list,
      buffers = this._worldsCache.buffers, buffer,
      shadows = '';

  // check for resize stop
  if (this._resizeTime && new Date().getTime() - this._resizeTime > 100) {
    this._resizeTime = 0;
    for (i = 0, max = worlds.length; i < max; i += 1) {
      worlds[i].pauseStep = false;
    }
  }

  // loop thru and reset buffers
  for (i = worlds.length - 1; i >= 0; i -= 1) {
    buffers[worlds[i].id] = '';
  }

  // loop thru and step records
  for (i = records.length - 1; i >= 0; i -= 1) {
    record = records[i];
    if (record.step && !record.world.pauseStep) {
      record.step();
    }
  }

  // loop thru records and build box shadows
  for (i = records.length - 1; i >= 0; i -= 1) {
    record = records[i];
    if (record.world && record.location && record.opacity) {
      shadows = buffers[record.world.id];
      if (record.world.colorMode === 'rgba' && record.color) {
        shadows = shadows + this._buildStringRGBA(record);
      } else if (record.world.colorMode === 'hsla' && typeof record.hue !== undefined && typeof record.saturation !== undefined && typeof record.lightness !== undefined) {
        shadows = shadows + this._buildStringHSLA(record);
      } else {
        throw new Error('System: current color mode not supported.');
      }
      buffers[record.world.id] = shadows;
    }
  }

  // loop thru worlds and apply box shadow
  for (i = worlds.length - 1; i >= 0; i -= 1) {
    buffer = buffers[worlds[i].id];
    // remove the last comma
    worlds[i].el.style.boxShadow = buffer.substr(0, buffer.length - 1);
  }

  update = (function (me) {
    return (function() {
      me._update(me);
    });
  })(this);
  window.requestAnimFrame(update);
};

/**
 * Builds an hsla box shadow string based on the passed
 * object's properties.
 * @private
 */
System._buildStringHSLA = function(obj) {

    var resolution = obj.world.resolution,
        loc = obj.location;

    return (loc.x * resolution) + 'px ' + // left offset
        (loc.y * resolution) + 'px ' + // right offset
        obj.blur + 'px ' + // blur
        resolution + 'px ' + // spread
        obj.world.colorMode + // color mode
        '(' + obj.hue + ',' + (obj.saturation * 100) + '%,' + (obj.lightness * 100) + '%,' + // color
        obj.opacity + '),'; // opacity
};

/**
 * Builds an rgba box shadow string based on the passed
 * object's properties.
 * @private
 */
System._buildStringRGBA = function(obj) {

    var resolution = obj.world.resolution,
        loc = obj.location;

    return (loc.x * resolution) + 'px ' + // left offset
        (loc.y * resolution) + 'px ' + // right offset
        obj.blur + 'px ' + // blur
        resolution + 'px ' + // spread
        obj.world.colorMode + // color mode
        '(' + obj.color[0] + ',' + obj.color[1] + ',' + obj.color[2] + ',' + // color
        obj.opacity + '),'; // opacity
};

/**
 * Iterates over _records.list and finds the world
 * passed as a DOM element.
 *
 * @param {Object} world A DOM element representing a world.
 * @returns {Object} If found, returns a world. If not found returns null.
 */
System.getWorld = function(world) {
  var records = this._records.list;
  for (var i = 0, max = records.length; i < max; i++) {
    if (records[i].el === world) {
      return records[i];
    }
  }
  return null;
};

/**
 * Returns all worlds in the System.
 *
 * @returns {Array} A list of all worlds in the System.
 */
System.allWorlds = function () {
  return this._worldsCache.list;
};

/**
 * Adds an object to the system. Object should extend the 'Element' class.
 */
System.add = function(klass, opt_options) {

  var options = opt_options || {},
      records = this._records.list,
      recordsLookup = this._records.lookup,
      parentNode = null;

  if (!options.world || exports.Utils.getDataType(options.world) !== 'object') {
    options.world = records[0];
  } else {
    // if a world was passed, find its reference in _records
    options.world = System.getWorld(options.world);
  }

  // recycle object if one is available
  if (options.world._pool && options.world._pool.length) {

    // pop off _pool array
    records[records.length] = options.world._pool.pop();
    // pass new options
    records[records.length - 1].options = options;
  } else {
    // no pool objects available, create a new one
    // add the instance to the records list array
    // assumes 'klass' has extended Element
    // if not, tries calling Element directly
    if (parent[klass]) {
      records[records.length] = new parent[klass](options);
    } else {
      records[records.length] = new exports[klass](options);
    }

  }
  // initialize the new object
  records[records.length - 1]._init();
  // add the new object to records lookup table
  recordsLookup[records[records.length - 1].id] = true;
};

/**
 * Removes an element from the system.
 *
 * @param {Object} obj The element to remove.
 */
System.destroy = function (obj) {

  var i, max,
      records = this._records.list;

  for (i = 0, max = records.length; i < max; i += 1) {
    if (records[i].id === obj.id) {
      records[i].world._pool[records[i].world._pool.length] = records.splice(i, 1)[0]; // move record to pool array
      break;
    }
  }
};

/**
 * Returns all elements in the System.
 *
 * @returns {Array} A list of all elements in the System.
 */
System.allElements = function () {
  return this._records.list;
};

exports.System = System;
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
  this.pauseStep = false;

  /**
   * Object pool used to recycle objects.
   */
  this._pool = [];
}

exports.World = World;
};
