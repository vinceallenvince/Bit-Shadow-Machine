var Item = BitShadowMachine.Item,
    SimplexNoise = BitShadowMachine.SimplexNoise,
    System = BitShadowMachine.System,
    Utils = BitShadowMachine.Utils,
    Vector = BitShadowMachine.Vector;

function Walker(opt_options) {
  Mover.call(this);
}
Utils.extend(Walker, Mover);

Walker.prototype.init = function(world, opt_options) {
  Walker._superClass.init.call(this, world, opt_options);

  var options = opt_options || {};

  this.width = typeof options.width === 'undefined' ? 10 : options.width;
  this.height = typeof options.height === 'undefined' ? 10 : options.height;
  this.remainsOnScreen = !!options.remainsOnScreen;
  this.maxSpeed = typeof options.maxSpeed === 'undefined' ? 1 : options.maxSpeed;
  this.perlin = typeof options.perlin === 'undefined' ? true : options.perlin;
  this.perlinSpeed = typeof options.perlinSpeed === 'undefined' ? 0.005 : options.perlinSpeed;
  this.perlinTime = options.perlinTime || 0;
  this.perlinAccelLow = typeof options.perlinAccelLow === 'undefined' ? -0.075 : options.perlinAccelLow;
  this.perlinAccelHigh = typeof options.perlinAccelHigh === 'undefined' ? 0.075 : options.perlinAccelHigh;
  this.perlinOffsetX = typeof options.perlinOffsetX === 'undefined' ? Math.random() * 10000 : options.perlinOffsetX;
  this.perlinOffsetY = typeof options.perlinOffsetY === 'undefined' ? Math.random() * 10000 : options.perlinOffsetY;
  this.color = options.color || [255, 150, 50];
  this.borderWidth = typeof options.borderWidth === 'undefined' ? 0 : options.borderWidth;
  this.borderStyle = options.borderStyle || 'none';
  this.borderColor = options.borderColor || [255, 255, 255];
  this.borderRadius = typeof options.borderRadius === 'undefined' ? 100 : options.borderRadius;
  this.opacity = typeof options.opacity === 'undefined' ? 1 : options.opacity;
  this.zIndex = typeof options.zIndex === 'undefined' ? 0 : options.zIndex;

  this._randomVector = new Vector();
};

/**
 * If walker uses perlin noise, updates acceleration based on noise space. If walker
 * is a random walker, updates location based on random location.
 */
Walker.prototype.applyAdditionalForces = function() {

  // walker use either perlin noise or random walk
  if (this.perlin) {

    this.perlinTime += this.perlinSpeed;

    if (this.remainsOnScreen) {
      this.acceleration = new Vector();
      this.velocity = new Vector();
      this.location.x =  Utils.map(SimplexNoise.noise(this.perlinTime + this.perlinOffsetX, 0), -1, 1, 0, this.world.width);
      this.location.y =  Utils.map(SimplexNoise.noise(0, this.perlinTime + this.perlinOffsetY), -1, 1, 0, this.world.height);
    } else {
      this.acceleration.x =  Utils.map(SimplexNoise.noise(this.perlinTime + this.perlinOffsetX, 0), -1, 1, this.perlinAccelLow, this.perlinAccelHigh);
      this.acceleration.y =  Utils.map(SimplexNoise.noise(0, this.perlinTime + this.perlinOffsetY), -1, 1, this.perlinAccelLow, this.perlinAccelHigh);
    }
    return;
  }

  // point to a random angle and move toward it
  this._randomVector.x = 1;
  this._randomVector.y = 1;
  this._randomVector.normalize();
  this._randomVector.rotate(Utils.degreesToRadians(Utils.getRandomNumber(0, 359)));
  this._randomVector.mult(this.maxSpeed);
  this.applyForce(this._randomVector);
};


