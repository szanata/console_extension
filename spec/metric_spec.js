const expect = require( 'chai' ).expect;
const sinon = require( 'sinon' );
const os = require( 'os' );

describe( 'Metric spec', () => {
  let logSpy;

  beforeEach( () => {
    process.env.NODE_ENV = 'development';
    logSpy = sinon.spy( console, 'log' );
  } );

  afterEach( () => {
    logSpy.restore();
    delete console.metric;
    delete require.cache[require.resolve( '../index' )];
  } );

  it( 'Should use the "system" prop from a env var', () => {
    process.env.SYSTEM_NAME = 'foo';
    require( '../index' );
    console.metric();

    const args = JSON.parse( logSpy.getCalls()[0].args[0] );
    expect( args.system ).to.eql( 'foo' );

    delete process.env.SYSTEM_NAME;
  } );

  it( 'Should use the "service" prop from a env var', () => {
    process.env.SERVICE_NAME = 'bar';
    require( '../index' );
    console.metric();

    const args = JSON.parse( logSpy.getCalls()[0].args[0] );
    expect( args.service ).to.eql( 'bar' );

    delete process.env.SERVICE_NAME;
  } );

  it( 'Should use the "hostname" from the machine', () => {
    const hostnameStub = sinon.stub( os, 'hostname' ).returns( 'foo-bar' );
    require( '../index' );
    console.metric();

    const args = JSON.parse( logSpy.getCalls()[0].args[0] );
    expect( args.hostname ).to.eql( 'foo-bar' );
    hostnameStub.restore();
  } );

  it( 'Should add the "timestamp" as time now in ISO-8601', () => {
    const isoStub = sinon.stub( Date.prototype, 'toISOString' ).returns( 'iso-date' );
    require( '../index' );
    console.metric();

    const args = JSON.parse( logSpy.getCalls()[0].args[0] );
    expect( args.timestamp ).to.eql( 'iso-date' );
    isoStub.restore();
  } );

  it( 'Should add the "type" as "metric" to all outputs', () => {
    require( '../index' );
    console.metric();

    const args = JSON.parse( logSpy.getCalls()[0].args[0] );
    expect( args.type ).to.eql( 'metric' );
  } );

  it( 'Should merge props send as parameters', () => {
    const tags = [ 1, 2, 3 ];

    require( '../index' );
    console.metric( { tags } );

    const args = JSON.parse( logSpy.getCalls()[0].args[0] );
    expect( args.tags ).to.eql( tags );
    expect( args ).to.have.all.keys( 'type', 'timestamp', 'service', 'system', 'hostname', 'tags' );
  } );

  it( 'Should never overwrite base fields', () => {
    const type = 'type';
    const timestamp = 'timestamp';
    const service = 'service';
    const hostname = 'hostname';
    const system = 'system';

    require( '../index' );
    console.metric( { type, timestamp, service, hostname, system } );

    const args = JSON.parse( logSpy.getCalls()[0].args[0] );
    expect( args.type ).to.not.eql( type );
    expect( args.timestamp ).to.not.eql( timestamp );
    expect( args.service ).to.not.eql( service );
    expect( args.hostname ).to.not.eql( hostname );
    expect( args.system ).to.not.eql( system );
  } );

  it( 'Should do nothing if the env is test', () => {
    process.env.NODE_ENV = 'test';

    require( '../index' );
    console.metric( { foo: 'bar' } );

    expect( logSpy.notCalled );
  } );
} );
