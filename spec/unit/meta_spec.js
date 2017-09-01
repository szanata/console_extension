const expect = require( 'chai' ).expect;
const sinon = require( 'sinon' );
const os = require( 'os' );
const path = '../../index';

describe( 'Meta spec', () => {
  let writeSpy;

  before(() => {
    process.env.NODE_ENV = 'development';
    writeSpy = sinon.spy( process.stdout, 'write' );
  });

  afterEach( () => {
    writeSpy.reset();
    delete require.cache[require.resolve( path )];
  } );

  after(() => {
    writeSpy.restore();
  });

  describe('Envinroment automatic variables', () => {
    before( () => {
      process.env.SYSTEM_NAME = 'foo';
      process.env.SERVICE_NAME = 'bar';
      require( path );
    });

    after( () => {
      delete process.env.SYSTEM_NAME;
      delete process.env.SERVICE_NAME;
    });

    it( 'Should use the "system" prop from a env var', () => {
      console.table();
      let args = JSON.parse( writeSpy.lastCall.args[0] );
      expect( args.system ).to.eql( 'foo' );
    } );

    it( 'Should use the "service" prop from a env var', () => {
      console.table();
      let args = JSON.parse( writeSpy.lastCall.args[0] );
      expect( args.service ).to.eql( 'bar' );
    } );
  });

  it( 'Should use the "hostname" from the machine', () => {
    const hostnameStub = sinon.stub( os, 'hostname' ).returns( 'foo-bar' );
    require( path );
    console.table();

    const args = JSON.parse( writeSpy.lastCall.args[0] );
    expect( args.hostname ).to.eql( 'foo-bar' );
    hostnameStub.restore();
  } );

  it( 'Should add the "timestamp" as time now in ISO-8601', () => {
    const isoStub = sinon.stub( Date.prototype, 'toISOString' ).returns( 'iso-date' );
    require( path );
    console.table();

    const args = JSON.parse( writeSpy.lastCall.args[0] );
    expect( args.timestamp ).to.eql( 'iso-date' );
    isoStub.restore();
  } );

  describe('Type property', () => {

    before(() => {
      require( path );
    });

    it( 'Should be "metric" for .table', () => {
      console.table();
      const args = JSON.parse( writeSpy.lastCall.args[0] );
      expect( args.type ).to.eql( 'metric' );
    } );

    it( 'Should be "log" fro .info', () => {
      console.info();
      const args = JSON.parse( writeSpy.lastCall.args[0] );
      expect( args.type ).to.eql( 'log' );
    } );

    it( 'Should be "log" fro .debug', () => {
      console.debug();
      const args = JSON.parse( writeSpy.lastCall.args[0] );
      expect( args.type ).to.eql( 'log' );
    } );

    it( 'Should be "log" fro .warn', () => {
      console.warn();
      const args = JSON.parse( writeSpy.lastCall.args[0] );
      expect( args.type ).to.eql( 'log' );
    } );

    it( 'Should accept more than one string argument', () => {
      console.info('test', 'test2');
      const args = JSON.parse( writeSpy.lastCall.args[0] );
      expect( args.message ).to.eql( 'test test2' );
    } );

    it( 'Should accept more than one argument', () => {
      console.info('test', JSON.stringify({name: 'Jon Doe'}));
      const args = JSON.parse( writeSpy.lastCall.args[0] );
      expect( args.message ).to.eql( 'test {"name":"Jon Doe"}' );
    } );

    it( 'Should be "log" fro .error', () => {
      console.error();
      const args = JSON.parse( writeSpy.lastCall.args[0] );
      expect( args.type ).to.eql( 'log' );
    } );
  })

  it( 'Should merge props send as parameters', () => {
    const tags = [ 1, 2, 3 ];

    require( path );
    console.table( { tags } );

    const args = JSON.parse( writeSpy.lastCall.args[0] );
    expect( args.tags ).to.eql( tags );
    expect( args ).to.have.all.keys( 'type', 'timestamp', 'service', 'system', 'hostname', 'tags' );
  } );

  it( 'Should never overwrite base fields', () => {
    const type = 'type';
    const timestamp = 'timestamp';
    const service = 'service';
    const hostname = 'hostname';
    const system = 'system';

    require( path );
    console.table( { type, timestamp, service, hostname, system } );

    const args = JSON.parse( writeSpy.lastCall.args[0] );
    expect( args.type ).to.not.eql( type );
    expect( args.timestamp ).to.not.eql( timestamp );
    expect( args.service ).to.not.eql( service );
    expect( args.hostname ).to.not.eql( hostname );
    expect( args.system ).to.not.eql( system );
  } );
} );
