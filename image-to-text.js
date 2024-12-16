const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager} = require("@google/generative-ai/server");
require('dotenv').config();

const fileManager = new GoogleAIFileManager(process.env.API_KEY);
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function run () {
    const uploadResult = await fileManager.uploadFile(
        "cat.jpeg",
        {
          mimeType: "image/jpeg",
          displayName: "cat image",
        },
    )
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = "tell me about this image.";
    const result = await model.generateContent([
        prompt,
        {
            fileData: {
                fileUri: uploadResult.file.uri,
                mimeType: uploadResult.file.mimeType,
            },
        },
    ]);
    console.log(result.response.text());
}
run();