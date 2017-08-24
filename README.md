

## To log INFO|WARN|DEBUG|ERROR objects use:

```js
console.info()
console.warn()
console.debug()
console.error()
```

### Logging some message:
```js
console.info('Foo');
//or
console.info({message: 'Foo'});
```

### Logging properties:
```js
console.info({message: 'Foo', custom_field: 'bar'});
```

## To log metrics

```js
console.table({custom_field: 'bar', another_field: 'bar'});
```

## Default appended fields:

- **system**: Read from process.env.SYSTEM_NAME
- **service**: Read from process.env.SERVICE_NAME
- **hostname**: Read from os.hostname()
- **type**: Automatic set for 'log' or 'metric'
- **level**: Log only. Set by the method called
- **timestamp**: Current date in ISO-8601
