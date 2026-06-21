import {aiGroq} from "../Services/groq.js";
import { aiGemini } from "../Services/gemini";

const colors = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
};

export async function getAIResponse(userMessage , primaryModel , onToken){
    const secondaryModel = primaryModel === "groq" ? "gemini" : "groq";

    const callers = {
        groq :aiGroq,
        gemini : aiGemini,
    };

    try{
        const text = await callers[primaryModel](userMessage,onToken);
        return {text , modelUsed :primaryModel};
    }
    catch(primaryError){
        console.log(colors.red(`\n Primary Model (${primaryModel}) Failed : ${primaryError.message}`))
        console.log(colors.yellow(`Switching to ${secondaryModel}...`))

        try {
      const text = await callers[secondaryModel](userMessage, onToken);
      console.log(colors.green(`Response Generated Successfully using ${secondaryModel}.\n`));
      return { text, modelUsed: secondaryModel };
    } catch (secondaryError) {
      throw new Error(
        `Both models failed.\n- ${primaryModel}: ${primaryError.message}\n- ${secondaryModel}: ${secondaryError.message}`
      );
    }
  }
}
    
