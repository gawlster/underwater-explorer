//////////////////////////////////////////////////////////////////////////////
//
//  Angel.js
//
//////////////////////////////////////////////////////////////////////////////

//----------------------------------------------------------------------------
//
//  Helper functions
//

function _argumentsToArray(args) {
  return [].concat.apply([], Array.prototype.slice.apply(args));
}

//----------------------------------------------------------------------------

function radians(degrees) {
  return (degrees * Math.PI) / 180.0;
}

//----------------------------------------------------------------------------
//
//  Vector Constructors
//

function vec2() {
  var result = _argumentsToArray(arguments);

  switch (result.length) {
    case 0:
      result.push(0.0);
    case 1:
      result.push(0.0);
  }

  return result.splice(0, 2);
}

function vec3() {
  var result = _argumentsToArray(arguments);

  switch (result.length) {
    case 0:
      result.push(0.0);
    case 1:
      result.push(0.0);
    case 2:
      result.push(0.0);
  }

  return result.splice(0, 3);
}

function vec4() {
  var result = _argumentsToArray(arguments);

  switch (result.length) {
    case 0:
      result.push(0.0);
    case 1:
      result.push(0.0);
    case 2:
      result.push(0.0);
    case 3:
      result.push(1.0);
  }

  return result.splice(0, 4);
}

//----------------------------------------------------------------------------
//
//  Matrix Constructors
//

function mat2() {
  var v = _argumentsToArray(arguments);

  var m = [];
  switch (v.length) {
    case 0:
      v[0] = 1;
    case 1:
      m = [vec2(v[0], 0.0), vec2(0.0, v[0])];
      break;

    default:
      m.push(vec2(v));
      v.splice(0, 2);
      m.push(vec2(v));
      break;
  }

  m.matrix = true;

  return m;
}

//----------------------------------------------------------------------------

function mat3() {
  var v = _argumentsToArray(arguments);

  var m = [];
  switch (v.length) {
    case 0:
      v[0] = 1;
    case 1:
      m = [vec3(v[0], 0.0, 0.0), vec3(0.0, v[0], 0.0), vec3(0.0, 0.0, v[0])];
      break;

    default:
      m.push(vec3(v));
      v.splice(0, 3);
      m.push(vec3(v));
      v.splice(0, 3);
      m.push(vec3(v));
      break;
  }

  m.matrix = true;

  return m;
}

//----------------------------------------------------------------------------

function mat4() {
  var v = _argumentsToArray(arguments);

  var m = [];
  switch (v.length) {
    case 0:
      v[0] = 1;
    case 1:
      m = [
        vec4(v[0], 0.0, 0.0, 0.0),
        vec4(0.0, v[0], 0.0, 0.0),
        vec4(0.0, 0.0, v[0], 0.0),
        vec4(0.0, 0.0, 0.0, v[0]),
      ];
      break;

    default:
      m.push(vec4(v));
      v.splice(0, 4);
      m.push(vec4(v));
      v.splice(0, 4);
      m.push(vec4(v));
      v.splice(0, 4);
      m.push(vec4(v));
      break;
  }

  m.matrix = true;

  return m;
}

//----------------------------------------------------------------------------
//
//  Generic Mathematical Operations for Vectors and Matrices
//

function equal(u, v) {
  if (u.length != v.length) {
    return false;
  }

  if (u.matrix && v.matrix) {
    for (var i = 0; i < u.length; ++i) {
      if (u[i].length != v[i].length) {
        return false;
      }
      for (var j = 0; j < u[i].length; ++j) {
        if (u[i][j] !== v[i][j]) {
          return false;
        }
      }
    }
  } else if ((u.matrix && !v.matrix) || (!u.matrix && v.matrix)) {
    return false;
  } else {
    for (var i = 0; i < u.length; ++i) {
      if (u[i] !== v[i]) {
        return false;
      }
    }
  }

  return true;
}

//----------------------------------------------------------------------------

function add(u, v) {
  var result = [];

  if (u.matrix && v.matrix) {
    if (u.length != v.length) {
      throw "add(): trying to add matrices of different dimensions";
    }

    for (var i = 0; i < u.length; ++i) {
      if (u[i].length != v[i].length) {
        throw "add(): trying to add matrices of different dimensions";
      }
      result.push([]);
      for (var j = 0; j < u[i].length; ++j) {
        result[i].push(u[i][j] + v[i][j]);
      }
    }

    result.matrix = true;

    return result;
  } else if ((u.matrix && !v.matrix) || (!u.matrix && v.matrix)) {
    throw "add(): trying to add matrix and non-matrix variables";
  } else {
    if (u.length != v.length) {
      throw "add(): vectors are not the same dimension";
    }

    for (var i = 0; i < u.length; ++i) {
      result.push(u[i] + v[i]);
    }

    return result;
  }
}

