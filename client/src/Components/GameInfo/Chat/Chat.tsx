import React, { useState, useEffect } from 'react'
import { AiFillCloseCircle } from 'react-icons/ai'
const socket = require('../../../SocketConnection/Socket').socket

interface PassedProps {
    oppoId: string
};

export const Chat: React.FC<PassedProps> = ({ oppoId }) => {

    const [message, set_message] = useState<string>("");
    const [messageHistory, set_messageHistory] = useState<any[]>([]);

    const handleWriteMessage = (e: ChatEvent): void => {
        set_message(e.currentTarget.value)
    }

    useEffect(() => {
        console.log(messageHistory)
    }, [messageHistory])

    const sendMessage = (e: React.FormEvent<HTMLButtonElement>): void => {
        e.preventDefault()
        if (message) {
            console.log("sending message")
            socket.emit("sendingChatMessage", { id: oppoId, message: message });
            const newMessage = <li className="your_messaage">{message}</li>
            set_messageHistory(prev => [...prev, newMessage]);
            set_message("");
            let ele: any = document.getElementById("write_message");
            ele.value = "";
        }
        return;
    }

    useEffect(() => {
        socket.on("recieveChatMessage", (incomingMessage: string) => {
            const newMessage = <li className="their_message">{incomingMessage}</li>
            set_messageHistory(prev => [...prev, newMessage]);
        });
    }, []);

    const clearChat = (): void => {
        set_messageHistory([])
    }

    return (
        <div className="chat_container">
            <span title="clear chat" className="clear_chat" onClick={clearChat}><AiFillCloseCircle /></span>
            <div className="messages_display">
                <ul>
                    {messageHistory.map((message: HTMLLIElement) => (
                        <>
                            {message}
                        </>
                    ))}
                </ul>
            </div>
            <textarea
                placeholder="Write a message..."
                id="write_message"
                name="write_message"
                className="write_message"
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
