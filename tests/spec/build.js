describe("System", function() {

  var sys;

  beforeEach(function() {

    Anim = {}, exports = Anim;

    (function(exports) {

      exports.BitShadowMachine = {};
      new BitShadowMachine(exports.BitShadowMachine, exports);

    }(exports));

    sys = Anim.BitShadowMachine.System;

  });

  it("_getNewId() should return a unique id.", function() {
    sys._getNewId();
    sys._getNewId();
    sys._getNewId();
    expect(sys._getNewId()).toEqual(4);
  });

  it("_getIdCount() should return the current id count.", function() {
    sys._getNewId();
    sys._getNewId();
    expect(sys._getIdCount()).toEqual(2);
  });

  it("create() should create a world.", function() {
    var system = new Anim.BitShadowMachine.System.create();
    expect(sys._getIdCount()).toEqual(1);
    expect(sys._worldsCache.list.length).toEqual(1);
  });

  it("add() should create an element and append it to the _records list.", function() {
    var system = new Anim.BitShadowMachine.System.create(function() {
       Anim.BitShadowMachine.System.add('Element');
    });
    expect(sys._getIdCount()).toEqual(2);
    expect(sys._worldsCache.list.length).toEqual(1);
    expect(sys._records.list.length).toEqual(2);
    expect(sys._records.lookup.element2).toEqual(true);
  });

  it("destroy() should remove an element from the _records list and copy it to the world's object pool.", function() {
    var system = new Anim.BitShadowMachine.System.create(function() {
       Anim.BitShadowMachine.System.add('Element');
    });
    sys.destroy(sys._records.list[1]);
    expect(sys._records.list.length).toEqual(1);
    expect(sys._records.list[0]._pool.length).toEqual(1);
  });

  it("_getWorld() should iterate over _records.list and finds the passed world.", function() {
    var system = new Anim.BitShadowMachine.System.create(function() {
       Anim.BitShadowMachine.System.add('Element');
    });
    expect(typeof sys._getWorld(document.body)).toEqual("object");
  });

  it("_buildStringHSLA() should build an hsla box shadow string based on the passed object's properties.", function() {
    var system = new Anim.BitShadowMachine.System.create(function() {
       Anim.BitShadowMachine.System.add('Element');
    });
    var obj = {
      world: {
        resolution: 8,
        colorMode: 'hsla'
      },
      location: {
        x: 8,
        y: 16
      },
      blur: 0,
      hue: 1,
      saturation: 1,
      lightness: 0.5,
      opacity: 0.75
    };
    expect(sys._buildStringHSLA(obj)).toEqual("64px 128px 0px 8px hsla(1,100%,50%,0.75),");
  });

  it("_buildStringRGBA() should build an rgba box shadow string based on the passed object's properties.", function() {
    var system = new Anim.BitShadowMachine.System.create(function() {
       Anim.BitShadowMachine.System.add('Element');
    });
    var obj = {
      world: {
        resolution: 8,
        colorMode: 'rgba'
      },
      location: {
        x: 8,
        y: 16
      },
      blur: 0,
      color: [200, 200, 200],
      opacity: 0.75
    };
    expect(sys._buildStringRGBA(obj)).toEqual("64px 128px 0px 8px rgba(200,200,200,0.75),");
  });
});

describe("Element", function() {

  var sys;

  beforeEach(function() {

    Anim = {}, exports = Anim;

    (function(exports) {

      exports.BitShadowMachine = {};
      new BitShadowMachine(exports.BitShadowMachine, exports);

    }(exports));

    sys = Anim.BitShadowMachine.System;

  });

  it("A new Element should have its required properties.", function() {
    var system = new Anim.BitShadowMachine.System.create(function() {
       Anim.BitShadowMachine.System.add('Element');
    });
    expect(sys._records.list[1].blur).toEqual(0);
    expect(sys._records.list[1].id).toEqual('element2');
    expect(sys._records.list[1].name).toEqual('element');
    expect(typeof sys._records.list[1].world).toEqual('object');
  });
});

describe("World", function() {

  var sys, utils;

  beforeEach(function() {

    Anim = {}, exports = Anim;

    (function(exports) {

      exports.BitShadowMachine = {};
      new BitShadowMachine(exports.BitShadowMachine, exports);

    }(exports));

    sys = Anim.BitShadowMachine.System;
    utils = Anim.BitShadowMachine.Utils;
  });

  it("A new World should have its required properties.", function() {
    var system = new Anim.BitShadowMachine.System.create(function() {
       Anim.BitShadowMachine.System.add('Element');
    });
    expect(utils.getDataType(sys._records.list[0]._pool)).toEqual('array');
    expect(sys._records.list[0].colorMode).toEqual('rgba');
    expect(utils.getDataType(sys._records.list[0].el)).toEqual('object');
    expect(utils.getDataType(sys._records.list[0].gravity.add)).toEqual('function');
    expect(utils.getDataType(sys._records.list[0].height)).toEqual('number');
    expect(sys._records.list[0].id).toEqual('world1');
    expect(sys._records.list[0].name).toEqual('world');
    expect(sys._records.list[0].resolution).toEqual(8);
    expect(utils.getDataType(sys._records.list[0].width)).toEqual('number');
  });
});

