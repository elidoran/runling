module.exports = function addOrRemove(next, shared) {

  switch (shared.args[0]) {

    case 'add':
      shared.add = true
      shared.args.shift()
      break

    case 'remove':
      shared.add = false
      shared.args.shift()
      break

    default:
      shared.add = true
  }

  next()
}
