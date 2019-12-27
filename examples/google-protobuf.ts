var COMPILED = !0;
var DEBUG = !0;
var TRUSTED_SITE = !0;
var getGlobal = function (a) {
  return "undefined" != typeof window && window === a ? a : "undefined" != typeof globalThis && null != globalThis ? globalThis : a
};
var nowGlobal = getGlobal(this)

var FEATURESET_YEAR = 2012;
var LOCALE = "en";
var STRICT_MODE_COMPATIBLE = !1;
var DISALLOW_TEST_ONLY_CODE = COMPILED && !DEBUG;
var ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING = !1;
var NATIVE_ARRAY_PROTOTYPES = TRUSTED_SITE;

var isDef = function(a) {
  return void 0 !== a;
};
var isString = function(a) {
  return "string" == typeof a;
};
var isBoolean = function(a) {
  return "boolean" == typeof a;
};
var isNumber = function(a) {
  return "number" == typeof a;
};
export var typeOf = function(a) {
  var b = typeof a;
  if ("object" == b)
    if (a) {
      if (a instanceof Array) return "array";
      if (a instanceof Object) return b;
      var c = Object.prototype.toString.call(a);
      if ("[object Window]" == c) return "object";
      if (
          "[object Array]" == c ||
          ("number" == typeof a.length &&
              "undefined" != typeof a.splice &&
              "undefined" != typeof a.propertyIsEnumerable &&
              !a.propertyIsEnumerable("splice"))
      )
        return "array";
      if (
          "[object Function]" == c ||
          ("undefined" != typeof a.call &&
              "undefined" != typeof a.propertyIsEnumerable &&
              !a.propertyIsEnumerable("call"))
      )
        return "function";
    } else return "null";
  else if ("function" == b && "undefined" == typeof a.call) return "object";
  return b;
};
var isNull = function(a) {
  return null === a;
};
var isDefAndNotNull = function(a) {
  return null != a;
};
var isArray = function(a) {
  return "array" == typeOf(a);
};
var isArrayLike = function(a) {
  var b = typeOf(a);
  return "array" == b || ("object" == b && "number" == typeof a.length);
};
var isDateLike = function(a) {
  return isObject(a) && "function" == typeof a.getFullYear;
};
var isFunction = function(a) {
  return "function" == typeOf(a);
};
var isObject = function(a) {
  var b = typeof a;
  return ("object" == b && null != a) || "function" == b;
};
var getUid = function(a) {
  return a[UID_PROPERTY_] || (a[UID_PROPERTY_] = ++uidCounter_);
};
var hasUid = function(a) {
  return !!a[UID_PROPERTY_];
};
var removeUid = function(a) {
  null !== a && "removeAttribute" in a && a.removeAttribute(UID_PROPERTY_);
  try {
    delete a[UID_PROPERTY_];
  } catch (b) {}
};
var UID_PROPERTY_ = "closure_uid_" + ((1e9 * Math.random()) >>> 0);
var uidCounter_ = 0;
var getHashCode = getUid;
var removeHashCode = removeUid;
var cloneObject = function(a) {
  var b = typeOf(a) as any;
  if ("object" == b || "array" == b) {
    if ("function" === typeof a.clone) return a.clone();
    b = "array" == b ? [] : {};
    for (var c in a) b[c] = cloneObject(a[c]);
    return b;
  }
  return a;
};
var bindNative_ = function(a, b, c) {
  return a.call.apply(a.bind, arguments);
};
var bindJs_ = function(a, b, c) {
  if (!a) throw new Error();
  if (2 < arguments.length) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var c = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(c, d);
      return a.apply(b, c);
    };
  }
  return function() {
    return a.apply(b, arguments);
  };
};
var bind = function(a, b, c?) {
  Function.prototype.bind &&
  -1 != Function.prototype.bind.toString().indexOf("native code")
      ? (bind = bindNative_)
      : (bind = bindJs_);
  return bind.apply(null, arguments);
};
var partial = function(a, b, c?, d?) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var b = c.slice();
    b.push.apply(b, arguments);
    return a.apply(this, b);
  };
};
var mixin = function(a, b) {
  for (var c in b) a[c] = b[c];
};
var now =
    (TRUSTED_SITE && Date.now) ||
    function() {
      return +new Date();
    };
var evalWorksForGlobals_ = null;


export var inherits = function(a, b) {
  var c = function() {} as any
  c.prototype = b.prototype;
  a.superClass_ = b.prototype;
  a.prototype = new c();
  a.prototype.constructor = a;
  a.base = function(a, c, f) {
    for (var d = Array(arguments.length - 2), e = 2; e < arguments.length; e++)
      d[e - 2] = arguments[e];
    return b.prototype[c].apply(a, d);
  };
};

class debug {
  static Error = function(a) {
    return a && (this.message = String(a));
  };
}
inherits(debug.Error, Error);

class asserts {
  static ENABLE_ASSERTS = DEBUG;

  static AssertionError = function(a, b) {
    //this.name = "AssertionError";
    return debug.Error.call(this, asserts.subs_(a, b));
    //this.messagePattern = a;
  };
  static subs_ = function(a, b) {
    a = a.split("%s");
    for (var c = "", d = a.length - 1, e = 0; e < d; e++)
      c += a[e] + (e < b.length ? b[e] : "%s");
    return c + a[d];
  };
  static DEFAULT_ERROR_HANDLER = function(a) {
    throw a;
  };
  static staticerrorHandler_ = asserts.DEFAULT_ERROR_HANDLER;
  static errorHandler_ = asserts.DEFAULT_ERROR_HANDLER;


  static doAssertFailure_ = function(a, b, c, d) {
    var e = "Assertion failed";
    if (c) {
      e += ": " + c;
      var f = d;
    } else a && ((e += ": " + a), (f = b));
    a = asserts.AssertionError("" + e, f || []);
    asserts.errorHandler_(a);
  };
  static setErrorHandler = function(a) {
    asserts.ENABLE_ASSERTS && (asserts.errorHandler_ = a);
  };
  static assert = function(a, b?, c?) {
    asserts.ENABLE_ASSERTS &&
    !a &&
    asserts.doAssertFailure_(
        "",
        null,
        b,
        Array.prototype.slice.call(arguments, 2)
    );
    return a;
  };
  static assertExists = function(a, b, c) {
    asserts.ENABLE_ASSERTS &&
    null == a &&
    asserts.doAssertFailure_(
        "Expected to exist: %s.",
        [a],
        b,
        Array.prototype.slice.call(arguments, 2)
    );
    return a;
  };
  static fail = function(a, b?, c?) {
    asserts.ENABLE_ASSERTS &&
    asserts.errorHandler_(
        new asserts.AssertionError(
            "Failure" + (a ? ": " + a : ""),
            Array.prototype.slice.call(arguments, 1)
        )
    );
  };
  static assertNumber = function(a, b, c) {
    asserts.ENABLE_ASSERTS &&
    !isNumber(a) &&
    asserts.doAssertFailure_(
        "Expected number but got %s: %s.",
        [typeOf(a), a],
        b,
        Array.prototype.slice.call(arguments, 2)
    );
    return a;
  };
  static assertString = function(a, b, c) {
    asserts.ENABLE_ASSERTS &&
    !isString(a) &&
    asserts.doAssertFailure_(
        "Expected string but got %s: %s.",
        [typeOf(a), a],
        b,
        Array.prototype.slice.call(arguments, 2)
    );
    return a;
  };
  static assertFunction = function(a, b, c) {
    asserts.ENABLE_ASSERTS &&
    !isFunction(a) &&
    asserts.doAssertFailure_(
        "Expected function but got %s: %s.",
        [typeOf(a), a],
        b,
        Array.prototype.slice.call(arguments, 2)
    );
    return a;
  };
  static assertObject = function(a, b, c) {
    asserts.ENABLE_ASSERTS &&
    !isObject(a) &&
    asserts.doAssertFailure_(
        "Expected object but got %s: %s.",
        [typeOf(a), a],
        b,
        Array.prototype.slice.call(arguments, 2)
    );
    return a;
  };
  static assertArray = function(a, b, c) {
    asserts.ENABLE_ASSERTS &&
    !isArray(a) &&
    asserts.doAssertFailure_(
        "Expected array but got %s: %s.",
        [typeOf(a), a],
        b,
        Array.prototype.slice.call(arguments, 2)
    );
    return a;
  };
  static assertBoolean = function(a, b, c) {
    asserts.ENABLE_ASSERTS &&
    !isBoolean(a) &&
    asserts.doAssertFailure_(
        "Expected boolean but got %s: %s.",
        [typeOf(a), a],
        b,
        Array.prototype.slice.call(arguments, 2)
    );
    return a;
  };
  static assertInstanceof = function(a, b, c?, d?) {
    !asserts.ENABLE_ASSERTS ||
    a instanceof b ||
    asserts.doAssertFailure_(
        "Expected instanceof %s but got %s.",
        [asserts.getType_(b), asserts.getType_(a)],
        c,
        Array.prototype.slice.call(arguments, 3)
    );
    return a;
  };
  static assertFinite = function(a, b, c) {
    !asserts.ENABLE_ASSERTS ||
    ("number" == typeof a && isFinite(a)) ||
    asserts.doAssertFailure_(
        "Expected %s to be a finite number but it is not.",
        [a],
        b,
        Array.prototype.slice.call(arguments, 2)
    );
    return a;
  };
  static assertObjectPrototypeIsIntact = function() {
    for (var a in Object.prototype)
      asserts.fail(a + " should not be enumerable in Object.prototype.");
  };
  static getType_ = function(a) {
    return a instanceof Function
        ? a.displayName || a.name || "unknown type name"
        : a instanceof Object
            ? a.constructor.displayName ||
            a.constructor.name ||
            Object.prototype.toString.call(a)
            : null === a
                ? "null"
                : typeof a;
  };
}
inherits(asserts.AssertionError, debug.Error);

export class objectT {
  static  is = function(a, b) {
    return a === b ? 0 !== a || 1 / a === 1 / b : a !== a && b !== b;
  };
  static forEach = function(a, b, c) {
    for (var d in a) b.call(c, a[d], d, a);
  };
  static filter = function(a, b, c) {
    var d = {},
        e;
    for (e in a) b.call(c, a[e], e, a) && (d[e] = a[e]);
    return d;
  };
  static map = function(a, b, c) {
    var d = {},
        e;
    for (e in a) d[e] = b.call(c, a[e], e, a);
    return d;
  };
  static some = function(a, b, c) {
    for (var d in a) if (b.call(c, a[d], d, a)) return !0;
    return !1;
  };
  static every = function(a, b, c) {
    for (var d in a) if (!b.call(c, a[d], d, a)) return !1;
    return !0;
  };
  static getCount = function(a) {
    var b = 0,
        c;
    for (c in a) b++;
    return b;
  };
  static getAnyKey = function(a) {
    for (var b in a) return b;
  };
  static getAnyValue = function(a) {
    for (var b in a) return a[b];
  };
  static contains = function(a, b) {
    return objectT.containsValue(a, b);
  };
  static getValues = function(a) {
    var b = [],
        c = 0,
        d;
    for (d in a) b[c++] = a[d];
    return b;
  };
  static getKeys = function(a) {
    var b = [],
        c = 0,
        d;
    for (d in a) b[c++] = d;
    return b;
  };
  static getValueByKeys = function(a, b) {
    var c = isArrayLike(b) as any,
        d = c ? b : arguments;
    for (c = c ? 0 : 1; c < d.length; c++) {
      if (null == a) return;
      a = a[d[c]];
    }
    return a;
  };
  static containsKey = function(a, b) {
    return null !== a && b in a;
  };
  static containsValue = function(a, b) {
    for (var c in a) if (a[c] == b) return !0;
    return !1;
  };
  static findKey = function(a, b, c) {
    for (var d in a) if (b.call(c, a[d], d, a)) return d;
  };
  static findValue = function(a, b, c) {
    return (b = objectT.findKey(a, b, c)) && a[b];
  };
  static isEmpty = function(a) {
    for (var b in a) return !1;
    return !0;
  };
  static clear = function(a) {
    for (var b in a) delete a[b];
  };
  static remove = function(a, b) {
    var c;
    (c = b in a) && delete a[b];
    return c;
  };
  static add = function(a, b, c) {
    if (null !== a && b in a)
      throw Error('The object already contains the key "' + b + '"');
    objectT.set(a, b, c);
  };
  static get = function(a, b, c) {
    return null !== a && b in a ? a[b] : c;
  };
  static set = function(a, b, c) {
    a[b] = c;
  };
  static setIfUndefined = function(a, b, c) {
    return b in a ? a[b] : (a[b] = c);
  };
  static setWithReturnValueIfNotSet = function(a, b, c) {
    if (b in a) return a[b];
    c = c();
    return (a[b] = c);
  };
  static equals = function(a, b) {
    for (var c in a) if (!(c in b) || a[c] !== b[c]) return !1;
    for (var d in b) if (!(d in a)) return !1;
    return !0;
  };
  static clone = function(a) {
    var b = {},
        c;
    for (c in a) b[c] = a[c];
    return b;
  };
  static unsafeClone = function(a) {
    var b = typeOf(a) as any;
    if ("object" == b || "array" == b) {
      if (isFunction(a.clone)) return a.clone();
      b = "array" == b ? [] : {};
      for (var c in a) b[c] = objectT.unsafeClone(a[c]);
      return b;
    }
    return a;
  };
  static transpose = function(a) {
    var b = {},
        c;
    for (c in a) b[a[c]] = c;
    return b;
  };
  static PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(
      " "
  );
  static extend = function(a, b) {
    for (var c, d, e = 1; e < arguments.length; e++) {
      d = arguments[e];
      for (c in d) a[c] = d[c];
      for (var f = 0; f < objectT.PROTOTYPE_FIELDS_.length; f++)
        (c = objectT.PROTOTYPE_FIELDS_[f]),
        Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
    }
  };
  static  create = function(a) {
    var b = arguments.length;
    if (1 == b && isArray(arguments[0]))
      return objectT.create.apply(null, arguments[0]);
    if (b % 2) throw Error("Uneven number of arguments");
    for (var c = {}, d = 0; d < b; d += 2) c[arguments[d]] = arguments[d + 1];
    return c;
  };
  static createSet = function(a) {
    var b = arguments.length;
    if (1 == b && isArray(arguments[0]))
      return objectT.createSet.apply(null, arguments[0]);
    for (var c = {}, d = 0; d < b; d++) c[arguments[d]] = !0;
    return c;
  };
  static createImmutableView = function(a) {
    var b = a;
    Object.isFrozen &&
    !Object.isFrozen(a) &&
    ((b = Object.create(a)), Object.freeze(b));
    return b;
  };
  static isImmutableView = function(a) {
    return !!Object.isFrozen && Object.isFrozen(a);
  };
  static getAllPropertyNames = function(a, b, c) {
    if (!a) return [];
    if (!Object.getOwnPropertyNames || !Object.getPrototypeOf)
      return objectT.getKeys(a);
    for (
        var d = {};
        a && (a !== Object.prototype || b) && (a !== Function.prototype || c);

    ) {
      for (var e = Object.getOwnPropertyNames(a), f = 0; f < e.length; f++)
        d[e[f]] = !0;
      a = Object.getPrototypeOf(a);
    }
    return objectT.getKeys(d);
  };
  static getSuperClass = function(a) {
    return (a = Object.getPrototypeOf(a.prototype)) && a.constructor;
  };
}

