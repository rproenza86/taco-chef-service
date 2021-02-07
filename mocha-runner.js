'use strict';

// Dependencies
var fs = require('fs');
var Mocha = require('mocha');
var recursiveReadSync = require('recursive-readdir-sync');

// Determine which tests to run based on argument passed to runner
var args = process.argv.splice(2);
var files;


//Define Mocha
var mocha = new Mocha({
    timeout: 60000,
    reporter: 'spec',
    globals: ['Associations', 'CREATE_TEST_WATERLINE', 'DELETE_TEST_WATERLINE']
});

args.forEach(function (testDir) {
    try {
        files = recursiveReadSync(testDir);
    } catch (err) {
        if (err.errno === 34) {
            console.log('Path does not exist');
        } else {
            // something unrelated went wrong, rethrow 
            throw err;
        }
    }
});

files.filter(function (file) {
    // Only keep the .js files
    return file.endsWith('.test.js');
}).forEach(function(file){
    mocha.addFile(file);
});

// Run unit tests
mocha.run(function (failures) {
    process.exit(failures);
});