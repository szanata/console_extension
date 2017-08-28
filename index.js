const os = require( 'os' );
const util = require( 'util' );

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

function getCallerFile() {
  const err = new Error();

  Error.prepareStackTrace = ( error, stack ) => stack;

  const currentFile = err.stack.shift().getFileName();
  const caller = err.stack.find( line => line.getFileName() !== currentFile );

  return caller.getFileName();
}

function wasCalledFromModule() {
  const caller = getCallerFile();
  return caller.includes( '/node_modules/' );
}

function buildFields( props, metaFields ) {
  const fields = Object.assign( {}, props, constantFields, metaFields );
  fields.timestamp = new Date().toISOString();
  return fields;
}

const ready = Symbol( 'ready' );

Object.keys( methods ).forEach( key => {
  console[key] = new Proxy( console[key], {
    apply( target, thisArg, args = {} ) {
      if ( process.env.NODE_ENV === 'test' ) {
        return;
      }

      if ( wasCalledFromModule() ) {
        return target( ...args );
      }

      const props = ( args[0] && args[0].constructor.name === 'Object' ) ? args[0] : { message: args[0] };
      const fields = buildFields( props, methods[key] );
      process.stdout.write( `${util.format( JSON.stringify( fields ) )}\n` );
    }
  } );
} );