//----------------------------------------------------------------------------

function subtract(u, v) {
  var result = [];

  if (u.matrix && v.matrix) {
    if (u.length != v.length) {
      throw (
        "subtract(): trying to subtract matrices" + " of different dimensions"
      );
    }

    for (var i = 0; i < u.length; ++i) {
      if (u[i].length != v[i].length) {
        throw (
          "subtract(): trying to subtact matrices" + " of different dimensions"
        );
      }
      result.push([]);
      for (var j = 0; j < u[i].length; ++j) {
        result[i].push(u[i][j] - v[i][j]);
      }
    }

    result.matrix = true;

    return result;
  } else if ((u.matrix && !v.matrix) || (!u.matrix && v.matrix)) {
    throw "subtract(): trying to subtact  matrix and non-matrix variables";
  } else {
    if (u.length != v.length) {
      throw "subtract(): vectors are not the same length";
    }

    for (var i = 0; i < u.length; ++i) {
      result.push(u[i] - v[i]);
    }

    return result;
  }
}

//----------------------------------------------------------------------------

function mult(u, v) {
  var result = [];

  if (u.matrix && v.matrix) {
    if (u.length != v.length) {
      throw "mult(): trying to mult matrices of different dimensions";
    }

    for (var i = 0; i < u.length; ++i) {
      if (u[i].length != v[i].length) {
        throw "mult(): trying to mult matrices of different dimensions";
      }
    }

    for (var i = 0; i < u.length; ++i) {
      result.push([]);

      for (var j = 0; j < v.length; ++j) {
        var sum = 0.0;
        for (var k = 0; k < u.length; ++k) {
          sum += u[i][k] * v[k][j];
        }
        result[i].push(sum);
      }
    }

    result.matrix = true;

    return result;
  } else {
    if (u.length != v.length) {
      throw "mult(): vectors are not the same dimension";
    }

    for (var i = 0; i < u.length; ++i) {
      result.push(u[i] * v[i]);
    }

    return result;
  }
}

//----------------------------------------------------------------------------
//
//  Basic Transformation Matrix Generators
//

function translate(x, y, z) {
  if (Array.isArray(x) && x.length == 3) {
    z = x[2];
    y = x[1];
    x = x[0];
  }

  var result = mat4();
  result[0][3] = x;
  result[1][3] = y;
  result[2][3] = z;

  return result;
}

//----------------------------------------------------------------------------

function rotate(angle, axis) {
  if (!Array.isArray(axis)) {
    axis = [arguments[1], arguments[2], arguments[3]];
  }

  var v = normalize(axis);

  var x = v[0];
  var y = v[1];
  var z = v[2];

  var c = Math.cos(radians(angle));
  var omc = 1.0 - c;
  var s = Math.sin(radians(angle));

  var result = mat4(
    vec4(x * x * omc + c, x * y * omc - z * s, x * z * omc + y * s, 0.0),
    vec4(x * y * omc + z * s, y * y * omc + c, y * z * omc - x * s, 0.0),
    vec4(x * z * omc - y * s, y * z * omc + x * s, z * z * omc + c, 0.0),
    vec4(),
  );

  return result;
}

//----------------------------------------------------------------------------

function scale(x, y, z) {
  if (Array.isArray(x) && x.length == 3) {
    z = x[2];
    y = x[1];
    x = x[0];
  }

  var result = mat4();
  result[0][0] = x;
  result[1][1] = y;
  result[2][2] = z;

  return result;
}

//----------------------------------------------------------------------------
//
//  ModelView Matrix Generators
//

function lookAt(eye, at, up) {
  if (!Array.isArray(eye) || eye.length != 3) {
    throw "lookAt(): first parameter [eye] must be a vec3";
  }

  if (!Array.isArray(at) || at.length != 3) {
    throw "lookAt(): first parameter [at] must be a vec3";
  }

  if (!Array.isArray(up) || up.length != 3) {
    throw "lookAt(): first parameter [up] must be a vec3";
  }

  if (equal(eye, at)) {
    return mat4();
  }

  var v = normalize(subtract(at, eye)); // view direction vector
  var n = normalize(cross(v, up)); // perpendicular vector
  var u = normalize(cross(n, v)); // "new" up vector

  v = negate(v);

  var result = mat4(
    vec4(n, -dot(n, eye)),
    vec4(u, -dot(u, eye)),
    vec4(v, -dot(v, eye)),
    vec4(),
  );

  return result;
}

//----------------------------------------------------------------------------
//
//  Projection Matrix Generators
//

