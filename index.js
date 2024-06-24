import { app } from "./app.js";

import userRouter from "./routes/user.js";
import mainRouter from "./routes/main.js";

const hostname = '127.0.0.1';
const port = 3000;

app.use("", mainRouter);
app.use("/user", userRouter);

app.get("/health", (req, resp) => {
  resp.json({
    health: "ok",
    active: true,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
