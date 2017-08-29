module.exports = function usePlugin(next, shared) {
  var name, path, target, error

  // TODO: if no args then go into interactive mode? list plugins?

  name = shared.args[0]
  // NOTE: ./plugin-plugin.js returns an array of functions.
  path = (name === 'plugin') ? './plugin-plugin.js' : shared.map[name]

  if (path) { // if we have a path then try to require() it.

    try {
      target = require(path)
    } catch (e) { // eslint-disable-line brace-style
      error = new Error('unable to load plugin: ' + name)
      error.cause = e
    }

    shared.args.shift()     // remove sub-command name/alias
    this.append([ target ]) // queue up sub-command plugin (may be an array)
  }

  else { // create an error cuz we don't know the sub-command
    error = new Error('unknown sub-command: ' + name)
  }

  next(error) // always call next(), may have assigned an error...
}
