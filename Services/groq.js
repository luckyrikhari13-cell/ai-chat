import Groq from "groq-sdk"

const groq = new Groq({
    apiKey : process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = "you are a freindly , and a helpful ai for a terminal chat app"


export async function aiGroq(userMessage , onToken){
    if(!userMessage || userMessage.trim() === "")
    {
        throw new Error("Empty input : create some message cant send the empty prompt")
    }
    if(!process.env.GROQ_API_KEY)
    {
        throw new Error("Missing the groq api key")
    }

    let fullText = "";

    const stream = await groq.chat.completions.create({
        temperature : 0.7,
        stream :true,
        model : "llama-3.3-70b-versatile",
        messages:[
            {role : "system" , content : SYSTEM_PROMPT},
            {role:"user", content:userMessage},
        ],
    });

    for await(const chunk of stream){
        const delta = chunk.choices?.[0]?.delta;
        if(typeof delta?.content === "string")
        {
            fullText += delta.content;
            if (onToken) onToken(delta.content);
        }
    }
    return fullText;
}

