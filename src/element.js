/*global exports */
/**
 * Creates a new Element.
 * @constructor
 */
function Element(opt_options) {

  this.options = opt_options || {};
  this.name = 'element';
  this.id = this.name + exports.System._getNewId();

  this.blur = 0;

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
