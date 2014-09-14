Bit-Shadow Machine: A JavaScript framework for creating particle and frame-based animation.
======

Bit-Shadow Machine renders particles in a web browser using CSS box shadows. That's it. No HTML5 Canvas, WebGL or even a single DOM element.

By default, the box shadows are attached to your document's body. Freed from parsing the render tree, the browser can animate many more particles than with conventional methods. You should be able to easily render several hundred particles at 60 frames per second.

View a demo at http://www.bitshadowmachine.com

## Create a Simple System

Think of a Bit-Shadow Machine as a rendering engine. You supply the particles to animate. It takes care of drawing them on screen.

To setup a simple Bit-Shadow Machine, reference bitshadowmachine.min.js and the bitshadowmachine.css from a script tag in the &lt;head&gt; of your document.

In the body, add a &lt;script&gt; tag and create a new Bit-Shadow system. Pass the system a function that adds items to the system.

IMPORTANT: Your items must extend the BitShadowMachine.Item class.

```html
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
  <title>Bit-Shadow Machine</title>
  <link href="css/bitshadowmachine.min.css" type="text/css" charset="utf-8" rel="stylesheet" />
  <script src="scripts/BitShadowMachine.min.js" type="text/javascript" charset="utf-8"></script>
  </head>
  <body>
    <div id='worldA'></div>
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

      /**
       * Create a new BitShadowMachine system.
       */
      BitShadowMachine.System.setup(function() {
        var world = this.add('World', {
          width: 960,
          height: 540,
          resolution: 4,
          el: document.getElementById('worldA'),
          color: [0, 0, 0],
          gravity: new BitShadowMachine.Vector(),
          c: 0
        });

        this.add('Box');
      });
      /**
       * Start the animation loop.
       */
      BitShadowMachine.System.loop();
    </script>
  </body>
</html>
```

Notice we're defining a Box class that extends BitShadowMachine.Item. The class must also have an init() method to set additional properties.

