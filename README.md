# ML image labeling service, using Azure Cognitive Services (Computer Vision)

This repo contains the source code for a machine learning-powered image labeling service, running as a serverless backend function.

This is a mildly adapted version of what I have done previously with [gcp-ml-image-labeling-service](https://github.com/mikaelvesavuori/gcp-ml-image-labeling-service).

This will be of great usage if you want to quickly set up an image tagging service or you could extend it to be used for checking if any posted images contain graphic/adult content.

## Prerequisites and setup

- You will need a Microsoft Azure account; if you don't have one, [set one up for free and get credit to use](https://azure.microsoft.com/en-us/free/‎)
- In the Azure Portal, you should create a new Computer Vision plan: tie it to your subscription, place it in a nearby location, and use the `F0` (free) pricing tier
- Click `Go to resource` and you should be presented with a key and an endpoint
- I've provided a `.env-example` where you should enter your key and endpoint (only change the first bit of the URL, don't remove the "vision..." thing); then copy that into a `.env` file so that `serverless.yml` will pick up those values when deploying

### Verify your computer vision API works

In the same view in Azure Portal, you should be presented with the possibility of testing your computer vision API. Try this if you want.

You can also do this manually by using a [curl](https://idratherbewriting.com/learnapidoc/docapis_understand_curl.html), or a client like [Insomnia](https://insomnia.rest) or [Postman](https://www.getpostman.com). You will need to set a request header to `Ocp-Apim-Subscription-Key` and its value to your key. The endpoint to test is your URL that looks similar to the endpoint in `.env-example` such as `https://computervisionslsdemo.cognitiveservices.azure.com/vision/v2.0/analyze?visualFeatures=Tags&language=en`.

An example payload is:

```
{
	"url": "https://uploads1.wikiart.org/images/giorgio-de-chirico/mystery-and-melancholy-of-a-street-1914.jpg"
}
```

Your response should be similar to:

```
{
  "tags": [
    {
      "name": "drawing",
      "confidence": 0.96886646747589111
    },
    {
      "name": "painting",
      "confidence": 0.958083987236023
    },
    {
      "name": "outdoor",
      "confidence": 0.85384196043014526
    },
    {
      "name": "art",
      "confidence": 0.78801882266998291
    },
    {
      "name": "cartoon",
      "confidence": 0.77362155914306641
    },
    {
      "name": "old",
      "confidence": 0.68285751342773438
    },
    {
      "name": "illustration",
      "confidence": 0.60438573360443115
    },
    {
      "name": "child art",
      "confidence": 0.53828060626983643
    }
  ],
  "requestId": "65245df9-65c5-4582-80ea-dd63dfef5cf0",
  "metadata": {
    "width": 755,
    "height": 927,
    "format": "Jpeg"
  }
}
```

## Installation

- I am assuming that you will use [Serverless Framework](https://serverless.com) to deploy it (however you can certainly do that manually), which necessitates that you install it
- Install [azure-function-core-tools](https://github.com/Azure/azure-functions-core-tools), which is needed for Serverless Framework to work with Azure

## Instructions

### Deployment

Just run `sls deploy` and it should deploy just fine, given that you configured the above steps and have a GCP account.

Note that the file `host.json` specifies that one part of the path should be cut. The final path should look something like `sls-neur-dev-azure-ml-image-labeling-service.azurewebsites.net/getImageLabels`;

### Using the labeling service

Do a POST request to your URL, which will be similar to `sls-neur-dev-azure-ml-image-labeling-service.azurewebsites.net/getImageLabels`.

Send a payload with the body containing an `imageUrl` key with the value being the URL for an image, so it looks like this:

```
{
	"imageUrl": "https://uploads1.wikiart.org/images/giorgio-de-chirico/mystery-and-melancholy-of-a-street-1914.jpg"
}
```

Your response should come back similar to the below:

```
[
  "drawing",
  "painting",
  "outdoor",
  "art",
  "cartoon",
  "old",
  "illustration",
  "child art"
]
```

## Tech used in this repo

- [Azure Functions](https://azure.microsoft.com/sv-se/services/functions/) is an event-driven, serverless _function-as-a-service_ offering that enables us to run backends without any server management
- [Computer Vision API](https://azure.microsoft.com/sv-se/services/cognitive-services/computer-vision/) uses machine learning to infer labels and other information from images
