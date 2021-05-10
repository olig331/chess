import React, { useState, useEffect } from 'react'
import { AiFillCloseCircle } from 'react-icons/ai'
const socket = require('../../../SocketConnection/Socket').socket

interface PassedProps {
    oppoId: string;
    boardWidthHeight: number;
};

export const Chat: React.FC<PassedProps> = ({ oppoId, boardWidthHeight }) => {

    const [message, set_message] = useState<string>("");
    const [messageHistory, set_messageHistory] = useState<any[]>([]);

    const handleWriteMessage = (e: ChatEvent): void => {
        set_message(e.currentTarget.value)
    }

    const sendMessage = (e: React.FormEvent<HTMLButtonElement>): void => {
        e.preventDefault()
        if (message.split("").length > 1) {
            socket.emit("sendingChatMessage", { id: oppoId, message: message });
            const newMessage = <li className="your_messaage message"><span className="text">{message}</span></li>
            set_messageHistory(prev => [...prev, newMessage]);
            set_message("");
            let ele: any = document.getElementById("write_message");
            ele.value = "";
        }
        set_message("")
        return;
    }

    useEffect(() => {
        socket.on("recieveChatMessage", (incomingMessage: string) => {
            const newMessage = <li className="their_message message"><span className="text">{incomingMessage}</span></li>
            set_messageHistory(prev => [...prev, newMessage]);
        });
    }, []);

    const clearChat = (): void => {
        set_messageHistory([])
    }

    const handleKeyUp = (e: any) => {
        if (e.keyCode === 13) {
            sendMessage(e);
        }
        return;
    }

    return (
        <div
            className="chat_container"
            style={{ height: "calc(100% - 58px)", maxHeight: "550px" }}>
            <span
                title="clear chat"
                className="clear_chat"
                onClick={clearChat}>
                <AiFillCloseCircle />
            </span>
            <div
                id="messages_display"
                className="messages_display"
            >
                <ul>
                    {messageHistory.map((message: HTMLLIElement, index: number) => (
                        <React.Fragment key={index}>
                            {message}
                        </React.Fragment>
                    ))}
                </ul>
            </div>
            <textarea
                placeholder="Write a message..."
                id="write_message"
                name="write_message"
                className="write_message"
                value={message}
                onKeyUp={(e: any) => handleKeyUp(e)}
                onChange={(e: ChatEvent) => handleWriteMessage(e)}>
            </textarea>
            <button
                onClick={(e: React.FormEvent<HTMLButtonElement>) => sendMessage(e)}
                className="send_message">
                Send
            </button>
        </div>
    )
}
