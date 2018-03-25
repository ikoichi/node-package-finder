const fs = require('fs')
const file = require('file')
const path = require('path')
const _ = require('lodash')

const deps = ['dependencies', 'devDependencies', 'peerDependencies']

function init (dirs, packages) {
  let finalResults = {}
  dirs.forEach(d => {
    let res = loop(d, packages)
    // console.log('res', res)
    finalResults = _.extendWith(finalResults, res, (v, src) => { return _.concat(src, v) })
  })

  Object.keys(finalResults).forEach(k => {
    finalResults[k] = _.compact(finalResults[k])
  })
  // console.log(finalResults)
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
    // console.log('dirPath', dirPath)
    // console.log('dirPath', dirs)
    // console.log('dirPath', files)

    files.forEach(function (file, index) {
      // console.log('file', file)
      if (file.endsWith('package.json')) {
        // console.log('file', file)
        let data = fs.readFileSync(dirPath + path.sep + file, 'utf8')
        // console.log(data)
        let j = JSON.parse(data)
        deps.forEach(d => {
          if (j[d]) {
            // console.log(Object.keys(j[d]))
            Object.keys(j[d]).forEach(k => {
              packages.forEach(p => {
                if (k.includes(p)) {
                  // console.log(p, dirPath)
                  if (!results[p]) {
                    results[p] = []
                  }
                  results[p].push(dirPath)
                }
              })
            })
          }
        })
      }
    })
  })
  return results
}

module.exports = init
