Adding some features over console methods to log objects.

## To log INFO|WARN|DEBUG|ERROR objects use:



### Logging some message:

Use common log methods to log different levels of information.

```js
console.info( 'Foo' );
//or
console.info( { message: 'Foo' } );
```

Output will be this a stringified object like this:
```js
{
  "message": "Foo",
  "system": "Your system name",
  "service": "your service name",
  "hostname": "Machine name",
  "type": "log",
  "level": "INFO",
  "timestamp": "2017-09-01T02:34:53.134Z"
}
```
## Using different log levels

The `level` prop varies according to the method called:

```js
console.info(); // level: INFO
console.warn(); // level: WARN
console.debug(); // level: DEBUG
console.error(); // level: ERROR
```

### Logging properties:

You can add any props to the output object, simple logging a object with those

```js
console.info( { message: 'Foo', custom_field: 'customize', another_field: 'more_values' } );
```

Outputs:
```js
{
  "message": "Foo",
  "custom_field": "customize",
  "another_field": "more_values",
  "system": "Your system name",
  "service": "your service name",
  "hostname": "Machine name",
  "type": "log",
  "level": "INFO",
  "timestamp": "2017-09-01T02:34:53.134Z"
}
```
*Note that you cannot overwrite the default props*

## To log metrics

Use V8 native method table to log a metric object.

```js
console.table( { custom_field: 'bar', another_field: 'bar' } );
```

Is almost the same object:

```js
{
  "custom_field": "bar",
  "another_field": "bar",
  "system": "Your system name",
  "service": "your service name",
  "hostname": "Machine name",
  "type": "metric",
  "timestamp": "2017-09-01T02:34:53.134Z"
}
```
*Note that you do not have a level anymore, nor a message*

## Automatic fields:

These are the fields added by default by the lib (an their values):

- **system**: Read from `process.env.SYSTEM_NAME`
- **service**: Read from `process.env.SERVICE_NAME`
- **hostname**: Read from `require('os').hostname()`
- **type**: Automatic set for 'log' or 'metric'
- **level**: *Log only*. Set after the method called
- **timestamp**: Current date in ISO-8601 format
