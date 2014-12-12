  /* Return a random integer given min, max
   *
   */
  function randomInt(min,max)
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

/* Shuffle an array
 *
 */
    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex ;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }

/* Sort an array of objects by a particular key
 * 
 */
function specialSort(arrayToSort, keyOrder) {
    arrayToSort = arrayToSort.sort(function (a, b) {
        for (var key in keyOrder) {
            if (!keyOrder.hasOwnProperty(key)) {
                continue;
            }
            var aKey = keyOrder[key];
            if (typeof a[aKey] === "undefined" && typeof b[aKey] === "undefined") {
                continue;
            }
            if (typeof a[aKey] !== "undefined" && typeof b[aKey] === "undefined") {
                return -1;
            }
            if (typeof a[aKey] === "undefined" && typeof b[aKey] !== "undefined") {
                return 1;
            }
            if (a[aKey] > b[aKey]) {
                return 1;
            }
            else if (a[aKey] < b[aKey]) {
                return -1;
            }
        }
        return 0;
    });
    return arrayToSort;
}

    



/* Compare two JSON-style objects
 * accepts parameters
 * obj1 Object
 * obj2 Object
*/
function compareJSON(obj1, obj2){
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}


// Free to use & distribute under the MIT license
// Wes Johnson (@SterlingWes)
//
// inspired by http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/

(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory;
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.RColor = factory();
    }
}(this, function () {

  var RColor = function() {
    this.hue      = Math.random(),
    this.goldenRatio  = 0.618033988749895;
    this.hexwidth   = 2;
  };

  RColor.prototype.hsvToRgb = function (h,s,v) {
    var h_i = Math.floor(h*6),
      f   = h*6 - h_i,
      p = v * (1-s),
      q = v * (1-f*s),
      t = v * (1-(1-f)*s),
      r = 255,
      g = 255,
      b = 255;
    switch(h_i) {
      case 0: r = v, g = t, b = p;  break;
      case 1: r = q, g = v, b = p;  break;
      case 2: r = p, g = v, b = t;  break;
      case 3: r = p, g = q, b = v;  break;
      case 4: r = t, g = p, b = v;  break;
      case 5: r = v, g = p, b = q;  break;
    }
    return [Math.floor(r*256),Math.floor(g*256),Math.floor(b*256)];
  };
  
  RColor.prototype.padHex = function(str) {
    if(str.length > this.hexwidth) return str;
    return new Array(this.hexwidth - str.length + 1).join('0') + str;
  };
  
  RColor.prototype.get = function(hex,saturation,value) {
    this.hue += this.goldenRatio;
    this.hue %= 1;
    if(typeof saturation !== "number")  saturation = 0.5;
    if(typeof value !== "number")   value = 0.95;
    var rgb = this.hsvToRgb(this.hue,saturation,value);
    if(hex)
      return "#" +  this.padHex(rgb[0].toString(16))
            + this.padHex(rgb[1].toString(16))
            + this.padHex(rgb[2].toString(16));
    else 
      return rgb;
  };

  return RColor;

}));

/* Universal Module Definition */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as a named AMD module.
    define('baselineRatio', [], function () {
      return (root.baselineRatio = factory());
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals
    root.baselineRatio = factory();
  }
}(this, function () {
  var baselineRatio = function(elem) {
    // Get the baseline in the context of whatever element is passed in.
    elem = elem || document.body;

    // The container is a little defenseive.
    var container = document.createElement('div');
    container.style.display = "block";
    container.style.position = "absolute";
    container.style.bottom = "0";
    container.style.right = "0";
    container.style.width = "0px";
    container.style.height = "0px";
    container.style.margin = "0";
    container.style.padding = "0";
    container.style.visibility = "hidden";
    container.style.overflow = "hidden";

    // Intentionally unprotected style definition.
    var small = document.createElement('span');
    var large = document.createElement('span');

    // Large numbers help improve accuracy.
    small.style.fontSize = "0px";
    large.style.fontSize = "2000px";

    small.innerHTML = "X";
    large.innerHTML = "X";

    container.appendChild(small);
    container.appendChild(large);

    // Put the element in the DOM for a split second.
    elem.appendChild(container);
    var smalldims = small.getBoundingClientRect();
    var largedims = large.getBoundingClientRect();
    elem.removeChild(container);

    // Calculate where the baseline was, percentage-wise.
    var baselineposition = smalldims.top - largedims.top;
    var height = largedims.height;

    return 1 - (baselineposition / height);
  }

  return baselineRatio;
}));