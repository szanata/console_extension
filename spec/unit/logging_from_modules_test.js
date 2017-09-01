const chai = require( 'chai' );
const sinon = require( 'sinon' );

const expect = chai.expect;
const assert = chai.assert;

describe( 'Logging from /node_modules', () => {

  let fakeModule;
  let stdoutSpy;
  let stderrSpy;

  before(() => {
    process.env.NODE_ENV = 'production';

    stdoutSpy = sinon.spy( process.stdout, 'write' );
    stderrSpy = sinon.spy( process.stderr, 'write' );

    fakeModule = require( 'fake_module' );
  });

  beforeEach(() => {
    stdoutSpy.reset();
    stderrSpy.reset();
  });

  after(() => {
    stdoutSpy.restore();
    stderrSpy.restore();

    delete require.cache[require.resolve( 'fake_module' )];
  });

  it('Should fallback to the default console.error when logging errors from module', () => {
    fakeModule.runConsoleError( );
    expect( stderrSpy.lastCall.args[0] ).to.eql('A simple error log\n')
  });

  it('Should fallback to the default console.warn when logging warnings from module', () => {
    fakeModule.runConsoleWarn( );
    expect( stderrSpy.lastCall.args[0] ).to.eql('A simple warn log\n')
  });

  it('Should fallback to the default console.table by calling the native code', () => {
    fakeModule.runConsoleDebug( );
    assert( stdoutSpy.notCalled );
  });

  it('Should fallback to the default console.debug by calling the native code', () => {
    fakeModule.runConsoleDebug( );
    assert( stdoutSpy.notCalled );
  });

  it('Should fallback to the default console.info when logging infos from module', () => {
    fakeModule.runConsoleInfo( );
    expect( stdoutSpy.lastCall.args[0] ).to.eql('A simple info log\n')
  });

  it('Should use the lib when logging from scope called by a module', () => {
    fakeModule.runScope( function () {
      console.error('Bad');
    } );

    const out = JSON.parse( stdoutSpy.lastCall.args[0] );
    expect( out ).to.be.a.object;
    expect( out.message ).to.eql( 'Bad' );
  });
});
