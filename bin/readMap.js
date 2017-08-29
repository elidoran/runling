var os      = require('os')            // used to get user's home dir
var resolve = require('path').resolve  // resolve map file location

module.exports = function readMap(next, shared) {
  var error

  try {
    // mapPath is reused by plugin-plugin to save changed map.
    shared.mapPath = resolve(os.homedir(), '.runling-map.json')

    // map is used by get-plugin to get a plugin's path
    shared.map     = require(shared.mapPath)
  } catch (e) { // eslint-disable-line
    // TODO: only error when the error isn't ENOENT (non-existent file)
    // error = new Error('runling missing plugins map')
    // error.cause = e

    // when file doesn't exist, use an empty object, we'll make the file.
    shared.map = {}
  }

  next(error) // always call next(), may have assigned an error...
}
