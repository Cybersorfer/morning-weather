const Alexa = require("ask-sdk-core");
const { getLambdaHandler } = require("../alexa-skill/skillFactory.cjs");

const handler = getLambdaHandler(Alexa);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const response = await handler(req.body, {});
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Skill handler failed" });
  }
};
