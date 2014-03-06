/**
 * Creates a new Anim. Use for frame-based animation in a
 * Bit-Shadow Machine rendering.
 *
 * An Anim is a simple hidden point with a 'frames' property
 * that describes additional Bit-Shadows to position relative
 * to the Anim's location. An Anim also has an advanceFrame
 * method that cycles through all entries in the frames property.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @constructor
 */
function Anim(opt_options) {
  var options = opt_options || {};
  options.name = 'Anim';
  Item.call(this, options);
}
Utils.extend(Anim, Item);

/**
 * Initializes the Anim.
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.scale = 0] Scale. Set to a higher value for debugging.
 * @param {Array} [opt_options.color = [0, 0, 0]] Color. Set color for debugging if scale > 0.
 * @param {number} [opt_options.zIndex = 0] zIndex. Set to a higher value to place this pixel on a higher layer.
 * @param {Object} [opt_options.location = new Vector] Location.
 * @param {Array} [opt_options.frames = []] The frames to animate.
 * @param {number} [opt_options.currentFrame = 0] The current animation frame.
 *
 * @example The 'frames' property should be formatted like:
 * var obj = [
 *   {"items":
 *     [
 *       {"x":9,"y":-30,"color":[255,255,255],"opacity":255,"scale":1},
 *       {"x":17,"y":-30,"color":[255,255,255],"opacity":255,"scale":1}
 *     ]
 *   }
 * ];
 */
Anim.prototype.init = function(options) {

  /*
   * At scale = 0, the origin point will be hidden. Set scale and
   * color for help w debugging.
   */
  this.scale = options.scale || 0;
  this.color = options.color || [0, 0, 0];
  this.location = options.location || new BitShadowMachine.Vector(this.world.width / 2, this.world.height / 2);

  this.frames = options.frames || [];
  this.currentFrame = options.currentFrame !== 'undefined' ? 0 : options.currentFrame;
  this.loop = options.loop !== 'undefined' ? true : options.loop;

  this.frameDuration = options.frameDuration || 3;

  /**
   * Anim instances must be stored in System._records.list at a lower index
   * than their associated AnimUnit instance. If System.zSorted = true,
   * we sort System._records.list by zIndex. Since Anim instances are
   * invisible (while their AnimUnits are rendered), we can force a negative
   * zIndex and keep them at the bottom of System._records.list.
   */
  this.zIndex = -options.zIndex || -1;

  /**
   * The internal frame count that is checked against
   * frameDuration to see if we should advance the frame.
   * @private
   */
  this._frameCount = 0;

};


/**
 * Updates properties.
 */
Anim.prototype.step = function() {

  if (this._frameCount < this.frameDuration) {
    this._frameCount++;
  } else {
    this.advanceFrame();
    this._frameCount = 0;
  }
};

/*
 * Loops thru all entries in the 'frames' property and
 * creates instances of AnimUnit.
 */
Anim.prototype.advanceFrame = function() {

  var i, max, animUnits, item, frame;

  // create new anim pixels
  if (this.frames.length) {
    frame = this.frames[this.currentFrame];
    for (i = 0, max = frame.items.length; i < max; i++) {
      item = frame.items[i];
      BitShadowMachine.System.add('AnimUnit', {
        location: new BitShadowMachine.Vector(this.location.x + item.x, this.location.y + item.y),
        color: item.color,
        scale: 1,
        opacity: item.opacity,
        parentId: this.id,
        zIndex: -this.zIndex // reverse the zIndex value so the intended value is passed to the AnimUnit
      }, this.world);
    }
  }

  if (this.currentFrame + 1 < this.frames.length) {
    this.currentFrame++;
  } else if (this.loop) {
    this.currentFrame = 0;
  }
};