class array {
  static peek = function (a) {
    return a[a.length - 1]
  };
  static last = array.peek;
  static indexOf = (Array.prototype.indexOf) ? function (a, b, c?) {
    asserts.assert(null != a.length);
    return Array.prototype.indexOf.call(a, b, c)
  } : function (a, b, c) {
    c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
    if (isString(a)) return isString(b) && 1 == b.length ? a.indexOf(b, c) : -1;
    for (; c < a.length; c++) if (c in a && a[c] === b) return c;
    return -1
  };
  static lastIndexOf = (Array.prototype.lastIndexOf) ? function (a, b, c?) {
    asserts.assert(null != a.length);
    return Array.prototype.lastIndexOf.call(a, b, null == c ? a.length - 1 : c)
  } : function (a, b, c) {
    c = null == c ? a.length - 1 : c;
    0 > c && (c = Math.max(0, a.length + c));
    if (isString(a)) return isString(b) && 1 == b.length ? a.lastIndexOf(b, c) : -1;
    for (; 0 <= c; c--) if (c in a && a[c] === b) return c;
    return -1
  };
  static forEach = (Array.prototype.forEach) ? function (a, b, c?) {
    asserts.assert(null != a.length);
    Array.prototype.forEach.call(a, b, c)
  } : function (a, b, c) {
    for (var d = a.length, e = isString(a) ? a.split("") : a, f = 0; f < d; f++) f in e && b.call(c, e[f], f, a)
  };
  static forEachRight = function (a, b, c?) {
    var d = a.length, e = isString(a) ? a.split("") : a;
    for (--d; 0 <= d; --d) d in e && b.call(c, e[d], d, a)
  };
  static filter = (Array.prototype.filter) ? function (a, b, c) {
    asserts.assert(null != a.length);
    return Array.prototype.filter.call(a, b, c)
  } : function (a, b, c) {
    for (var d = a.length, e = [], f = 0, g = isString(a) ? a.split("") : a, h = 0; h < d; h++) if (h in g) {
      var k = g[h];
      b.call(c, k, h, a) && (e[f++] = k)
    }
    return e
  };
  static map = (Array.prototype.map) ? function (a, b, c?) {
    asserts.assert(null != a.length);
    return Array.prototype.map.call(a, b, c)
  } : function (a, b, c) {
    for (var d = a.length, e = Array(d), f = isString(a) ? a.split("") : a, g = 0; g < d; g++) g in f && (e[g] = b.call(c, f[g], g, a));
    return e
  };
  static reduce = (Array.prototype.reduce) ? function (a, b, c, d) {
    asserts.assert(null != a.length);
    d && (b = bind(b, d));
    return Array.prototype.reduce.call(a, b, c)
  } : function (a, b, c, d) {
    var e = c;
    array.forEach(a, function (c, g) {
      e = b.call(d, e, c, g, a)
    });
    return e
  };
  static reduceRight = (Array.prototype.reduceRight) ? function (a, b, c, d) {
    asserts.assert(null != a.length);
    asserts.assert(null != b);
    d && (b = bind(b, d));
    return Array.prototype.reduceRight.call(a, b, c)
  } : function (a, b, c, d) {
    var e = c;
    array.forEachRight(a, function (c, g) {
      e = b.call(d, e, c, g, a)
    });
    return e
  };
  static some = (Array.prototype.some) ? function (a, b, c) {
    asserts.assert(null != a.length);
    return Array.prototype.some.call(a, b, c)
  } : function (a, b, c) {
    for (var d = a.length, e = isString(a) ? a.split("") : a, f = 0; f < d; f++) if (f in e && b.call(c, e[f], f, a)) return !0;
    return !1
  };
  static every = (Array.prototype.every) ? function (a, b, c) {
    asserts.assert(null != a.length);
    return Array.prototype.every.call(a, b, c)
  } : function (a, b, c) {
    for (var d = a.length, e = isString(a) ? a.split("") : a, f = 0; f < d; f++) if (f in e && !b.call(c, e[f], f, a)) return !1;
    return !0
  };
  static count = function (a, b, c) {
    var d = 0;
    array.forEach(a, function (a, f, g) {
      b.call(c, a, f, g) && ++d
    }, c);
    return d
  };
  static find = function (a, b, c) {
    b = array.findIndex(a, b, c);
    return 0 > b ? null : isString(a) ? a.charAt(b) : a[b]
  };
  static findIndex = function (a, b, c) {
    for (var d = a.length, e = isString(a) ? a.split("") : a, f = 0; f < d; f++) if (f in e && b.call(c, e[f], f, a)) return f;
    return -1
  };
  static findRight = function (a, b, c) {
    b = array.findIndexRight(a, b, c);
    return 0 > b ? null : isString(a) ? a.charAt(b) : a[b]
  };
  static findIndexRight = function (a, b, c) {
    var d = a.length, e = isString(a) ? a.split("") : a;
    for (--d; 0 <= d; d--) if (d in e && b.call(c, e[d], d, a)) return d;
    return -1
  };
  static contains = function (a, b) {
    return 0 <= array.indexOf(a, b)
  };
  static isEmpty = function (a) {
    return 0 == a.length
  };
  static clear = function (a) {
    if (!isArray(a)) for (var b = a.length - 1; 0 <= b; b--) delete a[b];
    a.length = 0
  };
  static insert = function (a, b) {
    array.contains(a, b) || a.push(b)
  };
  static insertAt = function (a, b, c) {
    array.splice(a, c, 0, b)
  };
  static insertArrayAt = function (a, b, c) {
    partial(array.splice, a, c, 0).apply(null, b)
  };
  static insertBefore = function (a, b, c) {
    var d;
    2 == arguments.length || 0 > (d = array.indexOf(a, c)) ? a.push(b) : array.insertAt(a, b, d)
  };
  static remove = function (a, b) {
    b = array.indexOf(a, b);
    var c;
    (c = 0 <= b) && array.removeAt(a, b);
    return c
  };
  static removeLast = function (a, b) {
    b = array.lastIndexOf(a, b);
    return 0 <= b ? (array.removeAt(a, b), !0) : !1
  };
  static removeAt = function (a, b) {
    asserts.assert(null != a.length);
    return 1 == Array.prototype.splice.call(a, b, 1).length
  };
  static removeIf = function (a, b, c) {
    b = array.findIndex(a, b, c);
    return 0 <= b ? (array.removeAt(a, b), !0) : !1
  };
  static removeAllIf = function (a, b, c) {
    var d = 0;
    array.forEachRight(a, function (e, f) {
      b.call(c, e, f, a) && array.removeAt(a, f) && d++
    });
    return d
  };
  static concat = function (a) {
    return Array.prototype.concat.apply([], arguments)
  };
  static join = function (a) {
    return Array.prototype.concat.apply([], arguments)
  };
  static toArray = function (a) {
    var b = a.length;
    if (0 < b) {
      for (var c = Array(b), d = 0; d < b; d++) c[d] = a[d];
      return c
    }
    return []
  };
  static clone = array.toArray;
  static extend = function (a, b) {
    for (var c = 1; c < arguments.length; c++) {
      var d = arguments[c];
      if (isArrayLike(d)) {
        var e = a.length || 0, f = d.length || 0;
        a.length = e + f;
        for (var g = 0; g < f; g++) a[e + g] = d[g]
      } else a.push(d)
    }
  };
  static splice = function (a, b, c, d) {
    asserts.assert(null != a.length);
    return Array.prototype.splice.apply(a, array.slice(arguments, 1))
  };
  static slice = function (a, b, c?) {
    asserts.assert(null != a.length);
    return 2 >= arguments.length ? Array.prototype.slice.call(a, b) : Array.prototype.slice.call(a, b, c)
  };
  static removeDuplicates = function (a, b, c) {
    b = b || a;
    var d = function (a) {
      return isObject(a) ? "o" + getUid(a) : (typeof a).charAt(0) + a
    } as any;
    c = c || d;
    d = {};
    for (var e = 0, f = 0; f < a.length;) {
      var g = a[f++], h = c(g);
      Object.prototype.hasOwnProperty.call(d, h) || (d[h] = !0, b[e++] = g)
    }
    b.length = e
  };
  static binarySearch = function (a, b, c) {
    return array.binarySearch_(a, c || array.defaultCompare, !1, b)
  };
  static binarySelect = function (a, b, c) {
    return array.binarySearch_(a, b, !0, void 0, c)
  };
  static binarySearch_ = function (a, b, c, d, e?) {
    for (var f = 0, g = a.length, h; f < g;) {
      var k = f + g >> 1;
      var l = c ? b.call(e, a[k], k, a) : b(d, a[k]);
      0 < l ? f = k + 1 : (g = k, h = !l)
    }
    return h ? f : ~f
  };
  static sort = function (a, b) {
    a.sort(b || array.defaultCompare)
  };
  static stableSort = function (a, b) {
    for (var c = Array(a.length), d = 0; d < a.length; d++) c[d] = {index: d, value: a[d]};
    var e = b || array.defaultCompare;
    array.sort(c, function (a, b) {
      return e(a.value, b.value) || a.index - b.index
    });
    for (d = 0; d < a.length; d++) a[d] = c[d].value
  };
  static sortByKey = function (a, b, c) {
    var d = c || array.defaultCompare;
    array.sort(a, function (a, c) {
      return d(b(a), b(c))
    })
  };
  static sortObjectsByKey = function (a, b, c) {
    array.sortByKey(a, function (a) {
      return a[b]
    }, c)
  };
  static isSorted = function (a, b, c) {
    b = b || array.defaultCompare;
    for (var d = 1; d < a.length; d++) {
      var e = b(a[d - 1], a[d]);
      if (0 < e || 0 == e && c) return !1
    }
    return !0
  };
  static equals = function (a, b, c) {
    if (!isArrayLike(a) || !isArrayLike(b) || a.length != b.length) return !1;
    var d = a.length;
    c = c || array.defaultCompareEquality;
    for (var e = 0; e < d; e++) if (!c(a[e], b[e])) return !1;
    return !0
  };
  static compare3 = function (a, b, c) {
    c = c || array.defaultCompare;
    for (var d = Math.min(a.length, b.length), e = 0; e < d; e++) {
      var f = c(a[e], b[e]);
      if (0 != f) return f
    }
    return array.defaultCompare(a.length, b.length)
  };
  static defaultCompare = function (a, b) {
    return a > b ? 1 : a < b ? -1 : 0
  };
  static inverseDefaultCompare = function (a, b) {
    return -array.defaultCompare(a, b)
  };
  static defaultCompareEquality = function (a, b) {
    return a === b
  };
  static binaryInsert = function (a, b, c) {
    c = array.binarySearch(a, b, c);
    return 0 > c ? (array.insertAt(a, b, -(c + 1)), !0) : !1
  };
  static binaryRemove = function (a, b, c) {
    b = array.binarySearch(a, b, c);
    return 0 <= b ? array.removeAt(a, b) : !1
  };
  static bucket = function (a, b, c) {
    for (var d = {}, e = 0; e < a.length; e++) {
      var f = a[e], g = b.call(c, f, e, a);
      isDef(g) && (d[g] || (d[g] = [])).push(f)
    }
    return d
  };
  static toObject = function (a, b, c) {
    var d = {};
    array.forEach(a, function (e, f) {
      d[b.call(c, e, f, a)] = e
    });
    return d
  };
  static range = function (a, b, c) {
    var d = [], e = 0, f = a;
    c = c || 1;
    void 0 !== b && (e = a, f = b);
    if (0 > c * (f - e)) return [];
    if (0 < c) for (a = e; a < f; a += c) d.push(a); else for (a = e; a > f; a += c) d.push(a);
    return d
  };
  static repeat = function (a, b) {
    for (var c = [], d = 0; d < b; d++) c[d] = a;
    return c
  };
  static flatten = function (a) {
    for (var b = [], c = 0; c < arguments.length; c++) {
      var d = arguments[c];
      if (isArray(d)) for (var e = 0; e < d.length; e += 8192) {
        var f = array.slice(d, e, e + 8192);
        f = array.flatten.apply(null, f);
        for (var g = 0; g < f.length; g++) b.push(f[g])
      } else b.push(d)
    }
    return b
  };
  static rotate = function (a, b) {
    asserts.assert(null != a.length);
    a.length && (b %= a.length, 0 < b ? Array.prototype.unshift.apply(a, a.splice(-b, b)) : 0 > b && Array.prototype.push.apply(a, a.splice(0, -b)));
    return a
  };
  static moveItem = function (a, b, c) {
    asserts.assert(0 <= b && b < a.length);
    asserts.assert(0 <= c && c < a.length);
    b = Array.prototype.splice.call(a, b, 1);
    Array.prototype.splice.call(a, c, 0, b[0])
  };
  static zip = function (a) {
    if (!arguments.length) return [];
    for (var b = [], c = arguments[0].length, d = 1; d < arguments.length; d++) arguments[d].length < c && (c = arguments[d].length);
    for (d = 0; d < c; d++) {
      for (var e = [], f = 0; f < arguments.length; f++) e.push(arguments[f][d]);
      b.push(e)
    }
    return b
  };
  static shuffle = function (a, b) {
    b = b || Math.random;
    for (var c = a.length - 1; 0 < c; c--) {
      var d = Math.floor(b() * (c + 1)), e = a[c];
      a[c] = a[d];
      a[d] = e
    }
  };
  static copyByIndex = function (a, b) {
    var c = [];
    array.forEach(b, function (b) {
      c.push(a[b])
    });
    return c
  };
  static concatMap = function (a, b, c) {
    return array.concat.apply([], array.map(a, b, c))
  };
}

class internal {
  static startsWith = function (a, b) {
    return 0 == a.lastIndexOf(b, 0)
  };
  static endsWith = function (a, b) {
    var c = a.length - b.length;
    return 0 <= c && a.indexOf(b, c) == c
  };
  static caseInsensitiveStartsWith = function (a, b) {
    return 0 == internal.caseInsensitiveCompare(b, a.substr(0, b.length))
  };
  static caseInsensitiveEndsWith = function (a, b) {
    return 0 == internal.caseInsensitiveCompare(b, a.substr(a.length - b.length, b.length))
  };
  static caseInsensitiveEquals = function (a, b) {
    return a.toLowerCase() == b.toLowerCase()
  };
  static isEmptyOrWhitespace = function (a) {
    return /^[\s\xa0]*$/.test(a)
  };
  static trim = TRUSTED_SITE && String.prototype.trim ? function (a) {
    return a.trim()
  } : function (a) {
    return /^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(a)[1]
  };
  static caseInsensitiveCompare = function (a, b) {
    a = String(a).toLowerCase();
    b = String(b).toLowerCase();
    return a < b ? -1 : a == b ? 0 : 1
  };
  static newLineToBr = function (a, b) {
    return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>")
  };
  static htmlEscape = function (a, b) {
    if (b) a = a.replace(internal.AMP_RE_, "&amp;").replace(internal.LT_RE_, "&lt;").replace(internal.GT_RE_, "&gt;").replace(internal.QUOT_RE_, "&quot;").replace(internal.SINGLE_QUOTE_RE_, "&#39;").replace(internal.NULL_RE_, "&#0;"); else {
      if (!internal.ALL_RE_.test(a)) return a;
      -1 != a.indexOf("&") && (a = a.replace(internal.AMP_RE_, "&amp;"));
      -1 != a.indexOf("<") && (a = a.replace(internal.LT_RE_,
          "&lt;"));
      -1 != a.indexOf(">") && (a = a.replace(internal.GT_RE_, "&gt;"));
      -1 != a.indexOf('"') && (a = a.replace(internal.QUOT_RE_, "&quot;"));
      -1 != a.indexOf("'") && (a = a.replace(internal.SINGLE_QUOTE_RE_, "&#39;"));
      -1 != a.indexOf("\x00") && (a = a.replace(internal.NULL_RE_, "&#0;"))
    }
    return a
  };
  static AMP_RE_ = /&/g;
  static LT_RE_ = /</g;
  static GT_RE_ = />/g;
  static QUOT_RE_ = /"/g;
  static SINGLE_QUOTE_RE_ = /'/g;
  static NULL_RE_ = /\x00/g;
  static ALL_RE_ = /[\x00&<>"']/;
  static whitespaceEscape = function (a, b) {
    return internal.newLineToBr(a.replace(/  /g, " &#160;"), b)
  };
  static contains = function (a, b) {
    return -1 != a.indexOf(b)
  };
  static caseInsensitiveContains = function (a, b) {
    return internal.contains(a.toLowerCase(), b.toLowerCase())
  };
  static compareVersions = function (a, b) {
    var c = 0;
    a = internal.trim(String(a)).split(".");
    b = internal.trim(String(b)).split(".");
    for (var d = Math.max(a.length, b.length), e = 0; 0 == c && e < d; e++) {
      var f = a[e] || "", g = b[e] || "";
      do {
        f = /(\d*)(\D*)(.*)/.exec(f) || ["", "", "", ""];
        g = /(\d*)(\D*)(.*)/.exec(g) || ["", "", "", ""];
        if (0 == f[0].length && 0 == g[0].length) break;
        c = 0 == f[1].length ? 0 : parseInt(f[1], 10);
        var h = 0 == g[1].length ? 0 : parseInt(g[1], 10);
        c = internal.compareElements_(c, h) || internal.compareElements_(0 ==
            f[2].length, 0 == g[2].length) || internal.compareElements_(f[2], g[2]);
        f = f[3];
        g = g[3]
      } while (0 == c)
    }
    return c
  };
  static compareElements_ = function (a, b) {
    return a < b ? -1 : a > b ? 1 : 0
  };
}

class Const {
  static GOOG_STRING_CONSTRUCTOR_TOKEN_PRIVATE_ ={}
  static TYPE_MARKER_ = {}
  stringConstValueWithSecurityContract__googStringSecurityPrivate_
  STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_
  implementsGoogStringTypedString = !0;
  constructor(a,b) {
    this.stringConstValueWithSecurityContract__googStringSecurityPrivate_ = a === Const.GOOG_STRING_CONSTRUCTOR_TOKEN_PRIVATE_ && b || "";
    this.STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_ = Const.TYPE_MARKER_
  }

  getTypedStringValue = function () {
    return this.stringConstValueWithSecurityContract__googStringSecurityPrivate_
  };
  toString = function () {
    return "Const{" + this.stringConstValueWithSecurityContract__googStringSecurityPrivate_ + "}"
  };
  static unwrap = function (a) {
    if (a instanceof Const && a.constructor === Const && a.STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_ === Const.TYPE_MARKER_) return a.stringConstValueWithSecurityContract__googStringSecurityPrivate_;
    asserts.fail("expected object of type Const, got '" + a + "'");
    return "type_error:Const"
  };
  static from = function (a) {
    return new Const(Const.GOOG_STRING_CONSTRUCTOR_TOKEN_PRIVATE_, a)
  };
  static EMPTY = Const.from("");
}

class stringT {
  static DETECT_DOUBLE_ESCAPING = !1;
  static FORCE_NON_DOM_HTML_UNESCAPING = !1;
  static Unicode = {NBSP: "\u00a0"};
  static startsWith = internal.startsWith;
  static endsWith = internal.endsWith;
  static caseInsensitiveStartsWith = internal.caseInsensitiveStartsWith;
  static caseInsensitiveEndsWith = internal.caseInsensitiveEndsWith;
  static caseInsensitiveEquals = internal.caseInsensitiveEquals;
  static subs = function (a, b) {
    for (var c = a.split("%s"), d = "", e = Array.prototype.slice.call(arguments, 1); e.length && 1 < c.length;) d += c.shift() + e.shift();
    return d + c.join("%s")
  };
  static collapseWhitespace = function (a) {
    return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
  };
  static isEmptyOrWhitespace = internal.isEmptyOrWhitespace;
  static isEmptyString = function (a) {
    return 0 == a.length
  };
  static isEmpty = stringT.isEmptyOrWhitespace;
  static isEmptyOrWhitespaceSafe = function (a) {
    return stringT.isEmptyOrWhitespace(stringT.makeSafe(a))
  };
  static isEmptySafe = stringT.isEmptyOrWhitespaceSafe;
  static isBreakingWhitespace = function (a) {
    return !/[^\t\n\r ]/.test(a)
  };
  static isAlpha = function (a) {
    return !/[^a-zA-Z]/.test(a)
  };
  static isNumeric = function (a) {
    return !/[^0-9]/.test(a)
  };
  static isAlphaNumeric = function (a) {
    return !/[^a-zA-Z0-9]/.test(a)
  };
  static isSpace = function (a) {
    return " " == a
  };
  static isUnicodeChar = function (a) {
    return 1 == a.length && " " <= a && "~" >= a || "\u0080" <= a && "\ufffd" >= a
  };
  static stripNewlines = function (a) {
    return a.replace(/(\r\n|\r|\n)+/g, " ")
  };
  static canonicalizeNewlines = function (a) {
    return a.replace(/(\r\n|\r|\n)/g, "\n")
  };
  static normalizeWhitespace = function (a) {
    return a.replace(/\xa0|\s/g, " ")
  };
  static normalizeSpaces = function (a) {
    return a.replace(/\xa0|[ \t]+/g, " ")
  };
  static collapseBreakingSpaces = function (a) {
    return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "")
  };
  static trim = internal.trim;
  static trimLeft = function (a) {
    return a.replace(/^[\s\xa0]+/, "")
  };
  static trimRight = function (a) {
    return a.replace(/[\s\xa0]+$/, "")
  };
  static caseInsensitiveCompare = internal.caseInsensitiveCompare;
  static numberAwareCompare_ = function (a, b, c) {
    if (a == b) return 0;
    if (!a) return -1;
    if (!b) return 1;
    for (var d = a.toLowerCase().match(c), e = b.toLowerCase().match(c), f = Math.min(d.length, e.length), g = 0; g < f; g++) {
      c = d[g];
      var h = e[g];
      if (c != h) return a = parseInt(c, 10), !isNaN(a) && (b = parseInt(h, 10), !isNaN(b) && a - b) ? a - b : c < h ? -1 : 1
    }
    return d.length != e.length ? d.length - e.length : a < b ? -1 : 1
  };
  static intAwareCompare = function (a, b) {
    return stringT.numberAwareCompare_(a, b, /\d+|\D+/g)
  };
  static floatAwareCompare = function (a, b) {
    return stringT.numberAwareCompare_(a, b, /\d+|\.\d+|\D+/g)
  };
  static numerateCompare = stringT.floatAwareCompare;
  static urlEncode = function (a) {
    return encodeURIComponent(String(a))
  };
  static urlDecode = function (a) {
    return decodeURIComponent(a.replace(/\+/g, " "))
  };
  static newLineToBr = internal.newLineToBr;
  static htmlEscape = function (a, b) {
    a = internal.htmlEscape(a, b);
    stringT.DETECT_DOUBLE_ESCAPING && (a = a.replace(stringT.E_RE_, "&#101;"));
    return a
  };
  static E_RE_ = /e/g;
  static unescapePureXmlEntities_ = function (a) {
    return a.replace(/&([^;]+);/g, function (a, c) {
      switch (c) {
        case "amp":
          return "&";
        case "lt":
          return "<";
        case "gt":
          return ">";
        case "quot":
          return '"';
        default:
          return "#" != c.charAt(0) || (c = Number("0" + c.substr(1)), isNaN(c)) ? a : String.fromCharCode(c)
      }
    })
  };
  static HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
  static whitespaceEscape = function (a, b) {
    return stringT.newLineToBr(a.replace(/  /g, " &#160;"), b)
  };
  static preserveSpaces = function (a) {
    return a.replace(/(^|[\n ]) /g, "$1" + stringT.Unicode.NBSP)
  };
  static stripQuotes = function (a, b) {
    for (var c = b.length, d = 0; d < c; d++) {
      var e = 1 == c ? b : b.charAt(d);
      if (a.charAt(0) == e && a.charAt(a.length - 1) == e) return a.substring(1, a.length - 1)
    }
    return a
  };
  static specialEscapeChars_ = {
    "\x00": "\\0",
    "\b": "\\b",
    "\f": "\\f",
    "\n": "\\n",
    "\r": "\\r",
    "\t": "\\t",
    "\x0B": "\\x0B",
    '"': '\\"',
    "\\": "\\\\",
    "<": "\\u003C"
  };
  static jsEscapeCache_ = {"'": "\\'"};
  static quote = function (a) {
    a = String(a);
    for (var b = ['"'], c = 0; c < a.length; c++) {
      var d = a.charAt(c), e = d.charCodeAt(0);
      b[c + 1] = stringT.specialEscapeChars_[d] || (31 < e && 127 > e ? d : stringT.escapeChar(d))
    }
    b.push('"');
    return b.join("")
  };
  static escapeString = function (a) {
    for (var b = [], c = 0; c < a.length; c++) b[c] = stringT.escapeChar(a.charAt(c));
    return b.join("")
  };
  static escapeChar = function (a) {
    if (a in stringT.jsEscapeCache_) return stringT.jsEscapeCache_[a];
    if (a in stringT.specialEscapeChars_) return stringT.jsEscapeCache_[a] = stringT.specialEscapeChars_[a];
    var b = a.charCodeAt(0);
    if (31 < b && 127 > b) var c = a; else {
      if (256 > b) {
        if (c = "\\x", 16 > b || 256 < b) c += "0"
      } else c = "\\u", 4096 > b && (c += "0");
      c += b.toString(16).toUpperCase()
    }
    return stringT.jsEscapeCache_[a] = c
  };
  static contains = internal.contains;
  static caseInsensitiveContains = internal.caseInsensitiveContains;
  static countOf = function (a, b) {
    return a && b ? a.split(b).length - 1 : 0
  };
  static removeAt = function (a, b, c) {
    var d = a;
    0 <= b && b < a.length && 0 < c && (d = a.substr(0, b) + a.substr(b + c, a.length - b - c));
    return d
  };
  static remove = function (a, b) {
    return a.replace(b, "")
  };
  static removeAll = function (a, b) {
    b = new RegExp(stringT.regExpEscape(b), "g");
    return a.replace(b, "")
  };
  static replaceAll = function (a, b, c) {
    b = new RegExp(stringT.regExpEscape(b), "g");
    return a.replace(b, c.replace(/\$/g, "$$$$"))
  };
  static regExpEscape = function (a) {
    return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
  };
  static repeat = String.prototype.repeat ? function (a, b) {
    return a.repeat(b)
  } : function (a, b) {
    return Array(b + 1).join(a)
  };
  static padNumber = function (a, b, c) {
    a = isDef(c) ? a.toFixed(c) : String(a);
    c = a.indexOf(".");
    -1 == c && (c = a.length);
    return stringT.repeat("0", Math.max(0, b - c)) + a
  };
  static makeSafe = function (a) {
    return null == a ? "" : String(a)
  };
  static buildString = function (a) {
    return Array.prototype.join.call(arguments, "")
  };
  static getRandomString = function () {
    return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ now()).toString(36)
  };
  static compareVersions = internal.compareVersions;
  static hashCode = function (a) {
    for (var b = 0, c = 0; c < a.length; ++c) b = 31 * b + a.charCodeAt(c) >>> 0;
    return b
  };
  static uniqueStringCounter_ = 2147483648 * Math.random() | 0;
  static createUniqueString = function () {
    return "goog_" + stringT.uniqueStringCounter_++
  };
  static toNumber = function (a) {
    var b = Number(a);
    return 0 == b && stringT.isEmptyOrWhitespace(a) ? NaN : b
  };
  static isLowerCamelCase = function (a) {
    return /^[a-z]+([A-Z][a-z]*)*$/.test(a)
  };
  static isUpperCamelCase = function (a) {
    return /^([A-Z][a-z]*)+$/.test(a)
  };
  static toCamelCase = function (a) {
    return String(a).replace(/\-([a-z])/g, function (a, c) {
      return c.toUpperCase()
    })
  };
  static toSelectorCase = function (a) {
    return String(a).replace(/([A-Z])/g, "-$1").toLowerCase()
  };
  static toTitleCase = function (a, b) {
    b = isString(b) ? stringT.regExpEscape(b) : "\\s";
    return a.replace(new RegExp("(^" + (b ? "|[" + b + "]+" : "") + ")([a-z])", "g"), function (a, b, e) {
      return b + e.toUpperCase()
    })
  };
  static capitalize = function (a) {
    return String(a.charAt(0)).toUpperCase() + String(a.substr(1)).toLowerCase()
  };
  static parseInt = function (a) {
    isFinite(a) && (a = String(a));
    return isString(a) ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN
  };
  static splitLimit = function (a, b, c) {
    a = a.split(b);
    for (var d = []; 0 < c && a.length;) d.push(a.shift()), c--;
    a.length && d.push(a.join(b));
    return d
  };
  static lastComponent = function (a, b) {
    if (b) "string" == typeof b && (b = [b]); else return a;
    for (var c = -1, d = 0; d < b.length; d++) if ("" != b[d]) {
      var e = a.lastIndexOf(b[d]);
      e > c && (c = e)
    }
    return -1 == c ? a : a.slice(c + 1)
  };
  static editDistance = function (a, b) {
    var c = [], d = [];
    if (a == b) return 0;
    if (!a.length || !b.length) return Math.max(a.length, b.length);
    for (var e = 0; e < b.length + 1; e++) c[e] = e;
    for (e = 0; e < a.length; e++) {
      d[0] = e + 1;
      for (var f = 0; f < b.length; f++) d[f + 1] = Math.min(d[f] + 1, c[f + 1] + 1, c[f] + Number(a[e] != b[f]));
      for (f = 0; f < c.length; f++) c[f] = d[f]
    }
    return d[b.length]
  };
}

