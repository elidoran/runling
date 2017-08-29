module.exports = getNpmGlobalRoot

function getNpmGlobalRoot(run) {
  var result

  if (module.exports.root) return module.exports.root

  result = run({
    command: 'npm',
    args: [ 'root', '-g' ],
    // override the default 'inherit' so we get stdout in result.
    options: { stdio: 'pipe' }
    // NOTE: without done callback it runs synchronously
  })

  // if we have a result and it has a stdout then ensure it's a string.
  // and, it'll have a newline after it so trim() it.
  module.exports.root = result && result.stdout && result.stdout.toString().trim()

  return module.exports.root
}
