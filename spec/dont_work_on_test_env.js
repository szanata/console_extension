const expect = require( 'chai' ).expect;
const sinon = require( 'sinon' );

describe( 'Should not work on test envinronments', () => {
  let writeSpy;
  before(() => {
    writeSpy = sinon.spy( process.stdout, 'write' );
    require( '../index' );
  });

  after(() => {
    writeSpy.restore();
    delete require.cache[require.resolve( '../index' )];
  });

  it('Should work normally as the call was not in a "test" env', () => {
    process.env.NODE_ENV = 'not_test';
    console.table();
    expect( writeSpy.notCalled );
  });

  it('Should do nothing if the call was in "test" env', () => {
    process.env.NODE_ENV = 'test';
    console.table();
    expect( writeSpy.calledOnce );
  });
});
