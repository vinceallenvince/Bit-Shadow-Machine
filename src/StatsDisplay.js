/*global document, window */

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
function StatsDisplay() {}

/**
 * Name
 * @private
 * @memberof StatsDisplay
 */
StatsDisplay.name = 'StatsDisplay';

/**
 * Set to false to stop requesting animation frames.
 * @private
 * @memberof StatsDisplay
 */
StatsDisplay.active = false;

/**
 * Frames per second.
 * @private
 * @memberof StatsDisplay
 */
StatsDisplay.fps = false;

/**
 * The current time.
 * @private
 * @memberof StatsDisplay
 */
StatsDisplay._time = Date.now();

/**
 * The time at the last frame.
 * @private
 * @memberof StatsDisplay
 */
StatsDisplay._timeLastFrame = StatsDisplay._time;

/**
 * The time the last second was sampled.
 * @private
 * @memberof StatsDisplay
 */
StatsDisplay._timeLastSecond = StatsDisplay._time;

/**
 * Holds the total number of frames
 * between seconds.
 * @private
 * @memberof StatsDisplay
 */
StatsDisplay._frameCount = 0;

/**
 * Initializes the StatsDisplay.
 * @function update
 * @memberof StatsDisplay
 */
StatsDisplay.init = function() {

  StatsDisplay.active = true;

  /**
   * A reference to the DOM element containing the display.
   * @private
   */
  StatsDisplay.el = document.createElement('div');
  StatsDisplay.el.id = 'statsDisplay';
  StatsDisplay.el.className = 'statsDisplay';
  StatsDisplay.el.style.backgroundColor = 'black';
  StatsDisplay.el.style.color = 'white';
  StatsDisplay.el.style.fontFamily = 'Helvetica';
  StatsDisplay.el.style.padding = '0.5em';
  StatsDisplay.el.style.opacity = '0.5';


  // create totol elements label
  var labelContainer = document.createElement('span');
  labelContainer.className = 'statsDisplayLabel';
  labelContainer.style.marginLeft = '0.5em';
  label = document.createTextNode('total elements: ');
  labelContainer.appendChild(label);
  StatsDisplay.el.appendChild(labelContainer);

  // create textNode for totalElements
  StatsDisplay.totalElementsValue = document.createTextNode('0');
  StatsDisplay.el.appendChild(StatsDisplay.totalElementsValue);

  // create fps label
  labelContainer = document.createElement('span');
  labelContainer.className = 'statsDisplayLabel';
  labelContainer.style.marginLeft = '0.5em';
  var label = document.createTextNode('fps: ');
  labelContainer.appendChild(label);
  StatsDisplay.el.appendChild(labelContainer);

  // create textNode for fps
  StatsDisplay.fpsValue = document.createTextNode('0');
  StatsDisplay.el.appendChild(StatsDisplay.fpsValue);

  document.body.appendChild(StatsDisplay.el);

};

/**
 * If 1000ms have elapsed since the last evaluated second,
 * fps is assigned the total number of frames rendered and
 * its corresponding textNode is updated. The total number of
 * elements is also updated.
 *
 * @function update
 * @memberof StatsDisplay
 * @param {Number} [opt_totalItems] The total items in the system.
 */
StatsDisplay.update = function(opt_totalItems) {

  var sd = StatsDisplay,
      totalItems = opt_totalItems || 0;

  sd._time = Date.now();
  sd._frameCount++;

  // at least a second has passed
  if (sd._time > sd._timeLastSecond + 1000) {

    sd.fps = sd._frameCount;
    sd._timeLastSecond = sd._time;
    sd._frameCount = 0;

    sd.fpsValue.nodeValue = sd.fps;
    sd.totalElementsValue.nodeValue = totalItems;
  }
};

/**
 * Hides statsDisplay from DOM.
 * @function hide
 * @memberof StatsDisplay
 */
StatsDisplay.hide = function() {
  var sd = document.getElementById(StatsDisplay.el.id);
  sd.style.display = 'none';
};

/**
 * Shows statsDisplay from DOM.
 * @function show
 * @memberof StatsDisplay
 */
StatsDisplay.show = function() {
  var sd = document.getElementById(StatsDisplay.el.id);
  sd.style.display = 'block';
};

module.exports = StatsDisplay;
