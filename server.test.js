const server = require("./server.js");
const path = require("path");

const event = {
  url: "http://www.google.com",
};

test("returns an object with url path", async () => {
  const result = await server.handler(event);
  expect(typeof result).toBe("object");
  let pathOfVideo = result.file;
  let fileName = path.basename(pathOfVideo);
  expect(path.extname(fileName)).toBe(".mp4");
}, 60000);
