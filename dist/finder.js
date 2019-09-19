"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var fs = require('fs');

var file = require('file');

var path = require('path');

var _ = require('lodash');

var semver = require('semver');

var deps = ['dependencies', 'devDependencies', 'peerDependencies'];

var init = function init(dirs, packages) {
  var finalResults = {};
  dirs.forEach(function (d) {
    var res = loop(d, packages);
    finalResults = _.extendWith(finalResults, res, function (v, src) {
      return _.concat(src, v);
    });
  });
  Object.keys(finalResults).forEach(function (k) {
    finalResults[k] = _.compact(finalResults[k]);
  }); // format Object

  var formatted = [];
  Object.keys(finalResults).forEach(function (packageName) {
    var obj = {
      "package": packageName,
      folders: finalResults[packageName]
    };
    formatted.push(obj);
  });
  return formatted;
};

var loop = function loop(dir, packages) {
  var results = {};
  file.walkSync(dir, function (dirPath, dirs, files) {
    files.forEach(function (file, index) {
      if (file.endsWith('package.json')) {
        processFile(dirPath, packages, file, results);
      }
    });
  });
  return results;
};

var getPackageInfo = function getPackageInfo(packageName) {
  return packageName.includes(':') ? packageName.split(':') : [packageName, undefined];
};

var processFile = function processFile(dirPath, packages, file, results) {
  var data = fs.readFileSync("".concat(dirPath).concat(path.sep).concat(file), 'utf8');
  var packageFile = JSON.parse(data);
  deps.forEach(function (dependencyKey) {
    if (packageFile[dependencyKey]) {
      Object.keys(packageFile[dependencyKey]).forEach(function (filePackage) {
        packages.forEach(function (_packageName) {
          // check if package name contains the version, format package-name:version
          var _getPackageInfo = getPackageInfo(_packageName),
              _getPackageInfo2 = _slicedToArray(_getPackageInfo, 2),
              packageName = _getPackageInfo2[0],
              version = _getPackageInfo2[1];

          if (filePackage.includes(packageName)) {
            if (version) {
              var packageVersion = semver.coerce(packageFile[dependencyKey][filePackage]);

              if (semver.satisfies(packageVersion, version)) {
                addPackage(results, packageName, dirPath);
              }
            } else {
              addPackage(results, packageName, dirPath);
            }
          }
        });
      });
    }
  });
};

var addPackage = function addPackage(results, packageName, dirPath) {
  if (!results[packageName]) {
    results[packageName] = [];
  }

  results[packageName].push(dirPath);
};

module.exports = init;