class base64 {
  static DEFAULT_ALPHABET_COMMON_ = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  static ENCODED_VALS = base64.DEFAULT_ALPHABET_COMMON_ + "+/=";
  static ENCODED_VALS_WEBSAFE = base64.DEFAULT_ALPHABET_COMMON_ + "-_.";
  static Alphabet = {DEFAULT: 0, NO_PADDING: 1, WEBSAFE: 2, WEBSAFE_DOT_PADDING: 3, WEBSAFE_NO_PADDING: 4};
  static paddingChars_ = "=.";
  static isPadding_ = function (a) {
    return stringT.contains(base64.paddingChars_, a)
  };
  static byteToCharMaps_ = {};
  static charToByteMap_ = null;
  static ASSUME_NATIVE_SUPPORT_ = true;
  static HAS_NATIVE_ENCODE_ = base64.ASSUME_NATIVE_SUPPORT_ || "function" == typeof nowGlobal.btoa;
  static HAS_NATIVE_DECODE_ = base64.ASSUME_NATIVE_SUPPORT_ || "function" == typeof window.atob;
  static encodeByteArray = function (a, b?) {
    asserts.assert(isArrayLike(a), "encodeByteArray takes an array as a parameter");
    void 0 === b && (b = base64.Alphabet.DEFAULT);
    base64.init_();
    b = base64.byteToCharMaps_[b];
    for (var c = [], d = 0; d < a.length; d += 3) {
      var e = a[d], f = d + 1 < a.length, g = f ? a[d + 1] : 0, h = d + 2 < a.length, k = h ? a[d + 2] : 0,
          l = e >> 2;
      e = (e & 3) << 4 | g >> 4;
      g = (g & 15) << 2 | k >> 6;
      k &= 63;
      h || (k = 64, f || (g = 64));
      c.push(b[l], b[e], b[g] || "", b[k] || "")
    }
    return c.join("")
  };
  static encodeString = function (a, b) {
    return base64.HAS_NATIVE_ENCODE_ && !b ? nowGlobal.btoa(a) : base64.encodeByteArray(crypt.stringToByteArray(a), b)
  };
  static decodeString = function (a, b) {
    if (base64.HAS_NATIVE_DECODE_ && !b) return nowGlobal.atob(a);
    var c = "";
    base64.decodeStringInternal_(a, function (a) {
      c += String.fromCharCode(a)
    });
    return c
  };
  static decodeStringToByteArray = function (a, b) {
    var c = [];
    base64.decodeStringInternal_(a, function (a) {
      c.push(a)
    });
    return c
  };
  static decodeStringToUint8Array = function (a) {
    var b = a.length, c = 3 * b / 4;
    c % 3 ? c = Math.floor(c) : base64.isPadding_(a[b - 1]) && (c = base64.isPadding_(a[b - 2]) ? c - 2 : c - 1);
    var d = new Uint8Array(c), e = 0;
    base64.decodeStringInternal_(a, function (a) {
      d[e++] = a
    });
    return d.subarray(0, e)
  };
  static decodeStringInternal_ = function (a, b) {
    function c(b) {
      for (; d < a.length;) {
        var c = a.charAt(d++), e = base64.charToByteMap_[c];
        if (null != e) return e;
        if (!stringT.isEmptyOrWhitespace(c)) throw Error("Unknown base64 encoding at char: " + c);
      }
      return b
    }

    base64.init_();
    for (var d = 0; ;) {
      var e = c(-1), f = c(0), g = c(64), h = c(64);
      if (64 === h && -1 === e) break;
      b(e << 2 | f >> 4);
      64 != g && (b(f << 4 & 240 | g >> 2), 64 != h && b(g << 6 & 192 | h))
    }
  };
  static init_ = function () {
    if (!base64.charToByteMap_) {
      base64.charToByteMap_ = {};
      for (var a = base64.DEFAULT_ALPHABET_COMMON_.split(""), b = ["+/=", "+/", "-_=", "-_.", "-_"], c = 0; 5 > c; c++) {
        var d = a.concat(b[c].split(""));
        base64.byteToCharMaps_[c] = d;
        for (var e = 0; e < d.length; e++) {
          var f = d[e], g = base64.charToByteMap_[f];
          void 0 === g ? base64.charToByteMap_[f] = e : asserts.assert(g === e)
        }
      }
    }
  };
}

class crypt {
  static stringToByteArray = function (a) {
    for (var b = [], c = 0, d = 0; d < a.length; d++) {
      var e = a.charCodeAt(d);
      255 < e && (b[c++] = e & 255, e >>= 8);
      b[c++] = e
    }
    return b
  };
  static byteArrayToString = function (a) {
    if (8192 >= a.length) return String.fromCharCode.apply(null, a);
    for (var b = "", c = 0; c < a.length; c += 8192) {
      var d = array.slice(a, c, c + 8192);
      b += String.fromCharCode.apply(null, d)
    }
    return b
  };
  static byteArrayToHex = function (a, b) {
    return array.map(a, function (a) {
      a = a.toString(16);
      return 1 < a.length ? a : "0" + a
    }).join(b || "")
  };
  static hexToByteArray = function (a) {
    asserts.assert(0 == a.length % 2, "Key string length must be multiple of 2");
    for (var b = [], c = 0; c < a.length; c += 2) b.push(parseInt(a.substring(c, c + 2), 16));
    return b
  };
  static stringToUtf8ByteArray = function (a) {
    for (var b = [], c = 0, d = 0; d < a.length; d++) {
      var e = a.charCodeAt(d);
      128 > e ? b[c++] = e : (2048 > e ? b[c++] = e >> 6 | 192 : (55296 == (e & 64512) && d + 1 < a.length && 56320 == (a.charCodeAt(d + 1) & 64512) ? (e = 65536 + ((e & 1023) << 10) + (a.charCodeAt(++d) & 1023), b[c++] = e >> 18 | 240, b[c++] = e >> 12 & 63 | 128) : b[c++] = e >> 12 | 224, b[c++] = e >> 6 & 63 | 128), b[c++] = e & 63 | 128)
    }
    return b
  };
  static utf8ByteArrayToString = function (a) {
    for (var b = [], c = 0, d = 0; c < a.length;) {
      var e = a[c++];
      if (128 > e) b[d++] = String.fromCharCode(e); else if (191 < e && 224 > e) {
        var f = a[c++];
        b[d++] = String.fromCharCode((e & 31) << 6 | f & 63)
      } else if (239 < e && 365 > e) {
        f = a[c++];
        var g = a[c++], h = a[c++];
        e = ((e & 7) << 18 | (f & 63) << 12 | (g & 63) << 6 | h & 63) - 65536;
        b[d++] = String.fromCharCode(55296 + (e >> 10));
        b[d++] = String.fromCharCode(56320 + (e & 1023))
      } else f = a[c++], g = a[c++], b[d++] = String.fromCharCode((e & 15) << 12 | (f & 63) << 6 | g & 63)
    }
    return b.join("")
  };
  static xorByteArray = function (a, b) {
    asserts.assert(a.length == b.length, "XOR array lengths must match");
    for (var c = [], d = 0; d < a.length; d++) c.push(a[d] ^ b[d]);
    return c
  };
}

class BinaryConstants {
  static FieldType = {
    INVALID: -1,
    DOUBLE: 1,
    FLOAT: 2,
    INT64: 3,
    UINT64: 4,
    INT32: 5,
    FIXED64: 6,
    FIXED32: 7,
    BOOL: 8,
    STRING: 9,
    GROUP: 10,
    MESSAGE: 11,
    BYTES: 12,
    UINT32: 13,
    ENUM: 14,
    SFIXED32: 15,
    SFIXED64: 16,
    SINT32: 17,
    SINT64: 18,
    FHASH64: 30,
    VHASH64: 31
  };

  static WireType = {
    INVALID: -1,
    VARINT: 0,
    FIXED64: 1,
    DELIMITED: 2,
    START_GROUP: 3,
    END_GROUP: 4,
    FIXED32: 5
  };

  static FieldTypeToWireType = function(a) {
    var b = BinaryConstants.FieldType,
        c = BinaryConstants.WireType;
    switch (a) {
      case b.INT32:
      case b.INT64:
      case b.UINT32:
      case b.UINT64:
      case b.SINT32:
      case b.SINT64:
      case b.BOOL:
      case b.ENUM:
      case b.VHASH64:
        return c.VARINT;
      case b.DOUBLE:
      case b.FIXED64:
      case b.SFIXED64:
      case b.FHASH64:
        return c.FIXED64;
      case b.STRING:
      case b.MESSAGE:
      case b.BYTES:
        return c.DELIMITED;
      case b.FLOAT:
      case b.FIXED32:
      case b.SFIXED32:
        return c.FIXED32;
      default:
        return c.INVALID;
    }
  };
  static INVALID_FIELD_NUMBER = -1;
  static FLOAT32_EPS = 1.401298464324817E-45;
  static FLOAT32_MIN = 1.1754943508222875E-38;
  static FLOAT32_MAX = 3.4028234663852886E38;
  static FLOAT64_EPS = 4.9E-324;
  static FLOAT64_MIN = 2.2250738585072014E-308;
  static FLOAT64_MAX = 1.7976931348623157E308;
  static TWO_TO_20 = 1048576;
  static TWO_TO_23 = 8388608;
  static TWO_TO_31 = 2147483648;
  static TWO_TO_32 = 4294967296;
  static TWO_TO_52 = 4503599627370496;
  static TWO_TO_63 = 0x7fffffffffffffff;
  static TWO_TO_64 = 1.8446744073709552E19;
  static ZERO_HASH = "\x00\x00\x00\x00\x00\x00\x00\x00";
}

class utils {

  static split64Low = 0;
  static split64High = 0;
  static splitUint64 = function(a) {
    var b = a >>> 0;
    a = Math.floor((a - b) / BinaryConstants.TWO_TO_32) >>> 0;
    utils.split64Low = b;
    utils.split64High = a;
  };


