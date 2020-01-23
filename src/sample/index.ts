import express from "express";

const app = express();

app.use("/test", (req, res) => res.send("test..."));

const listener = app.listen(process.env.PORT || 3000);
listener.on("listening", () =>
  console.log(
    `Listening on port ${
      // @ts-ignore
      listener.address().port
    }, try GET /test multiple times.`
  )
);
