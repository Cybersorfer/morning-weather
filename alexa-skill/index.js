/**
 * Alexa skill backend for "My Morning Weather"
 * Paste into Alexa Developer Console → Code tab (Node.js 18+ / ASK SDK v2)
 * OR deploy as AWS Lambda with skill endpoint.
 *
 * Before testing: set WEB_APP_URL to your HTTPS-hosted index.html
 */

const WEB_APP_URL = process.env.WEB_APP_URL || "https://YOUR-USERNAME.github.io/morning-weather/";

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "LaunchRequest" ||
      (handlerInput.requestEnvelope.request.type === "IntentRequest" &&
        handlerInput.requestEnvelope.request.intent.name === "AMAZON.HelpIntent")
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak("Opening your morning clothing guide!")
      .addDirective({
        type: "Alexa.Presentation.HTML.Start",
        data: {},
        token: "morningWeatherSession",
        configuration: {
          timeoutInSeconds: 1800,
        },
        request: {
          url: WEB_APP_URL,
        },
      })
      .getResponse();
  },
};

const OpenWeatherIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "OpenWeatherIntent"
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak("Here is your weather and outfit guide!")
      .addDirective({
        type: "Alexa.Presentation.HTML.Start",
        data: {},
        token: "morningWeatherSession",
        configuration: {
          timeoutInSeconds: 1800,
        },
        request: {
          url: WEB_APP_URL,
        },
      })
      .getResponse();
  },
};

const HtmlMessageHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "Alexa.Presentation.HTML.Message";
  },
  handle(handlerInput) {
    const message = handlerInput.requestEnvelope.request.message || {};
    if (message.type === "Speak" && message.text) {
      return handlerInput.responseBuilder.speak(message.text).getResponse();
    }
    return handlerInput.responseBuilder.getResponse();
  },
};

const SessionEndedHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "SessionEndedRequest";
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.error(error);
    return handlerInput.responseBuilder
      .speak("Sorry, something went wrong. Try again in a moment.")
      .getResponse();
  },
};

exports.handler = async function (event, context) {
  const Alexa = require("ask-sdk-core");
  const skillBuilder = Alexa.SkillBuilders.custom();

  return skillBuilder
    .addRequestHandlers(
      LaunchRequestHandler,
      OpenWeatherIntentHandler,
      HtmlMessageHandler,
      SessionEndedHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda()(event, context);
};
