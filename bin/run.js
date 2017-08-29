var async = require('child_process').spawn
var sync  = require('child_process').spawnSync

module.exports = function run(the) {
  var options, child

  options = the.options || { stdio: 'inherit' }

  if (!options.stdio) {
    options.stdio = 'inherit'
  }

  if (the.done) {
    child = async(the.command, the.args, options)
    child.on('error', the.done)
    child.on('close', the.done)
  }

  else {
    child = sync(the.command, the.args, options)
  }

  return child
}
