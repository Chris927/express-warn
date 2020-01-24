# Warn On Requests, Throttled

:warning: Experimental, don't use yet.

This package implements an [ExpressJS middleware](http://expressjs.com/en/guide/writing-middleware.html) to warn about arbitrary properties of requests.

By default, the warning will be logged to the console. A warning can, however, do anything, e.g. call a web hook, or send an HTTP request elsewhere etc.

## Example

This middleware came to existance in order to warn when JWT tokens are almost expired. This would be implemented like this:

```js
const express = require('express');
const expressWarn = require('express-warn');

const app = express();

/* we need some jwt middleware (in this example), and we expect "req.token"
 * to be populated by the middleware
 */
const jwt = ...

/* We further assume the token to have properties "userId" and
 * "iat" (compare https://tools.ietf.org/html/rfc7519#section-4.1.6).
 */

const warn = expressWarn({
  keyFn: req => req.token.userId,
  warningFn: req => {
    const { iat, userId } = req.token;
    const now = new Date().getTime() / 1000;
    const slack = 60 /* minutes */ * 60;
    if (iat + slack > now) {
      return [ `token of user ${userId} expiring soon` ];
    }
    return undefined
  }
});

app.get('/protected', jwt, warn, (req, res, next) => {
  res.send('Here is protected information: abc')
})
```

If, instead of just logging the warning on the console, we want to call
a web hook or similar, we can do so (e.g. via the `request` package):

```js

...
const warn = expressWarn({
  ...
  log: (...args: Array<any>) => {
    request.post(
      'https://my-host.com/warnings',
      {
        body: {
          warning: args
        }
      }
    );
  }
})
```
