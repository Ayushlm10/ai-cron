import { OpenAIStream } from "ai";
import OpenAI from "openai";
import { CreateChatCompletionRequestMessage } from "openai/resources/chat/completions";

export default defineLazyEventHandler(async () => {
  const apiKey = useRuntimeConfig().openaiApiKey;
  if (!apiKey) throw new Error("Missing OpenAI API key");

  const openai = new OpenAI({
    apiKey: apiKey,
  });

  return defineEventHandler(async (event) => {
    // Extract the `prompt` from the body of the request
    const { messages } = (await readBody(event)) as {
      messages: CreateChatCompletionRequestMessage[];
    };

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      temperature: 0,
      max_tokens: 150,
      stop: [":"],
      messages: [
        {
          role: "system",
          content: `You will receive a text describing a cron expression.
        Your goal is to:
        - Convert the text to a valid cron expression.
        - The cron expression you generate must match this regular expression: "^((\*|[0-9]|[1-5][0-9]|60) |(\*|[0-9]|[1-5][0-9]|60) |(\*|[0-9]|[1-2][0-9]|3[0-1]) |(\*|[0-9]|[1-9]|[1-2][0-9]|3[0-1]|4[0-6]|5[0-3]) |(\*|[0-9]|[1-9]|1[0-2]))(\*|\/[0-9]|[0-9\-,\/]+) (\*|\/[0-9]|[0-9\-,\/]+) (\*|\/[0-9]|[0-9\-,\/]+) (\*|\/[0-9]|[0-9\-,\/]+) (\*|\/[0-9]|[0-9\-,\/]+)$"
        - Return only the generated cron expression and nothing else.
        Here are some examples:
        - Text: A cron that runs every hour
        - Cron: 0 * * * *
        - Text: A cron that runs ever 12 hour
        - Cron: 0 */12 * * *`,
        },
        {
          role: "user",
          content: `A cron job that runs every: ${
            messages[messages.length - 1].content
          }`,
        },
      ],
    });

    // Convert the response into a friendly text-stream
    return OpenAIStream(response);
  });
});
