var BitShadowMachine = {
  Anim: require('./anim'),
  Item: require('./item'),
  SimplexNoise: require('quietriot'),
  System: require('./system'),
  Vector: require('burner').Vector,
  Utils: require('burner').Utils
};

BitShadowMachine.System.Classes = {
  Anim: require('./anim'),
  AnimUnit: require('./animunit')
};

module.exports = BitShadowMachine;