Loading the above, you should see a white box in the middle of the browser. View it at [public/Bit.Box.html](http://vinceallenvince.github.io/Bit-Shadow-Machine/Bit.Box.html).


## Animation

Let's make the box move.

```html
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
  <title>Bit-Shadow Machine</title>
  <link href="css/bitshadowmachine.min.css" type="text/css" charset="utf-8" rel="stylesheet" />
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

      /**
       * Create a new BitShadowMachine system.
       */
      BitShadowMachine.System.setup(function() {
        var world = this.add('World', {
          resolution: 4,
          color: [0, 0, 0],
          gravity: new BitShadowMachine.Vector(0, 0.1),
          c: 0
        });

        this.add('Box');
      });
      /**
       * Start the animation loop.
       */
      BitShadowMachine.System.loop();
    </script>
  </body>
</html>
```

The Bit-Shadow Machine system will execute an item's step() method each iteration of the animation loop. In the example above, we've added some additional properties and use them in the step() method to simulate a gravitational force on the box. View it at [public/Bit.BoxAnim.html](http://vinceallenvince.github.io/Bit-Shadow-Machine/Bit.BoxAnim.html).

## Multiple items

Now we'll see the power of the Bit-Shadow Machine. Replace the System.init() call with the following.

```javascript
BitShadowMachine.System.setup(function() {
  var rand = BitShadowMachine.Utils.getRandomNumber;
  for (var i = 0; i < 500; i++) {
    var scale = rand(0.25, 4, true);
    this.add('Box', {
      location: new BitShadowMachine.Vector(rand(0, world.width),
          rand(0, world.height / 2)),
      opacity: BitShadowMachine.Utils.map(scale, 0.25, 4, 1, 0.25),
      scale: scale,
      mass: BitShadowMachine.Utils.map(scale, 0.25, 4, 10, 15)
    });
  }
});
```

We're adding 500 items with random scale and random location. We've also inversely mapped scale and opacity so the largest items have the least opacity.

Press 's' on your keyboard. You should see a status menu appear in the top left that indicates the total number of objects and the current frame rate. You should see 501 items (the world counts as an item) and a frame rate close to 60 frames per second.

View it at [public/Bit.BoxAnimItems.html](http://vinceallenvince.github.io/Bit-Shadow-Machine/Bit.BoxAnimItems.html).

## Blur

Since we're using CSS box-shadows, we can also apply blur to our items. Replace the System.init function with the following.

```javascript
BitShadowMachine.System.init(function() {
  var rand = BitShadowMachine.Utils.getRandomNumber;
  for (var i = 0; i < 100; i++) {
    var scale = rand(0.25, 4, true);
    this.add('Box', {
      location: new BitShadowMachine.Vector(rand(0, world.width),
          rand(0, world.height / 2)),
      opacity: BitShadowMachine.Utils.map(scale, 0.25, 4, 1, 0.25),
      scale: scale,
      mass: BitShadowMachine.Utils.map(scale, 0.25, 4, 10, 15),
      beforeStep: function() {
        this.blur = BitShadowMachine.Utils.map(this.velocity.mag(), this.minSpeed,
            this.maxSpeed, 0, 50);
      }
    });
  }
});
```

We've added a function as a beforeStep property that gets called from step(). In beforeStep, we're mapping the magnitude of the item's velocity to its min/max speed and producing a blur value between 0 and 100. Running the code you should see the items blur as they accelerate.

Rendering blur is an intensive operation that requires us to decrease the total number of items to maintain 60fps. View it at [public/Bit.BoxAnimItemsBlur.html](http://vinceallenvince.github.io/Bit-Shadow-Machine/Bit.BoxAnimItemsBlur.html).

## A world

A Bit-Shadow world can be any element that has a box shadow. In the example below, we've placed a &lt;div&gt; in the body and passed it as an 'el' property when adding a new World.

```html
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
  <title>Bit-Shadow Machine</title>
  <link href="css/bitshadowmachine.min.css" type="text/css" charset="utf-8" rel="stylesheet" />
  <script src="scripts/BitShadowMachine.min.js" type="text/javascript" charset="utf-8"></script>
  </head>
  <body>
    <div id='worldA'></div>
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

      /**
       * Create a new BitShadowMachine system.
       */
      BitShadowMachine.System.setup(function() {
        var world = this.add('World', {
          width: 960,
          height: 540,
          resolution: 4,
          el: document.getElementById('worldA'),
          color: [0, 0, 0],
          gravity: new BitShadowMachine.Vector(0, 0.1),
          c: 0
        });

        this.add('Box');
      });
      /**
       * Start the animation loop.
       */
      BitShadowMachine.System.loop();
    </script>
  </body>
</html>
```

View it at [public/Bit.World.html](http://foldi.github.io/Bit-Shadow-Machine/Bit.World.html).

## Multple worlds

Bit-Shadow Machine can support multiple worlds. Just add them in the setup function.

```html
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
  <title>Bit-Shadow Machine</title>
  <link href="css/bitshadowmachine.min.css" type="text/css" charset="utf-8" rel="stylesheet" />
  <script src="scripts/BitShadowMachine.min.js" type="text/javascript" charset="utf-8"></script>
  </head>
  <body>
    <div id='worldA'></div>
    <div id='worldB'></div>
    <div id='worldC'></div>
    <script type="text/javascript" charset="utf-8">

      var viewportSize = BitShadowMachine.Utils.getWindowSize(),
          rand = BitShadowMachine.Utils.getRandomNumber,
          map = BitShadowMachine.Utils.map;

      function Box(opt_options) {
        console.log(arguments);
        var options = opt_options || {};
        options.name = 'Box';
        BitShadowMachine.Item.call(this, options);
      }
      BitShadowMachine.Utils.extend(Box, BitShadowMachine.Item);

      // An init() method is required.
      Box.prototype.init = function(world, options) {
        console.log(arguments);
        this.color = options.color || [100, 100, 100];
        this.location = options.location || new BitShadowMachine.Vector(world.width / 2, world.height / 2);
      };

      /**
       * Tell BitShadowMachine where to find classes.
       */
      BitShadowMachine.Classes = {
        Box: Box
      };

      /**
       * Create a new BitShadowMachine system.
       */
      BitShadowMachine.System.setup(function() {
        var worldA = this.add('World', {
          width: 320,
          height: 480,
          location: new BitShadowMachine.Vector(0, viewportSize.height / 2 - 240),
          resolution: 4,
          colorMode: 'hsl',
          el: document.getElementById('worldA')
        });

        var worldB = this.add('World', {
          width: 320,
          height: 480,
          resolution: 4,
          colorMode: 'hsl',
          el: document.getElementById('worldB')
        });

        var worldC = this.add('World', {
          width: 320,
          height: 480,
          location: new BitShadowMachine.Vector(viewportSize.width - 320, viewportSize.height / 2 - 240),
          resolution: 4,
          colorMode: 'hsl',
          el: document.getElementById('worldC')
        });

        var i, scale;
        for (i = 0; i < 200; i++) {
          scale = rand(0.25, 2, true);
          this.add('Box', {
            location: new BitShadowMachine.Vector(rand(0, worldA.width), rand(0, worldA.height / 1.2)),
            scale: scale,
            mass: map(scale, 0.25, 2, 10, 20),
            opacity: map(scale, 0.25, 2, 0.8, 0.2),
            color: [0, 1, 0.5]
          }, worldA);
        }
        for (i = 0; i < 200; i++) {
          scale = rand(0.25, 2, true);
          this.add('Box', {
            location: new BitShadowMachine.Vector(rand(0, worldA.width), rand(0, worldA.height / 1.2)),
            scale: scale,
            mass: map(scale, 0.25, 2, 10, 20),
            opacity: map(scale, 0.25, 2, 0.8, 0.2),
            color: [20, 1, 0.5]
          }, worldB);
        }
        for (i = 0; i < 200; i++) {
          scale = rand(0.25, 2, true);
          this.add('Box', {
            location: new BitShadowMachine.Vector(rand(0, worldA.width), rand(0, worldA.height / 1.2)),
            scale: scale,
            mass: map(scale, 0.25, 2, 10, 20),
            opacity: map(scale, 0.25, 2, 0.8, 0.2),
            color: [40, 1, 0.5]
          }, worldC);
        }
      });
      /**
       * Start the animation loop.
       */
      BitShadowMachine.System.loop();
    </script>
  </body>
</html>
```

You should see three Bit-Shadow worlds each with their own set of animated items. View it at [public/Bit.MultipleWorlds.html](http://vinceallenvince.github.io/Bit-Shadow-Machine/Bit.MultipleWorlds.html).

##Docs

To learn more, please review [the docs](http://vinceallenvince.github.io/bitshadowmachine/doc/).

Building this project
------

This project uses [Grunt](http://gruntjs.com). To build the project first install the node modules.

```
npm install
```

Next, run grunt.

```
grunt
```

To run the tests, run 'npm test'.

```
npm test
```

To check test coverage run 'grunt coverage'.

```
grunt coverage
```

A pre-commit hook is defined in /pre-commit that runs jshint. To use the hook, run the following:

```
ln -s ../../pre-commit .git/hooks/pre-commit
```

A post-commit hook is defined in /post-commit that runs the Plato complexity analysis tools. To use the hook, run the following:

```
ln -s ../../post-commit .git/hooks/post-commit
```

View the [code complexity](http://vinceallenvince.github.io/bitshadowmachine/reports/) report.