  static splitInt64 = function(a) {
    var b = 0 > a;
    a = Math.abs(a);
    var c = a >>> 0;
    a = Math.floor((a - c) / BinaryConstants.TWO_TO_32);
    a >>>= 0;
    b &&
    ((a = ~a >>> 0),
        (c = (~c >>> 0) + 1),
    4294967295 < c && ((c = 0), a++, 4294967295 < a && (a = 0)));
    utils.split64Low = c;
    utils.split64High = a;
  };
  static splitZigzag64 = function(a) {
    var b = 0 > a;
    a = 2 * Math.abs(a);
    utils.splitUint64(a);
    a = utils.split64Low;
    var c = utils.split64High;
    b &&
    (0 == a ? (0 == c ? (c = a = 4294967295) : (c--, (a = 4294967295))) : a--);
    utils.split64Low = a;
    utils.split64High = c;
  };
  static splitFloat32 = function(a) {
    var b = 0 > a ? 1 : 0;
    a = b ? -a : a;
    if (0 === a)
      0 < 1 / a
          ? ((utils.split64High = 0), (utils.split64Low = 0))
          : ((utils.split64High = 0), (utils.split64Low = 2147483648));
    else if (isNaN(a))
      (utils.split64High = 0), (utils.split64Low = 2147483647);
    else if (a > BinaryConstants.FLOAT32_MAX)
      (utils.split64High = 0),
          (utils.split64Low = ((b << 31) | 2139095040) >>> 0);
    else if (a < BinaryConstants.FLOAT32_MIN)
      (a = Math.round(a / Math.pow(2, -149))),
          (utils.split64High = 0),
          (utils.split64Low = ((b << 31) | a) >>> 0);
    else {
      var c = Math.floor(Math.log(a) / Math.LN2);
      a *= Math.pow(2, -c);
      a = Math.round(a * BinaryConstants.TWO_TO_23) & 8388607;
      utils.split64High = 0;
      utils.split64Low = ((b << 31) | ((c + 127) << 23) | a) >>> 0;
    }
  };
  static splitFloat64 = function(a) {
    var b = 0 > a ? 1 : 0;
    a = b ? -a : a;
    if (0 === a)
      (utils.split64High = 0 < 1 / a ? 0 : 2147483648),
          (utils.split64Low = 0);
    else if (isNaN(a))
      (utils.split64High = 2147483647), (utils.split64Low = 4294967295);
    else if (a > BinaryConstants.FLOAT64_MAX)
      (utils.split64High = ((b << 31) | 2146435072) >>> 0),
          (utils.split64Low = 0);
    else if (a < BinaryConstants.FLOAT64_MIN) {
      var c = a / Math.pow(2, -1074);
      a = c / BinaryConstants.TWO_TO_32;
      utils.split64High = ((b << 31) | a) >>> 0;
      utils.split64Low = c >>> 0;
    } else {
      c = a;
      var d = 0;
      if (2 <= c) for (; 2 <= c && 1023 > d; ) d++, (c /= 2);
      else for (; 1 > c && -1022 < d; ) (c *= 2), d--;
      c = a * Math.pow(2, -d);
      a = (c * BinaryConstants.TWO_TO_20) & 1048575;
      c = (c * BinaryConstants.TWO_TO_52) >>> 0;
      utils.split64High = ((b << 31) | ((d + 1023) << 20) | a) >>> 0;
      utils.split64Low = c;
    }
  };
  static splitHash64 = function(a) {
    var b = a.charCodeAt(0),
        c = a.charCodeAt(1),
        d = a.charCodeAt(2),
        e = a.charCodeAt(3),
        f = a.charCodeAt(4),
        g = a.charCodeAt(5),
        h = a.charCodeAt(6);
    a = a.charCodeAt(7);
    utils.split64Low = (b + (c << 8) + (d << 16) + (e << 24)) >>> 0;
    utils.split64High = (f + (g << 8) + (h << 16) + (a << 24)) >>> 0;
  };
  static joinUint64 = function(a, b) {
    return b * BinaryConstants.TWO_TO_32 + (a >>> 0);
  };
  static joinInt64 = function(a, b) {
    var c = b & 2147483648;
    c && ((a = (~a + 1) >>> 0), (b = ~b >>> 0), 0 == a && (b = (b + 1) >>> 0));
    a = utils.joinUint64(a, b);
    return c ? -a : a;
  };
  static toZigzag64 = function(a, b, c) {
    var d = b >> 31;
    return c((a << 1) ^ d, ((b << 1) | (a >>> 31)) ^ d);
  };
  static joinZigzag64 = function(a, b) {
    return utils.fromZigzag64(a, b, utils.joinInt64);
  };
  static fromZigzag64 = function(a, b, c) {
    var d = -(a & 1);
    return c(((a >>> 1) | (b << 31)) ^ d, (b >>> 1) ^ d);
  };
  static joinFloat32 = function(a, b) {
    b = 2 * (a >> 31) + 1;
    var c = (a >>> 23) & 255;
    a &= 8388607;
    return 255 == c
        ? a
            ? NaN
            : Infinity * b
        : 0 == c
            ? b * Math.pow(2, -149) * a
            : b * Math.pow(2, c - 150) * (a + Math.pow(2, 23));
  };
  static joinFloat64 = function(a, b) {
    var c = 2 * (b >> 31) + 1,
        d = (b >>> 20) & 2047;
    a = BinaryConstants.TWO_TO_32 * (b & 1048575) + a;
    return 2047 == d
        ? a
            ? NaN
            : Infinity * c
        : 0 == d
            ? c * Math.pow(2, -1074) * a
            : c * Math.pow(2, d - 1075) * (a + BinaryConstants.TWO_TO_52);
  };
  static joinHash64 = function(a, b) {
    return String.fromCharCode(
        (a >>> 0) & 255,
        (a >>> 8) & 255,
        (a >>> 16) & 255,
        (a >>> 24) & 255,
        (b >>> 0) & 255,
        (b >>> 8) & 255,
        (b >>> 16) & 255,
        (b >>> 24) & 255
    );
  };
  static DIGITS = "0123456789abcdef".split("");
  static ZERO_CHAR_CODE_ = 48;
  static A_CHAR_CODE_ = 97;
  static joinUnsignedDecimalString = function(a, b) {
    function c(a, b) {
      a = a ? String(a) : "";
      return b ? "0000000".slice(a.length) + a : a;
    }

    if (2097151 >= b) return "" + (BinaryConstants.TWO_TO_32 * b + a);
    var d = (((a >>> 24) | (b << 8)) >>> 0) & 16777215;
    b = (b >> 16) & 65535;
    a = (a & 16777215) + 6777216 * d + 6710656 * b;
    d += 8147497 * b;
    b *= 2;
    1e7 <= a && ((d += Math.floor(a / 1e7)), (a %= 1e7));
    1e7 <= d && ((b += Math.floor(d / 1e7)), (d %= 1e7));
    return c(b, 0) + c(d, b) + c(a, 1);
  };
  static joinSignedDecimalString = function(a, b) {
    var c = b & 2147483648;
    c && ((a = (~a + 1) >>> 0), (b = (~b + (0 == a ? 1 : 0)) >>> 0));
    a = utils.joinUnsignedDecimalString(a, b);
    return c ? "-" + a : a;
  };
  static hash64ToDecimalString = function(a, b) {
    utils.splitHash64(a);
    a = utils.split64Low;
    var c = utils.split64High;
    return b
        ? utils.joinSignedDecimalString(a, c)
        : utils.joinUnsignedDecimalString(a, c);
  };
  static hash64ArrayToDecimalStrings = function(a, b) {
    for (var c = Array(a.length), d = 0; d < a.length; d++)
      c[d] = utils.hash64ToDecimalString(a[d], b);
    return c;
  };
  static decimalStringToHash64 = function(a) {
    function b(a, b) {
      for (var c = 0; 8 > c && (1 !== a || 0 < b); c++)
        (b = a * e[c] + b), (e[c] = b & 255), (b >>>= 8);
    }

    function c() {
      for (var a = 0; 8 > a; a++) e[a] = ~e[a] & 255;
    }

    asserts.assert(0 < a.length);
    var d = !1;
    "-" === a[0] && ((d = !0), (a = a.slice(1)));
    for (var e = [0, 0, 0, 0, 0, 0, 0, 0], f = 0; f < a.length; f++)
      b(10, a.charCodeAt(f) - utils.ZERO_CHAR_CODE_);
    d && (c(), b(1, 1));
    return crypt.byteArrayToString(e);
  };
  static splitDecimalString = function(a) {
    utils.splitHash64(utils.decimalStringToHash64(a));
  };
  static toHexDigit_ = function(a) {
    return String.fromCharCode(
        10 > a ? utils.ZERO_CHAR_CODE_ + a : utils.A_CHAR_CODE_ - 10 + a
    );
  };
  static fromHexCharCode_ = function(a) {
    return a >= utils.A_CHAR_CODE_
        ? a - utils.A_CHAR_CODE_ + 10
        : a - utils.ZERO_CHAR_CODE_;
  };
  static hash64ToHexString = function(a) {
    var b = Array(18);
    b[0] = "0";
    b[1] = "x";
    for (var c = 0; 8 > c; c++) {
      var d = a.charCodeAt(7 - c);
      b[2 * c + 2] = utils.toHexDigit_(d >> 4);
      b[2 * c + 3] = utils.toHexDigit_(d & 15);
    }
    return b.join("");
  };
  static hexStringToHash64 = function(a) {
    a = a.toLowerCase();
    asserts.assert(18 == a.length);
    asserts.assert("0" == a[0]);
    asserts.assert("x" == a[1]);
    for (var b = "", c = 0; 8 > c; c++) {
      var d = utils.fromHexCharCode_(a.charCodeAt(2 * c + 2)),
          e = utils.fromHexCharCode_(a.charCodeAt(2 * c + 3));
      b = String.fromCharCode(16 * d + e) + b;
    }
    return b;
  };
  static hash64ToNumber = function(a, b) {
    utils.splitHash64(a);
    a = utils.split64Low;
    var c = utils.split64High;
    return b ? utils.joinInt64(a, c) : utils.joinUint64(a, c);
  };
  static numberToHash64 = function(a) {
    utils.splitInt64(a);
    return utils.joinHash64(utils.split64Low, utils.split64High);
  };
  static countVarints = function(a, b, c) {
    for (var d = 0, e = b; e < c; e++) d += a[e] >> 7;
    return c - b - d;
  };
  static countVarintFields = function(a, b, c, d) {
    var e = 0;
    d = 8 * d + BinaryConstants.WireType.VARINT;
    if (128 > d)
      for (; b < c && a[b++] == d; )
        for (e++; ; ) {
          var f = a[b++];
          if (0 == (f & 128)) break;
        }
    else
      for (; b < c; ) {
        for (f = d; 128 < f; ) {
          if (a[b] != ((f & 127) | 128)) return e;
          b++;
          f >>= 7;
        }
        if (a[b++] != f) break;
        for (e++; (f = a[b++]), 0 != (f & 128); );
      }
    return e;
  };
  static countFixedFields_ = function(a, b, c, d, e) {
    var f = 0;
    if (128 > d) for (; b < c && a[b++] == d; ) f++, (b += e);
    else
      for (; b < c; ) {
        for (var g = d; 128 < g; ) {
          if (a[b++] != ((g & 127) | 128)) return f;
          g >>= 7;
        }
        if (a[b++] != g) break;
        f++;
        b += e;
      }
    return f;
  };
  static countFixed32Fields = function(a, b, c, d) {
    return utils.countFixedFields_(
        a,
        b,
        c,
        8 * d + BinaryConstants.WireType.FIXED32,
        4
    );
  };
  static countFixed64Fields = function(a, b, c, d) {
    return utils.countFixedFields_(
        a,
        b,
        c,
        8 * d + BinaryConstants.WireType.FIXED64,
        8
    );
  };
  static countDelimitedFields = function(a, b, c, d) {
    var e = 0;
    for (d = 8 * d + BinaryConstants.WireType.DELIMITED; b < c; ) {
      for (var f = d; 128 < f; ) {
        if (a[b++] != ((f & 127) | 128)) return e;
        f >>= 7;
      }
      if (a[b++] != f) break;
      e++;
      for (
          var g = 0, h = 1;
          (f = a[b++]), (g += (f & 127) * h), (h *= 128), 0 != (f & 128);

      );
      b += g;
    }
    return e;
  };
  static debugBytesToTextFormat = function(a) {
    var b = '"';
    if (a) {
      a = utils.byteSourceToUint8Array(a);
      for (var c = 0; c < a.length; c++)
        (b += "\\x"), 16 > a[c] && (b += "0"), (b += a[c].toString(16));
    }
    return b + '"';
  };
  static debugScalarToTextFormat = function(a) {
    return "string" === typeof a ? stringT.quote(a) : a.toString();
  };
  static stringToByteArray = function(a) {
    for (var b = new Uint8Array(a.length), c = 0; c < a.length; c++) {
      var d = a.charCodeAt(c);
      if (255 < d)
        throw Error(
            "Conversion error: string contains codepoint outside of byte range"
        );
      b[c] = d;
    }
    return b;
  };
  static byteSourceToUint8Array = function(a) {
    if (a.constructor === Uint8Array) return a;
    if (a.constructor === ArrayBuffer || a.constructor === Array)
      return new Uint8Array(a);
    if (a.constructor === String)
      return base64.decodeStringToUint8Array(a);
    asserts.fail("Type not convertible to Uint8Array.");
    return new Uint8Array(0);
  };
}

class UInt64 {
  lo
  hi
  constructor(a, b) {
    this.lo = a;
    this.hi = b
  };
  cmp = function (a) {
    return this.hi < a.hi || this.hi == a.hi && this.lo < a.lo ? -1 : this.hi == a.hi && this.lo == a.lo ? 0 : 1
  };
  rightShift = function () {
    return new UInt64((this.lo >>> 1 | (this.hi & 1) << 31) >>> 0, this.hi >>> 1 >>> 0)
  };
  leftShift = function () {
    return new UInt64(this.lo << 1 >>> 0, (this.hi << 1 | this.lo >>> 31) >>> 0)
  };
  msb = function () {
    return !!(this.hi & 2147483648)
  };
  lsb = function () {
    return !!(this.lo & 1)
  };
  zero = function () {
    return 0 == this.lo && 0 == this.hi
  };
  add = function (a) {
    return new UInt64((this.lo + a.lo & 4294967295) >>> 0 >>> 0, ((this.hi + a.hi & 4294967295) >>> 0) + (4294967296 <= this.lo + a.lo ? 1 : 0) >>> 0)
  };
  sub = function (a) {
    return new UInt64((this.lo - a.lo & 4294967295) >>> 0 >>> 0, ((this.hi - a.hi & 4294967295) >>> 0) - (0 > this.lo - a.lo ? 1 : 0) >>> 0)
  };
  static mul32x32 = function (a, b) {
    var c = a & 65535;
    a >>>= 16;
    var d = b & 65535, e = b >>> 16;
    b = c * d + 65536 * (c * e & 65535) + 65536 * (a * d & 65535);
    for (c = a * e + (c * e >>> 16) + (a * d >>> 16); 4294967296 <= b;) b -= 4294967296, c += 1;
    return new UInt64(b >>> 0, c >>> 0)
  };
  mul = function (a) {
    var b = UInt64.mul32x32(this.lo, a);
    a = UInt64.mul32x32(this.hi, a);
    a.hi = a.lo;
    a.lo = 0;
    return b.add(a)
  };
  div = function (a) {
    if (0 == a) return [];
    var b = new UInt64(0, 0), c = new UInt64(this.lo, this.hi);
    a = new UInt64(a, 0);
    for (var d = new UInt64(1, 0); !a.msb();) a = a.leftShift(), d = d.leftShift();
    for (; !d.zero();) 0 >= a.cmp(c) && (b = b.add(d), c = c.sub(a)), a = a.rightShift(), d = d.rightShift();
    return [b, c]
  };
  toString = function () {
    for (var a = "", b = this; !b.zero();) {
      b = b.div(10);
      var c = b[0];
      a = b[1].lo + a;
      b = c
    }
    "" == a && (a = "0");
    return a
  };
  static fromString = function (a) {
    for (var b = new UInt64(0, 0), c = new UInt64(0, 0), d = 0; d < a.length; d++) {
      if ("0" > a[d] || "9" < a[d]) return null;
      var e = parseInt(a[d], 10);
      c.lo = e;
      b = b.mul(10).add(c)
    }
    return b
  };
  clone = function () {
    return new UInt64(this.lo, this.hi)
  };
}

class Int64 {
  lo
  hi
  constructor (a, b) {
    this.lo = a;
    this.hi = b
  };
  add = function (a) {
    return new Int64((this.lo + a.lo & 4294967295) >>> 0 >>> 0, ((this.hi + a.hi & 4294967295) >>> 0) + (4294967296 <= this.lo + a.lo ? 1 : 0) >>> 0)
  };
  sub = function (a) {
    return new Int64((this.lo - a.lo & 4294967295) >>> 0 >>> 0, ((this.hi - a.hi & 4294967295) >>> 0) - (0 > this.lo - a.lo ? 1 : 0) >>> 0)
  };
  clone = function () {
    return new Int64(this.lo, this.hi)
  };
  toString = function () {
    var a = 0 != (this.hi & 2147483648), b = new UInt64(this.lo, this.hi);
    a && (b = (new UInt64(0, 0)).sub(b));
    return (a ? "-" : "") + b.toString()
  };
  static fromString = function (a) {
    var b = 0 < a.length && "-" == a[0];
    b && (a = a.substring(1));
    a = UInt64.fromString(a);
    if (null === a) return null;
    b && (a = (new UInt64(0, 0)).sub(a));
    return new Int64(a.lo, a.hi)
  };
}

class BinaryDecoder {
  bytes_
  cursor_
  end_
  start_
  error_
  constructor(a, b?, c?) {
    this.bytes_ = null;
    this.cursor_ = this.end_ = this.start_ = 0;
    this.error_ = !1;
    a && this.setBlock(a, b, c);
  };
  static instanceCache_ = [];
  static alloc = function(a, b?, c?) {
    if (BinaryDecoder.instanceCache_.length) {
      var d = BinaryDecoder.instanceCache_.pop();
      a && d.setBlock(a, b, c);
      return d;
    }
    return new BinaryDecoder(a, b, c);
  };
  free = function() {
    this.clear();
    100 > BinaryDecoder.instanceCache_.length &&
    BinaryDecoder.instanceCache_.push(this);
  };
  clone = function() {
    return BinaryDecoder.alloc(
        this.bytes_,
        this.start_,
        this.end_ - this.start_
    );
  };
  clear = function() {
    this.bytes_ = null;
    this.cursor_ = this.end_ = this.start_ = 0;
    this.error_ = !1;
  };
  getBuffer = function() {
    return this.bytes_;
  };
  setBlock = function(a, b?, c?) {
    this.bytes_ = utils.byteSourceToUint8Array(a);
    this.start_ = void 0 !== b ? b : 0;
    this.end_ = void 0 !== c ? this.start_ + c : this.bytes_.length;
    this.cursor_ = this.start_;
  };
  getEnd = function() {
    return this.end_;
  };
  setEnd = function(a) {
    this.end_ = a;
  };
  reset = function() {
    this.cursor_ = this.start_;
  };
  getCursor = function() {
    return this.cursor_;
  };
  setCursor = function(a) {
    this.cursor_ = a;
  };
  advance = function(a) {
    this.cursor_ += a;
    asserts.assert(this.cursor_ <= this.end_);
  };
  atEnd = function() {
    return this.cursor_ == this.end_;
  };
  pastEnd = function() {
    return this.cursor_ > this.end_;
  };
  getError = function() {
    return this.error_ || 0 > this.cursor_ || this.cursor_ > this.end_;
  };
  readSplitVarint64 = function(a) {
    for (var b = 128, c = 0, d = 0, e = 0; 4 > e && 128 <= b; e++)
      (b = this.bytes_[this.cursor_++]), (c |= (b & 127) << (7 * e));
    128 <= b &&
    ((b = this.bytes_[this.cursor_++]),
        (c |= (b & 127) << 28),
        (d |= (b & 127) >> 4));
    if (128 <= b)
      for (e = 0; 5 > e && 128 <= b; e++)
        (b = this.bytes_[this.cursor_++]), (d |= (b & 127) << (7 * e + 3));
    if (128 > b) return a(c >>> 0, d >>> 0);
    asserts.fail("Failed to read varint, encoding is invalid.");
    this.error_ = !0;
  };
  readSplitZigzagVarint64 = function(a) {
    return this.readSplitVarint64(function(b, c) {
      return utils.fromZigzag64(b, c, a);
    });
  };
  readSplitFixed64 = function(a) {
    var b = this.bytes_,
        c = this.cursor_;
    this.cursor_ += 8;
    for (var d = 0, e = 0, f = c + 7; f >= c; f--)
      (d = (d << 8) | b[f]), (e = (e << 8) | b[f + 4]);
    return a(d, e);
  };
  skipVarint = function() {
    for (; this.bytes_[this.cursor_] & 128; ) this.cursor_++;
    this.cursor_++;
  };
  unskipVarint = function(a) {
    for (; 128 < a; ) this.cursor_--, (a >>>= 7);
    this.cursor_--;
  };
  readUnsignedVarint32 = function() {
    var a = this.bytes_;
    var b = a[this.cursor_ + 0];
    var c = b & 127;
    if (128 > b)
      return (
          (this.cursor_ += 1), asserts.assert(this.cursor_ <= this.end_), c
      );
    b = a[this.cursor_ + 1];
    c |= (b & 127) << 7;
    if (128 > b)
      return (
          (this.cursor_ += 2), asserts.assert(this.cursor_ <= this.end_), c
      );
    b = a[this.cursor_ + 2];
    c |= (b & 127) << 14;
    if (128 > b)
      return (
          (this.cursor_ += 3), asserts.assert(this.cursor_ <= this.end_), c
      );
    b = a[this.cursor_ + 3];
    c |= (b & 127) << 21;
    if (128 > b)
      return (
          (this.cursor_ += 4), asserts.assert(this.cursor_ <= this.end_), c
      );
    b = a[this.cursor_ + 4];
    c |= (b & 15) << 28;
    if (128 > b)
      return (
          (this.cursor_ += 5),
              asserts.assert(this.cursor_ <= this.end_),
          c >>> 0
      );
    this.cursor_ += 5;
    128 <= a[this.cursor_++] &&
    128 <= a[this.cursor_++] &&
    128 <= a[this.cursor_++] &&
    128 <= a[this.cursor_++] &&
    128 <= a[this.cursor_++] &&
    asserts.assert(!1);
    asserts.assert(this.cursor_ <= this.end_);
    return c;
  };
  readSignedVarint32 = this.readUnsignedVarint32;
  readUnsignedVarint32String = function() {
    return this.readUnsignedVarint32().toString();
  };
  readSignedVarint32String = function() {
    return this.readSignedVarint32().toString();
  };
  readZigzagVarint32 = function() {
    var a = this.readUnsignedVarint32();
    return (a >>> 1) ^ -(a & 1);
  };
  readUnsignedVarint64 = function() {
    return this.readSplitVarint64(utils.joinUint64);
  };
  readUnsignedVarint64String = function() {
    return this.readSplitVarint64(utils.joinUnsignedDecimalString);
  };
  readSignedVarint64 = function() {
    return this.readSplitVarint64(utils.joinInt64);
  };
  readSignedVarint64String = function() {
    return this.readSplitVarint64(utils.joinSignedDecimalString);
  };
  readZigzagVarint64 = function() {
    return this.readSplitVarint64(utils.joinZigzag64);
  };
  readZigzagVarintHash64 = function() {
    return this.readSplitZigzagVarint64(utils.joinHash64);
  };
  readZigzagVarint64String = function() {
    return this.readSplitZigzagVarint64(utils.joinSignedDecimalString);
  };
  readUint8 = function() {
    var a = this.bytes_[this.cursor_ + 0];
    this.cursor_ += 1;
    asserts.assert(this.cursor_ <= this.end_);
    return a;
  };
  readUint16 = function() {
    var a = this.bytes_[this.cursor_ + 0],
        b = this.bytes_[this.cursor_ + 1];
    this.cursor_ += 2;
    asserts.assert(this.cursor_ <= this.end_);
    return (a << 0) | (b << 8);
  };
  readUint32 = function() {
    var a = this.bytes_[this.cursor_ + 0],
        b = this.bytes_[this.cursor_ + 1],
        c = this.bytes_[this.cursor_ + 2],
        d = this.bytes_[this.cursor_ + 3];
    this.cursor_ += 4;
    asserts.assert(this.cursor_ <= this.end_);
    return ((a << 0) | (b << 8) | (c << 16) | (d << 24)) >>> 0;
  };
  readUint64 = function() {
    var a = this.readUint32(),
        b = this.readUint32();
    return utils.joinUint64(a, b);
  };
  readUint64String = function() {
    var a = this.readUint32(),
        b = this.readUint32();
    return utils.joinUnsignedDecimalString(a, b);
  };
  readInt8 = function() {
    var a = this.bytes_[this.cursor_ + 0];
    this.cursor_ += 1;
    asserts.assert(this.cursor_ <= this.end_);
    return (a << 24) >> 24;
  };
  readInt16 = function() {
    var a = this.bytes_[this.cursor_ + 0],
        b = this.bytes_[this.cursor_ + 1];
    this.cursor_ += 2;
    asserts.assert(this.cursor_ <= this.end_);
    return (((a << 0) | (b << 8)) << 16) >> 16;
  };
  readInt32 = function() {
    var a = this.bytes_[this.cursor_ + 0],
        b = this.bytes_[this.cursor_ + 1],
        c = this.bytes_[this.cursor_ + 2],
        d = this.bytes_[this.cursor_ + 3];
    this.cursor_ += 4;
    asserts.assert(this.cursor_ <= this.end_);
    return (a << 0) | (b << 8) | (c << 16) | (d << 24);
  };
  readInt64 = function() {
    var a = this.readUint32(),
        b = this.readUint32();
    return utils.joinInt64(a, b);
  };
  readInt64String = function() {
    var a = this.readUint32(),
        b = this.readUint32();
    return utils.joinSignedDecimalString(a, b);
  };
  readFloat = function() {
    var a = this.readUint32();
    return utils.joinFloat32(a, 0);
  };
  readDouble = function() {
    var a = this.readUint32(),
        b = this.readUint32();
    return utils.joinFloat64(a, b);
  };
  readBool = function() {
    return !!this.bytes_[this.cursor_++];
  };
  readEnum = function() {
    return this.readSignedVarint32();
  };
  readString = function(a) {
    var b = this.bytes_,
        c = this.cursor_;
    a = c + a;
    for (var d = [], e = ""; c < a; ) {
      var f = b[c++];
      if (128 > f) d.push(f);
      else if (192 > f) continue;
      else if (224 > f) {
        var g = b[c++];
        d.push(((f & 31) << 6) | (g & 63));
      } else if (240 > f) {
        g = b[c++];
        var h = b[c++];
        d.push(((f & 15) << 12) | ((g & 63) << 6) | (h & 63));
      } else if (248 > f) {
        g = b[c++];
        h = b[c++];
        var k = b[c++];
        f = ((f & 7) << 18) | ((g & 63) << 12) | ((h & 63) << 6) | (k & 63);
        f -= 65536;
        d.push(((f >> 10) & 1023) + 55296, (f & 1023) + 56320);
      }
      8192 <= d.length &&
      ((e += String.fromCharCode.apply(null, d)), (d.length = 0));
    }
    e += crypt.byteArrayToString(d);
    this.cursor_ = c;
    return e;
  };
  readStringWithLength = function() {
    var a = this.readUnsignedVarint32();
    return this.readString(a);
  };
  readBytes = function(a) {
    if (0 > a || this.cursor_ + a > this.bytes_.length)
      return (
          (this.error_ = !0),
              asserts.fail("Invalid byte length!"),
              new Uint8Array(0)
      );
    var b = this.bytes_.subarray(this.cursor_, this.cursor_ + a);
    this.cursor_ += a;
    asserts.assert(this.cursor_ <= this.end_);
    return b;
  };
  readVarintHash64 = function() {
    return this.readSplitVarint64(utils.joinHash64);
  };
  readFixedHash64 = function() {
    var a = this.bytes_,
        b = this.cursor_,
        c = a[b + 0],
        d = a[b + 1],
        e = a[b + 2],
        f = a[b + 3],
        g = a[b + 4],
        h = a[b + 5],
        k = a[b + 6];
    a = a[b + 7];
    this.cursor_ += 8;
    return String.fromCharCode(c, d, e, f, g, h, k, a);
  };
}

