var run = require('./run.js') // provided in shared object

module.exports = function runling(args, options) {
  var temp, log, err, shared, tasks

  // avoid using console functions if options says not to.
  // added during testing... may be a candidate for removal ;P
  if (options && options.console === false) {
    log = err = function(){} // NO-OP
  }

  else {
    log = console.log    // eslint-disable-line no-console
    err = console.error  // eslint-disable-line no-console
  }

  switch (args[2]) { // NOTE: ignore args[0] and args[1], as usual.

    case 'version': // print version and we're done.
      log('runling v' + require('../package.json').version)
      return

    // swap args so add/remove are after the sub-command.
    // TODO: perhaps keep a list of these "helper" words to swap...
    case 'add':
    case 'remove':
      temp    = args[2]
      args[2] = args[3]
      args[3] = temp
  }

  shared = { // shared object has both args and run()
    args: args.slice(2),
    run : run,
    // and console.log / console.error based on options (for testing)
    log : log,
    err : err,
    global: (!options || options.global !== false)
  }

  tasks = [ // initial task queue. tasks may add more.
    './readMap.js',   // first, read plugin map
    './usePlugin.js', // queue plugin from path in map-by-name
  ].map(require)

  function callback(error) { // handle error by printing it and exiting with error code.

    // call callback in options, if it exists
    if (options && typeof options.done === 'function') {
      options.done(error)
    }

    // if no callback *and* there's an error then print it and exit.
    else if (error) {
      err(error)
      process.exit(error.code || 1)
    }
  }

  // use package 'taskling' to run the sequence of functions
  require('taskling')(shared, tasks, callback)
}
