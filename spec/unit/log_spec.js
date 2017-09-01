const expect = require( 'chai' ).expect;
const sinon = require( 'sinon' );

describe( 'Log spec', () => {
  let writeSpy;
  let consoleBkp;

  before(() => {
    process.env.NODE_ENV = 'development';

    writeSpy = sinon.spy( process.stdout, 'write' );

    require( '../../index' );
  });

  afterEach( () => {
    writeSpy.reset();
  } );

  after(() => {
    delete require.cache[require.resolve( '../../index' )];
    writeSpy.restore();
  });

  it( 'Should allow just a string param to work as message prop', () => {
    console.info( 'foo' );
    const args = JSON.parse( writeSpy.lastCall.args[0] );
    expect( args.message ).to.eql( 'foo' );
  } );

  it( 'Should allow any number of params to be logged as a concatened string', () => {
    console.info( 'foo', 'bar' );
    const args = JSON.parse( writeSpy.lastCall.args[0] );
    expect( args.message ).to.eql( 'foo bar' );
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
