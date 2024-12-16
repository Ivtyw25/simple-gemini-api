const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

function fileToGenerativePart(path, mimeType) {
    return {
      inlineData: {
        data: Buffer.from(fs.readFileSync(path)).toString("base64"),
        mimeType
      },
    };
  }

const filePart1 = fileToGenerativePart("prompt_audio.mp3", "audio/mp3");

async function run () {

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = "";
    const audioParts = [
        filePart1,
    ]
    const result = await model.generateContent([prompt, ...audioParts]);
    console.log(result.response.text());
}
run();  