describe("Utils", function() {

  var utils;

  beforeEach(function() {

    Anim = {}, exports = Anim;

    (function(exports) {

      exports.BitShadowMachine = {};
      new BitShadowMachine(exports.BitShadowMachine, exports);

    }(exports));

    utils = Anim.BitShadowMachine.Utils;
  });

  it("map() should re-map a number from one range to another.", function() {
    expect(utils.map(1, 0, 10, 0, 100)).toEqual(10);
  });
  it("getRandomNumber() should return a random number within a range.", function() {
    expect(typeof utils.getRandomNumber(1, 100)).toEqual('number');
    expect(utils.getRandomNumber(1, 100)).toBeGreaterThan(0);
    expect(utils.getRandomNumber(1, 100)).toBeLessThan(101);
  });
  it("getRandomNumber() should return a float when passing 'true' as 3rd argument.", function() {
    expect(utils.getRandomNumber(1, 100, true) % 1).toNotEqual(0);
  });
  it("getRandomNumber() should return an integer when passing 'false' as 3rd argument.", function() {
    expect(utils.getRandomNumber(1, 100, false) % 1).toEqual(0);
  });
  it("getWindowSize() should return the current window width and height", function() {
    expect(typeof utils.getWindowSize()).toEqual('object');
    expect(typeof utils.getWindowSize().width).toEqual('number');
    expect(typeof utils.getWindowSize().height).toEqual('number');

  });

});

describe("Vector", function() {

  var Anim, Vector, exports = BitShadowMachine, system, obj, objA, objB;

  beforeEach(function() {

    Anim = {}, exports = Anim;

    (function(exports) {

      exports.BitShadowMachine = {};
      new BitShadowMachine(exports.BitShadowMachine, exports);

    }(exports));

    Vector = Anim.BitShadowMachine.Vector;
    obj = new Vector(22, 10);
  });

  afterEach(function() {

  });

  it("should create vectors.", function() {
    expect(obj.x).toEqual(22);
    expect(obj.y).toEqual(10);
  });
  it('VectorAdd() should add two vectors.', function() {
    objA = new Vector(1, 1);
    expect(Vector.VectorAdd(obj, objA).x).toEqual(23);
    expect(Vector.VectorAdd(obj, objA).y).toEqual(11);
  });
  it('add() should add a vector.', function() {
    obj.add(new Vector(1, 1));
    expect(obj.x).toEqual(23);
    expect(obj.y).toEqual(11);
  });
  it('VectorSub() should subtract two vectors.', function() {
    objA = new Vector(1, 1);
    expect(Vector.VectorSub(obj, objA).x).toEqual(21);
    expect(Vector.VectorSub(obj, objA).y).toEqual(9);
  });
  it('sub() should subtract a vector.', function() {
    obj.sub(new Vector(1, 1));
    expect(obj.x).toEqual(21);
    expect(obj.y).toEqual(9);
  });
  it('VectorMult() should multiply a vector by a scalar value.', function() {
    expect(Vector.VectorMult(obj, 2).x).toEqual(44);
    expect(Vector.VectorMult(obj, 2).y).toEqual(20);
  });
  it('mult() should multiply a vector.', function() {
    obj.mult(2);
    expect(obj.x).toEqual(44);
    expect(obj.y).toEqual(20);
  });
  it('VectorDiv() should divide a vector by a scalar value.', function() {
    expect(Vector.VectorDiv(obj, 2).x).toEqual(11);
    expect(Vector.VectorDiv(obj, 2).y).toEqual(5);
  });
  it('div() should divide a vector.', function() {
    obj.div(2);
    expect(obj.x).toEqual(11);
    expect(obj.y).toEqual(5);
  });
  it('mag() should calculate the magnitude of a vector.', function() {
    obj = new Vector(10, 10);
    expect(obj.mag()).toEqual(14.142135623730951);
  });
  it('limit() should limit the magnitude of a vector.', function() {
    obj = new Vector(10, 10);
    expect(obj.limit(5).mag()).toEqual(5);
  });
  it('normalize() should divide a vector by its magnitude to reduce its magnitude to 1.', function() {
    obj = new Vector(3, 4);
    expect(obj.normalize().x).toEqual(0.6);
    expect(obj.normalize().y).toEqual(0.8);
  });
  it('VectorDistance(v1, v2) should return the distance between two vectors.', function() {
    objA = new Vector(50, 100);
    objB = new Vector(100, 100);
    expect(Vector.VectorDistance(objA, objB)).toEqual(50);
  });
  it('distance() should calculate the distance between this vector and a passed vector.', function() {
    obj = new Vector(5, 0);
    expect(obj.distance(new Vector(1, 0))).toEqual(4);
  });
  it('rotate() should rotate a vector using a passed angle in radians.', function() {
    obj = new Vector(10, 0);
    expect(obj.rotate(Math.PI).x).toEqual(-10);
  });
  it('VectorMidPoint(v1, v2) should return the midpoint between two vectors.', function() {
    objA = new Vector(50, 100);
    objB = new Vector(100, 200);
    expect(Vector.VectorMidPoint(objA, objB).x).toEqual(75);
    expect(Vector.VectorMidPoint(objA, objB).y).toEqual(150);
  });
  it('midpoint() should return the midpoint between this vector and a passed vector.', function() {
    objA = new Vector(50, 100);
    objB = new Vector(100, 200);
    expect(objA.midpoint(objB).x).toEqual(75);
    expect(objA.midpoint(objB).y).toEqual(150);
  });
  it('Vector.VectorAngleBetween should return the angle between two Vectors.', function() {
    objA = new Vector(50, 0);
    objB = new Vector(50, 180);
    expect(Math.round(Vector.VectorAngleBetween(objA, objB))).toEqual(1);
  });
});