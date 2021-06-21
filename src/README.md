# Clean Architecture

The P2WDB is using the Clean Architecture design pattern, based on this video:
https://youtu.be/CnailTcJV_U

Code is split up into four groups:

- Entities
- Use Cases
- Controllers/Adapters
- External Interfaces/Frameworks

## Coding Patterns

A few coding patterns are worth noting, as they may appear unusual.

### Object Input

`myFunction ({hash, key, value, isValid = false} = {}) {}`

The above pattern has the following qualities:

- The function `myFunction()` above expects a single Object as an input. If no input is specified, it defaults to an empty object.
- The input object is [destructured](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#object_destructuring) into discrete variables with the names `hash`, `key`, `value`, and `isValid`.
- The `isValid` property has a default value of `false` if that property is not supplied.
