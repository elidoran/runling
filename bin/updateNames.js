/* eslint-disable max-depth */
// if check === true then 'add' so we add to map...
// if check === false then 'remove' so we nullify in map.
module.exports = function getNames(check, next, shared) {
  var i, path, names, error

  if (shared.add === check) {
    shared.names = []

    try {
      // for each path get their aliases (names)
      for (i = 0; i < shared.paths.length; i++) {
        path  = shared.paths[i]
        names = require(path).names

        if (names && names.length > 0) {
          // either set the path in there or nullify it
          updateNames(shared.map, names, shared.add ? path : null)

          // add its names to the list of all names
          shared.names.push(names)
        }

        else { // no names?? that's a problem.
          error = new Error(
            'command plugin "' + shared.args[i] + '" missing names at: ' + path
          )
          break
        }
      }
    } catch (e) { // eslint-disable-line
      // require() failed to find it at the path? that's a problem.
      error = new Error(
        'command plugin "' + shared.args[i] + '" not found at: ' + path + ' due to ' + e
      )
      error.cause = e
    }
  }

  next(error) // always call next(), may have assigned an error...
}

function updateNames(map, names, path) {
  for (var i = 0; i < names.length; i++) {
    map[names[i]] = path
  }
}
