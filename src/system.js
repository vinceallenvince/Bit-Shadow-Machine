/*global exports, window, parent */
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
 * @param {Object|Array.<Object>} opt_worlds A single reference or an array of
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
  if (utils.getDataType(setup) === 'function') {
    setup.call(this);
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
    var resolution = me._records.list[0].resolution;
    if (e.pageX && e.pageY) {
      me.mouse.location.x = e.pageX / resolution;
      me.mouse.location.y = e.pageY / resolution;
    } else if (e.clientX && e.clientY) {
      me.mouse.location.x = e.clientX / resolution;
      me.mouse.location.y = e.clientY / resolution;
    }
  });

  // listen for window resize
  /*exports.Utils.addEvent(window, 'resize', function(e) {
    System._resize.call(System, e);
  });*/
};

/**
 * Iterates over _records array to update properties and render
 * their corresponding box shadow.
 * @private
 */
System._update = function() {

  var i, update,
      records = this._records.list, record,
      worlds = this._worldsCache.list,
      buffers = this._worldsCache.buffers, buffer,
      shadows = '';

  // loop thru and reset buffers
  for (i = worlds.length - 1; i >= 0; i -= 1) {
    buffers[worlds[i].id] = '';
  }

  // loop thru and step records
  for (i = records.length - 1; i >= 0; i -= 1) {
    record = records[i];
    if (record.step) {
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
 * @private
 */
System._getWorld = function(world) {
  var records = this._records.list;
  for (var i = 0, max = records.length; i < max; i++) {
    if (records[i].el === world) {
      return records[i];
    }
  }
  return null;
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
    options.world = System._getWorld(options.world);
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


exports.System = System;
