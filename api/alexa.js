const Alexa = require("ask-sdk-core");
const { ExpressAdapter } = require("ask-sdk-express-adapter");
const express = require("express");
const { buildSkill } = require("../alexa-skill/skillFactory.cjs");

const SKILL_ID =
  process.env.ALEXA_SKILL_ID ||
  "amzn1.ask.skill.4b029178-4334-420f-acef-6396c4b23477";

const skill = buildSkill(Alexa);
const adapter = new ExpressAdapter(skill, false, false, null, SKILL_ID);

const app = express();
app.use(
  express.json({
    type: ["application/json", "application/json; charset=utf-8"],
  })
);
app.post("/", adapter.getRequestHandlers());
app.post("/api/alexa", adapter.getRequestHandlers());

module.exports = app;
