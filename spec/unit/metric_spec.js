const expect = require( 'chai' ).expect;
const sinon = require( 'sinon' );

describe( 'Metric spec', () => {
  let writeSpy;

  before( () => {
    process.env.NODE_ENV = 'development';
    writeSpy = sinon.spy( process.stdout, 'write' );
  });

  afterEach( () => {
    writeSpy.reset();
    delete require.cache[require.resolve( '../../index' )];
  } );

  after( () => {
    writeSpy.restore();
  });

  it( 'Should merge props send as parameters', () => {
    const tags = [ 1, 2, 3 ];

    require( '../../index' );
    console.table( { tags } );

    const args = JSON.parse( writeSpy.lastCall.args[0] );
    expect( args.tags ).to.eql( tags );
    expect( args ).to.have.all.keys( 'type', 'timestamp', 'service', 'system', 'hostname', 'tags' );
  } );
} );
