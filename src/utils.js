/**
 * @namespace
 */
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
Utils._addEvent = function(target, eventType, handler) {
  if (target.addEventListener) { // W3C
    target.addEventListener(eventType, handler, false);
  } else if (target.attachEvent) { // IE
    target.attachEvent("on" + eventType, handler);
  }
};