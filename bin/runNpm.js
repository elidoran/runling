module.exports = function runNpm(next, shared) {

  // TODO: use npm as a library instead?

  // only do an install/uninstall when there are packages to do that for.
  if (shared.packageNames.length > 0) {

    // use the provided run() function to call npm
    shared.run({
      command: 'npm',

      args: [
        // add=true means install the package, otherwise uninstall it.
        shared.add ? 'install' : 'uninstall',
        '--global',  // always a global install cuz runling is global.
      ].concat(shared.packageNames), // names of packages to (un)install

      // runs asynchronously when `done` is provided.
      done: next
    })
  }

  else {
    next()
  }
}
