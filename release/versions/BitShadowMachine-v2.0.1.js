/*! BitShadowMachine v2.0.1 - 2013-09-30 08:09:04 
 *  Vince Allen 
 *  Brooklyn, NY 
 *  vince@vinceallen.com 
 *  @vinceallenvince 
 *  License: MIT */

var BitShadowMachine = {}, exports = BitShadowMachine;

(function(exports) {

"use strict";

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
var Utils = {};

/**
 * Re-maps a number from one range to another.
 *
 * @function map
 * @memberof System
 * @param {number} value The value to be converted.
 * @param {number} min1 Lower bound of the value's current range.
 * @param {number} max1 Upper bound of the value's current range.
 * @param {number} min2 Lower bound of the value's target range.
 * @param {number} max2 Upper bound of the value's target range.
 * @returns {number} A number.
 */
Utils.map = function(value, min1, max1, min2, max2) { // returns a new value relative to a new range
  var unitratio = (value - min1) / (max1 - min1);
  return (unitratio * (max2 - min2)) + min2;
};

/**
 * Generates a psuedo-random number within a range.
 *
 * @function getRandomNumber
 * @memberof System
 * @param {number} low The low end of the range.
 * @param {number} high The high end of the range.
 * @param {boolean} [flt] Set to true to return a float.
 * @returns {number} A number.
 */
Utils.getRandomNumber = function(low, high, flt) {
  if (flt) {
    return Math.random()*(high-(low-1)) + low;
  }
  return Math.floor(Math.random()*(high-(low-1))) + low;
};

/**
 * Extends the properties and methods of a superClass onto a subClass.
 *
 * @function extend
 * @memberof System
 * @param {Object} subClass The subClass.
 * @param {Object} superClass The superClass.
 */
Utils.extend = function(subClass, superClass) {
  function F() {}
  F.prototype = superClass.prototype;
  subClass.prototype = new F;
  subClass.prototype.constructor = subClass;
};

 /**
 * Returns a new object with all properties and methods of the
 * old object copied to the new object's prototype.
 *
 * @function clone
 * @memberof Utils
 * @param {Object} object The object to clone.
 * @returns {Object} An object.
 */
Utils.clone = function(object) {
  function F() {}
  F.prototype = object;
  return new F;
};

/**
 * Determines the size of the browser window.
 *
 * @function extend
 * @memberof System
 * @returns {Object} The current browser window width and height.
 */
Utils.getWindowSize = function() {

  var d = {
    'width' : false,
    'height' : false
  };

  if (typeof(window.innerWidth) !== 'undefined') {
    d.width = window.innerWidth;
    d.height = window.innerHeight;
  } else if (typeof(document.documentElement) !== 'undefined' &&
      typeof(document.documentElement.clientWidth) !== 'undefined') {
    d.width = document.documentElement.clientWidth;
    d.height = document.documentElement.clientHeight;
  } else if (typeof(document.body) !== 'undefined') {
    d.width = document.body.clientWidth;
    d.height = document.body.clientHeight;
  }
  return d;
};

/**
 * Adds an event listener to a DOM element.
 *
 * @function _addEvent
 * @memberof System
 * @private
 * @param {Object} target The element to receive the event listener.
 * @param {string} eventType The event type.
 * @param {function} The function to run when the event is triggered.
 */
Utils.addEvent = function(target, eventType, handler) {
  if (target.addEventListener) { // W3C
    target.addEventListener(eventType, handler, false);
  } else if (target.attachEvent) { // IE
    target.attachEvent("on" + eventType, handler);
  }
};

/**
 * Converts degrees to radians.
 *
 * @function degreesToRadians
 * @memberof Utils
 * @param {number} degrees The degrees value to be converted.
 * @returns {number} A number in radians.
 */
Utils.degreesToRadians = function(degrees) {
  if (typeof degrees !== 'undefined') {
    return 2 * Math.PI * (degrees/360);
  } else {
    if (typeof console !== 'undefined') {
      console.log('Error: Utils.degreesToRadians is missing degrees param.');
    }
    return false;
  }
};

/**
 * Converts radians to degrees.
 *
 * @function radiansToDegrees
 * @memberof Utils
 * @param {number} radians The radians value to be converted.
 * @returns {number} A number in degrees.
 */
Utils.radiansToDegrees = function(radians) {
  if (typeof radians !== 'undefined') {
    return radians * (180/Math.PI);
  } else {
    if (typeof console !== 'undefined') {
      console.log('Error: Utils.radiansToDegrees is missing radians param.');
    }
    return false;
  }
};
exports.Utils = Utils;

/**
 * Creates a new Vector.
 *
 * @param {number} [opt_x = 0] The x location.
 * @param {number} [opt_y = 0] The y location.
 * @constructor
 */
function Vector(opt_x, opt_y) {
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
  return Math.sqrt((this.x * this.x) + (this.y * this.y));
};

/**
 * Limits the vector's magnitude.
 *
 * @param {number} opt_high The upper bound of the vector's magnitude
 * @param {number} opt_low The lower bound of the vector's magnitude.
 * @returns {Object} This vector.
 */
Vector.prototype.limit = function(opt_high, opt_low) {
  var high = opt_high || null,
      low = opt_low || null;
  if (high && this.mag() > high) {
    this.normalize();
    this.mult(high);
  }
  if (low && this.mag() < low) {
    this.normalize();
    this.mult(low);
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
  return Math.sqrt(Math.pow(vector.x - this.x, 2) + Math.pow(vector.y - this.y, 2));
};

/**
 * Rotates a vector using a passed angle in radians.
 *
 * @param {number} radians The angle to rotate in radians.
 * @returns {Object} This vector.
 */
Vector.prototype.rotate = function(radians) {
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
  return Vector.VectorAdd(this, vector).div(2);
};

/**
 * Calulates the dot product.
 *
 * @param {Object} vector The target vector.
 * @returns {Object} A vector.
 */
Vector.prototype.dot = function(vector) {
  if (this.z && vector.z) {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }
  return this.x * vector.x + this.y * vector.y;
};

exports.Vector = Vector;

/**
 * Creates a new StatsDisplay object.
 *
 * Use this class to create a field in the
 * top-left corner that displays the current
 * frames per second and total number of elements
 * processed in the System.animLoop.
 *
 * Note: StatsDisplay will not function in browsers
 * whose Date object does not support Date.now().
 * These include IE6, IE7, and IE8.
 *
 * @constructor
 */
function StatsDisplay() {

  var labelContainer, label;

  this.name = 'StatsDisplay';

  /**
   * Set to false to stop requesting animation frames.
   * @private
   */
  this._active = true;

  /**
   * Frames per second.
   * @private
   */
  this._fps = 0;

  /**
   * The current time.
   * @private
   */
  if (Date.now) {
    this._time = Date.now();
  } else {
    this._time = 0;
  }

  /**
   * The time at the last frame.
   * @private
   */
  this._timeLastFrame = this._time;

  /**
   * The time the last second was sampled.
   * @private
   */
  this._timeLastSecond = this._time;

  /**
   * Holds the total number of frames
   * between seconds.
   * @private
   */
  this._frameCount = 0;

  /**
   * A reference to the DOM element containing the display.
   * @private
   */
  this.el = document.createElement('div');
  this.el.id = 'statsDisplay';
  this.el.className = 'statsDisplay';
  this.el.style.backgroundColor = 'black';
  this.el.style.color = 'white';
  this.el.style.fontFamily = 'Helvetica';
  this.el.style.padding = '0.5em';
  this.el.style.opacity = '0.5';
  this.el.style.position = 'absolute';
  this.el.style.left = '0';
  this.el.style.top = '0';
  this.el.style.width = '220px';

  /**
   * A reference to the textNode displaying the total number of elements.
   * @private
   */
  this._totalElementsValue = null;

  /**
   * A reference to the textNode displaying the frame per second.
   * @private
   */
  this._fpsValue = null;

  // create totol elements label
  labelContainer = document.createElement('span');
  labelContainer.className = 'statsDisplayLabel';
  labelContainer.style.marginLeft = '0.5em';
  label = document.createTextNode('total elements: ');
  labelContainer.appendChild(label);
  this.el.appendChild(labelContainer);

  // create textNode for totalElements
  this._totalElementsValue = document.createTextNode('0');
  this.el.appendChild(this._totalElementsValue);

  // create fps label
  labelContainer = document.createElement('span');
  labelContainer.className = 'statsDisplayLabel';
  labelContainer.style.marginLeft = '0.5em';
  label = document.createTextNode('fps: ');
  labelContainer.appendChild(label);
  this.el.appendChild(labelContainer);

  // create textNode for fps
  this._fpsValue = document.createTextNode('0');
  this.el.appendChild(this._fpsValue);

  document.body.appendChild(this.el);

  /**
   * Initiates the requestAnimFrame() loop.
   */
  this._update(this);
}

/**
 * Returns the current frames per second value.
 * @returns {number} Frame per second.
 */
StatsDisplay.prototype.getFPS = function() {
  return this._fps;
};

/**
 * If 1000ms have elapsed since the last evaluated second,
 * _fps is assigned the total number of frames rendered and
 * its corresponding textNode is updated. The total number of
 * elements is also updated.
 *
 * This function is called again via requestAnimFrame().
 *
 * @private
 */
StatsDisplay.prototype._update = function(me) {

  var elementCount = exports.System.count();

  if (Date.now) {
    me._time = Date.now();
  } else {
    me._time = 0;
  }
  me._frameCount++;

  // at least a second has passed
  if (me._time > me._timeLastSecond + 1000) {

    me._fps = me._frameCount;
    me._timeLastSecond = me._time;
    me._frameCount = 0;

    me._fpsValue.nodeValue = me._fps;
    me._totalElementsValue.nodeValue = elementCount;
  }

  var reqAnimFrame = (function (me) {
    return (function() {
      me._update(me);
    });
  })(this);

  if (this._active) {
    window.requestAnimFrame(reqAnimFrame);
  }
};

/**
 * Removes statsDisplay from DOM.
 */
StatsDisplay.prototype.destroy = function() {
  this._active = false;
  if (document.getElementById(this.el.id)) {
    document.body.removeChild(this.el);
  }
};

exports.StatsDisplay = StatsDisplay;

/**
 * Creates a new ColorPalette object.
 *
 * Use this class to create a palette of colors randomly selected
 * from a range created with initial start and end colors. You
 * can also generate gradients that smoothly interpolate from
 * start and end colors.
 *
 * @param {string|number} [opt_id=] An optional id. If an id is not passed, a default id is created.
 * @constructor
 */
function ColorPalette(opt_id) {

  /**
   * Holds a list of arrays representing 3-digit color values
   * smoothly interpolated between start and end colors.
   * @private
   */
  this._gradients = [];

  /**
   * Holds a list of arrays representing 3-digit color values
   * randomly selected from start and end colors.
   * @private
   */
  this._colors = [];

  this.id = opt_id || ColorPalette._idCount;
  ColorPalette._idCount++; // increment id
}

/**
 * Increments as each ColorPalette is created.
 * @type number
 * @default 0
 * @private
 */
ColorPalette._idCount = 0;

ColorPalette.prototype.name = 'ColorPalette';

/**
 * Creates a color range of 255 colors from the passed start and end colors.
 * Adds a random selection of these colors to the color property of
 * the color palette.
 *
 * @param {Object} options A set of required options
 *    that includes:
 *    options.min {number} The minimum number of colors to add.
 *    options.max {number} The maximum number of color to add.
 *    options.startColor {Array} The beginning color of the color range.
 *    options.endColor {Array} The end color of the color range.
 */
ColorPalette.prototype.addColor = function(options) {

  var i, ln, colors;

  ln = Utils.getRandomNumber(options.min, options.max);
  colors = ColorPalette._createColorRange(options.startColor, options.endColor, 255);

  for (i = 0; i < ln; i++) {
    this._colors.push(colors[Utils.getRandomNumber(0, colors.length - 1)]);
  }

  return this;
};

/**
 * Adds color arrays representing a color range to the gradients property.
 *
 * @param {Object} options A set of required options
 *    that includes:
 *    options.startColor {Array} The beginning color of the color range.
 *    options.endColor {Array} The end color of the color range.
 *    options.totalColors {number} The total number of colors in the gradient.
 * @private
 */
ColorPalette.prototype.createGradient = function(options) {

  this.startColor = options.startColor;
  this.endColor = options.endColor;
  this.totalColors = options.totalColors || 255;
  if (this.totalColors > 0) {
    this._gradients.push(ColorPalette._createColorRange(this.startColor, this.endColor, this.totalColors));
  } else {
    throw new Error('ColorPalette: total colors must be greater than zero.');
  }
};

/**
 * @returns An array representing a randomly selected color
 *    from the colors property.
 * @throws {Error} If the colors property is empty.
 */
ColorPalette.prototype.getColor = function() {

  if (this._colors.length > 0) {
    return this._colors[Utils.getRandomNumber(0, this._colors.length - 1)];
  } else {
    throw new Error('ColorPalette.getColor: You must add colors via addColor() before using getColor().');
  }
};

/**
 * Renders a strip of colors representing the color range
 * in the colors property.
 *
 * @param {Object} parent A DOM object to contain the color strip.
 */
ColorPalette.prototype.createSampleStrip = function(parent) {

  var i, max, div;

  for (i = 0, max = this._colors.length; i < max; i++) {
    div = document.createElement('div');
    div.className = 'color-sample-strip';
    div.style.background = 'rgb(' + this._colors[i].toString() + ')';
    parent.appendChild(div);
  }
};

/**
 * Creates an array of RGB color values interpolated between
 * a passed startColor and endColor.
 *
 * @param {Array} startColor The beginning of the color array.
 * @param {Array} startColor The end of the color array.
 * @param {number} totalColors The total numnber of colors to create.
 * @returns {Array} An array of color values.
 */
ColorPalette._createColorRange = function(startColor, endColor, totalColors) {

  var i, colors = [],
      startRed = startColor[0],
      startGreen = startColor[1],
      startBlue = startColor[2],
      endRed = endColor[0],
      endGreen = endColor[1],
      endBlue = endColor[2],
      diffRed, diffGreen, diffBlue,
      newRed, newGreen, newBlue;

  diffRed = endRed - startRed;
  diffGreen = endGreen - startGreen;
  diffBlue = endBlue - startBlue;

  for (i = 0; i < totalColors; i++) {
    newRed = parseInt(diffRed * i/totalColors, 10) + startRed;
    newGreen = parseInt(diffGreen * i/totalColors, 10) + startGreen;
    newBlue = parseInt(diffBlue * i/totalColors, 10) + startBlue;
    colors.push([newRed, newGreen, newBlue]);
  }
  return colors;
};

exports.ColorPalette = ColorPalette;

/*jshint supernew:true */
/** @namespace */
var System = {
  name: 'System'
};

/**
 * Increments each time update() is executed.
 */
System.clock = 0;

/**
 * A map of supported browser features. By default
 * we're assuming support for boxShadows, rgba, and hsla.
 */
System.supportedFeatures = {
  boxshadow: true,
  rgba: true,
  hsla: true
};

/**
 * Stores references to all items in the system.
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
System._worlds = {
  lookup: {},
  list: [],
  buffers: {}
};

/**
 * Stores references to all items in the system.
 * @private
 */
System._caches = {};

/**
 * Used to create unique ids.
 * @private
 */
System._idCount = 0;

/**
 * Holds the current and last mouse/touch positions relative
 * to the browser window. Also, holds the current mouse velocity.
 * @public
 */
System.mouse = {
  location: new Vector(),
  lastLocation: new Vector(),
  velocity: new Vector()
};

/**
 * Stores the time in milliseconds of the last
 * resize event. Used to pause renderer during resize
 * and resume when resize is complete.
 * @type number
 * @private
 */
System._resizeTime = 0;

/**
 * Set to true log flags in a performance tracing tool.
 * @type boolean
 */
System.trace = false;

/**
 * Set to a positive number to render only those frames. Leave at
 * -1 to ignore.
 * @type number
 */
System.totalFrames = -1;

/**
 * Set to true to save properties defined in System.recordItemProperties from
 * each object in each frame.
 * @type boolean
 */
System.recordData = false;

/**
 * Defines the properties to save in System.recordedData for each item
 * in each frame.
 * @type Object
 */
System.recordItemProperties = {
  id: true,
  name: true,
  width: true,
  height: true,
  scale: true,
  location: true,
  velocity: true,
  angle: true,
  minSpeed: true,
  maxSpeed: true,
  hue: true,
  saturation: true,
  lightness: true,
  color: true,
  opacity: true
};

/**
 * Defines the properties to save in System.recordedData for each world
 * in each frame.
 * @type Object
 */
System.recordWorldProperties = {
  id: true,
  name: true,
  width: true,
  height: true,
  resolution: true,
  colorMode: true
};

/**
 * Stores properties from each object in each frame.
 * @type Array
 * @example
 [
    {
      frame: 0,
      items: [
        {},
        {},
        ...
      ]
    }
 ]
 */
System.recordedData = [];

/**
 * Initializes the system and starts the update loop.
 *
 * @function init
 * @memberof System
 * @param {Function=} opt_setup Creates the initial system conditions.
 * @param {Object=} opt_worlds A reference to a DOM element representing the System world.
 * @param {Object=} opt_supportedFeatures A map of supported browser features.
 * @param {boolean=} opt_noStartLoop If true, _update is not called. Use to setup a System
 *    and start the _update loop at a later time.
 */
System.init = function(opt_setup, opt_worlds, opt_supportedFeatures, opt_noStartLoop) {

  var setup = opt_setup || function () {},
      worlds = opt_worlds || new exports.World(document.body),
      supportedFeatures = opt_supportedFeatures || System.supportedFeatures,
      noStartLoop = !opt_noStartLoop ? false : true;

  // halt execution if the browser does not support box shadows
  if (!supportedFeatures.boxshadow) {
    throw new Error('BitShadowMachine requires support for CSS Box Shadows.');
  }

  this.supportedFeatures = supportedFeatures;

  if (Object.prototype.toString.call(worlds) === '[object Array]') {
    for (var i = 0, max = worlds.length; i < max; i++) {
      System._addWorld(worlds[i]);
    }
  } else {
    System._addWorld(worlds);
  }

  document.body.onorientationchange = System.updateOrientation;

  // listen for resize events
  exports.Utils.addEvent(window, 'resize', function(e) {
    System._resize.call(System, e);
  });

  // save the current and last mouse position
  exports.Utils.addEvent(document, 'mousemove', function(e) {
    System._recordMouseLoc.call(System, e);
  });

  // save the current and last touch position
  exports.Utils.addEvent(window, 'touchstart', function(e) {
    System._recordMouseLoc.call(System, e);
  });
  exports.Utils.addEvent(window, 'touchmove', function(e) {
    System._recordMouseLoc.call(System, e);
  });
  exports.Utils.addEvent(window, 'touchend', function(e) {
    System._recordMouseLoc.call(System, e);
  });

  // listen for device motion events (ie. accelerometer)
  exports.Utils.addEvent(window, 'devicemotion', function(e) {

    var world, worlds = System._caches.World.list,
        x = e.accelerationIncludingGravity.x,
        y = e.accelerationIncludingGravity.y;

    for (i = 0, max = worlds.length; i < max; i++) {
      world = worlds[i];
      if (window.orientation === 0) {
        world.gravity.x = x;
        world.gravity.y = y * -1;
      } else if (window.orientation === -90) {
        world.gravity.x = y;
        world.gravity.y = x;
      } else {
        world.gravity.x = y * -1;
        world.gravity.y = x * -1;
      }
    }
  });

  // listen for key up
  exports.Utils.addEvent(window, 'keyup', function(e) {
    System._keyup.call(System, e);
  });

  this._setup = setup;
  this._setup.call(this);

  if (!noStartLoop) {
    this._update();
  }
};

/**
 * Adds world to System records and worlds cache.
 *
 * @function _addWorld
 * @memberof System
 * @private
 * @param {Object} world A world.
 */
System._addWorld = function(world) {
  System._records.list.push(world);
  System._worlds.list.push(System._records.list[System._records.list.length - 1]);
  System._worlds.lookup[world.id] = System._records.list[System._records.list.length - 1];
  System._worlds.buffers[world.id] = '';
};

/**
 * Adds an item to the system.
 *
 * @function add
 * @memberof System
 * @param {string} klass Function will try to create an instance of this class.
 * @param {Object=} opt_options Object properties.
 * @param {string=} opt_world The world to contain the item.
 */
System.add = function(klass, opt_options, opt_world) {

  var i, max, last, parentNode, pool,
      records = this._records.list,
      recordsLookup = this._records.lookup,
      options = opt_options || {};

  options.world = opt_world || records[0];

  // recycle object if one is available
  pool = this.getAllItemsByName(klass, options.world._pool);

  if (pool.length) {
    for (i = 0, max = options.world._pool.length; i < max; i++) {
      if (options.world._pool[i].name === klass) {
        records[records.length] = options.world._pool.splice(i, 1)[0];
        records[records.length - 1].options = options;
        System._updateCacheLookup(records[records.length - 1], true);
        break;
      }
    }
  } else {
    if (BitShadowMachine[klass]) {
      records[records.length] = new BitShadowMachine[klass](options);
    } else {
      records[records.length] = new BitShadowMachine.Classes[klass](options);
    }
  }
  last = records.length - 1;
  records[last].reset(options);
  records[last].init(options);
  return records[last];
};

/**
 * Starts the render loop.
 * @function start
 * @memberof System
 */
System.start = function() {
  this._update();
};

/**
 * Adds an object to a cache based on its constructor name.
 *
 * @function updateCache
 * @memberof System
 * @param {Object} obj An object.
 * returns {Object} The cache that received the passed object.
 */
System.updateCache = function(obj) {

  // Create cache object, unless it already exists
  var cache = System._caches[obj.name] ||
      (System._caches[obj.name] = {
        lookup: {},
        list: []
      });

  cache.list[cache.list.length] = obj;
  cache.lookup[obj.id] = true;
  return cache;
};

/**
 * Assigns the given 'val' to the given object's record in System._caches.
 *
 * @function _updateCacheLookup
 * @memberof System
 * @private
 * @param {Object} obj An object.
 * @param {Boolean} val True if object is active, false if object is destroyed.
 */
System._updateCacheLookup = function(obj, val) {

  var cache = System._caches[obj.name];

  if (cache) {
    cache.lookup[obj.id] = val;
  }
};

/**
 * Returns the total number of items in the system.
 *
 * @function count
 * @memberof System
 * @returns {number} Total number of items.
 */
System.count = function() {
  return this._records.list.length;
};

/**
 * Returns the first world in the system.
 *
 * @function firstWorld
 * @memberof System
 * @returns {null|Object} A world.
 */
System.firstWorld = function() {
  return this._worlds.list.length ? this._worlds.list[0] : null;
};

/**
 * Returns the last world in the system.
 *
 * @function lastWorld
 * @memberof System
 * @returns {null|Object} A world.
 */
System.lastWorld = function() {
  return this._worlds.list.length ? this._worlds.list[this._worlds.list.length - 1] : null;
};

/**
 * Returns the first item in the system.
 *
 * @function firstItem
 * @memberof System
 * @returns {Object} An item.
 */
System.firstItem = function() {
  return this._records.list[0];
};

/**
 * Returns the last item in the system.
 *
 * @function lastItem
 * @memberof System
 * @returns {Object} An item.
 */
System.lastItem = function() {
  return this._records.list[this._records.list.length - 1];
};

/**
 * Returns all worlds.
 *
 * @function getAllWorlds
 * @memberof System
 * @return {Array.<World>} An array of worlds.
 */
System.getAllWorlds = function() {
  return System._worlds.list;
};

/**
 * Returns all buffers.
 *
 * @function getAllBuffers
 * @memberof System
 * @return {Array.<Buffer>} An array of buffers.
 */
System.getAllBuffers = function() {
  return System._worlds.buffers;
};

/**
 * Iterates over objects in the system and calls step() and draw().
 *
 * @function _update
 * @memberof System
 * @private
 */
System._update = function() {

  var i, max, style, records = System._records.list, record,
      worlds = System.getAllWorlds(),
      world = System.firstWorld(),
      buffers = System.getAllBuffers(), buffer,
      shadows = '';

  // check for resize stop
  if (System._resizeTime && new Date().getTime() - System._resizeTime > 100) {
    System._resizeTime = 0;
    for (i = 0, max = worlds.length; i < max; i++) {
      worlds[i].pauseStep = false;
    }
    if (world.afterResize) {
      world.afterResize.call(this);
    }
  }

  // check if we've exceeded totalFrames
  if (System.totalFrames > -1 && System.clock >= System.totalFrames) {
    System.totalFramesCallback();
    return;
  }

  if (System.trace) {
    console.time('update');
  }

  // setup entry in System.recordedData
  if (System.recordData) {
    System.recordedData.push({
      frame: System.clock,
      world: {},
      items: []
    });
  }

  // step
  for (i = records.length - 1; i >= 0; i -= 1) {
    record = records[i];
    if (record.step && !record.world.pauseStep) {
      record.step();
    }
    if (System.recordData && record.name !== 'World' && record.opacity) { // we don't want to record World data as Item
      System.recordedData[System.recordedData.length - 1].items.push({});
      System._saveData(System.recordedData[System.recordedData.length - 1].items.length - 1, record);
    }
  }

  if (System.trace) {
    console.timeEnd('update');
    console.time('render');
  }

  // draw

  // loop thru and reset buffers
  /*for (i = worlds.length - 1; i >= 0; i -= 1) {
    buffers[worlds[i].id] = '';
  }*/

  // loop thru records and build box shadows
  for (i = records.length - 1; i >= 0; i -= 1) {
    record = records[i];
    if (record.world && record.location && record.opacity && !(record instanceof exports.World)) {
      
      shadows = buffers[record.world.id];

      if (record.world.colorMode === 'rgba' && record.color) {
        shadows = shadows + System._buildStringRGBA(record);
      } else if (record.world.colorMode === 'hsla' && typeof record.hue !== 'undefined' &&
          typeof record.saturation !== 'undefined' && typeof record.lightness !== 'undefined') {
        shadows = shadows + System._buildStringHSLA(record);
      } else {
        throw new Error('System: current color mode not supported.');
      }
      buffers[record.world.id] = shadows;
    }
  }

  // loop thru worlds and apply box shadow
  for (i = worlds.length - 1; i >= 0; i -= 1) {
    world = worlds[i];
    style = world.el.style;
    buffer = buffers[world.id];
    buffers[worlds[i].id] = ''; // clear buffer
    style.boxShadow = buffer.substr(0, buffer.length - 1); // remove the last comma
    style.borderRadius = world.borderRadius + '%';
  }


  if (System.trace) {
    console.timeEnd('render');
  }


  System.clock++;
  window.requestAnimFrame(System._update);
};

/**
 * Called if System.totalFrames > -1 and exceeds System.clock.
 */
System.totalFramesCallback = function() {
  if (console) {
    console.log('Rendered ' + System.totalFrames + ' frames.');
  }
};

/**
 * Builds an hsla box shadow string based on the passed
 * object's properties.
 * @private
 */
System._buildStringHSLA = function(item) {

    var resolution = item.world.resolution,
        loc = item.location;

    return (loc.x * resolution) + 'px ' + // left offset
        (loc.y * resolution) + 'px ' + // right offset
        item.blur + 'px ' + // blur
        (resolution * item.scale) + 'px ' + // spread
        (System.supportedFeatures.hsla ? item.world.colorMode : 'hsl') + // color mode
        '(' + item.hue + ',' + (item.saturation * 100) + '%,' + (item.lightness * 100) + '%' + // color
        (System.supportedFeatures.hsla ? ', ' + item.opacity : '') + '),'; // opacity
};

/**
 * Builds an rgba box shadow string based on the passed
 * object's properties.
 * @private
 */
System._buildStringRGBA = function(item) {

    var resolution = item.world.resolution,
        loc = item.location;

    return (loc.x * resolution) + 'px ' + // left offset
        (loc.y * resolution) + 'px ' + // right offset
        item.blur + 'px ' + // blur
        (resolution * item.scale) + 'px ' + // spread
        (System.supportedFeatures.rgba ? item.world.colorMode : 'rgb') + // color mode
        '(' + item.color[0] + ',' + item.color[1] + ',' + item.color[2] + // color
        (System.supportedFeatures.rgba ? ', ' + item.opacity : '') + '),'; // opacity
};

/**
 * Pauses the system and processes one step in records.
 *
 * @function _stepForward
 * @memberof System
 * @private
 */
System._stepForward = function() {

  var i, j, max, records = System._records.list,
      world, worlds = System.getAllWorlds();

    for (i = 0, max = worlds.length; i < max; i++) {
      world = worlds[i];
      world.pauseStep = true;
      for (j = records.length - 1; j >= 0; j -= 1) {
        if (records[j].step) {
          records[j].step();
        }
      }
      for (j = records.length - 1; j >= 0; j -= 1) {
        if (records[j].draw) {
          records[j].draw();
        }
      }
    }
  System.clock++;
};

/**
 * Saves properties of the passed record that match properties
 * defined in System.recordItemProperties.
 * @param {number} index The array index for this object.
 * @param {Object} record An Item instance.
 */
System._saveData = function(index, record) {
  for (var i in record) {
    if (record.hasOwnProperty(i) && System.recordItemProperties[i]) {
      var val = record[i];
      if (val instanceof Vector) { // we want to copy the scalar values out of the Vector
        val = {
          x: record[i].x,
          y: record[i].y
        };
      }
      System.recordedData[System.recordedData.length - 1].items[index][i] = val;
    }
    for (var j in record.world) {
      if (record.world.hasOwnProperty(j) && System.recordWorldProperties[j]) {
        System.recordedData[System.recordedData.length - 1].world[j] = record.world[j];
      }
    }
  }
};

/**
 * Resets the system.
 *
 * @function _resetSystem
 * @memberof System
 * @private
 * @param {boolean} opt_noRestart= Pass true to not restart the system.
 */
System._resetSystem = function(opt_noRestart) {

  var i, max, world, worlds = System.getAllWorlds();

  for (i = 0, max = worlds.length; i < max; i++) {
    world = worlds[i];
    world.pauseStep = false;
    world.pauseDraw = false;

    while(world.el.firstChild) {
      world.el.removeChild(world.el.firstChild);
    }
  }

  System._caches = {};

  System._destroyAllItems();

  System._idCount = 0;

  System.mouse = {
    location: new exports.Vector(),
    lastLocation: new exports.Vector(),
    velocity: new exports.Vector()
  };

  System._resizeTime = 0;

  if (!opt_noRestart) {
    System._setup.call(System);
  }
};

/**
 * Destroys the system.
 *
 * @function _destroySystem
 * @memberof System
 * @private
 */
System._destroySystem = function() {
  this._resetSystem(true);
  this._destroyAllWorlds();
  this.clock = 0;
  this._idCount = 0;
};

/**
 * Removes all items in all worlds.
 *
 * @function _destroyAllItems
 * @memberof System
 * @private
 */
System._destroyAllItems = function() {

  var i, items = this._records.list;

  for (i = items.length - 1; i >= 0; i--) {
    if (items[i].name !== 'World') {
      items.splice(i, 1);
    }
  }
};

/**
 * Removes all worlds.
 *
 * @function _destroyAllWorlds
 * @memberof System
 * @private
 */
System._destroyAllWorlds = function() {

  var i, item, items = this._records.list;

  for (i = items.length - 1; i >= 0; i--) {
    item = items[i];
    if (item.name === 'World') {
      item.el.parentNode.removeChild(item.el);
      items.splice(i, 1);
    }
  }
  this._worlds = {
    lookup: {},
    list: []
  };
};

/**
 * Removes an item from a world.
 *
 * @function destroyItem
 * @memberof System
 * @param {Object} obj The item to remove.
 */
System.destroyItem = function (obj) {

  var i, max, records = this._records.list;

  for (i = 0, max = records.length; i < max; i++) {
    if (records[i].id === obj.id) {
      records[i].world._pool[records[i].world._pool.length] = records.splice(i, 1)[0]; // move record to pool array
      System._updateCacheLookup(obj, false);
      break;
    }
  }
};

/**
 * Returns an array of items created from the same constructor.
 *
 * @function getAllItemsByName
 * @memberof System
 * @param {string} name The 'name' property.
 * @param {Array} [opt_list = this._records] An optional list of items.
 * @returns {Array} An array of items.
 */
System.getAllItemsByName = function(name, opt_list) {

  var i, max, arr = [],
      list = opt_list || this._records.list;

  for (i = 0, max = list.length; i < max; i++) {
    if (list[i].name === name) {
      arr[arr.length] = list[i];
    }
  }
  return arr;
};

/**
 * Returns an array of items with an attribute that matches the
 * passed 'attr'. If 'opt_val' is passed, 'attr' must equal 'val'.
 *
 * @function getAllItemsByAttribute
 * @memberof System
 * @param {string} attr The property to match.
 * @param {*} [opt_val=] The 'attr' property must equal 'val'.
 * @returns {Array} An array of items.
 */
System.getAllItemsByAttribute = function(attr, opt_val) {

  var i, max, arr = [], records = this._records.list,
      val = typeof opt_val !== 'undefined' ? opt_val : null;

  for (i = 0, max = records.length; i < max; i++) {
    if (typeof records[i][attr] !== 'undefined') {
      if (val !== null && records[i][attr] !== val) {
        continue;
      }
      arr[arr.length] = records[i];
    }
  }
  return arr;
};

/**
 * Updates the properties of items created from the same constructor.
 *
 * @function updateItemPropsByName
 * @memberof System
 * @param {string} name The constructor name.
 * @param {Object} props A map of properties to update.
 * @returns {Array} An array of items.
 * @example
 * System.updateElementPropsByName('point', {
 *    color: [0, 0, 0],
 *    scale: 2
 * }); // all points will turn black and double in size
 */
System.updateItemPropsByName = function(name, props) {

  var i, max, p, arr = this.getAllItemsByName(name);

  for (i = 0, max = arr.length; i < max; i++) {
    for (p in props) {
      if (props.hasOwnProperty(p)) {
        arr[i][p] = props[p];
      }
    }
  }
  return arr;
};

/**
 * Finds an item by its 'id' and returns it.
 *
 * @function getItem
 * @memberof System
 * @param {string|number} id The item's id.
 * @returns {Object} The item.
 */
System.getItem = function(id) {

  var i, max, records = this._records.list;

  for (i = 0, max = records.length; i < max; i += 1) {
    if (records[i].id === id) {
      return records[i];
    }
  }
  return null;
};

/**
 * Updates the properties of an item.
 *
 * @function updateItem
 * @memberof System
 * @param {Object} item The item.
 * @param {Object} props A map of properties to update.
 * @returns {Object} The item.
 * @example
 * System.updateItem(myItem, {
 *    color: [0, 0, 0],
 *    scale: 2
 * }); // item will turn black and double in size
 */
System.updateItem = function(item, props) {

  for (var p in props) {
    if (props.hasOwnProperty(p)) {
      item[p] = props[p];
    }
  }
  return item;
};

/**
 * Repositions all items relative to the viewport size and resets the world bounds.
 *
 * @function _resize
 * @memberof System
 * @private
 */
System._resize = function() {

  var i, max, records = this._records.list, record,
      viewportSize = exports.Utils.getWindowSize(),
      world, worlds = System.getAllWorlds();

  for (i = 0, max = records.length; i < max; i++) {
    record = records[i];
    if (record.name !== 'World' && record.world.boundToWindow && record.location) {
      record.location.x = viewportSize.width * (record.location.x / record.world.width);
      record.location.y = viewportSize.height * (record.location.y / record.world.height);
    }
  }

  for (i = 0, max = worlds.length; i < max; i++) {
    world = worlds[i];
    if (world.boundToWindow) {
      world.bounds = [0, viewportSize.width, viewportSize.height, 0];
      world.width = viewportSize.width;
      world.height = viewportSize.height;
      world.location = new exports.Vector((viewportSize.width / 2),
        (viewportSize.height / 2));
    }
  }
};

/**
 * Handles keyup events.
 *
 * @function _keyup
 * @memberof System
 * @private
 * @param {Object} e An event.
 */
System._keyup = function(e) {

  var i, max, world, worlds = this.getAllWorlds();

  switch(e.keyCode) {
    case 39:
      System._stepForward();
      break;
    case 80: // p; pause/play
      for (i = 0, max = worlds.length; i < max; i++) {
        world = worlds[i];
        world.pauseStep = !world.pauseStep;
      }
      break;
    case 82: // r; reset
      System._resetSystem();
      break;
    case 83: // s; reset
      System._toggleStats();
      break;
    case 72: // h; hide menu
      System.firstWorld().toggleMenu();
      break;
  }
};

/**
 * Increments idCount and returns the value.
 *
 * @function getNewId
 * @memberof System
 */
System.getNewId = function() {
  this._idCount++;
  return this._idCount;
};

/**
 * Saves the mouse/touch location relative to the browser window.
 *
 * @function _recordMouseLoc
 * @memberof System
 * @private
 */
System._recordMouseLoc = function(e) {

  var touch, world = this.firstWorld(), map = exports.Utils.map;

  this.mouse.lastLocation.x = this.mouse.location.x;
  this.mouse.lastLocation.y = this.mouse.location.y;

  if (e.changedTouches) {
    touch = e.changedTouches[0];
  }

  /**
   * Mapping window size to world size allows us to
   * lead an agent around a world that's not bound
   * to the window.
   */
  if (e.pageX && e.pageY) {
    this.mouse.location.x = map(e.pageX, 0, window.innerWidth, 0, world.width);
    this.mouse.location.y = map(e.pageY, 0, window.innerHeight, 0, world.height);
  } else if (e.clientX && e.clientY) {
    this.mouse.location.x = map(e.clientX, 0, window.innerWidth, 0, world.width);
    this.mouse.location.y = map(e.clientY, 0, window.innerHeight, 0, world.height);
  } else if (touch) {
    this.mouse.location.x = touch.pageX;
    this.mouse.location.y = touch.pageY;
  }

  this.mouse.velocity.x = this.mouse.lastLocation.x - this.mouse.location.x;
  this.mouse.velocity.y = this.mouse.lastLocation.y - this.mouse.location.y;
};

/**
 * Handles orientation evenst and forces the world to update its bounds.
 *
 * @function updateOrientation
 * @memberof System
 */
System.updateOrientation = function() {
  setTimeout(function() {
   System._records.list[0]._setBounds();
  }, 500);
};

/**
 * Toggles stats display.
 *
 * @function _toggleStats
 * @memberof System
 * @private
 */
System._toggleStats = function() {
  if (!System._statsDisplay) {
    System._statsDisplay = new exports.StatsDisplay();
  } else if (System._statsDisplay && System._statsDisplay._active) {
    System._statsDisplay.destroy();
  } else if (System._statsDisplay && !System._statsDisplay._active) {
    System._statsDisplay = new exports.StatsDisplay();
  }
};

exports.System = System;

/**
 * Creates a new World.
 * @constructor
 */
function World(opt_el, opt_options) {

  var el, options = opt_options || {},
      viewportSize = exports.Utils.getWindowSize();

  this.gravity = options.gravity || new exports.Vector(0, 0.01);
  this.c = options.c || 0.1;
  this.resolution = options.resolution || 8;
  this.width = options.width / this.resolution || viewportSize.width / this.resolution;
  this.height = options.height / this.resolution || viewportSize.height / this.resolution;
  this.borderRadius = options.borderRadius || 0;
  this.location = options.location || new Vector(((viewportSize.width - (this.width * this.resolution)) / 2),
      ((viewportSize.height - (this.height * this.resolution)) / 2));
  this.opacity = typeof options.opacity === 'undefined' ? 1 : options.opacity;
  this.zIndex = typeof options.zIndex === 'undefined' ? 1 : options.zIndex;
  this.colorMode = options.colorMode || 'rgba';
  this.backgroundColor = options.backgroundColor || 'transparent';
  this.hue = options.hue || 0;
  this.saturation = typeof options.saturation === 'undefined' ? 1 : options.saturation;
  this.lightness = typeof options.lightness === 'undefined' ? 0.5 : options.lightness;
  this.addMenuText = typeof options.addMenuText === 'undefined' ? '' : options.addMenuText;

  // if no element is passed, use document.body
  if (!opt_el) {
    el = document.body;
  } else {
    el = opt_el;
  }

  this.el = el;
  this.name = 'World';
  this.el.className = this.name.toLowerCase();
  this.id = this.name + exports.System.getNewId();
  this.pauseStep = false;

  // create container if not document.body
  if (el !== document.body) {
    var container = document.createElement('div'),
        style = container.style;

    container.id = 'container_' + this.name.toLowerCase();
    container.className = 'worldContainer';
    style.left = this.location.x + 'px';
    style.top = this.location.y + 'px';
    style.width = this.width * this.resolution + 'px';
    style.height = this.height * this.resolution + 'px';
    style.zIndex = this.zIndex;
    style.backgroundColor = this.colorMode === 'rgba' ?
        'rgba(' + this.backgroundColor[0] + ', ' + this.backgroundColor[1] + ', ' + this.backgroundColor[2] + ', ' + this.opacity + ')' :
        'hsla(' + this.hue + ', ' + (this.saturation * 100) + '%, ' + (this.lightness * 100) + '%, ' + this.opacity + ')';
    container.appendChild(this.el);

    if (!options.noMenu) {
      this.menu = document.createElement('div');
      this.menu.id = 'inputMenu';
      this.menu.className = 'inputMenu';
      var menuText = "'p' = pause | 'r' = reset | 's' = stats | 'h' = hide " + this.addMenuText;
      this.menu.textContent = menuText;
      container.appendChild(this.menu);
      this.menuHidden = false;
    }

    document.body.appendChild(container);

  }

  /**
   * Object pool used to recycle objects.
   */
  this._pool = [];

  /**
   * Worlds do not have worlds. However, assigning an
   * object literal makes for less conditions in the
   * update loop.
   */
  this.world = {};
}

World.prototype.toggleMenu = function() {
  this.menuHidden = !this.menuHidden;
  if (this.menuHidden) {
    this.menu.style.visibility = 'hidden';
    return;
  }
  this.menu.style.visibility = 'visible';
};

exports.World = World;

/**
 * Creates a new Item.
 * @constructor
 */
function Item(opt_options) {

  var options = opt_options || {};

  if (!options.world || typeof options.world !== 'object') {
    throw new Error('Item: A valid instance of the World class is required for a new Item.');
  }
  this.options = options;
  this.world = options.world;

  this.name = options.name || 'Item';
  this.id = this.name + exports.System.getNewId();
  this.blur = null;
  this.scale = null;
}

Item.prototype.init = function() {
  if (console) {
    console.log('init is not implemented.');
  }
};

/**
 * Sets item's properties via initial options.
 * @private
 */
Item.prototype.reset = function(opt_options) {

  var i, options = opt_options || {};

  // re-assign all options
  for (i in options) {
    if (options.hasOwnProperty(i)) {
      this[i] = options[i];
    }
  }

  this.blur = options.blur || 0;
  this.scale = typeof options.scale === 'undefined' ? 1 : options.scale;
  this.opacity = typeof options.opacity === 'undefined' ? 1 : options.opacity;
  this.color = options.color || [0, 0, 0];
};

exports.Item = Item;

}(exports));