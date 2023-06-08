import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
} from "@adiwajshing/baileys";
import { Boom } from "@hapi/boom";
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
import { readFromFile, writeToFile } from "./utils/file-handeling";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const generate_reply = async (from: string, text: string) => {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "user", content: `${from}: ${text}` },
    ],
  });
  const choices = completion.data.choices;

  return choices[Math.floor(Math.random() * choices.length)].message.content;
};

// -----------------Globals-----------------
let chatgptEnabled = false;
const filename = 'numbers.txt'
const trusted_numbers = readFromFile(filename);

// -----------------------------------------

const addToTrustedMember = (user) => {
    trusted_numbers.add(user);
    writeToFile(filename, trusted_numbers);
    return `Added ${user} to trusted numbers`;
  };
  
  const deleteFromTrustedMember = (user) => {
    trusted_numbers.delete(user);
    writeToFile(filename, trusted_numbers);
    return `Removed ${user} from trusted numbers`;
  };
  
const enableChatgpt = async () => {
  chatgptEnabled = true;

  return "Chat GPT Enabled";
};
const disableChatgpt = () => {
  chatgptEnabled = false;
  return "Chat GPT Disabled";
};

const commands = {
  add: addToTrustedMember,
  remove: deleteFromTrustedMember,
  enable: enableChatgpt,
  disable: disableChatgpt,
};

const command_handler = async (text): Promise<string> => {
  const tokens = text.split(" ");
  const cmd = tokens[0];
  const args = tokens.slice(1);

  if (commands[cmd] === undefined) return "Invalid Command";
  try {
    return commands[cmd](...args);
  } catch {
    console.log("Invalid command");
    return "Invalid Command";
  }
};

async function main() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
  const sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
  });
  sock.ev.on("creds.update", saveCreds);
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      if (lastDisconnect == undefined) return;
      const shouldReconnect =
        (lastDisconnect.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      console.log(
        "connection closed due to ",
        lastDisconnect.error,
        ", reconnecting ",
        shouldReconnect
      );
      // reconnect if not logged out
      if (shouldReconnect) {
        main();
      }
    } else if (connection === "open") {
      console.log("opened connection");
    }
  });

  sock.ev.on("messages.upsert", async (m) => {
    // console.log("Got Message", JSON.stringify(m, undefined, 2))
  
    try {
      if (m.messages.length == 0) return;
      const text =
        m.messages[0].message?.extendedTextMessage?.text ||
        m.messages[0].message?.conversation;
      const fromID = m.messages[0].key.remoteJid;
      const from = fromID.split("@")[0];
  
      if (m.messages[0].key.fromMe) {
        if (!text.startsWith("!")) return;
        const resp = await command_handler(text.slice(1));
        sock.sendMessage(fromID, { text: resp });
        return;
      }
  
      if (!chatgptEnabled || !trusted_numbers.has(from)) return;
      if (text.length >= 128 || text.length<=3 || !text.toLowerCase().startsWith("ai")) return;
      console.log(`Generating response for: ${text}`)
  
      
      await sock.sendMessage(fromID, { text: await generate_reply(from, text.slice(2)) });
    } catch (error) {
      console.log(error)
    }
  });
}

// run in main file
main();
