const Hoek = require('hoek')
const Util = require('util')

const Exec = require('./exec')

const defaults = {
  server: 'localhost:3000',
  directory: '.demeteorized'
}

//
// Options include:
//    server - URL of the server (defaults to localhost:3000).
//    directory - The output directory (defaults to .demeteorized).
//    architecture - Architecture build target.
//
module.exports = (options, done) => {
  var args, build

  options = Hoek.applyToDefaults(defaults, options)

  args = [
    'build',
    '--server', options.server,
    '--directory', Util.format('%s', options.directory)
  ]

  if (options.architecture) {
    args.push('--architecture')
    args.push(options.architecture)
  }

  if (options.debug) args.push('--debug')
  if (options.serverOnly) args.push('--server-only')
  if (options.verbose) args.push('--verbose')

  build = Exec.spawn('meteor', args, { cwd: options.input, stdio: 'inherit' })

  build.on('error', (err) => {
    var message = [
      'Meteor not in $PATH.',
      'Please make sure Meteor is installed properly.'
    ].join(' ')

    if (err.code === 'ENOENT') return done(new Error(message))
    done(err)
  })

  build.on('close', (code) => {
    if (code !== 0) return done(new Error('Conversion failed.'))
    done()
  })
}
