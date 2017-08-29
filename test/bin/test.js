var fs = require('fs')
var os = require('os')
var resolve = require('path').resolve
var assert  = require('assert')

// it will use this during testing only..
// the bin/buildPaths.js uses it first and it caches the value.
// so we can grab it in our test (not now, it isn't there yet).
var getNpmGlobalRoot = require('../../bin/global-root.js')

var runling = require('../../bin/command.js')

/*
 * tests by moving the real map file aside and then restoring it after testing.
 * tests with the testplugin both as a local path and a published package.
 */

describe('test runling', function() {

  var mapFilePath     = resolve(os.homedir(), '.runling-map.json')
  var tempMapFilePath = resolve(mapFilePath, '../.real-runling-map.json')

  this.timeout(10000) // override default timeout, set to 10 seconds.

  before('move aside real plugin map file', function(done) {
    fs.rename(mapFilePath, tempMapFilePath, function(error) {
      // TODO:
      //  we don't care about an error saying it doesn't exist. that's fine.
      //  however, if it's something else, then we need to pass it to done()
      done()
    })
  })

  after('restore name of real plugin map file', function(done) {
    fs.unlink(mapFilePath, function(error) {
      fs.rename(tempMapFilePath, mapFilePath, function(error) {
        // TODO:
        //  we don't care about an error saying it doesn't exist. that's fine.
        //  however, if it's something else, then we need to pass it to done()
        done()
      })
    })
  })

  it('should add test plugin to map (local)', function(done) {

    function checkAdded(error) {

      var testPluginPath  = resolve(__dirname, '..', 'plugin')

      assert.strictEqual(error)  // should be undefined

      // read map file to ensure we added the test plugin
      try {
        var content = require(mapFilePath)
      } catch (error) {
        done(error)
      }

      assert((content && content.testplugin), testPluginPath)
      done()
    }

    runling([
      'ignored arg which is `node`',
      'ignored arg which is the command script',
      'add',         // adding "something"
      'plugin',      // adding a plugin
      'test/plugin', // path to our test plugin (will be resolved to PWD)
    ], {
      console: false,      // don't print console messages
      done   : checkAdded,  // make the command tell us when it's done
      global : false,         // need to know global installed for buildPaths.js
    })
  })


  it('should remove test plugin from map (local)', function(done) {

    function checkRemoved(error) {

      assert.strictEqual(error) // should be undefined

      // read map file to ensure we added the test plugin
      try {
        var content = require(mapFilePath)
      } catch (error) {
        done(error)
      }

      assert(!content || !content.testplugin)
      done()
    }

    runling([
      'ignored arg which is `node`',
      'ignored arg which is the command script',
      'remove',      // removing "something"
      'plugin',      // removing a plugin
      'test/plugin', // path to our test plugin (will be resolved to PWD)
    ], {
      console: false,      // don't print console messages
      done   : checkRemoved,  // make the command tell us when it's done
      global : false,         // need to know global installed for buildPaths.js
    })
  })


  it('should add test plugin to map (package)', function(done) {

    function checkAdded(error) {
      var testPluginPath

      assert.strictEqual(error)  // should be undefined

      testPluginPath  = resolve(getNpmGlobalRoot.root, 'runling-test-plugin')

      // read map file to ensure we added the test plugin
      try {
        var content = require(mapFilePath)
      } catch (error) {
        done(error)
      }

      assert((content && content.testplugin), testPluginPath)
      done()
    }

    runling([
      'ignored arg which is `node`',
      'ignored arg which is the command script',
      'add',         // adding "something"
      'plugin',      // adding a plugin
      'runling-test-plugin', // path to our test plugin (will be globally installed)
    ], {
      console: false,      // don't print console messages
      done   : checkAdded, // make the command tell us when it's done
      global : false,      // need to know global installed for buildPaths.js
    })
  })


  it('should remove test plugin from map (package)', function(done) {

    function checkRemoved(error) {

      assert.strictEqual(error) // should be undefined

      // read map file to ensure we added the test plugin
      try {
        var content = require(mapFilePath)
      } catch (error) {
        done(error)
      }

      assert(!content || !content.testplugin)
      done()
    }

    runling([
      'ignored arg which is `node`',
      'ignored arg which is the command script',
      'remove',      // removing "something"
      'plugin',      // removing a plugin
      'runling-test-plugin', // path to our test plugin (will be globally installed)
    ], {
      console: false,         // don't print console messages
      done   : checkRemoved,  // make the command tell us when it's done
      global : false,         // need to know global installed for buildPaths.js
    })
  })


})
