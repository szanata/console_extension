const expect = require( 'chai' ).expect;

describe( 'Assignment spec', () => {
  afterEach( () => {
    delete require.cache[require.resolve( '../index' )];
    delete console.metric;
  } );

  it( 'Should not overwrite if the is already a metric function', () => {
    console.metric = 'foo';
    const index = require( '../index' );
    expect( console.metric ).to.eql( 'foo' );
  } );

  it( 'Should add a prop metric, that is a function', () => {
    const index = require( '../index' );
    expect( console.metric ).to.be.a( 'Function' );
  } );
} );
