// queue series of task functions:
module.exports = [
  './addOrRemove', // determine if we're going to add or remove plugins
  './buildPaths',  // build path to the plugin's install location.
  './removeNames', // if add=false then get+remove names before npm uninstall.
  './runNpm',      // run npm install/uninstall job
  './addNames',    // if add=true then get+add names after npm install.
  './saveMap',     // save updated map
  './reportUpdate',// output map update results to console
].map(require)
