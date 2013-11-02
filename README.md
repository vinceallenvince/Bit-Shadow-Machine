Bit-Shadow Machine: A JavaScript framework for creating particle and frame-based animation.
======

Bit-Shadow Machine renders particles in a web browser using CSS box shadows. That's it. No HTML5 Canvas, WebGL or even a single DOM element.

By default, the box shadows are attached to your document's body. Freed from parsing the render tree, the browser can animate many more particles than with conventional methods. You should be able to easily render several hundred particles at 60 frames per second.

View a demo at http://www.bitshadowmachine.com

## Create a Simple System

Think of a Bit-Shadow Machine as a rendering engine. You supply the particles to animate. It takes care of drawing them on screen.

To setup a simple Bit-Shadow Machine, reference BitShadowMachine.min.js and Modernizr.min.js from a script tag in the &lt;head&gt; of your document.

Also, reference the bitshadowmachine.css file.

In the body, add a &lt;script&gt; tag and create a new Bit-Shadow system. Pass the system a function that adds items to the system.

IMPORTANT: Your items must extend the BitShadowMachine.Item class.

The following is taken from public/simple.html.

```html
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
  <title>Bit-Shadow Machine</title>
  <link rel="stylesheet" href="css/BitShadowMachine.min.css" type="text/css" charset="utf-8" />
  <script src="scripts/Modernizr.min.js" type="text/javascript" charset="utf-8"></script>
  <script src="scripts/BitShadowMachine.min.js" type="text/javascript" charset="utf-8"></script>
  </head>
  <body>
    <script type="text/javascript" charset="utf-8">

      function Box(opt_options) {
        var options = opt_options || {};
        options.name = 'Box';
        BitShadowMachine.Item.call(this, options);
      }
      BitShadowMachine.Utils.extend(Box, BitShadowMachine.Item);

      // An init() method is required.
      Box.prototype.init = function(options) {
        this.color = options.color || [100, 100, 100];
        this.location = options.location || new BitShadowMachine.Vector(this.world.width / 2, this.world.height / 2);
      };

      /**
       * Tell BitShadowMachine where to find classes.
       */
      BitShadowMachine.Classes = {
        Box: Box
      };

      var worldA = new BitShadowMachine.World();

      /**
       * Create a new BitShadowMachine system.
       */
      BitShadowMachine.System.init(function() {
        this.add('Box');
      }, null, Modernizr);
    </script>
  </body>
</html>
```

Notice we're defining a Box class that extends BitShadowMachine.Item. The class must also have an init() method to set additional properties.

Loading the above, you should see a gray box in the middle of the browser.

## Animation

Let's make the box move.

```html
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
  <title>Bit-Shadow Machine</title>
  <link rel="stylesheet" href="css/BitShadowMachine.min.css" type="text/css" charset="utf-8" />
  <script src="scripts/Modernizr.min.js" type="text/javascript" charset="utf-8"></script>
  <script src="scripts/BitShadowMachine.min.js" type="text/javascript" charset="utf-8"></script>
  </head>
  <body>
    <script type="text/javascript" charset="utf-8">

      function Box(opt_options) {
        var options = opt_options || {};
        options.name = 'Box';
        BitShadowMachine.Item.call(this, options);
      }
      BitShadowMachine.Utils.extend(Box, BitShadowMachine.Item);

      // An init() method is required.
      Box.prototype.init = function(options) {
        this.color = options.color || [100, 100, 100];
        this.location = options.location || new BitShadowMachine.Vector(this.world.width / 2, this.world.height / 2);
        this.acceleration = options.acceleration || new BitShadowMachine.Vector();
        this.velocity = options.velocity || new BitShadowMachine.Vector();
        this.mass = options.mass || 10;
        this.maxSpeed = typeof options.maxSpeed === 'undefined' ? 10 : options.maxSpeed;
        this.minSpeed = options.minSpeed || 0;
        this.bounciness = options.bounciness || 1;
        this._force = new BitShadowMachine.Vector();
      };

      Box.prototype.step = function() {
        if (this.beforeStep) {
          this.beforeStep.call(this);
        }
        this.applyForce(this.world.gravity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed, this.minSpeed);
        this.location.add(this.velocity);
        this._checkWorldEdges();
        this.acceleration.mult(0);
      };

      Box.prototype.applyForce = function(force) {
        if (force) {
          this._force.x = force.x;
          this._force.y = force.y;
          this._force.div(this.mass);
          this.acceleration.add(this._force);
          return this.acceleration;
        }
      };

      Box.prototype._checkWorldEdges = function() {
        if (this.location.y > this.world.height) { // bottom
          this.velocity.mult(-this.bounciness);
          this.location.y = this.world.height;
          return;
        }
      };

      /**
       * Tell BitShadowMachine where to find classes.
       */
      BitShadowMachine.Classes = {
        Box: Box
      };

      var worldA = new BitShadowMachine.World();

      /**
       * Create a new BitShadowMachine system.
       */
      BitShadowMachine.System.init(function() {
        this.add('Box');
      }, null, Modernizr);
    </script>
  </body>
</html>
```

