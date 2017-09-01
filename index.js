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

function wasCalledFromModule() {
  const stack = new Error().stack.split( '\n' ).slice( 1 )
    .map( cs => {
      const exp = cs.includes( '(' ) ? /.+\(([^:]+).*\)/ : /\s+at\s([^:]+).*/;
      return cs.replace( exp, '$1' );
    } ); // get only the path/file.js part of the stack trace

  const ownProjectFolder = stack.shift().replace( /\/[^/]+$/, '' ); // remove file part

  stack.slice().some( entry => {
    if ( entry.includes( ownProjectFolder ) ) {
      stack.shift();
      return false;
    }
    return true;
  } );

  return stack[0] ? stack[0].includes( '/node_modules/' ) : true;
}

function buildFields( props, metaFields ) {
  const fields = Object.assign( {}, props, constantFields, metaFields );
  fields.timestamp = new Date().toISOString();
  return fields;
}

Object.keys( methods ).forEach( key => {
  let method;
  const originalMethodKey = `[[native:${key}]]`;

  if ( console[originalMethodKey] ) { // eslint-disable-line no-console
    method = console[originalMethodKey]; // eslint-disable-line no-console
  } else {
    method = console[key]; // eslint-disable-line no-console
    // eslint-disable-next-line no-console
    Reflect.defineProperty( console, originalMethodKey, { value: console[key] } );
  }

  console[key] = new Proxy( method, { // eslint-disable-line no-console
    apply( target, thisArg, args = {} ) {
      if ( process.env.NODE_ENV === 'test' ) { return; }


      // eslint-disable-next-line consistent-return
      if ( wasCalledFromModule() ) { return target( ...args ); }

      const props = ( args[0] && args[0].constructor.name === 'Object' ) ?
        args[0] :
        { message: args.join( ' ' ) };
      const fields = buildFields( props, methods[key] );

      process.stdout.write( `${util.format( JSON.stringify( fields ) )}\n` );
    }
  } );
} );
