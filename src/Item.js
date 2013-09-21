/*global exports */
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
  this._force = new exports.Vector();
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
  this.scale = options.scale || 1;
  this.opacity = options.opacity || 1;
  this.color = options.color || [0, 0, 0];
};
