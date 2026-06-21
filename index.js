import "dotenv/config";
import readline from "readline";

import { getAIResponse } from "./utilites/fallback.js";

const colors = {
    cyan: (s) => `\x1b[36m${s}\x1b[0m`,
   magenta: (s) => `\x1b[35m${s}\x1b[0m`,
   gray: (s) => `\x1b[90m${s}\x1b[0m`,
   green: (s) => `\x1b[32m${s}\x1b[0m`,
}

let currentModel = "groq";

const r1 = readline.createInterface({
    input:process.stdin,
    output:process.stdout,
});

function printHelp(){
    console.log(colors.gray(`
        Commands:
  /groq    Switch primary model to Groq
  /gemini  Switch primary model to Gemini
  /clear   Clear the terminal screen
  /help    Show this help message
  /exit    Quit the chat
        `));
}

function askQuestion(){
    r1.question(colors.cyan("User: "), async (input) => {
        const text = input.trim();

        if(text === ""){
            console.log(colors.gray("empty input ignored . type something or type /help"))
            return askQuestion();
        }

        switch(text){
        case "/exit":
        console.log(colors.gray("Goodbye!"));
        r1.close();
        return;

        case "/groq":
        currentModel = "groq";
        console.log(colors.green("Using Groq Model\n"));
        return askQuestion();

        case "/gemini":
        currentModel = "gemini";
        console.log(colors.green("Using Gemini Model\n"));
        return askQuestion();

        case "/clear":
        console.clear();
        return askQuestion();

        case "/help":
        printHelp();
        return askQuestion();

        default:
        break;
        }

        try {
      process.stdout.write(colors.magenta(`AI (${currentModel}): `));
 
      const { text: responseText, modelUsed } = await getAIResponse(
        text,
        currentModel,
        (token) => process.stdout.write(token)
      );
 
      if (modelUsed !== currentModel) {
        console.log(colors.gray(`\n(Note: this reply came from ${modelUsed} as a fallback.)`));
      }
 
      console.log("\n");
    } catch (err) {
      console.log(colors.gray(`\n[Error] ${err.message}\n`));
    }
 
    askQuestion();
    });
}

console.log(colors.gray("=== Terminal AI Chat (Groq + Gemini) ==="));
console.log(colors.gray(`Starting model: ${currentModel}`));
printHelp();
 
askQuestion();
