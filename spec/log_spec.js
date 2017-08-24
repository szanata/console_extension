const expect = require( 'chai' ).expect;
const sinon = require( 'sinon' );

describe( 'Log spec', () => {
  let writeSpy;
  let includesStub;

  before(() => {
    includesStub = sinon.stub(String.prototype, 'includes').returns(false);
    require( '../index' );
  });

  beforeEach( () => {
    writeSpy = sinon.spy( process.stdout, 'write' );
  } );

  afterEach( () => {
    writeSpy.restore();
  } );

  after(() => {
    delete require.cache[require.resolve( '../index' )];
    includesStub.restore();
  });

  it( 'Should allow just a string param to work as message prop', () => {
    console.info( 'foo' );
    const args = JSON.parse( writeSpy.lastCall.args[0] );
    expect( args.message ).to.eql( 'foo' );
  } );

  it( 'Should set the level INFO', () => {
    console.info( 'foo' );
    const args = JSON.parse( writeSpy.lastCall.args[0] );
    expect( args.level ).to.eql( 'INFO' );
  } );

  it( 'Should set the level WARN', () => {
    console.warn( 'foo' );
    const args = JSON.parse( writeSpy.lastCall.args[0] );
    expect( args.level ).to.eql( 'WARN' );
  } );

  it( 'Should set the level DEBUG', () => {
    console.debug( 'foo' );
    const args = JSON.parse( writeSpy.lastCall.args[0] );
    expect( args.level ).to.eql( 'DEBUG' );
  } );

  it( 'Should set the level ERROR', () => {
    console.error( 'foo' );
    const args = JSON.parse( writeSpy.lastCall.args[0] );
    expect( args.level ).to.eql( 'ERROR' );
  } );
} );