export class BinaryReader {
  decoder_
  fieldCursor_
  nextField_
  nextWireType_
  error_
  readCallbacks_
  constructor(a, b?, c?) {
    this.decoder_ = BinaryDecoder.alloc(a, b, c);
    this.fieldCursor_ = this.decoder_.getCursor();
    this.nextField_ = BinaryConstants.INVALID_FIELD_NUMBER;
    this.nextWireType_ = BinaryConstants.WireType.INVALID;
    this.error_ = !1;
    this.readCallbacks_ = null;
  };
  static instanceCache_ = [];
  static alloc = function(a, b, c) {
    if (BinaryReader.instanceCache_.length) {
      var d = BinaryReader.instanceCache_.pop();
      a && d.decoder_.setBlock(a, b, c);
      return d;
    }
    return new BinaryReader(a, b, c);
  };
  alloc = BinaryReader.alloc;
  free = function() {
    this.decoder_.clear();
    this.nextField_ = BinaryConstants.INVALID_FIELD_NUMBER;
    this.nextWireType_ = BinaryConstants.WireType.INVALID;
    this.error_ = !1;
    this.readCallbacks_ = null;
    100 > BinaryReader.instanceCache_.length &&
    BinaryReader.instanceCache_.push(this);
  };
  getFieldCursor = function() {
    return this.fieldCursor_;
  };
  getCursor = function() {
    return this.decoder_.getCursor();
  };
  getBuffer = function() {
    return this.decoder_.getBuffer();
  };
  getFieldNumber = function() {
    return this.nextField_;
  };
  getWireType = function() {
    return this.nextWireType_;
  };
  isEndGroup = function() {
    return this.nextWireType_ == BinaryConstants.WireType.END_GROUP;
  };
  getError = function() {
    return this.error_ || this.decoder_.getError();
  };
  setBlock = function(a, b, c) {
    this.decoder_.setBlock(a, b, c);
    this.nextField_ = BinaryConstants.INVALID_FIELD_NUMBER;
    this.nextWireType_ = BinaryConstants.WireType.INVALID;
  };
  reset = function() {
    this.decoder_.reset();
    this.nextField_ = BinaryConstants.INVALID_FIELD_NUMBER;
    this.nextWireType_ = BinaryConstants.WireType.INVALID;
  };
  advance = function(a) {
    this.decoder_.advance(a);
  };
  nextField = function() {
    if (this.decoder_.atEnd()) return !1;
    if (this.getError()) return asserts.fail("Decoder hit an error"), !1;
    this.fieldCursor_ = this.decoder_.getCursor();
    var a = this.decoder_.readUnsignedVarint32(),
        b = a >>> 3;
    a &= 7;
    if (
        a != BinaryConstants.WireType.VARINT &&
        a != BinaryConstants.WireType.FIXED32 &&
        a != BinaryConstants.WireType.FIXED64 &&
        a != BinaryConstants.WireType.DELIMITED &&
        a != BinaryConstants.WireType.START_GROUP &&
        a != BinaryConstants.WireType.END_GROUP
    )
      return (
          asserts.fail(
              "Invalid wire type: %s (at position %s)",
              a,
              this.fieldCursor_
          ),
              (this.error_ = !0),
              !1
      );
    this.nextField_ = b;
    this.nextWireType_ = a;
    return !0;
  };
  unskipHeader = function() {
    this.decoder_.unskipVarint((this.nextField_ << 3) | this.nextWireType_);
  };
  skipMatchingFields = function() {
    var a = this.nextField_;
    for (this.unskipHeader(); this.nextField() && this.getFieldNumber() == a; )
      this.skipField();
    this.decoder_.atEnd() || this.unskipHeader();
  };
  skipVarintField = function() {
    this.nextWireType_ != BinaryConstants.WireType.VARINT
        ? (asserts.fail("Invalid wire type for skipVarintField"),
            this.skipField())
        : this.decoder_.skipVarint();
  };
  skipDelimitedField = function() {
    if (this.nextWireType_ != BinaryConstants.WireType.DELIMITED)
      asserts.fail("Invalid wire type for skipDelimitedField"),
          this.skipField();
    else {
      var a = this.decoder_.readUnsignedVarint32();
      this.decoder_.advance(a);
    }
  };
  skipFixed32Field = function() {
    this.nextWireType_ != BinaryConstants.WireType.FIXED32
        ? (asserts.fail("Invalid wire type for skipFixed32Field"),
            this.skipField())
        : this.decoder_.advance(4);
  };
  skipFixed64Field = function() {
    this.nextWireType_ != BinaryConstants.WireType.FIXED64
        ? (asserts.fail("Invalid wire type for skipFixed64Field"),
            this.skipField())
        : this.decoder_.advance(8);
  };
  skipGroup = function() {
    var a = this.nextField_;
    do {
      if (!this.nextField()) {
        asserts.fail("Unmatched start-group tag: stream EOF");
        this.error_ = !0;
        break;
      }
      if (this.nextWireType_ == BinaryConstants.WireType.END_GROUP) {
        this.nextField_ != a &&
        (asserts.fail("Unmatched end-group tag"), (this.error_ = !0));
        break;
      }
      this.skipField();
    } while (1);
  };
  skipField = function() {
    switch (this.nextWireType_) {
      case BinaryConstants.WireType.VARINT:
        this.skipVarintField();
        break;
      case BinaryConstants.WireType.FIXED64:
        this.skipFixed64Field();
        break;
      case BinaryConstants.WireType.DELIMITED:
        this.skipDelimitedField();
        break;
      case BinaryConstants.WireType.FIXED32:
        this.skipFixed32Field();
        break;
      case BinaryConstants.WireType.START_GROUP:
        this.skipGroup();
        break;
      default:
        asserts.fail("Invalid wire encoding for field.");
    }
  };
  registerReadCallback = function(a, b) {
    null === this.readCallbacks_ && (this.readCallbacks_ = {});
    asserts.assert(!this.readCallbacks_[a]);
    this.readCallbacks_[a] = b;
  };
  runReadCallback = function(a) {
    asserts.assert(null !== this.readCallbacks_);
    a = this.readCallbacks_[a];
    asserts.assert(a);
    return a(this);
  };
  readAny = function(a) {
    this.nextWireType_ = BinaryConstants.FieldTypeToWireType(a);
    var b = BinaryConstants.FieldType;
    switch (a) {
      case b.DOUBLE:
        return this.readDouble();
      case b.FLOAT:
        return this.readFloat();
      case b.INT64:
        return this.readInt64();
      case b.UINT64:
        return this.readUint64();
      case b.INT32:
        return this.readInt32();
      case b.FIXED64:
        return this.readFixed64();
      case b.FIXED32:
        return this.readFixed32();
      case b.BOOL:
        return this.readBool();
      case b.STRING:
        return this.readString();
      case b.GROUP:
        asserts.fail("Group field type not supported in readAny()");
      case b.MESSAGE:
        asserts.fail("Message field type not supported in readAny()");
      case b.BYTES:
        return this.readBytes();
      case b.UINT32:
        return this.readUint32();
      case b.ENUM:
        return this.readEnum();
      case b.SFIXED32:
        return this.readSfixed32();
      case b.SFIXED64:
        return this.readSfixed64();
      case b.SINT32:
        return this.readSint32();
      case b.SINT64:
        return this.readSint64();
      case b.FHASH64:
        return this.readFixedHash64();
      case b.VHASH64:
        return this.readVarintHash64();
      default:
        asserts.fail("Invalid field type in readAny()");
    }
    return 0;
  };
  readMessage = function(a, b) {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.DELIMITED
    );
    var c = this.decoder_.getEnd(),
        d = this.decoder_.readUnsignedVarint32();
    d = this.decoder_.getCursor() + d;
    this.decoder_.setEnd(d);
    b(a, this);
    this.decoder_.setCursor(d);
    this.decoder_.setEnd(c);
  };
  readGroup = function(a, b, c) {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.START_GROUP
    );
    asserts.assert(this.nextField_ == a);
    c(b, this);
    this.error_ ||
    this.nextWireType_ == BinaryConstants.WireType.END_GROUP ||
    (asserts.fail("Group submessage did not end with an END_GROUP tag"),
        (this.error_ = !0));
  };
  getFieldDecoder = function() {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.DELIMITED
    );
    var a = this.decoder_.readUnsignedVarint32(),
        b = this.decoder_.getCursor(),
        c = b + a;
    a = BinaryDecoder.alloc(this.decoder_.getBuffer(), b, a);
    this.decoder_.setCursor(c);
    return a;
  };
  readInt32 = function() {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.VARINT
    );
    return this.decoder_.readSignedVarint32();
  };
  readInt32String = function() {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.VARINT
    );
    return this.decoder_.readSignedVarint32String();
  };
  readInt64 = function() {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.VARINT
    );
    return this.decoder_.readSignedVarint64();
  };
  readInt64String = function() {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.VARINT
    );
    return this.decoder_.readSignedVarint64String();
  };
  readUint32 = function() {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.VARINT
    );
    return this.decoder_.readUnsignedVarint32();
  };
  readUint32String = function() {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.VARINT
    );
    return this.decoder_.readUnsignedVarint32String();
  };
  readUint64 = function() {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.VARINT
    );
    return this.decoder_.readUnsignedVarint64();
  };
  readUint64String = function() {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.VARINT
    );
    return this.decoder_.readUnsignedVarint64String();
  };
  readSint32 = function() {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.VARINT
    );
    return this.decoder_.readZigzagVarint32();
  };
  readSint64 = function() {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.VARINT
    );
    return this.decoder_.readZigzagVarint64();
  };
  readSint64String = function() {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.VARINT
    );
    return this.decoder_.readZigzagVarint64String();
  };
  readFixed32 = function() {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.FIXED32
    );
    return this.decoder_.readUint32();
  };
  readFixed64 = function() {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.FIXED64
    );
    return this.decoder_.readUint64();
  };
  readFixed64String = function() {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.FIXED64
    );
    return this.decoder_.readUint64String();
  };
  readSfixed32 = function() {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.FIXED32
    );
    return this.decoder_.readInt32();
  };
  readSfixed32String = function() {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.FIXED32
    );
    return this.decoder_.readInt32().toString();
  };
  readSfixed64 = function() {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.FIXED64
    );
    return this.decoder_.readInt64();
  };
  readSfixed64String = function() {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.FIXED64
    );
    return this.decoder_.readInt64String();
  };
  readFloat = function() {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.FIXED32
    );
    return this.decoder_.readFloat();
  };
  readDouble = function() {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.FIXED64
    );
    return this.decoder_.readDouble();
  };
  readBool = function() {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.VARINT
    );
    return !!this.decoder_.readUnsignedVarint32();
  };
  readEnum = function() {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.VARINT
    );
    return this.decoder_.readSignedVarint64();
  };
  readString = function() {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.DELIMITED
    );
    var a = this.decoder_.readUnsignedVarint32();
    return this.decoder_.readString(a);
  };
  readBytes = function() {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.DELIMITED
    );
    var a = this.decoder_.readUnsignedVarint32();
    return this.decoder_.readBytes(a);
  };
  readVarintHash64 = function() {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.VARINT
    );
    return this.decoder_.readVarintHash64();
  };
  readSintHash64 = function() {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.VARINT
    );
    return this.decoder_.readZigzagVarintHash64();
  };
  readSplitVarint64 = function(a) {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.VARINT
    );
    return this.decoder_.readSplitVarint64(a);
  };
  readSplitZigzagVarint64 = function(a) {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.VARINT
    );
    return this.decoder_.readSplitVarint64(function(b, c) {
      return utils.fromZigzag64(b, c, a);
    });
  };
  readFixedHash64 = function() {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.FIXED64
    );
    return this.decoder_.readFixedHash64();
  };
  readSplitFixed64 = function(a) {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.FIXED64
    );
    return this.decoder_.readSplitFixed64(a);
  };
  readPackedField_ = function(a) {
    asserts.assert(
        this.nextWireType_ == BinaryConstants.WireType.DELIMITED
    );
    var b = this.decoder_.readUnsignedVarint32();
    b = this.decoder_.getCursor() + b;
    for (var c = []; this.decoder_.getCursor() < b; )
      c.push(a.call(this.decoder_));
    return c;
  };
  readPackedInt32 = function() {
    return this.readPackedField_(this.decoder_.readSignedVarint32);
  };
  readPackedInt32String = function() {
    return this.readPackedField_(this.decoder_.readSignedVarint32String);
  };
  readPackedInt64 = function() {
    return this.readPackedField_(this.decoder_.readSignedVarint64);
  };
  readPackedInt64String = function() {
    return this.readPackedField_(this.decoder_.readSignedVarint64String);
  };
  readPackedUint32 = function() {
    return this.readPackedField_(this.decoder_.readUnsignedVarint32);
  };
  readPackedUint32String = function() {
    return this.readPackedField_(this.decoder_.readUnsignedVarint32String);
  };
  readPackedUint64 = function() {
    return this.readPackedField_(this.decoder_.readUnsignedVarint64);
  };
  readPackedUint64String = function() {
    return this.readPackedField_(this.decoder_.readUnsignedVarint64String);
  };
  readPackedSint32 = function() {
    return this.readPackedField_(this.decoder_.readZigzagVarint32);
  };
  readPackedSint64 = function() {
    return this.readPackedField_(this.decoder_.readZigzagVarint64);
  };
  readPackedSint64String = function() {
    return this.readPackedField_(this.decoder_.readZigzagVarint64String);
  };
  readPackedFixed32 = function() {
    return this.readPackedField_(this.decoder_.readUint32);
  };
  readPackedFixed64 = function() {
    return this.readPackedField_(this.decoder_.readUint64);
  };
  readPackedFixed64String = function() {
    return this.readPackedField_(this.decoder_.readUint64String);
  };
  readPackedSfixed32 = function() {
    return this.readPackedField_(this.decoder_.readInt32);
  };
  readPackedSfixed64 = function() {
    return this.readPackedField_(this.decoder_.readInt64);
  };
  readPackedSfixed64String = function() {
    return this.readPackedField_(this.decoder_.readInt64String);
  };
  readPackedFloat = function() {
    return this.readPackedField_(this.decoder_.readFloat);
  };
  readPackedDouble = function() {
    return this.readPackedField_(this.decoder_.readDouble);
  };
  readPackedBool = function() {
    return this.readPackedField_(this.decoder_.readBool);
  };
  readPackedEnum = function() {
    return this.readPackedField_(this.decoder_.readEnum);
  };
  readPackedVarintHash64 = function() {
    return this.readPackedField_(this.decoder_.readVarintHash64);
  };
  readPackedFixedHash64 = function() {
    return this.readPackedField_(this.decoder_.readFixedHash64);
  };
}


class BinaryEncoder{
  buffer_
  constructor() {
    this.buffer_ = [];
  }

