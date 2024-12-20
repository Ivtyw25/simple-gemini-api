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

const filePart1 = fileToGenerativePart("cat.jpeg", "image/jpeg");
const filePart2 = fileToGenerativePart("dog.jpeg", "image/jpeg");

async function run () {

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = "tell me about these two images.";
    const imageParts = [
        filePart1,
        filePart2,
    ]
    const result = await model.generateContent([prompt, ...imageParts]);
    console.log(result.response.text());
}
run();  