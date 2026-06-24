const WEB_APP_URL =
  process.env.WEB_APP_URL || "https://cybersorfer.github.io/morning-weather/";

function kidSpeak(text) {
  const safe = String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return `<speak><amazon:domain name="conversational"><prosody rate="94%" pitch="+10%" volume="medium">${safe}</prosody></amazon:domain></speak>`;
}

function buildSkill(Alexa) {
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
        .speak(kidSpeak("Hi friend! Opening your morning clothing guide."))
        .addDirective({
          type: "Alexa.Presentation.HTML.Start",
          data: {},
          token: "morningWeatherSession",
          configuration: { timeoutInSeconds: 1800 },
          request: { url: WEB_APP_URL },
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
        .speak(kidSpeak("Here comes your weather and outfit guide!"))
        .addDirective({
          type: "Alexa.Presentation.HTML.Start",
          data: {},
          token: "morningWeatherSession",
          configuration: { timeoutInSeconds: 1800 },
          request: { url: WEB_APP_URL },
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
        return handlerInput.responseBuilder.speak(kidSpeak(message.text)).getResponse();
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
        .speak(kidSpeak("Oops, something went wrong. Let's try again in a moment."))
        .getResponse();
    },
  };

  return Alexa.SkillBuilders.custom()
    .addRequestHandlers(
      LaunchRequestHandler,
      OpenWeatherIntentHandler,
      HtmlMessageHandler,
      SessionEndedHandler
    )
    .addErrorHandlers(ErrorHandler)
    .create();
}

module.exports = { buildSkill, WEB_APP_URL, kidSpeak };
