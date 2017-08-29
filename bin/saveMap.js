var save = require('fs').writeFile // rewrite map file

module.exports = function saveMap(next, shared) {

  save(shared.mapPath, JSON.stringify(shared.map, nonulls, 2), function(e) {
    var error

    if (e) {
      error = new Error('failed to write updated plugin map')
      error.cause = e
    }

    next(error)
  })
}

// eliminate nulls during JSON.stringify()
function nonulls(_, value) {
  if (value != null) return value
}