  length = function() {
    return this.buffer_.length;
  };
  end = function() {
    var a = this.buffer_;
    this.buffer_ = [];
    return a;
  };
  writeSplitVarint64 = function(a, b) {
    asserts.assert(a == Math.floor(a));
    asserts.assert(b == Math.floor(b));
    asserts.assert(0 <= a && a < BinaryConstants.TWO_TO_32);
    for (
        asserts.assert(0 <= b && b < BinaryConstants.TWO_TO_32);
        0 < b || 127 < a;

    )
      this.buffer_.push((a & 127) | 128),
          (a = ((a >>> 7) | (b << 25)) >>> 0),
          (b >>>= 7);
    this.buffer_.push(a);
  };
  writeSplitFixed64 = function(a, b) {
    asserts.assert(a == Math.floor(a));
    asserts.assert(b == Math.floor(b));
    asserts.assert(0 <= a && a < BinaryConstants.TWO_TO_32);
    asserts.assert(0 <= b && b < BinaryConstants.TWO_TO_32);
    this.writeUint32(a);
    this.writeUint32(b);
  };
  writeUnsignedVarint32 = function(a) {
    asserts.assert(a == Math.floor(a));
    for (
        asserts.assert(0 <= a && a < BinaryConstants.TWO_TO_32);
        127 < a;

    )
      this.buffer_.push((a & 127) | 128), (a >>>= 7);
    this.buffer_.push(a);
  };
  writeSignedVarint32 = function(a) {
    asserts.assert(a == Math.floor(a));
    asserts.assert(
        a >= -BinaryConstants.TWO_TO_31 && a < BinaryConstants.TWO_TO_31
    );
    if (0 <= a) this.writeUnsignedVarint32(a);
    else {
      for (var b = 0; 9 > b; b++) this.buffer_.push((a & 127) | 128), (a >>= 7);
      this.buffer_.push(1);
    }
  };
  writeUnsignedVarint64 = function(a) {
    asserts.assert(a == Math.floor(a));
    asserts.assert(0 <= a && a < BinaryConstants.TWO_TO_64);
    utils.splitInt64(a);
    this.writeSplitVarint64(utils.split64Low, utils.split64High);
  };
  writeSignedVarint64 = function(a) {
    asserts.assert(a == Math.floor(a));
    asserts.assert(
        a >= -BinaryConstants.TWO_TO_63 && a < BinaryConstants.TWO_TO_63
    );
    utils.splitInt64(a);
    this.writeSplitVarint64(utils.split64Low, utils.split64High);
  };
  writeZigzagVarint32 = function(a) {
    asserts.assert(a == Math.floor(a));
    asserts.assert(
        a >= -BinaryConstants.TWO_TO_31 && a < BinaryConstants.TWO_TO_31
    );
    this.writeUnsignedVarint32(((a << 1) ^ (a >> 31)) >>> 0);
  };
  writeZigzagVarint64 = function(a) {
    asserts.assert(a == Math.floor(a));
    asserts.assert(
        a >= -BinaryConstants.TWO_TO_63 && a < BinaryConstants.TWO_TO_63
    );
    utils.splitZigzag64(a);
    this.writeSplitVarint64(utils.split64Low, utils.split64High);
  };
  writeZigzagVarint64String = function(a) {
    this.writeZigzagVarintHash64(utils.decimalStringToHash64(a));
  };
  writeZigzagVarintHash64 = function(a) {
    var b = this;
    utils.splitHash64(a);
    utils.toZigzag64(utils.split64Low, utils.split64High, function(
        a,
        d
    ) {
      b.writeSplitVarint64(a >>> 0, d >>> 0);
    });
  };
  writeUint8 = function(a) {
    asserts.assert(a == Math.floor(a));
    asserts.assert(0 <= a && 256 > a);
    this.buffer_.push((a >>> 0) & 255);
  };
  writeUint16 = function(a) {
    asserts.assert(a == Math.floor(a));
    asserts.assert(0 <= a && 65536 > a);
    this.buffer_.push((a >>> 0) & 255);
    this.buffer_.push((a >>> 8) & 255);
  };
  writeUint32 = function(a) {
    asserts.assert(a == Math.floor(a));
    asserts.assert(0 <= a && a < BinaryConstants.TWO_TO_32);
    this.buffer_.push((a >>> 0) & 255);
    this.buffer_.push((a >>> 8) & 255);
    this.buffer_.push((a >>> 16) & 255);
    this.buffer_.push((a >>> 24) & 255);
  };
  writeUint64 = function(a) {
    asserts.assert(a == Math.floor(a));
    asserts.assert(0 <= a && a < BinaryConstants.TWO_TO_64);
    utils.splitUint64(a);
    this.writeUint32(utils.split64Low);
    this.writeUint32(utils.split64High);
  };
  writeInt8 = function(a) {
    asserts.assert(a == Math.floor(a));
    asserts.assert(-128 <= a && 128 > a);
    this.buffer_.push((a >>> 0) & 255);
  };
  writeInt16 = function(a) {
    asserts.assert(a == Math.floor(a));
    asserts.assert(-32768 <= a && 32768 > a);
    this.buffer_.push((a >>> 0) & 255);
    this.buffer_.push((a >>> 8) & 255);
  };
  writeInt32 = function(a) {
    asserts.assert(a == Math.floor(a));
    asserts.assert(
        a >= -BinaryConstants.TWO_TO_31 && a < BinaryConstants.TWO_TO_31
    );
    this.buffer_.push((a >>> 0) & 255);
    this.buffer_.push((a >>> 8) & 255);
    this.buffer_.push((a >>> 16) & 255);
    this.buffer_.push((a >>> 24) & 255);
  };
  writeInt64 = function(a) {
    asserts.assert(a == Math.floor(a));
    asserts.assert(
        a >= -BinaryConstants.TWO_TO_63 && a < BinaryConstants.TWO_TO_63
    );
    utils.splitInt64(a);
    this.writeSplitFixed64(utils.split64Low, utils.split64High);
  };
  writeInt64String = function(a) {
    asserts.assert(a == Math.floor(a));
    asserts.assert(
        +a >= -BinaryConstants.TWO_TO_63 && +a < BinaryConstants.TWO_TO_63
    );
    utils.splitHash64(utils.decimalStringToHash64(a));
    this.writeSplitFixed64(utils.split64Low, utils.split64High);
  };
  writeFloat = function(a) {
    asserts.assert(
        Infinity === a ||
        -Infinity === a ||
        isNaN(a) ||
        (a >= -BinaryConstants.FLOAT32_MAX &&
            a <= BinaryConstants.FLOAT32_MAX)
    );
    utils.splitFloat32(a);
    this.writeUint32(utils.split64Low);
  };
  writeDouble = function(a) {
    asserts.assert(
        Infinity === a ||
        -Infinity === a ||
        isNaN(a) ||
        (a >= -BinaryConstants.FLOAT64_MAX &&
            a <= BinaryConstants.FLOAT64_MAX)
    );
    utils.splitFloat64(a);
    this.writeUint32(utils.split64Low);
    this.writeUint32(utils.split64High);
  };
  writeBool = function(a) {
    asserts.assert("boolean" === typeof a || "number" === typeof a);
    this.buffer_.push(a ? 1 : 0);
  };
  writeEnum = function(a) {
    asserts.assert(a == Math.floor(a));
    asserts.assert(
        a >= -BinaryConstants.TWO_TO_31 && a < BinaryConstants.TWO_TO_31
    );
    this.writeSignedVarint32(a);
  };
  writeBytes = function(a) {
    this.buffer_.push.apply(this.buffer_, a);
  };
  writeVarintHash64 = function(a) {
    utils.splitHash64(a);
    this.writeSplitVarint64(utils.split64Low, utils.split64High);
  };
  writeFixedHash64 = function(a) {
    utils.splitHash64(a);
    this.writeUint32(utils.split64Low);
    this.writeUint32(utils.split64High);
  };
  writeString = function(a) {
    for (var b = this.buffer_.length, c = 0; c < a.length; c++) {
      var d = a.charCodeAt(c);
      if (128 > d) this.buffer_.push(d);
      else if (2048 > d)
        this.buffer_.push((d >> 6) | 192), this.buffer_.push((d & 63) | 128);
      else if (65536 > d)
        if (55296 <= d && 56319 >= d && c + 1 < a.length) {
          var e = a.charCodeAt(c + 1);
          56320 <= e &&
          57343 >= e &&
          ((d = 1024 * (d - 55296) + e - 56320 + 65536),
              this.buffer_.push((d >> 18) | 240),
              this.buffer_.push(((d >> 12) & 63) | 128),
              this.buffer_.push(((d >> 6) & 63) | 128),
              this.buffer_.push((d & 63) | 128),
              c++);
        } else
          this.buffer_.push((d >> 12) | 224),
              this.buffer_.push(((d >> 6) & 63) | 128),
              this.buffer_.push((d & 63) | 128);
    }
    return this.buffer_.length - b;
  };
}

export class BinaryWriter{
  blocks_
  totalLength_
  encoder_
  bookmarks_
  constructor() {
    this.blocks_ = [];
    this.totalLength_ = 0;
    this.encoder_ = new BinaryEncoder();
    this.bookmarks_ = [];
  }

