# Box-Shadow Machine: a JavaScript framework for creating particle animations

A Bit-Shadow Machine renders particles in a web browser using CSS box shadows. That's it. No DOM elements besides the your document's body. No HTML5 Canvas or WebGL.

## Simple System

To setup a simple Bit-Shadow Machine, reference the bitshadowmachine.min.js file from a script tag in the &lt;head&gt; of your document. Also, reference the bitshadowmachine.css file.

In the body, add a &lt;script&gt; tag and create a new Bit-Shadow system. Pass the system a function that describes the elements in the system.

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
    <script type="text/javascript" charset="utf-8">


    </script>
  </body>
</html>
```