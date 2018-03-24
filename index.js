#!/usr/bin/env node
const finder = require('./finder')
const yargs = require('yargs')

const argv = yargs
    .usage('Usage: $0 -packages [packages] -folders [folders]')
    .describe('packages', 'comma separated list of package names')
    .describe('folders', 'comma separated list of folders to look into')
    .alias('f', 'folders')
    .alias('p', 'packages')
    .demandOption(['packages','folders'])
    .argv

let result = finder(argv.folders.split(','), argv.packages.split(','))
console.log(JSON.stringify(result, null, 4))