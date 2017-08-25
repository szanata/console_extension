const expect = require( 'chai' ).expect;
const sinon = require( 'sinon' );

describe( 'Metric spec', () => {
  let writeSpy;
  let includesStub;

  before(() => {
    process.env.NODE_ENV = 'development';
    includesStub = sinon.stub(String.prototype, 'includes').returns(false);
  });

  beforeEach( () => {
    writeSpy = sinon.spy( process.stdout, 'write' );
  } );

  afterEach( () => {
    writeSpy.restore();
    delete require.cache[require.resolve( '../index' )];
  } );

  after(() => {
    includesStub.restore();
  });

  it( 'Should merge props send as parameters', () => {
    const tags = [ 1, 2, 3 ];

    require( '../index' );
    console.table( { tags } );

    const args = JSON.parse( writeSpy.lastCall.args[0] );
    expect( args.tags ).to.eql( tags );
    expect( args ).to.have.all.keys( 'type', 'timestamp', 'service', 'system', 'hostname', 'tags' );
  } );
} );
