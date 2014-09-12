var Item = BitShadowMachine.Item,
    SimplexNoise = BitShadowMachine.SimplexNoise,
    System = BitShadowMachine.System,
    Utils = BitShadowMachine.Utils,
    Vector = BitShadowMachine.Vector;

function Oscillator(opt_options) {
  Item.call(this);
}
Utils.extend(Oscillator, Item);

Oscillator.prototype.init = function(world, opt_options) {
  Oscillator._superClass.init.call(this, world, opt_options);

  var options = opt_options || {};

  this.acceleration = options.acceleration || new Vector(0.01, 0);
  this.aVelocity = options.aVelocity || new Vector();
  this.isStatic = !!options.isStatic;
  this.perlin = !!options.perlin;
  this.perlinSpeed = typeof options.perlinSpeed === 'undefined' ? 0.005 : options.perlinSpeed;
  this.perlinTime = options.perlinTime || 0;
  this.perlinAccelLow = typeof options.perlinAccelLow === 'undefined' ? -2 : options.perlinAccelLow;
  this.perlinAccelHigh = typeof options.perlinAccelHigh === 'undefined' ? 2 : options.perlinAccelHigh;
  this.perlinOffsetX = typeof options.perlinOffsetX === 'undefined' ? Math.random() * 10000 : options.perlinOffsetX;
  this.perlinOffsetY = typeof options.perlinOffsetY === 'undefined' ? Math.random() * 10000 : options.perlinOffsetY;
  this.width = typeof options.width === 'undefined' ? 20 : options.width;
  this.height = typeof options.height === 'undefined' ? 20 : options.height;
  this.color = options.color || [200, 100, 0];
  this.borderWidth = options.borderWidth || 0;
  this.borderStyle = options.borderStyle || 'solid';
  this.borderColor = options.borderColor || [255, 150, 50];
  this.borderRadius = typeof options.borderRadius === 'undefined' ? 100 : options.borderRadius;
  this.boxShadowOffsetX = options.boxShadowOffsetX || 0;
  this.boxShadowOffsetY = options.boxShadowOffsetY || 0;
  this.boxShadowBlur = options.boxShadowBlur || 0;
  this.boxShadowSpread = options.boxShadowSpread || 0;
  this.boxShadowColor = options.boxShadowColor || [200, 100, 0];
  this.opacity = typeof options.opacity === 'undefined' ? 0.75 : options.opacity;
  this.zIndex = typeof options.zIndex === 'undefined' ? 1 : options.zIndex;
  this.parent = options.parent || null;
  this.pointToDirection = !!options.pointToDirection;

  //

  this.lastLocation = new Vector();
  this.amplitude = options.amplitude || new Vector(this.world.width / 2,
      this.world.height / 2);
  this.initialLocation = options.initialLocation ||
    new Vector(this.world.width / 2, this.world.height / 2);
  this.location.x = this.initialLocation.x;
  this.location.y = this.initialLocation.y;
};

Oscillator.prototype.step = function () {

  this.beforeStep.call(this);

  if (this.isStatic) {
    return;
  }

  if (this.perlin) {
    this.perlinTime += this.perlinSpeed;
    this.aVelocity.x =  Utils.map(SimplexNoise.noise(this.perlinTime + this.perlinOffsetX, 0), -1, 1, this.perlinAccelLow, this.perlinAccelHigh);
    this.aVelocity.y =  Utils.map(SimplexNoise.noise(0, this.perlinTime + this.perlinOffsetY), -1, 1, this.perlinAccelLow, this.perlinAccelHigh);
  } else {
    this.aVelocity.add(this.acceleration); // add acceleration
  }

  if (this.parent) { // parenting
    this.initialLocation.x = this.parent.location.x;
    this.initialLocation.y = this.parent.location.y;
  }

  this.location.x = this.initialLocation.x + Math.sin(this.aVelocity.x) * this.amplitude.x;
  this.location.y = this.initialLocation.y + Math.sin(this.aVelocity.y) * this.amplitude.y;

  if (this.pointToDirection) { // object rotates toward direction
      velDiff = Vector.VectorSub(this.location, this.lastLocation);
      this.angle = Utils.radiansToDegrees(Math.atan2(velDiff.y, velDiff.x));
  }

  if (this.life < this.lifespan) {
    this.life += 1;
  } else if (this.lifespan !== -1) {
    System.remove(this);
  }

  this.afterStep.call(this);

  this.lastLocation.x = this.location.x;
  this.lastLocation.y = this.location.y;
};
