# Warn On Requests, Throttled

This package implements an [ExpressJS middleware](http://expressjs.com/en/guide/writing-middleware.html) to warn about arbitrary properties of requests.

By default, the warning will be logged to the console. A warning can, however, do anything, e.g. call a web hook, or send an HTTP request elsewhere etc.

## Example

This middleware came to existance in order to warn when JWT tokens are almost expired. This would be implemented like this:

```js

const app = express();
const jwt = ... /* some jwt middleware, resulting in `user.token` being populated with the token */

const warn = expressWarn({ ... })
app.get('/protected', jwt, warn, (req, res, next) => {
  res.send('Here is protected information: abc')
})
```
