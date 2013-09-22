Bit-Shadow-Machine
======

Bit-Shadow Machine renders particles in a web browser using CSS box shadows. That's it. No HTML5 Canvas, WebGL or even a single DOM element.

By default, the box shadows are attached to your document's body. Freed from parsing the render tree, the browser can animate many more particles than with conventional methods. You should be able to easily render several hundred particles at 60 frames per second.

View a demo at http://www.bitshadowmachine.com

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
