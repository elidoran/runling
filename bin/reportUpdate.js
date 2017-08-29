/* eslint-disable no-console */
module.exports = function reportUpdate(next, shared) {
  var names

  shared.log(
    'runling',
    (shared.add ? 'added' : 'removed'),
    'plugins and sub-commands:'
  )

  for (var i = 0; i < shared.args.length; i++) {
    names = shared.names[i]

    // if there's only one name then show it on one line
    if (names.length === 1) {
      shared.log('  ' + (i + 1) + '. ' + shared.args[i] + ' --> ' + names[0])
    }

    // otherwise, show the list of names on separate lines
    else {
      shared.log('  ' + (i + 1) + '. ' + shared.args[i] + ':')

      for (var j = 0; j < names.length; j++) {
        shared.log('    ' + (j + 1) + '. ' + names[j])
      }
    }
  }

  // extra newline after it all.
  shared.log()

  next()
}