The Bit-Shadow Machine system will execute an item's step() method each iteration of the animation loop. In the example above, we've added some additional properties and use them in the step() method to simulate a gravitationl force on the box. You can find the code public/simple-anim.html.

## Multiple items

Now we'll see the power of the Bit-Shadow Machine. Replace the System.init() call with the following.

```javascript
BitShadowMachine.System.init(function() {
  var getRandomNumber = BitShadowMachine.Utils.getRandomNumber;
  for (var i = 0; i < 500; i++) {
    var scale = getRandomNumber(0.25, 2, true);
    this.add('Box', {
      location: new BitShadowMachine.Vector(getRandomNumber(0, worldA.width),
          getRandomNumber(0, worldA.height / 2)),
      opacity: BitShadowMachine.Utils.map(scale, 1, 2, 1, 0.25),
      scale: scale,
      mass: scale
    });
  }
}, null, Modernizr);
```

We're adding 500 items with random scale and random location. We've also inversely mapped scale and opacity so the largest items have the least opacity.

Press 's' on your keyboard. You should see a status menu appear in the top left that indicates the total number of objects and the current frame rate. You should see 501 items (the world counts as an item) and a frame rate close to 60 frames per second.

## Blur

Since we're using CSS box-shadows, we can also apply blur to our items. Replace the System.init function with the following.

```javascript
BitShadowMachine.System.init(function() {
  var getRandomNumber = BitShadowMachine.Utils.getRandomNumber;
  for (var i = 0; i < 250; i++) {
    var scale = getRandomNumber(0.25, 2, true);
    this.add('Box', {
      location: new BitShadowMachine.Vector(getRandomNumber(0, worldA.width),
          getRandomNumber(0, worldA.height / 2)),
      opacity: BitShadowMachine.Utils.map(scale, 1, 2, 1, 0.25),
      scale: scale,
      mass: scale,
      beforeStep: function() {
        this.blur = BitShadowMachine.Utils.map(this.velocity.mag(), this.minSpeed, this.maxSpeed, 0, 100);
      }
    });
  }
}, null, Modernizr);
```

We've added a function as a beforeStep property that gets called from step(). In beforeStep, we're mapping the magnitude of the item's velocity to its min/max speed and producing a blur value between 0 and 100. Running the code you should see the items blur as they accelerate.

Rendering blur is an intensive operation that requires us to decrease the total number of items to maintain 60fps.

Now step back and remember these animated items are all just CSS box shadows on the document body.

## A world

A Bit-Shadow world can be any element that has a box shadow. In the example below, we've placed a &lt;div&gt; in the body and passed in as the second argument to the System.init() method.

```html

```


Building this project
======

This project uses [Grunt](http://gruntjs.com). To build the project first install the node modules.

```
npm install
```

Next, run grunt.

```
grunt
```

A pre-commit hook is defined in /pre-commit that runs jshint. To use the hook, run the following:

```
ln -s ../../pre-commit .git/hooks/pre-commit
```

A post-commit hook is defined in /post-commit that runs the Plato complexity analysis tools. To use the hook, run the following:

```
ln -s ../../post-commit .git/hooks/post-commit
```
