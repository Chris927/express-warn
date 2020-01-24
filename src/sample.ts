import express from "express";
import warn from "./warn";

const app = express();

const warnOnMissingQueryParam = warn({
  keyFn: req => req.url,
  warningFn: (req, res) =>
    !req.query || !req.query.bla ? ['"bla" query parameter missing'] : undefined
});

app.use("/test", warnOnMissingQueryParam, (req, res) => res.send("test..."));

const listener = app.listen(process.env.PORT || 3000);
listener.on("listening", () =>
  console.log(
    `Listening on port ${
      // @ts-ignore
      listener.address().port
    }, try GET /test multiple times.`
  )
);
