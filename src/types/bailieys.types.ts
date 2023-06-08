import makeWASocket, { MessageUpsertType, proto } from "@adiwajshing/baileys"

export type ISock = ReturnType<typeof makeWASocket>

export interface IMessage {
    messages: proto.IWebMessageInfo[],
    type: MessageUpsertType
}