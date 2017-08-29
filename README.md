# runling
[![Build Status](https://travis-ci.org/elidoran/runling.svg?branch=master)](https://travis-ci.org/elidoran/runling)
[![Dependency Status](https://gemnasium.com/elidoran/runling.png)](https://gemnasium.com/elidoran/runling)
[![npm version](https://badge.fury.io/js/runling.svg)](http://badge.fury.io/js/runling)
[![Coverage Status](https://coveralls.io/repos/github/elidoran/runling/badge.svg?branch=master)](https://coveralls.io/github/elidoran/runling?branch=master)

Run commands as readable statements.

Features:

1. add commands to runling via plugins (local and published to NPM)
2. focuses on command statements which are readable, memorable, and effective
3. provides common functionality so plugin writers can focus on only what their command does


## Install

Install globally to use instead of standard operating system commands.

Install plugins via runling's "plugin" sub-command.

```sh
# install it globally
npm install --global runling

# install plugin for `link`:
runling plugin add @runling/link

# runling allows "add" and "remove" first for any sub-command:
runling add plugin @runling/link
# it always swaps "add" and "remove" with the arg after it.
```


## Usage

```sh
# with @runling/link plugin installed.
# the alias 'ln' also exists and are interchangeable.
runling link from some/path/and/name to target/path

# both words "from" and "to" are optional.
# the argument order is always:
#  1. where to create the link
#  2. where the link targets (from CWD!)
runling link some/path/and/name target/path

# NOTE:
#   when using standard *nix link/ln the target path must be
#     1. an absolute path
#    or,
#     2. a path relative to where the link is. *not* the CWD
#   this is often annoying because it ruins tab-completion when
#   making the target path unless creating the link in the CWD.
#   @runling/link solves that by changing the target to be
#   relative to the source.
#
# so, if the CWD was ~/ then the above command would create the symlink:
#   ~/some/path/and/name  ->  ../../../target/path
#
# the above is another goal of runling:
#   add some convenience for little issues with standard commands.
```


## Alias

Instead of the long name, "runling", you can alias it to something short.

In Linux/Mac you can make an alias for runling by putting the following in one of your bash configuration files. Which file depends on preference and system configuration. Here are some to consider:

* `~/.bashrc`
* `~/.bash_profile`
* `~/.bash_aliases`

Here's how to make an alias "run":

```bash
alias run='runling'
```

You could make an alias to call a runling plugin like:

```sh
alias rln='runling ln'
# then, instead of using command `ln` use `rln` for runling version.
```

Afterwords, read the config file to add the alias to your current terminal:

```sh
source ~/.bashrc # use the file you added the alias to
```

On Windows it's a bit more complicated based on `doskey`. So, I suggest using [@runling/link](https://www.npmjs.com/package/@runling/link) to create a symlink with the alias name targeting the real executable.

TODO: make `@runling/alias` which simplifies this by doing it for us.


## How to write a plugin

A plugin is a task function which will be called by package [taskling](https://npmjs.org/package/taskling) (runling uses taskling to execute its series of functions).

The args are:

1. **next** - the callback to call when you're done. It accepts an `Error` as the first argument.
2. **shared** - the shared object given to each task. It has property `args` with its command arguments in it. It also has a `run` function for running a child process. See [API - run(object)](#run-object).

For example, calling `runling echo some text` would provide the "echo" plugin the `shared.args` `[ 'some', 'text' ]`.

### Example plugin:

```javascript
// let's make "echo":
module.exports = function (next, shared) {
  // tell runling to run the system's "echo" command with the args.
  shared.run({
    command: 'echo',
    args   : shared.args,
    done   : next
  })
}

// provide the sub-command names which map to this plugin:
module.exports.names = [ 'echo' ]
```


## Plugins

1. **plugin** - included with `runling` by default. Handles installing and uninstalling runling plugin packages.
2. **add/remove** - included with `runling` by default. Helps with readable commands by allowing both "add" and "remove" before a sub-command's name. For example, add a plugin via `runling add plugin some-plugin` instead of `runling plugin add some-plugin`. Sure, the second one works, but, it's order makes it a bit awkward to read.
2. [@runling/link](https://www.npmjs.com/package/@runling/link)
3. [@runling/alias](#) - TODO: build this plugin
4. [@runling/cron](#) - TODO: build this plugin to make it easy to add cron jobs


## API

### run(object)

Runs the command in a child process asynchronously/synchronously.

Provided in the `shared` object (second argument).

Usually used to run the standard command of the same name.

Can be used repeatedly to run as many commands as desired.

The properties for `object`:

1. **command** - required, the name of the command to run
2. **args** - optional, an array of arguments to provide to the command
3. **options** - optional, options which configure how the command is run
4. **done** - optional, error accepting callback. When specified the child process is run asynchronously and the `run()` call will return immediately.


### prepend() / append()

Adds additional tasks to the queue.

Execution is handled by `runling` via a package named [taskling](https://www.npmjs.com/package/taskling).

Plugin functions are added to the task queue to run.

This allows a plugin to add their own tasks to the queue to easily use an asynchronous operations chain. For synchronous, call `next()` when done.

For an example, look at the [plugin plugin](bin/plugin-plugin.js) which exports a series of functions and [usePlugin.js](bin/usePlugin.js) which queues them via `append()`.


## [MIT License](LICENSE)
