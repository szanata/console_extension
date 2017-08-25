const expect = require( 'chai' ).expect;
const sinon = require( 'sinon' );

describe( 'Should behave normally if the call came from node module', () => {
  let writeSpy;
  let includesStub;

  before(() => {
    process.env.NODE_ENV = 'development';
    require( '../index' );
  });

  beforeEach( () => {
    writeSpy = sinon.spy( process.stdout, 'write' );
  } );

  afterEach( () => {
    writeSpy.restore();
    includesStub.restore();
  } );

  after(() => {
    delete require.cache[require.resolve( '../index' )];
  });

  it('Should work normally as the call came from the /node_modules/ folder', () => {
    includesStub = sinon.stub(String.prototype, 'includes').returns(false);
    console.table();
    expect( includesStub.notCalled );
  });

  it('Should use the tempered behavior as the call came from the root', () => {
    includesStub = sinon.stub(String.prototype, 'includes').returns(false);
    console.table();
    expect( includesStub.calledOnce );
  });
});
