'use strict';

module.exports = function() {
  var colors = {};
  var defaultColorName = 'gray';
  var hexMap = {
    '#A6A6A6': 'gray',
    '#5C6166': 'black',
    '#5BB75B': 'deep-green',
    '#A1CF64': 'green',
    '#00B5AD': 'teal',
    '#006DCC': 'deep-blue',
    '#6ECFF5': 'blue',
    '#564F8A': 'deep-purple',
    '#9B96F7': 'purple',
    '#D95C5C': 'red',
    '#F05940': 'orange',
    '#F3A8AA': 'pink',
    '#F0AD4E': 'yellow'
  };
  var colorMap = {
    'gray': '#A6A6A6',
    'black': '#5C6166',
    'deep-green': '#5BB75B',
    'green': '#A1CF64',
    'teal': '#00B5AD',
    'deep-blue': '#006DCC',
    'blue': '#6ECFF5',
    'deep-purple': '#564F8A',
    'purple': '#9B96F7',
    'red': '#D95C5C',
    'orange': '#F05940',
    'pink': '#F3A8AA',
    'yellow': '#F0AD4E'
  };

  colors.getAllColorHex = function() {
    return hexMap;
  };
  colors.getDefaultHexCode = function() {
    return colorMap[defaultColorName];
  };
  colors.getHexCode = function(colorName) {
    if (colorMap[colorName]) {
      return colorMap[colorName];
    }
    return colorMap[defaultColorName];
  };
  colors.getColorName = function(hexCode) {
    if (hexMap[hexCode]) {
      return hexMap[hexCode];
    }
    return defaultColorName;
  };

  return colors;
};
