"use strict";
const puppeteer = require("puppeteer");
const videoshow = require("videoshow");

export const handler = async (event) => {
  const videoPath = await takeSnapshot(event["url"]);
  console.log("The video file Obj:\n", videoPath);
  return videoPath;
};

//create screenshot
const takeSnapshot = async (url) => {
  const imageName = randomImageName();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.screenshot({ path: `./${imageName}.png` });
  await browser.close();
  //create video from imageScreenshot
  return createVideo(imageName);
};

const createVideo = async (imageName) => {
  const image = [{ path: `./${imageName}.png` }];
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
    videoshow(image, videoOptions)
      .save(`${__dirname}/${imageName}.mp4`)
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

const randomImageName = () => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};