function ortho(left, right, bottom, top, near, far) {
  if (left == right) {
    throw "ortho(): left and right are equal";
  }
  if (bottom == top) {
    throw "ortho(): bottom and top are equal";
  }
  if (near == far) {
    throw "ortho(): near and far are equal";
  }

  var w = right - left;
  var h = top - bottom;
  var d = far - near;

  var result = mat4();
  result[0][0] = 2.0 / w;
  result[1][1] = 2.0 / h; // changed various sign --petros
  result[2][2] = -2.0 / d;
  result[0][3] = -(left + right) / w;
  result[1][3] = -(top + bottom) / h;
  result[2][3] = -(near + far) / d;

  return result;
}

//----------------------------------------------------------------------------

function perspective(fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(radians(fovy) / 2);
  var d = far - near;

  var result = mat4();
  result[0][0] = f / aspect;
  result[1][1] = f;
  result[2][2] = -(near + far) / d; // changed sign --petros
  result[2][3] = (-2 * near * far) / d; // change sign --petros
  result[3][2] = -1;
  result[3][3] = 0.0;

  return result;
}

//----------------------------------------------------------------------------
//
//  Matrix Functions
//

function transpose(m) {
  if (!m.matrix) {
    return "transpose(): trying to transpose a non-matrix";
  }

  var result = [];
  for (var i = 0; i < m.length; ++i) {
    result.push([]);
    for (var j = 0; j < m[i].length; ++j) {
      result[i].push(m[j][i]);
    }
  }

  result.matrix = true;

  return result;
}

//----------------------------------------------------------------------------
//
//  Vector Functions
//

function dot(u, v) {
  if (u.length != v.length) {
    throw "dot(): vectors are not the same dimension";
  }

  var sum = 0.0;
  for (var i = 0; i < u.length; ++i) {
    sum += u[i] * v[i];
  }

  return sum;
}

//----------------------------------------------------------------------------

function negate(u) {
  result = [];
  for (var i = 0; i < u.length; ++i) {
    result.push(-u[i]);
  }

  return result;
}

//----------------------------------------------------------------------------

function cross(u, v) {
  if (!Array.isArray(u) || u.length < 3) {
    throw "cross(): first argument is not a vector of at least 3";
  }

  if (!Array.isArray(v) || v.length < 3) {
    throw "cross(): second argument is not a vector of at least 3";
  }

  var result = [
    u[1] * v[2] - u[2] * v[1],
    u[2] * v[0] - u[0] * v[2],
    u[0] * v[1] - u[1] * v[0],
  ];

  return result;
}

//----------------------------------------------------------------------------

function length(u) {
  return Math.sqrt(dot(u, u));
}

//----------------------------------------------------------------------------

function normalize(u, excludeLastComponent) {
  if (excludeLastComponent) {
    var last = u.pop();
  }

  var len = length(u);

  if (!isFinite(len)) {
    throw "normalize: vector " + u + " has zero length";
  }

  for (var i = 0; i < u.length; ++i) {
    u[i] /= len;
  }

  if (excludeLastComponent) {
    u.push(last);
  }

  return u;
}

//----------------------------------------------------------------------------

function mix(u, v, s) {
  if (typeof s !== "number") {
    throw "mix: the last paramter " + s + " must be a number";
  }

  if (u.length != v.length) {
    throw "vector dimension mismatch";
  }

  var result = [];
  for (var i = 0; i < u.length; ++i) {
    result.push(s * u[i] + (1.0 - s) * v[i]);
  }

  return result;
}

//----------------------------------------------------------------------------
//
// Vector and Matrix functions
//

function scalev(s, u) {
  if (!Array.isArray(u)) {
    throw "scale: second parameter " + u + " is not a vector";
  }

  result = [];
  for (var i = 0; i < u.length; ++i) {
    result.push(s * u[i]);
  }

  return result;
}

//----------------------------------------------------------------------------
//
//
//

function flatten(v) {
  if (v.matrix === true) {
    v = transpose(v);
  }

  var n = v.length;
  var elemsAreArrays = false;

  if (Array.isArray(v[0])) {
    elemsAreArrays = true;
    n *= v[0].length;
  }

  var floats = new Float32Array(n);

  if (elemsAreArrays) {
    var idx = 0;
    for (var i = 0; i < v.length; ++i) {
      for (var j = 0; j < v[i].length; ++j) {
        floats[idx++] = v[i][j];
      }
    }
  } else {
    for (var i = 0; i < v.length; ++i) {
      floats[i] = v[i];
    }
  }

  return floats;
}

//inverseTranspose added by Petros from glm

