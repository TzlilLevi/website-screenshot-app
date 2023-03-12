const server = require("./server.js");

// import { handler } from "./server.js";

const event = {
  url: "http://www.google.com",
};

test("returns an object with url path", async () => {
  const result = await server.handler(event);
  let path = result.file;
  expect(typeof result).toBe("object");
  expect(path.substr(path.length - 3)).toBe("mp4");
}, 60000);
