/* eslint-disable no-async-promise-executor */
const { expect } = require('chai')
const packageFinder = require('../dist/finder')

const packageName = 'lodash'
const secondPackageName = 'fi-is'

describe('find packages', () => {
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
    expect(results[0].folders[2]).to.equal(
      'tests/testProjects/project2/subproject'
    )

    expect(results[1].package).to.equal(packageName)
    expect(results[1].folders).to.be.an('array')
    expect(results[1].folders.length).to.equal(1)
    expect(results[1].folders[0]).to.equal('tests/testProjects/project1')
  })

  it('should use two folders', () => {
    let results = packageFinder(
      [
        './tests/testProjects/project1',
        './tests/testProjects/project2/subproject',
      ],
      [packageName, secondPackageName]
    )
    console.log(results)
    expect(results).to.be.an('array')
    expect(results.length).to.equal(2)
    expect(results[0].package).to.equal(secondPackageName)
    expect(results[0].folders).to.be.an('array')
    expect(results[0].folders.length).to.equal(2)
    expect(results[0].folders[0]).to.equal(
      './tests/testProjects/project2/subproject'
    )
    expect(results[0].folders[1]).to.equal('./tests/testProjects/project1')

    expect(results[1].package).to.equal(packageName)
    expect(results[1].folders).to.be.an('array')
    expect(results[1].folders.length).to.equal(1)
    expect(results[1].folders[0]).to.equal('./tests/testProjects/project1')
  })
})

describe('find packages using versions', () => {
  it('should match the package', () => {
    let results = packageFinder(
      ['./tests/testProjects/project1'],
      [`${secondPackageName}:>=1.x`]
    )
    console.log(results)
    expect(results.length).to.equal(1)
  })

  it('should not match the package', () => {
    let results = packageFinder(
      ['./tests/testProjects/project1'],
      [`${secondPackageName}:<1.x`]
    )
    console.log(results)
    expect(results.length).to.equal(0)
  })
})
