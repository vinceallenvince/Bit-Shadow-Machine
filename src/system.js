var Item = require('./item');
var FPSDisplay = require('fpsdisplay');
var System = require('burner').System;
var Vector = require('burner').Vector;
var World = require('./world');

/**
 * Holds additional classes that can be defined at runtime.
 * @memberof System
 */
System.Classes = {
  'Item': Item
};

/**
 * Stores references to all buffers in the system.
 * @private
 */
System._buffers = {};

/**
 * Set to 1 to sort System._records.list by zIndex.
 * @type Number
 */
System.zSort = 0;

/**
 * Set to true to save properties defined in System.recordItemProperties from
 * each object in each frame.
 * @type boolean
 */
System.recordData = false;

/**
 * Recording starts with this frame number.
 * @type number
 */
System.recordStartFrame = -1;

/**
 * Recording ends with this frame number.
 * @type number
 */
System.recordEndFrame = -1;

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
System.recordedData = null;

/**
 * Returns all worlds.
 *
 * @function getAllWorlds
 * @memberof System
 * @return {Array.<Buffer>} An array of worlds.
 */
System.getAllWorlds = function() {
  return System.getAllItemsByName('World');
};

/**
 * Returns all buffers.
 *
 * @function getAllBuffers
 * @memberof System
 * @return {Array.<Buffer>} An array of buffers.
 */
System.getAllBuffers = function() {
  return System._buffers;
};

/**
 * Adds instances of class to _records and calls init on them.
 * @function add
 * @memberof System
 * @param {string} [opt_klass = 'Item'] The name of the class to add.
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {string=} [opt_world = System._records[0]] An instance of World to contain the item.
 * @returns {Object} An instance of the added item.
 */
System.add = function(opt_klass, opt_options, opt_world) {

  var klass = opt_klass || 'Item',
      options = opt_options || {},
      world = opt_world || System.firstWorld(),
      records = this._records, obj;

  // recycle object if one is available; obj must be an instance of the same class
  for (var i = 0, max = System._pool.length; i < max; i++) {
    if (System._pool[i].name === klass) {
      obj = System._cleanObj(System._pool.splice(i, 1)[0]);
      break;
    }
  }

  if (!obj) {
    if (klass.toLowerCase() === 'world') {
      obj = new World(options);
    } else if (System.Classes[klass]) {
      obj = new System.Classes[klass](options);
    } else {
      obj = new Item();
    }
  }

  options.name = klass;
  obj.init(world, options);
  records.push(obj);
  return obj;
};

/**
 * Iterates over records.
 * @function loop
 * @memberof System
 */
System.loop = function() {

  var i, record, records = System._records,
      len = System._records.length,
      worlds = System.getAllWorlds(),
      buffers = System.getAllBuffers(),
      shadows = '';

  // check if we've exceeded totalFrames
  if (System.checkFramesRecorded()) {
    return;
  }

  // setup entry in System.recordedData
  if (System.recordData) {
    System.recordedData = System._resetRecordedData();
  }

  for (i = len - 1; i >= 0; i -= 1) {

    var record = records[i];

    if (record && record.step && !record.world.pauseStep) {

      if (record.life < record.lifespan) {
        record.life += 1;
      } else if (record.lifespan !== -1) {
        System.remove(record);
        continue;
      }

      if (record instanceof World) {
        System._buffers[record.id] = '';
      }

      record.step();

      if (System.recordData && record.name !== 'World' && record.opacity) { // we don't want to record World data as Item
        if (!System._checkRecordFrame()) {
          continue;
        }
        System._saveData(System.recordedData.items.length, record);
      }
    }
  }

  if (System.zSort) {
    records = records.sort(function(a,b){return (a.zIndex - b.zIndex);});
  }

  len = System._records.length; // check length in case items were removed in step()

  // loop thru records and build box shadows
  for (i = records.length - 1; i >= 0; i -= 1) {
    record = records[i];
    if (record.world && record.location && record.opacity && !(record instanceof World)) {

      shadows = buffers[record.world.id];

      if (record.world.colorMode === 'rgb' && record.color) {
        shadows = shadows + System._buildStringRGBA(record);
      } else if (record.world.colorMode === 'hsl' && typeof record.hue !== 'undefined' &&
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

  // check to call frame complete callback.
  if (System.recordData) {
    System.saveFrameDataComplete(System.clock, System.recordedData);
  }
  System.clock++;
  if (FPSDisplay.active) {
    FPSDisplay.update(len);
  }
  if (typeof window.requestAnimationFrame !== 'undefined') {
    window.requestAnimationFrame(System.loop);
  }
};

/**
 * Called when frame has completed rendering. You should
 * override this function with your own handler.
 * @param {number} frameNumber The current frame number (System.clock).
 * @param {Object} data The data saved from the current frame.
 * @throws {Object} If not overridden.
 */
System.saveFrameDataComplete = function(frameNumber, data) {
  throw new Error('System.saveFrameDataComplete not implemented. Override this function.');
};

/**
 * Called if recordEndFrame - recordStartFrame exceeds System.clock.
 */
System.totalFramesCallback = function() {
  var totalFrames = System.recordEndFrame - System.recordStartFrame;
  console.log('Rendered ' + totalFrames + ' frames.');
};

/**
 * Checks if the System recorded the total number of frames.
 * @return {[type]} [description]
 */
System.checkFramesRecorded = function() {
  var totalFrames = System.recordEndFrame - System.recordStartFrame;
  if (totalFrames > 0 && System.clock >= System.recordEndFrame) {
    System.totalFramesCallback();
    return true;
  }
};

/**
 * Checks if System.clock is within bounds.
 * @returns {Boolean} True if frame should be recorded.
 */
System._checkRecordFrame = function() {
  if (System.clock >= System.recordStartFrame && System.clock <= System.recordEndFrame) {
    return true;
  }
};

/**
 * Resets System.recordedData.
 */
System._resetRecordedData = function() {
  return {
    frame: System.clock,
    world: {},
    items: []
  };
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
          x: parseFloat(record[i].x.toFixed(2), 10),
          y: parseFloat(record[i].y.toFixed(2), 10)
        };
      }
      if (typeof val === 'number') {
        val = parseFloat(val.toFixed(2), 10);
      }
      var frame = System.recordedData;
      var item = frame.items[index];
      if (typeof item !== 'object') {
        frame.items[index] = {};
      }
      frame.items[index][i] = val;
    }
    if (!System.recordedData.world.id) {
      for (var j in record.world) {
        if (record.world.hasOwnProperty(j) && System.recordWorldProperties[j]) {
          System.recordedData.world[j] = record.world[j];
        }
      }
    }
  }
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
        'hsla(' + item.hue + ',' + (item.saturation * 100) + '%,' + (item.lightness * 100) + '%' + // color
        ', ' + item.opacity + '),'; // opacity
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
        'rgba(' + item.color[0] + ',' + item.color[1] + ',' + item.color[2] + // color
        ', ' + item.opacity + '),'; // opacity
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

  var i, max, world, worlds = System.allWorlds();

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
  }
};

/**
 * Toggles stats display.
 *
 * @function _toggleStats
 * @memberof System
 * @private
 */
System._toggleStats = function() {
  if (!FPSDisplay.fps) {
    FPSDisplay.init();
  } else {
    FPSDisplay.active = !FPSDisplay.active;
  }

  if (!FPSDisplay.active) {
    FPSDisplay.hide();
  } else {
    FPSDisplay.show();
  }
};


module.exports = System;
