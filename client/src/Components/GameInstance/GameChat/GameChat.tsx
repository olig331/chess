import React, { useState, useEffect } from 'react'
const socket = require('../../../SocketConnection/Socket').socket

interface PassedProps {
    oppoId: string;
}


export const GameChat: React.FC<PassedProps> = ({ oppoId }) => {

    const [message, set_message] = useState<string>("");
    const [messageHistory, set_messageHistory] = useState<any[]>([]);

    useEffect(() => {
        socket.on("recieveMessage", (message: string) => {
            updateMessages(message, "their_message")
        })
    })

    const updateMessage = (e: React.FormEvent<HTMLTextAreaElement>): void => {
        set_message(e.currentTarget.value);
    }

    const updateMessages = (text: string, sender: string): void => {
        let newMessage: any = <li className={sender}>{message}</li>
        set_messageHistory(prev => [...prev, newMessage]);
    }

    const sendChatMessage = (): void => {
        if (message) {
            socket.emit("sendingMessage", { toId: oppoId, text: message });
            updateMessages(message, "my_messege")
            let writeArea: any = document.getElementById("write_messege")
            writeArea.value = ""
        }
        return;
    }


    return (
        <div className="chat_container">
            <ul>
                {messageHistory.map((renderMessage: any) => (
                    <>
                        {renderMessage}
                    </>
                ))}
            </ul>

            <textarea
                onChange={updateMessage}
                name="write_area"
                id="write_area"
                placeholder="Write a message...">
            </textarea>
            <button
                className="send_message_btn"
                onClick={() => { sendChatMessage(); set_message("") }}>
                Send
            </button>
        </div>
    )
}
