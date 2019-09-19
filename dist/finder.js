"use strict";

require("core-js/modules/es6.regexp.split");

require("core-js/modules/web.dom.iterable");

const fs = require('fs');

const file = require('file');

const path = require('path');

const _ = require('lodash');

const semver = require('semver');

const deps = ['dependencies', 'devDependencies', 'peerDependencies'];

const init = (dirs, packages) => {
  let finalResults = {};
  dirs.forEach(d => {
    const res = loop(d, packages);
    finalResults = _.extendWith(finalResults, res, (v, src) => _.concat(src, v));
  });
  Object.keys(finalResults).forEach(k => {
    finalResults[k] = _.compact(finalResults[k]);
  }); // format Object

  const formatted = [];
  Object.keys(finalResults).forEach(packageName => {
    const obj = {
      package: packageName,
      folders: finalResults[packageName]
    };
    formatted.push(obj);
  });
  return formatted;
};

const loop = (dir, packages) => {
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

const getPackageInfo = packageName => packageName.includes(':') ? packageName.split(':') : [packageName, undefined];

const processFile = (dirPath, packages, file, results) => {
  const data = fs.readFileSync("".concat(dirPath).concat(path.sep).concat(file), 'utf8');
  const packageFile = JSON.parse(data);
  deps.forEach(dependencyKey => {
    if (packageFile[dependencyKey]) {
      Object.keys(packageFile[dependencyKey]).forEach(filePackage => {
        packages.forEach(_packageName => {
          // check if package name contains the version, format package-name:version
          const [packageName, version] = getPackageInfo(_packageName);

          if (filePackage.includes(packageName)) {
            if (version) {
              const packageVersion = semver.coerce(packageFile[dependencyKey][filePackage]);

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

const addPackage = (results, packageName, dirPath) => {
  if (!results[packageName]) {
    results[packageName] = [];
  }

  results[packageName].push(dirPath);
};

module.exports = init;