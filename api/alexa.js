const WEB_APP_URL =
  process.env.WEB_APP_URL || "https://cybersorfer.github.io/morning-weather/";

function kidSpeak(text) {
  const safe = String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return `<speak><amazon:domain name="conversational"><prosody rate="94%" pitch="+10%" volume="medium">${safe}</prosody></amazon:domain></speak>`;
}

function htmlStartResponse(speechText) {
  return {
    version: "1.0",
    response: {
      outputSpeech: { type: "SSML", ssml: kidSpeak(speechText) },
      directives: [
        {
          type: "Alexa.Presentation.HTML.Start",
          token: "morningWeatherSession",
          configuration: { timeoutInSeconds: 1800 },
          request: { url: WEB_APP_URL },
        },
      ],
      shouldEndSession: false,
    },
  };
}

function emptyResponse() {
  return { version: "1.0", response: { shouldEndSession: true } };
}

module.exports = (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = req.body || {};
  const type = body.request?.type;
  const intentName = body.request?.intent?.name;

  if (type === "LaunchRequest" || intentName === "AMAZON.HelpIntent") {
    res.status(200).json(
      htmlStartResponse("Hi friend! Opening your morning clothing guide.")
    );
    return;
  }

  if (intentName === "OpenWeatherIntent") {
    res.status(200).json(
      htmlStartResponse("Here comes your weather and outfit guide!")
    );
    return;
  }

  if (type === "Alexa.Presentation.HTML.Message") {
    const message = body.request?.message || {};
    if (message.type === "Speak" && message.text) {
      res.status(200).json({
        version: "1.0",
        response: {
          outputSpeech: { type: "SSML", ssml: kidSpeak(message.text) },
          shouldEndSession: false,
        },
      });
      return;
    }
  }

  if (type === "SessionEndedRequest") {
    res.status(200).json(emptyResponse());
    return;
  }

  res.status(200).json(emptyResponse());
};
