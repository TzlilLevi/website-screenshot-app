"use strict";

// export  - add in the end
export const handler = async (event) => {
  let videoPath = await takeSnapshot(event["url"]);
  console.log(videoPath);
  return videoPath;
};

//create screenshot
const takeSnapshot = async (url, videoshow) => {
  const puppeteer = require("puppeteer");
  let imageName = rendomImageName();

  const browser = await puppeteer.launch({
    defaultViewport: {
      width: 1280,
      height: 2000,
    },
  });
  const page = await browser.newPage();
  await page.goto(url);
  await page.screenshot({ path: `./images/${imageName}.png` });
  await browser.close();

  //create video from imageScreenshot
  return await createVideo(imageName);
};

const createVideo = async (imageName) => {
  const videoshow = require("videoshow");
  let image = [{ path: `./images/${imageName}.png` }];
  const videoOptions = {
    fps: 25,
    loop: 10,
    transition: false,
    videoBitrate: 1024,
    videoCodec: "libx264",
    size: "640x?",
    format: "mp4",
    pixelFormat: "yuv420p",
  };

  return new Promise((resolve, reject) =>
    videoshow(image, videoOptions, imageName)
      .save(`${__dirname}/videos/${imageName}.mp4`)
      .on("start", function (command) {
        console.log("Convertion started: " + command);
      })
      .on("error", function (err, stdout, stderr) {
        console.log("Error:" + err);
        reject(err);
      })
      .on("end", function (output) {
        console.log("Video created in:" + output);
        resolve({ file: `${output}` });
      })
  );
};

const rendomImageName = () => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

// move to test
// const event = {
//   url: "http://www.google.com",
// };

// handler(event);
