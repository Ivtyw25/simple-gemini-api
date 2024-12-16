const { GoogleGenerativeAI } = require("@google/generative-ai");
const readline = require("readline");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let isAwaitingResponse = false;

async function run() { 
    const chat = model.startChat({
        history: [], //start with an empty history
        generationConfig: {
            maxOutputTokens: 500,
        },
    });

    //function to get user input and send it to the model using streaming
    function inputAndResponse() {
        if (!isAwaitingResponse) {
            rl.question("You: ", async (msg) => {
                if (msg.toLowerCase() == "exit") {
                    rl.close();
                } else {
                    try {
                        isAwaitingResponse = true;
                        const result = await chat.sendMessageStream(msg);
                        let text = ""
                        for await (const chunk of result.stream) {
                            const chunkText = await chunk.text();
                            console.log(chunkText);
                            text += chunkText;
                        }
                        isAwaitingResponse = false;
                        inputAndResponse();
                    } catch (error) {
                        console.log("Error: ", error);
                        isAwaitingResponse = false;
                    }
                }
            })
        } else {
            console.log("Please wait for the current response to complete");
        }
    }

    inputAndResponse();
}
run();