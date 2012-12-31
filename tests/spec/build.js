describe("Vector", function() {

  var Anim, Vector, exports = BitShadowMachine, system, obj, objA, objB;

  beforeEach(function() {

    Anim = {}, exports = Anim;

    (function(exports) {

      exports.BitShadowMachine = {};
      new BitShadowMachine(exports.BitShadowMachine, exports);

    }(exports));

    Vector = Anim.BitShadowMachine.Vector;

    //Flora.System.start(function() {
      obj = new Vector(22, 10);
    //});
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