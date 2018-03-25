const { expect } = require('chai')
const packageFinder = require('../lib/finder')

describe('find packages', () =>{

  const packageName = 'lodash'
  const secondPackageName = 'fi-is'
  it('should find the package', () => {
    let results = packageFinder(['./tests'], [packageName])
    console.log(results)
    expect(results).to.be.an('array')
    expect(results.length).to.equal(1)
    expect(results[0].package).to.equal(packageName)
    expect(results[0].folders).to.be.an('array')
    expect(results[0].folders.length).to.equal(1)
    expect(results[0].folders[0]).to.equal('tests/testProjects/project1')
  })

  it('should find two packages', () => {
    let results = packageFinder(['./tests'], [packageName, secondPackageName])
    console.log(results)
    expect(results).to.be.an('array')
    expect(results.length).to.equal(2)
    expect(results[0].package).to.equal(secondPackageName)
    expect(results[0].folders).to.be.an('array')
    expect(results[0].folders.length).to.equal(3)
    expect(results[0].folders[0]).to.equal('tests/testProjects/project1')
    expect(results[0].folders[1]).to.equal('tests/testProjects/project2')
    expect(results[0].folders[2]).to.equal('tests/testProjects/project2/subproject')

    expect(results[1].package).to.equal(packageName)
    expect(results[1].folders).to.be.an('array')
    expect(results[1].folders.length).to.equal(1)
    expect(results[1].folders[0]).to.equal('tests/testProjects/project1')
  })

  it('should use two folders', () => {
    let results = packageFinder(['./tests/testProjects/project1','./tests/testProjects/project2/subproject'], [packageName, secondPackageName])
    console.log(results)
    expect(results).to.be.an('array')
    expect(results.length).to.equal(2)
    expect(results[0].package).to.equal(secondPackageName)
    expect(results[0].folders).to.be.an('array')
    expect(results[0].folders.length).to.equal(2)
    expect(results[0].folders[0]).to.equal('./tests/testProjects/project2/subproject')
    expect(results[0].folders[1]).to.equal('./tests/testProjects/project1')

    expect(results[1].package).to.equal(packageName)
    expect(results[1].folders).to.be.an('array')
    expect(results[1].folders.length).to.equal(1)
    expect(results[1].folders[0]).to.equal('./tests/testProjects/project1')
  })
})