  appendUint8Array_ = function(a) {
    var b = this.encoder_.end();
    this.blocks_.push(b);
    this.blocks_.push(a);
    this.totalLength_ += b.length + a.length;
  };
  beginDelimited_ = function(a) {
    this.writeFieldHeader_(a, BinaryConstants.WireType.DELIMITED);
    a = this.encoder_.end();
    this.blocks_.push(a);
    this.totalLength_ += a.length;
    a.push(this.totalLength_);
    return a;
  };
  endDelimited_ = function(a) {
    var b = a.pop();
    b = this.totalLength_ + this.encoder_.length() - b;
    for (asserts.assert(0 <= b); 127 < b; )
      a.push((b & 127) | 128), (b >>>= 7), this.totalLength_++;
    a.push(b);
    this.totalLength_++;
  };
  writeSerializedMessage = function(a, b, c) {
    this.appendUint8Array_(a.subarray(b, c));
  };
  maybeWriteSerializedMessage = function(a, b, c) {
    null != a && null != b && null != c && this.writeSerializedMessage(a, b, c);
  };
  reset = function() {
    this.blocks_ = [];
    this.encoder_.end();
    this.totalLength_ = 0;
    this.bookmarks_ = [];
  };
  getResultBuffer = function() {
    asserts.assert(0 == this.bookmarks_.length);
    for (
        var a = new Uint8Array(this.totalLength_ + this.encoder_.length()),
            b = this.blocks_,
            c = b.length,
            d = 0,
            e = 0;
        e < c;
        e++
    ) {
      var f = b[e];
      a.set(f, d);
      d += f.length;
    }
    b = this.encoder_.end();
    a.set(b, d);
    d += b.length;
    asserts.assert(d == a.length);
    this.blocks_ = [a];
    return a;
  };
  getResultBase64String = function(a) {
    return base64.encodeByteArray(this.getResultBuffer(), a);
  };
  beginSubMessage = function(a) {
    this.bookmarks_.push(this.beginDelimited_(a));
  };
  endSubMessage = function() {
    asserts.assert(0 <= this.bookmarks_.length);
    this.endDelimited_(this.bookmarks_.pop());
  };
  writeFieldHeader_ = function(a, b) {
    asserts.assert(1 <= a && a == Math.floor(a));
    this.encoder_.writeUnsignedVarint32(8 * a + b);
  };
  writeAny = function(a, b, c) {
    var d = BinaryConstants.FieldType;
    switch (a) {
      case d.DOUBLE:
        this.writeDouble(b, c);
        break;
      case d.FLOAT:
        this.writeFloat(b, c);
        break;
      case d.INT64:
        this.writeInt64(b, c);
        break;
      case d.UINT64:
        this.writeUint64(b, c);
        break;
      case d.INT32:
        this.writeInt32(b, c);
        break;
      case d.FIXED64:
        this.writeFixed64(b, c);
        break;
      case d.FIXED32:
        this.writeFixed32(b, c);
        break;
      case d.BOOL:
        this.writeBool(b, c);
        break;
      case d.STRING:
        this.writeString(b, c);
        break;
      case d.GROUP:
        asserts.fail("Group field type not supported in writeAny()");
        break;
      case d.MESSAGE:
        asserts.fail("Message field type not supported in writeAny()");
        break;
      case d.BYTES:
        this.writeBytes(b, c);
        break;
      case d.UINT32:
        this.writeUint32(b, c);
        break;
      case d.ENUM:
        this.writeEnum(b, c);
        break;
      case d.SFIXED32:
        this.writeSfixed32(b, c);
        break;
      case d.SFIXED64:
        this.writeSfixed64(b, c);
        break;
      case d.SINT32:
        this.writeSint32(b, c);
        break;
      case d.SINT64:
        this.writeSint64(b, c);
        break;
      case d.FHASH64:
        this.writeFixedHash64(b, c);
        break;
      case d.VHASH64:
        this.writeVarintHash64(b, c);
        break;
      default:
        asserts.fail("Invalid field type in writeAny()");
    }
  };
  writeUnsignedVarint32_ = function(a, b) {
    null != b &&
    (this.writeFieldHeader_(a, BinaryConstants.WireType.VARINT),
        this.encoder_.writeUnsignedVarint32(b));
  };
  writeSignedVarint32_ = function(a, b) {
    null != b &&
    (this.writeFieldHeader_(a, BinaryConstants.WireType.VARINT),
        this.encoder_.writeSignedVarint32(b));
  };
  writeUnsignedVarint64_ = function(a, b) {
    null != b &&
    (this.writeFieldHeader_(a, BinaryConstants.WireType.VARINT),
        this.encoder_.writeUnsignedVarint64(b));
  };
  writeSignedVarint64_ = function(a, b) {
    null != b &&
    (this.writeFieldHeader_(a, BinaryConstants.WireType.VARINT),
        this.encoder_.writeSignedVarint64(b));
  };
  writeZigzagVarint32_ = function(a, b) {
    null != b &&
    (this.writeFieldHeader_(a, BinaryConstants.WireType.VARINT),
        this.encoder_.writeZigzagVarint32(b));
  };
  writeZigzagVarint64_ = function(a, b) {
    null != b &&
    (this.writeFieldHeader_(a, BinaryConstants.WireType.VARINT),
        this.encoder_.writeZigzagVarint64(b));
  };
  writeZigzagVarint64String_ = function(a, b) {
    null != b &&
    (this.writeFieldHeader_(a, BinaryConstants.WireType.VARINT),
        this.encoder_.writeZigzagVarint64String(b));
  };
  writeZigzagVarintHash64_ = function(a, b) {
    null != b &&
    (this.writeFieldHeader_(a, BinaryConstants.WireType.VARINT),
        this.encoder_.writeZigzagVarintHash64(b));
  };
  writeInt32 = function(a, b) {
    null != b &&
    (asserts.assert(
        b >= -BinaryConstants.TWO_TO_31 && b < BinaryConstants.TWO_TO_31
    ),
        this.writeSignedVarint32_(a, b));
  };
  writeInt32String = function(a, b) {
    null != b &&
    ((b = parseInt(b, 10)),
        asserts.assert(
            b >= -BinaryConstants.TWO_TO_31 && b < BinaryConstants.TWO_TO_31
        ),
        this.writeSignedVarint32_(a, b));
  };
  writeInt64 = function(a, b) {
    null != b &&
    (asserts.assert(
        b >= -BinaryConstants.TWO_TO_63 && b < BinaryConstants.TWO_TO_63
    ),
        this.writeSignedVarint64_(a, b));
  };
  writeInt64String = function(a, b) {
    null != b &&
    ((b = Int64.fromString(b)),
        this.writeFieldHeader_(a, BinaryConstants.WireType.VARINT),
        this.encoder_.writeSplitVarint64(b.lo, b.hi));
  };
  writeUint32 = function(a, b) {
    null != b &&
    (asserts.assert(0 <= b && b < BinaryConstants.TWO_TO_32),
        this.writeUnsignedVarint32_(a, b));
  };
  writeUint32String = function(a, b) {
    null != b &&
    ((b = parseInt(b, 10)),
        asserts.assert(0 <= b && b < BinaryConstants.TWO_TO_32),
        this.writeUnsignedVarint32_(a, b));
  };
  writeUint64 = function(a, b) {
    null != b &&
    (asserts.assert(0 <= b && b < BinaryConstants.TWO_TO_64),
        this.writeUnsignedVarint64_(a, b));
  };
  writeUint64String = function(a, b) {
    null != b &&
    ((b = UInt64.fromString(b)),
        this.writeFieldHeader_(a, BinaryConstants.WireType.VARINT),
        this.encoder_.writeSplitVarint64(b.lo, b.hi));
  };
  writeSint32 = function(a, b) {
    null != b &&
    (asserts.assert(
        b >= -BinaryConstants.TWO_TO_31 && b < BinaryConstants.TWO_TO_31
    ),
        this.writeZigzagVarint32_(a, b));
  };
  writeSint64 = function(a, b) {
    null != b &&
    (asserts.assert(
        b >= -BinaryConstants.TWO_TO_63 && b < BinaryConstants.TWO_TO_63
    ),
        this.writeZigzagVarint64_(a, b));
  };
  writeSintHash64 = function(a, b) {
    null != b && this.writeZigzagVarintHash64_(a, b);
  };
  writeSint64String = function(a, b) {
    null != b && this.writeZigzagVarint64String_(a, b);
  };
  writeFixed32 = function(a, b) {
    null != b &&
    (asserts.assert(0 <= b && b < BinaryConstants.TWO_TO_32),
        this.writeFieldHeader_(a, BinaryConstants.WireType.FIXED32),
        this.encoder_.writeUint32(b));
  };
  writeFixed64 = function(a, b) {
    null != b &&
    (asserts.assert(0 <= b && b < BinaryConstants.TWO_TO_64),
        this.writeFieldHeader_(a, BinaryConstants.WireType.FIXED64),
        this.encoder_.writeUint64(b));
  };
  writeFixed64String = function(a, b) {
    null != b &&
    ((b = UInt64.fromString(b)),
        this.writeFieldHeader_(a, BinaryConstants.WireType.FIXED64),
        this.encoder_.writeSplitFixed64(b.lo, b.hi));
  };
  writeSfixed32 = function(a, b) {
    null != b &&
    (asserts.assert(
        b >= -BinaryConstants.TWO_TO_31 && b < BinaryConstants.TWO_TO_31
    ),
        this.writeFieldHeader_(a, BinaryConstants.WireType.FIXED32),
        this.encoder_.writeInt32(b));
  };
  writeSfixed64 = function(a, b) {
    null != b &&
    (asserts.assert(
        b >= -BinaryConstants.TWO_TO_63 && b < BinaryConstants.TWO_TO_63
    ),
        this.writeFieldHeader_(a, BinaryConstants.WireType.FIXED64),
        this.encoder_.writeInt64(b));
  };
  writeSfixed64String = function(a, b) {
    null != b &&
    ((b = Int64.fromString(b)),
        this.writeFieldHeader_(a, BinaryConstants.WireType.FIXED64),
        this.encoder_.writeSplitFixed64(b.lo, b.hi));
  };
  writeFloat = function(a, b) {
    null != b &&
    (this.writeFieldHeader_(a, BinaryConstants.WireType.FIXED32),
        this.encoder_.writeFloat(b));
  };
  writeDouble = function(a, b) {
    null != b &&
    (this.writeFieldHeader_(a, BinaryConstants.WireType.FIXED64),
        this.encoder_.writeDouble(b));
  };
  writeBool = function(a, b) {
    null != b &&
    (asserts.assert("boolean" === typeof b || "number" === typeof b),
        this.writeFieldHeader_(a, BinaryConstants.WireType.VARINT),
        this.encoder_.writeBool(b));
  };
  writeEnum = function(a, b) {
    null != b &&
    (asserts.assert(
        b >= -BinaryConstants.TWO_TO_31 && b < BinaryConstants.TWO_TO_31
    ),
        this.writeFieldHeader_(a, BinaryConstants.WireType.VARINT),
        this.encoder_.writeSignedVarint32(b));
  };
  writeString = function(a, b) {
    null != b &&
    ((a = this.beginDelimited_(a)),
        this.encoder_.writeString(b),
        this.endDelimited_(a));
  };
  writeBytes = function(a, b) {
    null != b &&
    ((b = utils.byteSourceToUint8Array(b)),
        this.writeFieldHeader_(a, BinaryConstants.WireType.DELIMITED),
        this.encoder_.writeUnsignedVarint32(b.length),
        this.appendUint8Array_(b));
  };
  writeMessage = function(a, b, c) {
    null != b &&
    ((a = this.beginDelimited_(a)), c(this), this.endDelimited_(a));
  };
  writeMessageSet = function(a, b, c) {
    null != b &&
    (this.writeFieldHeader_(1, BinaryConstants.WireType.START_GROUP),
        this.writeFieldHeader_(2, BinaryConstants.WireType.VARINT),
        this.encoder_.writeSignedVarint32(a),
        (a = this.beginDelimited_(3)),
        c(b, this),
        this.endDelimited_(a),
        this.writeFieldHeader_(1, BinaryConstants.WireType.END_GROUP));
  };
  writeGroup = function(a, b, c) {
    null != b &&
    (this.writeFieldHeader_(a, BinaryConstants.WireType.START_GROUP),
        c(b, this),
        this.writeFieldHeader_(a, BinaryConstants.WireType.END_GROUP));
  };
  writeFixedHash64 = function(a, b) {
    null != b &&
    (asserts.assert(8 == b.length),
        this.writeFieldHeader_(a, BinaryConstants.WireType.FIXED64),
        this.encoder_.writeFixedHash64(b));
  };
  writeVarintHash64 = function(a, b) {
    null != b &&
    (asserts.assert(8 == b.length),
        this.writeFieldHeader_(a, BinaryConstants.WireType.VARINT),
        this.encoder_.writeVarintHash64(b));
  };
  writeSplitFixed64 = function(a, b, c) {
    this.writeFieldHeader_(a, BinaryConstants.WireType.FIXED64);
    this.encoder_.writeSplitFixed64(b, c);
  };
  writeSplitVarint64 = function(a, b, c) {
    this.writeFieldHeader_(a, BinaryConstants.WireType.VARINT);
    this.encoder_.writeSplitVarint64(b, c);
  };
  writeSplitZigzagVarint64 = function(a, b, c) {
    this.writeFieldHeader_(a, BinaryConstants.WireType.VARINT);
    var d = this.encoder_;
    utils.toZigzag64(b, c, function(a, b) {
      d.writeSplitVarint64(a >>> 0, b >>> 0);
    });
  };
  writeRepeatedInt32 = function(a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) this.writeSignedVarint32_(a, b[c]);
  };
  writeRepeatedInt32String = function(a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) this.writeInt32String(a, b[c]);
  };
  writeRepeatedInt64 = function(a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) this.writeSignedVarint64_(a, b[c]);
  };
  writeRepeatedSplitFixed64 = function(a, b, c, d) {
    if (null != b)
      for (var e = 0; e < b.length; e++)
        this.writeSplitFixed64(a, c(b[e]), d(b[e]));
  };
  writeRepeatedSplitVarint64 = function(a, b, c, d) {
    if (null != b)
      for (var e = 0; e < b.length; e++)
        this.writeSplitVarint64(a, c(b[e]), d(b[e]));
  };
  writeRepeatedSplitZigzagVarint64 = function(
      a,
      b,
      c,
      d
  ) {
    if (null != b)
      for (var e = 0; e < b.length; e++)
        this.writeSplitZigzagVarint64(a, c(b[e]), d(b[e]));
  };
  writeRepeatedInt64String = function(a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) this.writeInt64String(a, b[c]);
  };
  writeRepeatedUint32 = function(a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) this.writeUnsignedVarint32_(a, b[c]);
  };
  writeRepeatedUint32String = function(a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) this.writeUint32String(a, b[c]);
  };
  writeRepeatedUint64 = function(a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) this.writeUnsignedVarint64_(a, b[c]);
  };
  writeRepeatedUint64String = function(a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) this.writeUint64String(a, b[c]);
  };
  writeRepeatedSint32 = function(a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) this.writeZigzagVarint32_(a, b[c]);
  };
  writeRepeatedSint64 = function(a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) this.writeZigzagVarint64_(a, b[c]);
  };
  writeRepeatedSint64String = function(a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) this.writeZigzagVarint64String_(a, b[c]);
  };
  writeRepeatedSintHash64 = function(a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) this.writeZigzagVarintHash64_(a, b[c]);
  };
  writeRepeatedFixed32 = function(a, b) {
    if (null != b) for (var c = 0; c < b.length; c++) this.writeFixed32(a, b[c]);
  };
  writeRepeatedFixed64 = function(a, b) {
    if (null != b) for (var c = 0; c < b.length; c++) this.writeFixed64(a, b[c]);
  };
  writeRepeatedFixed64String = function(a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) this.writeFixed64String(a, b[c]);
  };
  writeRepeatedSfixed32 = function(a, b) {
    if (null != b) for (var c = 0; c < b.length; c++) this.writeSfixed32(a, b[c]);
  };
  writeRepeatedSfixed64 = function(a, b) {
    if (null != b) for (var c = 0; c < b.length; c++) this.writeSfixed64(a, b[c]);
  };
  writeRepeatedSfixed64String = function(a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) this.writeSfixed64String(a, b[c]);
  };
  writeRepeatedFloat = function(a, b) {
    if (null != b) for (var c = 0; c < b.length; c++) this.writeFloat(a, b[c]);
  };
  writeRepeatedDouble = function(a, b) {
    if (null != b) for (var c = 0; c < b.length; c++) this.writeDouble(a, b[c]);
  };
  writeRepeatedBool = function(a, b) {
    if (null != b) for (var c = 0; c < b.length; c++) this.writeBool(a, b[c]);
  };
  writeRepeatedEnum = function(a, b) {
    if (null != b) for (var c = 0; c < b.length; c++) this.writeEnum(a, b[c]);
  };
  writeRepeatedString = function(a, b) {
    if (null != b) for (var c = 0; c < b.length; c++) this.writeString(a, b[c]);
  };
  writeRepeatedBytes = function(a, b) {
    if (null != b) for (var c = 0; c < b.length; c++) this.writeBytes(a, b[c]);
  };
  writeRepeatedMessage = function(a, b, c) {
    if (null != b)
      for (var d = 0; d < b.length; d++) {
        var e = this.beginDelimited_(a);
        c(b[d], this);
        this.endDelimited_(e);
      }
  };
  writeRepeatedGroup = function(a, b, c) {
    if (null != b)
      for (var d = 0; d < b.length; d++)
        this.writeFieldHeader_(a, BinaryConstants.WireType.START_GROUP),
            c(b[d], this),
            this.writeFieldHeader_(a, BinaryConstants.WireType.END_GROUP);
  };
  writeRepeatedFixedHash64 = function(a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) this.writeFixedHash64(a, b[c]);
  };
  writeRepeatedVarintHash64 = function(a, b) {
    if (null != b)
      for (var c = 0; c < b.length; c++) this.writeVarintHash64(a, b[c]);
  };
  writePackedInt32 = function(a, b) {
    if (null != b && b.length) {
      a = this.beginDelimited_(a);
      for (var c = 0; c < b.length; c++) this.encoder_.writeSignedVarint32(b[c]);
      this.endDelimited_(a);
    }
  };
  writePackedInt32String = function(a, b) {
    if (null != b && b.length) {
      a = this.beginDelimited_(a);
      for (var c = 0; c < b.length; c++)
        this.encoder_.writeSignedVarint32(parseInt(b[c], 10));
      this.endDelimited_(a);
    }
  };
  writePackedInt64 = function(a, b) {
    if (null != b && b.length) {
      a = this.beginDelimited_(a);
      for (var c = 0; c < b.length; c++) this.encoder_.writeSignedVarint64(b[c]);
      this.endDelimited_(a);
    }
  };
  writePackedSplitFixed64 = function(a, b, c, d) {
    if (null != b) {
      a = this.beginDelimited_(a);
      for (var e = 0; e < b.length; e++)
        this.encoder_.writeSplitFixed64(c(b[e]), d(b[e]));
      this.endDelimited_(a);
    }
  };
  writePackedSplitVarint64 = function(a, b, c, d) {
    if (null != b) {
      a = this.beginDelimited_(a);
      for (var e = 0; e < b.length; e++)
        this.encoder_.writeSplitVarint64(c(b[e]), d(b[e]));
      this.endDelimited_(a);
    }
  };
  writePackedSplitZigzagVarint64 = function(
      a,
      b,
      c,
      d
  ) {
    if (null != b) {
      a = this.beginDelimited_(a);
      for (var e = this.encoder_, f = 0; f < b.length; f++)
        utils.toZigzag64(c(b[f]), d(b[f]), function(a, b) {
          e.writeSplitVarint64(a >>> 0, b >>> 0);
        });
      this.endDelimited_(a);
    }
  };
  writePackedInt64String = function(a, b) {
    if (null != b && b.length) {
      a = this.beginDelimited_(a);
      for (var c = 0; c < b.length; c++) {
        var d = Int64.fromString(b[c]);
        this.encoder_.writeSplitVarint64(d.lo, d.hi);
      }
      this.endDelimited_(a);
    }
  };
  writePackedUint32 = function(a, b) {
    if (null != b && b.length) {
      a = this.beginDelimited_(a);
      for (var c = 0; c < b.length; c++)
        this.encoder_.writeUnsignedVarint32(b[c]);
      this.endDelimited_(a);
    }
  };
  writePackedUint32String = function(a, b) {
    if (null != b && b.length) {
      a = this.beginDelimited_(a);
      for (var c = 0; c < b.length; c++)
        this.encoder_.writeUnsignedVarint32(parseInt(b[c], 10));
      this.endDelimited_(a);
    }
  };
  writePackedUint64 = function(a, b) {
    if (null != b && b.length) {
      a = this.beginDelimited_(a);
      for (var c = 0; c < b.length; c++)
        this.encoder_.writeUnsignedVarint64(b[c]);
      this.endDelimited_(a);
    }
  };
  writePackedUint64String = function(a, b) {
    if (null != b && b.length) {
      a = this.beginDelimited_(a);
      for (var c = 0; c < b.length; c++) {
        var d = UInt64.fromString(b[c]);
        this.encoder_.writeSplitVarint64(d.lo, d.hi);
      }
      this.endDelimited_(a);
    }
  };
  writePackedSint32 = function(a, b) {
    if (null != b && b.length) {
      a = this.beginDelimited_(a);
      for (var c = 0; c < b.length; c++) this.encoder_.writeZigzagVarint32(b[c]);
      this.endDelimited_(a);
    }
  };
  writePackedSint64 = function(a, b) {
    if (null != b && b.length) {
      a = this.beginDelimited_(a);
      for (var c = 0; c < b.length; c++) this.encoder_.writeZigzagVarint64(b[c]);
      this.endDelimited_(a);
    }
  };
  writePackedSint64String = function(a, b) {
    if (null != b && b.length) {
      a = this.beginDelimited_(a);
      for (var c = 0; c < b.length; c++)
        this.encoder_.writeZigzagVarintHash64(
            utils.decimalStringToHash64(b[c])
        );
      this.endDelimited_(a);
    }
  };
  writePackedSintHash64 = function(a, b) {
    if (null != b && b.length) {
      a = this.beginDelimited_(a);
      for (var c = 0; c < b.length; c++)
        this.encoder_.writeZigzagVarintHash64(b[c]);
      this.endDelimited_(a);
    }
  };
  writePackedFixed32 = function(a, b) {
    if (null != b && b.length)
      for (
          this.writeFieldHeader_(a, BinaryConstants.WireType.DELIMITED),
              this.encoder_.writeUnsignedVarint32(4 * b.length),
              a = 0;
          a < b.length;
          a++
      )
        this.encoder_.writeUint32(b[a]);
  };
  writePackedFixed64 = function(a, b) {
    if (null != b && b.length)
      for (
          this.writeFieldHeader_(a, BinaryConstants.WireType.DELIMITED),
              this.encoder_.writeUnsignedVarint32(8 * b.length),
              a = 0;
          a < b.length;
          a++
      )
        this.encoder_.writeUint64(b[a]);
  };
  writePackedFixed64String = function(a, b) {
    if (null != b && b.length)
      for (
          this.writeFieldHeader_(a, BinaryConstants.WireType.DELIMITED),
              this.encoder_.writeUnsignedVarint32(8 * b.length),
              a = 0;
          a < b.length;
          a++
      ) {
        var c = UInt64.fromString(b[a]);
        this.encoder_.writeSplitFixed64(c.lo, c.hi);
      }
  };
  writePackedSfixed32 = function(a, b) {
    if (null != b && b.length)
      for (
          this.writeFieldHeader_(a, BinaryConstants.WireType.DELIMITED),
              this.encoder_.writeUnsignedVarint32(4 * b.length),
              a = 0;
          a < b.length;
          a++
      )
        this.encoder_.writeInt32(b[a]);
  };
  writePackedSfixed64 = function(a, b) {
    if (null != b && b.length)
      for (
          this.writeFieldHeader_(a, BinaryConstants.WireType.DELIMITED),
              this.encoder_.writeUnsignedVarint32(8 * b.length),
              a = 0;
          a < b.length;
          a++
      )
        this.encoder_.writeInt64(b[a]);
  };
  writePackedSfixed64String = function(a, b) {
    if (null != b && b.length)
      for (
          this.writeFieldHeader_(a, BinaryConstants.WireType.DELIMITED),
              this.encoder_.writeUnsignedVarint32(8 * b.length),
              a = 0;
          a < b.length;
          a++
      )
        this.encoder_.writeInt64String(b[a]);
  };
  writePackedFloat = function(a, b) {
    if (null != b && b.length)
      for (
          this.writeFieldHeader_(a, BinaryConstants.WireType.DELIMITED),
              this.encoder_.writeUnsignedVarint32(4 * b.length),
              a = 0;
          a < b.length;
          a++
      )
        this.encoder_.writeFloat(b[a]);
  };
  writePackedDouble = function(a, b) {
    if (null != b && b.length)
      for (
          this.writeFieldHeader_(a, BinaryConstants.WireType.DELIMITED),
              this.encoder_.writeUnsignedVarint32(8 * b.length),
              a = 0;
          a < b.length;
          a++
      )
        this.encoder_.writeDouble(b[a]);
  };
  writePackedBool = function(a, b) {
    if (null != b && b.length)
      for (
          this.writeFieldHeader_(a, BinaryConstants.WireType.DELIMITED),
              this.encoder_.writeUnsignedVarint32(b.length),
              a = 0;
          a < b.length;
          a++
      )
        this.encoder_.writeBool(b[a]);
  };
  writePackedEnum = function(a, b) {
    if (null != b && b.length) {
      a = this.beginDelimited_(a);
      for (var c = 0; c < b.length; c++) this.encoder_.writeEnum(b[c]);
      this.endDelimited_(a);
    }
  };
  writePackedFixedHash64 = function(a, b) {
    if (null != b && b.length)
      for (
          this.writeFieldHeader_(a, BinaryConstants.WireType.DELIMITED),
              this.encoder_.writeUnsignedVarint32(8 * b.length),
              a = 0;
          a < b.length;
          a++
      )
        this.encoder_.writeFixedHash64(b[a]);
  };
  writePackedVarintHash64 = function(a, b) {
    if (null != b && b.length) {
      a = this.beginDelimited_(a);
      for (var c = 0; c < b.length; c++) this.encoder_.writeVarintHash64(b[c]);
      this.endDelimited_(a);
    }
  };
}

class  ArrayIteratorIterable_ {
  idx_
  arr_
  constructor(a) {
    this.idx_ = 0;
    this.arr_ = a;
  };
  next = function() {
    return this.idx_ < this.arr_.length
        ? { done: !1, value: this.arr_[this.idx_++] }
        : { done: !0, value: void 0 };
  };
}

"undefined" != typeof Symbol && (ArrayIteratorIterable_.prototype[Symbol.iterator] = function () {
  return this
});

class Entry_ {
  key
  value
  valueWrapper
  constructor(a, b?) {
    this.key = a;
    this.value = b;
    this.valueWrapper = void 0;
  };
}

class Map {
  arr_
  valueCtor_
  map_
  arrClean
  constructor(a, b) {
    this.arr_ = a;
    this.valueCtor_ = b;
    this.map_ = {};
    this.arrClean = !0;
    0 < this.arr_.length && this.loadFromArray_();
  };

  loadFromArray_ = function() {
    for (var a = 0; a < this.arr_.length; a++) {
      var b = this.arr_[a],
          c = b[0];
      this.map_[c.toString()] = new Entry_(c, b[1]);
    }
    this.arrClean = !0;
  };
  toArray = function() {
    if (this.arrClean) {
      if (this.valueCtor_) {
        var a = this.map_,
            b;
        for (b in a)
          if (Object.prototype.hasOwnProperty.call(a, b)) {
            var c = a[b].valueWrapper;
            c && c.toArray();
          }
      }
    } else {
      this.arr_.length = 0;
      a = this.stringKeys_();
      a.sort();
      for (b = 0; b < a.length; b++) {
        var d = this.map_[a[b]];
        (c = d.valueWrapper) && c.toArray();
        this.arr_.push([d.key, d.value]);
      }
      this.arrClean = !0;
    }
    return this.arr_;
  };
  toObject = function(a, b) {
    for (var c = this.toArray(), d = [], e = 0; e < c.length; e++) {
      var f = this.map_[c[e][0].toString()];
      this.wrapEntry_(f);
      var g = f.valueWrapper;
      g
          ? (asserts.assert(b), d.push([f.key, b(a, g)]))
          : d.push([f.key, f.value]);
    }
    return d;
  };
  static fromObject = function(a, b, c) {
    b = new Map([], b);
    for (var d = 0; d < a.length; d++) {
      var e = a[d][0],
          f = c(a[d][1]);
      b.set(e, f);
    }
    return b;
  };

  getLength = function() {
    return this.stringKeys_().length;
  };
  clear = function() {
    this.map_ = {};
    this.arrClean = !1;
  };
  del = function(a) {
    a = a.toString();
    var b = this.map_.hasOwnProperty(a);
    delete this.map_[a];
    this.arrClean = !1;
    return b;
  };
  getEntryList = function() {
    var a = [],
        b = this.stringKeys_();
    b.sort();
    for (var c = 0; c < b.length; c++) {
      var d = this.map_[b[c]];
      a.push([d.key, d.value]);
    }
    return a;
  };
  entries = function() {
    var a = [],
        b = this.stringKeys_();
    b.sort();
    for (var c = 0; c < b.length; c++) {
      var d = this.map_[b[c]];
      a.push([d.key, this.wrapEntry_(d)]);
    }
    return new ArrayIteratorIterable_(a);
  };
  keys = function() {
    var a = [],
        b = this.stringKeys_();
    b.sort();
    for (var c = 0; c < b.length; c++) a.push(this.map_[b[c]].key);
    return new ArrayIteratorIterable_(a);
  };
  values = function() {
    var a = [],
        b = this.stringKeys_();
    b.sort();
    for (var c = 0; c < b.length; c++) a.push(this.wrapEntry_(this.map_[b[c]]));
    return new ArrayIteratorIterable_(a);
  };
  forEach = function(a, b) {
    var c = this.stringKeys_();
    c.sort();
    for (var d = 0; d < c.length; d++) {
      var e = this.map_[c[d]];
      a.call(b, this.wrapEntry_(e), e.key, this);
    }
  };
  set = function(a, b) {
    var c = new Entry_(a);
    this.valueCtor_
        ? ((c.valueWrapper = b), (c.value = b.toArray()))
        : (c.value = b);
    this.map_[a.toString()] = c;
    this.arrClean = !1;
    return this;
  };
  wrapEntry_ = function(a) {
    return this.valueCtor_
        ? (a.valueWrapper || (a.valueWrapper = new this.valueCtor_(a.value)),
            a.valueWrapper)
        : a.value;
  };
  get = function(a) {
    if ((a = this.map_[a.toString()])) return this.wrapEntry_(a);
  };
  has = function(a) {
    return a.toString() in this.map_;
  };
  serializeBinary = function(a, b, c, d, e) {
    var f = this.stringKeys_();
    f.sort();
    for (var g = 0; g < f.length; g++) {
      var h = this.map_[f[g]];
      b.beginSubMessage(a);
      c.call(b, 1, h.key);
      this.valueCtor_
          ? d.call(b, 2, this.wrapEntry_(h), e)
          : d.call(b, 2, h.value);
      b.endSubMessage();
    }
  };
  static deserializeBinary = function(a, b, c, d, e, f, g) {
    for (; b.nextField() && !b.isEndGroup(); ) {
      var h = b.getFieldNumber();
      1 == h
          ? (f = c.call(b))
          : 2 == h &&
          (a.valueCtor_
              ? (asserts.assert(e),
              g || (g = new a.valueCtor_()),
                  d.call(b, g, e))
              : (g = d.call(b)));
    }
    asserts.assert(void 0 != f);
    asserts.assert(void 0 != g);
    a.set(f, g);
  };
  stringKeys_ = function() {
    var a = this.map_,
        b = [],
        c;
    for (c in a) Object.prototype.hasOwnProperty.call(a, c) && b.push(c);
    return b;
  };
}

export class ExtensionFieldInfo {
  fieldIndex
  fieldName
  ctor
  toObjectFn
  isRepeated
  constructor(a, b, c, d, e) {
    this.fieldIndex = a;
    this.fieldName = b;
    this.ctor = c;
    this.toObjectFn = d;
    this.isRepeated = e;
  }
  isMessageType = function() {
    return !!this.ctor;
  };
};