function inverseTranspose(m) {
  var SubFactor00 = m[2][2] * m[3][3] - m[3][2] * m[2][3];
  var SubFactor01 = m[2][1] * m[3][3] - m[3][1] * m[2][3];
  var SubFactor02 = m[2][1] * m[3][2] - m[3][1] * m[2][2];
  var SubFactor03 = m[2][0] * m[3][3] - m[3][0] * m[2][3];
  var SubFactor04 = m[2][0] * m[3][2] - m[3][0] * m[2][2];
  var SubFactor05 = m[2][0] * m[3][1] - m[3][0] * m[2][1];
  var SubFactor06 = m[1][2] * m[3][3] - m[3][2] * m[1][3];
  var SubFactor07 = m[1][1] * m[3][3] - m[3][1] * m[1][3];
  var SubFactor08 = m[1][1] * m[3][2] - m[3][1] * m[1][2];
  var SubFactor09 = m[1][0] * m[3][3] - m[3][0] * m[1][3];
  var SubFactor10 = m[1][0] * m[3][2] - m[3][0] * m[1][2];
  var SubFactor11 = m[1][1] * m[3][3] - m[3][1] * m[1][3];
  var SubFactor12 = m[1][0] * m[3][1] - m[3][0] * m[1][1];
  var SubFactor13 = m[1][2] * m[2][3] - m[2][2] * m[1][3];
  var SubFactor14 = m[1][1] * m[2][3] - m[2][1] * m[1][3];
  var SubFactor15 = m[1][1] * m[2][2] - m[2][1] * m[1][2];
  var SubFactor16 = m[1][0] * m[2][3] - m[2][0] * m[1][3];
  var SubFactor17 = m[1][0] * m[2][2] - m[2][0] * m[1][2];
  var SubFactor18 = m[1][0] * m[2][1] - m[2][0] * m[1][1];

  var Inverse = mat4();
  Inverse[0][0] =
    m[1][1] * SubFactor00 - m[1][2] * SubFactor01 + m[1][3] * SubFactor02;
  Inverse[0][1] = -(
    m[1][0] * SubFactor00 -
    m[1][2] * SubFactor03 +
    m[1][3] * SubFactor04
  );
  Inverse[0][2] =
    m[1][0] * SubFactor01 - m[1][1] * SubFactor03 + m[1][3] * SubFactor05;
  Inverse[0][3] = -(
    m[1][0] * SubFactor02 -
    m[1][1] * SubFactor04 +
    m[1][2] * SubFactor05
  );

  Inverse[1][0] = -(
    m[0][1] * SubFactor00 -
    m[0][2] * SubFactor01 +
    m[0][3] * SubFactor02
  );
  Inverse[1][1] =
    m[0][0] * SubFactor00 - m[0][2] * SubFactor03 + m[0][3] * SubFactor04;
  Inverse[1][2] = -(
    m[0][0] * SubFactor01 -
    m[0][1] * SubFactor03 +
    m[0][3] * SubFactor05
  );
  Inverse[1][3] =
    m[0][0] * SubFactor02 - m[0][1] * SubFactor04 + m[0][2] * SubFactor05;

  Inverse[2][0] =
    m[0][1] * SubFactor06 - m[0][2] * SubFactor07 + m[0][3] * SubFactor08;
  Inverse[2][1] = -(
    m[0][0] * SubFactor06 -
    m[0][2] * SubFactor09 +
    m[0][3] * SubFactor10
  );
  Inverse[2][2] =
    m[0][0] * SubFactor11 - m[0][1] * SubFactor09 + m[0][3] * SubFactor12;
  Inverse[2][3] = -(
    m[0][0] * SubFactor08 -
    m[0][1] * SubFactor10 +
    m[0][2] * SubFactor12
  );

  Inverse[3][0] = -(
    m[0][1] * SubFactor13 -
    m[0][2] * SubFactor14 +
    m[0][3] * SubFactor15
  );
  Inverse[3][1] =
    m[0][0] * SubFactor13 - m[0][2] * SubFactor16 + m[0][3] * SubFactor17;
  Inverse[3][2] = -(
    m[0][0] * SubFactor14 -
    m[0][1] * SubFactor16 +
    m[0][3] * SubFactor18
  );
  Inverse[3][3] =
    m[0][0] * SubFactor15 - m[0][1] * SubFactor17 + m[0][2] * SubFactor18;

  var Determinant =
    m[0][0] * Inverse[0][0] +
    m[0][1] * Inverse[0][1] +
    m[0][2] * Inverse[0][2] +
    m[0][3] * Inverse[0][3];

  iDeterminant = 1.0 / Determinant;
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      Inverse[i][j] = Inverse[i][j] * iDeterminant;
    }
  }

  return Inverse;
}
