const chai = require( 'chai' );
const sinon = require( 'sinon' );
const spawnSync = require( 'child_process' ).spawn;

const expect = chai.expect;
const assert = chai.assert;

describe( 'Side Effect test', () => {

  /**
   * If a proxy is defined above a proxy, only one output will be shown but can leave to
   * a proxy called by some file call a proxy defined by other file if:
   * The first call is identified as a call from module
   * Than the second call being identified as a call from the project (thus logging by lib)
   * Than the output from the module will be displayed as it was from the project using it
   */

  describe( 'Should not create proxy over proxied properties', () => {

    // let writeSpy;
    let includesSpy;

    before(() => {
      process.env.NODE_ENV = 'production';

      // writeSpy = sinon.spy( process.stdout, 'write' );
      includesSpy = sinon.spy( String.prototype, 'includes' );
    });

    beforeEach( () => {
      delete require.cache[require.resolve( '../../index' )];
      delete require.cache[require.resolve( 'fake_module' )];
      // writeSpy.reset();
      includesSpy.reset();
    } );

    after( () => {
      delete require.cache[require.resolve( '../../index' )];
      // writeSpy.restore();
      includesSpy.restore();
    });


    it( 'Should work after importing the lib directly than importing another lib that uses the lib', () => {
      require('../../index');
      const mod = require('fake_module');

      mod.runConsoleWarn();
      const proxyFnCalls = includesSpy.getCalls().filter( call => call.args[0] === '/node_modules/' ).length;
      expect( proxyFnCalls ).to.eql( 1 );
    } );
  } );
} );