export class ExtensionFieldBinaryInfo {
  fieldInfo
  binaryReaderFn
  binaryWriterFn
  binaryMessageSerializeFn
  binaryMessageDeserializeFn
  isPacked
  constructor(a, b, c, d, e, f) {
    this.fieldInfo = a;
    this.binaryReaderFn = b;
    this.binaryWriterFn = c;
    this.binaryMessageSerializeFn = d;
    this.binaryMessageDeserializeFn = e;
    this.isPacked = f;
  };
}

export class Message {

  static GENERATE_TO_OBJECT = !0;
  static GENERATE_FROM_OBJECT = !DISALLOW_TEST_ONLY_CODE;
  static GENERATE_TO_STRING = !0;
  static ASSUME_LOCAL_ARRAYS = !1;
  static SERIALIZE_EMPTY_TRAILING_FIELDS = !0;
  static SUPPORTS_UINT8ARRAY_ = "function" == typeof Uint8Array;
  getJsPbMessageId = function() {
    return this.messageId_;
  };
  static getIndex_ = function(a, b) {
    return b + a.arrayIndexOffset_;
  };
  static hiddenES6Property_ = function() {};
  static getFieldNumber_ = function(a, b) {
    return b - a.arrayIndexOffset_;
  };
  static initialize = function(a, b, c, d, e, f) {
    a.wrappers_ = null;
    b || (b = c ? [c] : []);
    a.messageId_ = c ? String(c) : void 0;
    a.arrayIndexOffset_ = 0 === c ? -1 : 0;
    a.array = b;
    Message.initPivotAndExtensionObject_(a, d);
    a.convertedPrimitiveFields_ = {};
    Message.SERIALIZE_EMPTY_TRAILING_FIELDS || (a.repeatedFields = e);
    if (e)
      for (b = 0; b < e.length; b++)
        (c = e[b]),
            c < a.pivot_
                ? ((c = Message.getIndex_(a, c)),
                    (a.array[c] = a.array[c] || Message.EMPTY_LIST_SENTINEL_))
                : (Message.maybeInitEmptyExtensionObject_(a),
                    (a.extensionObject_[c] =
                        a.extensionObject_[c] || Message.EMPTY_LIST_SENTINEL_));
    if (f && f.length)
      for (b = 0; b < f.length; b++) Message.computeOneofCase(a, f[b]);
  };
  static EMPTY_LIST_SENTINEL_ =
      DEBUG && Object.freeze ? Object.freeze([]) : [];
  static isArray_ = function(a) {
    return Message.ASSUME_LOCAL_ARRAYS
        ? a instanceof Array
        : isArray(a);
  };
  static isExtensionObject_ = function(a) {
    return (
        null !== a &&
        "object" == typeof a &&
        !Message.isArray_(a) &&
        !(Message.SUPPORTS_UINT8ARRAY_ && a instanceof Uint8Array)
    );
  };
  static initPivotAndExtensionObject_ = function(a, b) {
    var c = a.array.length,
        d = -1;
    if (
        c &&
        ((d = c - 1), (c = a.array[d]), Message.isExtensionObject_(c))
    ) {
      a.pivot_ = Message.getFieldNumber_(a, d);
      a.extensionObject_ = c;
      return;
    }
    -1 < b
        ? ((a.pivot_ = Math.max(b, Message.getFieldNumber_(a, d + 1))),
            (a.extensionObject_ = null))
        : (a.pivot_ = Number.MAX_VALUE);
  };
  static maybeInitEmptyExtensionObject_ = function(a) {
    var b = Message.getIndex_(a, a.pivot_);
    a.array[b] || (a.extensionObject_ = a.array[b] = {});
  };
  static toObjectList = function(a, b, c) {
    for (var d = [], e = 0; e < a.length; e++) d[e] = b.call(a[e], c, a[e]);
    return d;
  };
  static toObjectExtension = function(a, b, c, d, e) {
    for (var f in c) {
      var g = c[f],
          h = d.call(a, g);
      if (null != h) {
        for (var k in g.fieldName) if (g.fieldName.hasOwnProperty(k)) break;
        b[k] = g.toObjectFn
            ? g.isRepeated
                ? Message.toObjectList(h, g.toObjectFn, e)
                : g.toObjectFn(e, h)
            : h;
      }
    }
  };
  static serializeBinaryExtensions = function(a, b, c, d) {
    for (var e in c) {
      var f = c[e],
          g = f.fieldInfo;
      if (!f.binaryWriterFn)
        throw Error(
            "Message extension present that was generated without binary serialization support"
        );
      var h = d.call(a, g);
      if (null != h)
        if (g.isMessageType())
          if (f.binaryMessageSerializeFn)
            f.binaryWriterFn.call(b, g.fieldIndex, h, f.binaryMessageSerializeFn);
          else
            throw Error(
                "Message extension present holding submessage without binary support enabled, and message is being serialized to binary format"
            );
        else f.binaryWriterFn.call(b, g.fieldIndex, h);
    }
  };
  static readBinaryExtension = function(a, b, c, d, e) {
    var f = c[b.getFieldNumber()];
    if (f) {
      c = f.fieldInfo;
      if (!f.binaryReaderFn)
        throw Error(
            "Deserializing extension whose generated code does not support binary format"
        );
      if (c.isMessageType()) {
        var g = new c.ctor();
        f.binaryReaderFn.call(b, g, f.binaryMessageDeserializeFn);
      } else g = f.binaryReaderFn.call(b);
      c.isRepeated && !f.isPacked
          ? (b = d.call(a, c))
          ? b.push(g)
          : e.call(a, c, [g])
          : e.call(a, c, g);
    } else b.skipField();
  };
  static getField = function(a, b) {
    if (b < a.pivot_) {
      b = Message.getIndex_(a, b);
      var c = a.array[b];
      return c === Message.EMPTY_LIST_SENTINEL_ ? (a.array[b] = []) : c;
    }
    if (a.extensionObject_)
      return (
          (c = a.extensionObject_[b]),
              c === Message.EMPTY_LIST_SENTINEL_ ? (a.extensionObject_[b] = []) : c
      );
  };
  static getRepeatedField = function(a, b) {
    return Message.getField(a, b);
  };
  static getOptionalFloatingPointField = function(a, b) {
    a = Message.getField(a, b);
    return null == a ? a : +a;
  };
  static getBooleanField = function(a, b) {
    a = Message.getField(a, b);
    return null == a ? a : !!a;
  };
  static getRepeatedFloatingPointField = function(a, b) {
    var c = Message.getRepeatedField(a, b);
    a.convertedPrimitiveFields_ || (a.convertedPrimitiveFields_ = {});
    if (!a.convertedPrimitiveFields_[b]) {
      for (var d = 0; d < c.length; d++) c[d] = +c[d];
      a.convertedPrimitiveFields_[b] = !0;
    }
    return c;
  };
  static getRepeatedBooleanField = function(a, b) {
    var c = Message.getRepeatedField(a, b);
    a.convertedPrimitiveFields_ || (a.convertedPrimitiveFields_ = {});
    if (!a.convertedPrimitiveFields_[b]) {
      for (var d = 0; d < c.length; d++) c[d] = !!c[d];
      a.convertedPrimitiveFields_[b] = !0;
    }
    return c;
  };
  static bytesAsB64 = function(a) {
    if (null == a || "string" === typeof a) return a;
    if (Message.SUPPORTS_UINT8ARRAY_ && a instanceof Uint8Array)
      return base64.encodeByteArray(a);
    asserts.fail("Cannot coerce to b64 string: " + typeOf(a));
    return null;
  };
  static bytesAsU8 = function(a) {
    if (null == a || a instanceof Uint8Array) return a;
    if ("string" === typeof a)
      return base64.decodeStringToUint8Array(a);
    asserts.fail("Cannot coerce to Uint8Array: " + typeOf(a));
    return null;
  };
  static bytesListAsB64 = function(a) {
    Message.assertConsistentTypes_(a);
    return a.length && "string" !== typeof a[0]
        ? array.map(a, Message.bytesAsB64)
        : a;
  };
  static bytesListAsU8 = function(a) {
    Message.assertConsistentTypes_(a);
    return !a.length || a[0] instanceof Uint8Array
        ? a
        : array.map(a, Message.bytesAsU8);
  };
  static assertConsistentTypes_ = function(a) {
    if (DEBUG && a && 1 < a.length) {
      var b = typeOf(a[0]);
      array.forEach(a, function(a) {
        typeOf(a) != b &&
        asserts.fail(
            "Inconsistent type in JSPB repeated field array. Got " +
            typeOf(a) +
            " expected " +
            b
        );
      });
    }
  };
  static getFieldWithDefault = function(a, b, c) {
    a = Message.getField(a, b);
    return null == a ? c : a;
  };
  static getBooleanFieldWithDefault = function(a, b, c) {
    a = Message.getBooleanField(a, b);
    return null == a ? c : a;
  };
  static getFloatingPointFieldWithDefault = function(a, b, c) {
    a = Message.getOptionalFloatingPointField(a, b);
    return null == a ? c : a;
  };
  static getFieldProto3 = Message.getFieldWithDefault;
  static getMapField = function(a, b, c, d) {
    a.wrappers_ || (a.wrappers_ = {});
    if (b in a.wrappers_) return a.wrappers_[b];
    var e = Message.getField(a, b);
    if (!e) {
      if (c) return;
      e = [];
      Message.setField(a, b, e);
    }
    return (a.wrappers_[b] = new Map(e, d));
  };
  static setField = function(a, b, c) {
    asserts.assertInstanceof(a, Message);
    b < a.pivot_
        ? (a.array[Message.getIndex_(a, b)] = c)
        : (Message.maybeInitEmptyExtensionObject_(a),
            (a.extensionObject_[b] = c));
    return a;
  };
  static setProto3IntField = function(a, b, c) {
    return Message.setFieldIgnoringDefault_(a, b, c, 0);
  };
  static setProto3FloatField = function(a, b, c) {
    return Message.setFieldIgnoringDefault_(a, b, c, 0);
  };
  static setProto3BooleanField = function(a, b, c) {
    return Message.setFieldIgnoringDefault_(a, b, c, !1);
  };
  static setProto3StringField = function(a, b, c) {
    return Message.setFieldIgnoringDefault_(a, b, c, "");
  };
  static setProto3BytesField = function(a, b, c) {
    return Message.setFieldIgnoringDefault_(a, b, c, "");
  };
  static setProto3EnumField = function(a, b, c) {
    return Message.setFieldIgnoringDefault_(a, b, c, 0);
  };
  static setProto3StringIntField = function(a, b, c) {
    return Message.setFieldIgnoringDefault_(a, b, c, "0");
  };
  static setFieldIgnoringDefault_ = function(a, b, c, d) {
    asserts.assertInstanceof(a, Message);
    c !== d
        ? Message.setField(a, b, c)
        : (a.array[Message.getIndex_(a, b)] = null);
    return a;
  };
  static addToRepeatedField = function(a, b, c, d?) {
    asserts.assertInstanceof(a, Message);
    b = Message.getRepeatedField(a, b);
    void 0 != d ? b.splice(d, 0, c) : b.push(c);
    return a;
  };
  static setOneofField = function(a, b, c, d) {
    asserts.assertInstanceof(a, Message);
    (c = Message.computeOneofCase(a, c)) &&
    c !== b &&
    void 0 !== d &&
    (a.wrappers_ && c in a.wrappers_ && (a.wrappers_[c] = void 0),
        Message.setField(a, c, void 0));
    return Message.setField(a, b, d);
  };
  static computeOneofCase = function(a, b) {
    for (var c, d, e = 0; e < b.length; e++) {
      var f = b[e],
          g = Message.getField(a, f);
      null != g && ((c = f), (d = g), Message.setField(a, f, void 0));
    }
    return c ? (Message.setField(a, c, d), c) : 0;
  };
  static getWrapperField = function(a, b, c, d?) {
    a.wrappers_ || (a.wrappers_ = {});
    if (!a.wrappers_[c]) {
      var e = Message.getField(a, c);
      if (d || e) a.wrappers_[c] = new b(e);
    }
    return a.wrappers_[c];
  };
  static getRepeatedWrapperField = function(a, b, c) {
    Message.wrapRepeatedField_(a, b, c);
    b = a.wrappers_[c];
    b == Message.EMPTY_LIST_SENTINEL_ && (b = a.wrappers_[c] = []);
    return b;
  };
  static wrapRepeatedField_ = function(a, b, c) {
    a.wrappers_ || (a.wrappers_ = {});
    if (!a.wrappers_[c]) {
      for (
          var d = Message.getRepeatedField(a, c), e = [], f = 0;
          f < d.length;
          f++
      )
        e[f] = new b(d[f]);
      a.wrappers_[c] = e;
    }
  };
  static setWrapperField = function(a, b, c) {
    asserts.assertInstanceof(a, Message);
    a.wrappers_ || (a.wrappers_ = {});
    var d = c ? c.toArray() : c;
    a.wrappers_[b] = c;
    return Message.setField(a, b, d);
  };
  static setOneofWrapperField = function(a, b, c, d) {
    asserts.assertInstanceof(a, Message);
    a.wrappers_ || (a.wrappers_ = {});
    var e = d ? d.toArray() : d;
    a.wrappers_[b] = d;
    return Message.setOneofField(a, b, c, e);
  };
  static setRepeatedWrapperField = function(a, b, c) {
    asserts.assertInstanceof(a, Message);
    a.wrappers_ || (a.wrappers_ = {});
    c = c || [];
    for (var d = [], e = 0; e < c.length; e++) d[e] = c[e].toArray();
    a.wrappers_[b] = c;
    return Message.setField(a, b, d);
  };
  static addToRepeatedWrapperField = function(a, b, c, d, e?) {
    Message.wrapRepeatedField_(a, d, b);
    var f = a.wrappers_[b];
    f || (f = a.wrappers_[b] = []);
    c = c ? c : new d();
    a = Message.getRepeatedField(a, b);
    void 0 != e
        ? (f.splice(e, 0, c), a.splice(e, 0, c.toArray()))
        : (f.push(c), a.push(c.toArray()));
    return c;
  };
  static toMap = function(a, b, c, d) {
    for (var e = {}, f = 0; f < a.length; f++)
      e[b.call(a[f])] = c ? c.call(a[f], d, a[f]) : a[f];
    return e;
  };
  syncMapFields_ = function() {
    if (this.wrappers_)
      for (var a in this.wrappers_) {
        var b = this.wrappers_[a];
        if (isArray(b))
          for (var c = 0; c < b.length; c++) b[c] && b[c].toArray();
        else b && b.toArray();
      }
  };
  toArray = function() {
    this.syncMapFields_();
    return this.array;
  };
  getExtension = function(a) {
    if (this.extensionObject_) {
      this.wrappers_ || (this.wrappers_ = {});
      var b = a.fieldIndex;
      if (a.isRepeated) {
        if (a.isMessageType())
          return (
              this.wrappers_[b] ||
              (this.wrappers_[b] = array.map(
                  this.extensionObject_[b] || [],
                  function(b) {
                    return new a.ctor(b);
                  }
              )),
                  this.wrappers_[b]
          );
      } else if (a.isMessageType())
        return (
            !this.wrappers_[b] &&
            this.extensionObject_[b] &&
            (this.wrappers_[b] = new a.ctor(this.extensionObject_[b])),
                this.wrappers_[b]
        );
      return this.extensionObject_[b];
    }
  };
  setExtension = function(a, b) {
    this.wrappers_ || (this.wrappers_ = {});
    Message.maybeInitEmptyExtensionObject_(this);
    var c = a.fieldIndex;
    a.isRepeated
        ? ((b = b || []),
            a.isMessageType()
                ? ((this.wrappers_[c] = b),
                    (this.extensionObject_[c] = array.map(b, function(a) {
                      return a.toArray();
                    })))
                : (this.extensionObject_[c] = b))
        : a.isMessageType()
        ? ((this.wrappers_[c] = b),
            (this.extensionObject_[c] = b ? b.toArray() : b))
        : (this.extensionObject_[c] = b);
    return this;
  };
  static difference = function(a, b) {
    if (!(a instanceof b.constructor))
      throw Error("Messages have different types.");
    var c = a.toArray();
    b = b.toArray();
    var d = [],
        e = 0,
        f = c.length > b.length ? c.length : b.length;
    a.getJsPbMessageId() && ((d[0] = a.getJsPbMessageId()), (e = 1));
    for (; e < f; e++) Message.compareFields(c[e], b[e]) || (d[e] = b[e]);
    return new a.constructor(d);
  };
  static equals = function(a, b) {
    return (
        a == b ||
        (!(!a || !b) &&
            a instanceof b.constructor &&
            Message.compareFields(a.toArray(), b.toArray()))
    );
  };
  static compareExtensions = function(a, b) {
    a = a || {};
    b = b || {};
    var c = {},
        d;
    for (d in a) c[d] = 0;
    for (d in b) c[d] = 0;
    for (d in c) if (!Message.compareFields(a[d], b[d])) return !1;
    return !0;
  };
  static compareFields = function(a, b) {
    if (a == b) return !0;
    if (!isObject(a) || !isObject(b))
      return ("number" === typeof a && isNaN(a)) ||
      ("number" === typeof b && isNaN(b))
          ? String(a) == String(b)
          : !1;
    if (a.constructor != b.constructor) return !1;
    if (Message.SUPPORTS_UINT8ARRAY_ && a.constructor === Uint8Array) {
      if (a.length != b.length) return !1;
      for (var c = 0; c < a.length; c++) if (a[c] != b[c]) return !1;
      return !0;
    }
    if (a.constructor === Array) {
      var d = void 0,
          e = void 0,
          f = Math.max(a.length, b.length);
      for (c = 0; c < f; c++) {
        var g = a[c],
            h = b[c];
        g &&
        g.constructor == Object &&
        (asserts.assert(void 0 === d),
            asserts.assert(c === a.length - 1),
            (d = g),
            (g = void 0));
        h &&
        h.constructor == Object &&
        (asserts.assert(void 0 === e),
            asserts.assert(c === b.length - 1),
            (e = h),
            (h = void 0));
        if (!Message.compareFields(g, h)) return !1;
      }
      return d || e
          ? ((d = d || {}), (e = e || {}), Message.compareExtensions(d, e))
          : !0;
    }
    if (a.constructor === Object) return Message.compareExtensions(a, b);
    throw Error("Invalid type in JSPB array");
  };
  cloneMessage = function() {
    return Message.cloneMessage(this);
  };
  clone = function() {
    return Message.cloneMessage(this);
  };
  static clone = function(a) {
    return Message.cloneMessage(a);
  };
  static cloneMessage = function(a) {
    return new a.constructor(Message.clone_(a.toArray()));
  };
  static copyInto = function(a, b) {
    asserts.assertInstanceof(a, Message);
    asserts.assertInstanceof(b, Message);
    asserts.assert(
        a.constructor == b.constructor,
        "Copy source and target message should have the same type."
    );
    a = Message.clone(a);
    for (
        var c = b.toArray(), d = a.toArray(), e = (c.length = 0);
        e < d.length;
        e++
    )
      c[e] = d[e];
    b.wrappers_ = a.wrappers_;
    b.extensionObject_ = a.extensionObject_;
  };
  static clone_ = function(a) {
    if (isArray(a)) {
      for (var b = Array(a.length) as any, c = 0 as any; c < a.length; c++) {
        var d = a[c];
        null != d &&
        (b[c] =
            "object" == typeof d
                ? Message.clone_(asserts.assert(d))
                : d);
      }
      return b;
    }
    if (Message.SUPPORTS_UINT8ARRAY_ && a instanceof Uint8Array)
      return new Uint8Array(a);
    b = {};
    for (c in a)
      (d = a[c]),
      null != d &&
      (b[c] =
          "object" == typeof d
              ? Message.clone_(asserts.assert(d))
              : d);
    return b;
  };
  static registerMessageType = function(a, b) {
    b.messageId = a;
  };
  static messageSetExtensions = {};
  static messageSetExtensionsBinary = {};

}

Message.GENERATE_TO_STRING && (Message.prototype.toString = function () {
  this.syncMapFields_();
  return this.array.toString()
});
