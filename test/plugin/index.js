module.exports = function testplugin(next, shared) {
  // used the shared `run()` to execute the echo command.
  shared.run({
    command: 'echo',
    args   : shared.args,
    done   : next,
  })
}

// tell runling the sub-commands which should call this plugin.
module.exports.names = [ 'testplugin' ]
