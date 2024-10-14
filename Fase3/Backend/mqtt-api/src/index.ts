import app from "./app";

const port = app.get("port");

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
