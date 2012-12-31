# Box-Shadow Machine: a JavaScript framework for creating particle animations

A Bit-Shadow Machine renders particles in a web browser using CSS box shadows. That's it. No HTML5 Canvas, WebGL or even a single DOM element.

By default, the box shadows are attached to your document's body. Freed from parsing the render tree, the browser can animate many more particles than with conventional methods. You should be able to easily render several hundred particles at 60 frames per second.

## Create a Simple System

Think of a Bit-Shadow Machine as a rendering engine. You supply the particles to animate. It takes care of drawing them on screen.

To setup a simple Bit-Shadow Machine, reference the bitshadowmachine.min.js file from a script tag in the &lt;head&gt; of your document. Also, reference the bitshadowmachine.css file.

In the body, add a &lt;script&gt; tag and create a new Bit-Shadow system. Pass the system a function that describes the elements in the system.

IMPORTANT: Your elements must extend the BitShadowMachine.Element class.

The following is taken from examples/simple.html.

```html
<!DOCTYPE html>
  <html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <title>Bit-Shadow Machine</title>
    <link rel="stylesheet" href="css/bitshadowmachine.min.css" type="text/css" charset="utf-8">
    <script src="scripts/bitshadowmachine.min.js" type="text/javascript" charset="utf-8"></script>
  </head>
  <body>
    <script type="text/javascript">

      var SimpleAnim = {}, exports = SimpleAnim;

      (function(exports) {

        // create BitShadowMachine namespace
        exports.BitShadowMachine = {};

        // pass in the namespace and parent object
        new BitShadowMachine(exports.BitShadowMachine, exports);

        function Block(opt_options) {

          var options = opt_options || {},
              bsm = exports.BitShadowMachine,
              utils = exports.BitShadowMachine.Utils;

          bsm.Element.call(this, options); // Required: extend Element

          this.world = options.world;

          this.id = options.id;
          this.width = options.width || 1;
          this.height = options.height || 1;
          this.mass = options.mass || 1;
          this.color = options.color || [255, 255, 255];
          this.opacity = options.opacity || 0.8;
          this.bounciness = options.bounciness || 0.8;

          this.acceleration = utils.getDataType(options.acceleration) === 'function' ?
              options.acceleration() : options.acceleration || new bsm.Vector();

          this.velocity = utils.getDataType(options.velocity) === 'function' ?
              options.velocity() : options.velocity || new bsm.Vector();

          this.location = utils.getDataType(options.location) === 'function' ?
              options.location() : options.location ||
              new bsm.Vector(this.world.width / 2, this.world.height/ 2);

          this.maxSpeed = options.maxSpeed || 100;

          this.forceVector = new bsm.Vector();
          this.name = 'block';

          return this;
        }
        exports.BitShadowMachine.Utils.extend(Block,
            exports.BitShadowMachine.Element);  // Required: extend Element

        /**
         * Called every frame, step() updates the instance's properties.
         */
        Block.prototype.step = function() {

          this.applyForce(this.world.gravity); // gravity

          this.velocity.add(this.acceleration); // add acceleration

          if (this.maxSpeed) {
            this.velocity.limit(this.maxSpeed); // check if velocity > maxSpeed
          }

          this.location.add(this.velocity); // add velocity

          this.checkEdges(); // check world bounds

          this.acceleration.mult(0); // reset acceleration
        };

        /**
         * Applies a force to this object's acceleration via F = M * A.
         *
         * @param {Object} force The force to be applied (expressed as a vector).
         */
        Block.prototype.applyForce = function(force) {
          this.forceVector.x = force.x;
          this.forceVector.y = force.y;
          this.forceVector.div(this.mass);
          this.acceleration.add(this.forceVector);
        };

        /**
         * Checks if this object is outside the world bounds.
         */
        Block.prototype.checkEdges = function() {

          if (this.location.y - this.height/2 < 0) { // top
            this.velocity.mult(-this.bounciness);
            this.location.y = this.height/2;
            return;
          }

          if (this.location.x + this.width/2 > this.world.width) { // right
            this.velocity.mult(-this.bounciness);
            this.location.x = this.world.width - this.width/2;
            return;
          }

          if (this.location.y + this.height/2 > this.world.height) { // bottom
            this.velocity.mult(-this.bounciness);
            this.location.y = this.world.height - this.height/2;
            return;
          }

          if (this.location.x - this.width/2 < 0) { // left
            this.velocity.mult(-this.bounciness);
            this.location.x = this.width/2;
            return;
          }
        };
        exports.Block = Block;

      }(exports));

      var totalBlocks = 200,
          bsm = SimpleAnim.BitShadowMachine;

      var system = new bsm.System.create(function() {
        for (var i = 0; i < totalBlocks; i++) {
          bsm.System.add('Block', {
            mass: bsm.Utils.map(i, 0, totalBlocks, 0.1, 1),
            location: function() {
              return new bsm.Vector(bsm.Utils.getRandomNumber(0, this.world.width),
                  this.world.height / 4);
            }
          });
        }
      });

    </script>
  </body>
</html>
```

You should see 200 blocks fall and bounce off the bottom of your browser.

## Change the resolution

Currently, all particles in the Bit-Shadow Machine are the same size. By default, the resolution is 8px X 8px. To change the resolution, pass in a new resolution when creating a new system.

Replace the System.create() call above with this:

```html

var system = new bsm.System.create(function() {
  for (var i = 0; i < totalBlocks; i++) {
    bsm.System.add('Block', {
      mass: bsm.Utils.map(i, 0, totalBlocks, 0.1, 1),
      location: function() {
        return new bsm.Vector(bsm.Utils.getRandomNumber(0, this.world.width),
            this.world.height / 4);
      }
    });
  }
},
{
  el: document.body,
  resolution: 4
});

You should see 4px X 4px blocks. You can change the gravity, and colorMode via the same method.

```

