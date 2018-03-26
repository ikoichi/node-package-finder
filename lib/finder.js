const fs = require('fs')
const file = require('file')
const path = require('path')
const _ = require('lodash')
const semver = require('semver')

const deps = ['dependencies', 'devDependencies', 'peerDependencies']

function init (dirs, packages) {
  let finalResults = {}
  dirs.forEach(d => {
    let res = loop(d, packages)
    finalResults = _.extendWith(finalResults, res, (v, src) => { return _.concat(src, v) })
  })

  Object.keys(finalResults).forEach(k => {
    finalResults[k] = _.compact(finalResults[k])
  })
  // format Object
  let formatted = []
  Object.keys(finalResults).forEach(packageName => {
      let obj = {
          package: packageName,
          folders: finalResults[packageName]
      }
      formatted.push(obj)
  })
  return formatted

}

function loop (dir, packages) {
  var results = {}
  file.walkSync(dir, function (dirPath, dirs, files) {
    files.forEach(function (file, index) {
      if (file.endsWith('package.json')) {
        processFile(dirPath, packages, file, results)
      }
    })
  })
  return results
}

function processFile (dirPath, packages, file, results) {
  let data = fs.readFileSync(`${dirPath}${path.sep}${file}`, 'utf8')
  let packageFile = JSON.parse(data)
  deps.forEach(dependencyKey => {
    if (packageFile[dependencyKey]) {
      Object.keys(packageFile[dependencyKey]).forEach(filePackage => {
        packages.forEach(packageName => {
          // check if package name contains the version, format package-name:version
          let version
          if( packageName.includes(':') ){
            version = packageName.split(':')[1]
            packageName = packageName.split(':')[0]
          }
          if (filePackage.includes(packageName)) {
            if (version) {
              let packageVersion = semver.coerce(packageFile[dependencyKey][filePackage])
              if (semver.satisfies(packageVersion, version)) {
                  addPackage(results, packageName, dirPath)
              }
            } else {
              addPackage(results, packageName, dirPath)
            }
          }
        })
      })
    }
  })
}

function addPackage (results, packageName, dirPath) {
  if (!results[packageName]) {
    results[packageName] = []
  }
  results[packageName].push(dirPath)
}

module.exports = init
