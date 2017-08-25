const os = require( 'os' );
const util = require('util');

const constantFields = {
  system: process.env.SYSTEM_NAME || 'Not defined',
  service: process.env.SERVICE_NAME || 'Not defined',
  hostname: os.hostname()
};

const methods = {
  info: { type: 'log', level: 'INFO' },
  error: { type: 'log', level: 'ERROR' },
  warn: { type: 'log', level: 'WARN' },
  debug: { type: 'log', level: 'DEBUG' },
  table: { type: 'metric' }
};

function wasCalledFromModule() {
  const trace = new Error().stack;
  return trace.includes('/node_modules/');
}

function buildFields( props, metaFields ) {
  fields = Object.assign( {}, props, constantFields, metaFields );
  fields.timestamp = new Date().toISOString();
  return fields;
}

const ready = Symbol('ready');

Object.keys( methods ).forEach( key => {
  console[key] = new Proxy(console[key], {
    apply: function (target, thisArg, args = {}) {

      if ( process.env.NODE_ENV === 'test' ) {
        return;
      }

      if ( wasCalledFromModule() ) {
        return target( ...args );
      }

      const props = (args[0] && args[0].constructor.name === 'Object') ? args[0] : { message: args[0] };
      const fields = buildFields( props, methods[key] );
      process.stdout.write( util.format( JSON.stringify( fields ) ) + '\n' );
    }
  });
} );
