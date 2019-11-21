"use strict";

// Set up variables
const SUBSCRIPTION_KEY = process.env["COMPUTER_VISION_SUBSCRIPTION_KEY"];
const ENDPOINT = process.env["COMPUTER_VISION_ENDPOINT"];
if (!SUBSCRIPTION_KEY) {
  throw new Error(
    "Set your environment variables for your subscription key and endpoint."
  );
}

// Set up computer vision client
const ComputerVisionClient = require("@azure/cognitiveservices-computervision")
  .ComputerVisionClient;
const ApiKeyCredentials = require("@azure/ms-rest-js").ApiKeyCredentials;

const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({
    inHeader: { "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY }
  }),
  ENDPOINT
);

module.exports.handler = async function computerVision(context, req) {
  // Make sure to parse stringified content, else leave it be
  const BODY = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const IMAGE_URL = BODY.imageUrl;
  console.log("Image URL is:", IMAGE_URL);
  context.log("Image URL is:", IMAGE_URL);

  if (!IMAGE_URL) {
    return {
      status: 400,
      body: "No 'imageUrl' parameter in body!"
    };
  }

  if (IMAGE_URL) {
    try {
      const LABELS = await getLabelsFromImage(IMAGE_URL);
      console.log("Labels:", LABELS);
      context.log("Labels:", LABELS);

      return {
        status: 200,
        body: JSON.stringify(LABELS)
      };
    } catch (error) {
      console.log("Failed to analyze image:", error);
      context.log("Failed to analyze image:", error);

      return {
        status: 400,
        body: error
      };
    }
  }
};

const getLabelsFromImage = async imageUrl => {
  const DATA = await computerVisionClient.describeImage(imageUrl);
  const TAGS = DATA.tags;
  return TAGS.map(tag => tag.name);
};
