var isAbsolute = require('path').isAbsolute
var resolve    = require('path').resolve    // resolve package locations

var getNpmGlobalRoot = require('./global-root.js')

module.exports = function buildPaths(next, shared) {
  var error

  // store the args which are package names so we can `npm install/uninstall` them.
  shared.packageNames = []

  // convert the args to resolved paths.
  // we store the paths in the runling map file
  // to map plugin names to the plugin's location.
  shared.paths = shared.args.map(toPaths)

  next(error)

  // NOTE: function hoisted so it's usable in above map() call.
  // both maps args to paths and identifies which ones are package names.
  function toPaths(pkg) {
    var result, globalRoot

    // A, B, and C are all paths to somewhere local.
    // D is a package name to globally install/uninstall.

    // A. if it's already absolute then use that:
    if (isAbsolute(pkg)) result = pkg

    // B. if it starts with a dot then it's a relative path to a module, resolve:
    else if (pkg[0] === '.') result = resolve(pkg)

    // C. if it isn't a scoped package name and has a '/' then resolve:
    else if (pkg[0] !== '@' && pkg.indexOf('/') > -1) result = resolve(pkg)

    // D. otherwise, it's a package name to install.
    // so, resolve it from where we are because we're globally installed.
    // back up twice to get out of `runling/bin` and then go into package:
    else {
      shared.packageNames.push(pkg)

      // NOTE: we're not globally installed during testing! *grumble*

      // if `global` is true (default) then we resolve from where we are:
      if (shared.global) {
        result = resolve(__dirname, '..', '..', pkg)
      }

      // otherwise, we resolve from.. umm, the global location...?
      else { // use run() to call `npm root -g` to get global root

        globalRoot = getNpmGlobalRoot(shared.run)

        if (typeof globalRoot === 'string') {
          result = resolve(globalRoot, pkg)
        }

        else {
          // will be provide to next() way above
          error = new Error('runling failed to find global npm root')
        }
      }
    }

    // single point of return for `arg` to `path` mapping.
    return result
  }

}
