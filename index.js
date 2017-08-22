const os = require( 'os' );

const mandatoryFields = {
  system: process.env.SYSTEM_NAME || 'Not defined',
  service: process.env.SERVICE_NAME || 'Not defined',
  hostname: os.hostname(),
  type: 'metric',
  timestamp: null
};

function metric( props = {} ) {
  if ( process.env.NODE_ENV === 'test' ) {
    return;
  }
  const metricFields = Object.assign( {}, props, mandatoryFields );
  metricFields.timestamp = new Date().toISOString();
  console.log( JSON.stringify( metricFields ) );
}

if ( !Reflect.has( console, 'metric' ) ) {
  Reflect.defineProperty( console, 'metric', { enumerable: true, writable: false, configurable: true, value: metric } );
}
