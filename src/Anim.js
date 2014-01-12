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
  this.frameCount = 0;
};


/**
 * Updates properties.
 */
Anim.prototype.step = function() {

  if (this.frameCount < this.frameDuration) {
    this.frameCount++;
  } else {
    this.advanceFrame();
    this.frameCount = 0;
  }
};

/*
 * Loops thru all entries in the 'frames' property and
 * creates instances of AnimUnit.
 */
Anim.prototype.advanceFrame = function() {

  var i, max, animUnits, item, frame;

  // destroy all anim pixels
  animUnits = BitShadowMachine.System.getAllItemsByName('AnimUnit');

  for (i = 0, max = animUnits.length; i < max; i++) {
    BitShadowMachine.System.destroyItem(animUnits[i]);
  }

  // create new anim pixels
  if (this.frames.length) {
    frame = this.frames[this.currentFrame];
    for (i = 0, max = frame.items.length; i < max; i++) {
      item = frame.items[i];
      BitShadowMachine.System.add('AnimUnit', {
        location: new BitShadowMachine.Vector(this.location.x + item.x, this.location.y + item.y),
        color: item.color,
        scale: 1
      });
    }
  }

  if (this.currentFrame + 1 < this.frames.length) {
    this.currentFrame++;
  } else if (this.loop) {
    this.currentFrame = 0;
  }
};
