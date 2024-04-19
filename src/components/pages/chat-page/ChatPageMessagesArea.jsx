import { React, useState, useRef, useEffect } from 'react';
import "./ChatPageMessagesArea.css";
import ChatPageMessage from './ChatPageMessage';
import { sendMessageToChat } from '../../../axios/MessageApi';
import { MessageType } from '../../../utils/MessageType';
import forge from "node-forge";
import CryptoJS from "crypto-js";

export default function ChatPageMessagesArea(props) {

    const chatPageMessagesArea = useRef();
    const { chat, setChat, isMemberTabOpened } = props;
    const [textValue, setTextValue] = useState("");

    useEffect(() => {
        chatPageMessagesArea.current.scrollTop = chatPageMessagesArea.current.scrollHeight;
    }, [chat]);

    const onSendMessageButtonClick = async () => {
        let chatId = chat.id;
        if (textValue && chatId) {
            let publicKeyString = localStorage.getItem("server-public-key");
            if (publicKeyString) {
                publicKeyString = "-----BEGIN PUBLIC KEY-----\n" + publicKeyString + "\n-----END PUBLIC KEY-----"
                let publicKey = forge.pki.publicKeyFromPem(publicKeyString);
                let encryptedText = forge.util.encode64(publicKey.encrypt(textValue))
                let response = await sendMessageToChat(chatId, encryptedText, MessageType.NEW_CHAT_MESSAGE);
                let sentMessage = response?.data;
                if (!sentMessage) {
                    window.alert(`Your message "${textValue}" wasn't sent`);
                }
                setTextValue("");
            }
        }
    }

    return (
        <div className={isMemberTabOpened ? "hide-chat-page-messages-area-container" : "chat-page-messages-area-container"}>
            <div className="chat-page-messages-area" ref={chatPageMessagesArea}>
                {
                    chat.messages.map((message) => {
                        return <ChatPageMessage key={message.sendTime} chat={chat} setChat={setChat} message={message} />
                    })
                }
            </div>
            <div className="chat-page-write-message-area-container">
                <div className="chat-page-write-message-area">
                    <textarea
                        id="message"
                        name="message"
                        value={textValue}
                        placeholder='Type here...'
                        onChange={(event) => setTextValue(event.target.value)}
                        className="chat-page-write-message-textarea"
                    ></textarea>
                    <div className="chat-page-send-message-button" onClick={onSendMessageButtonClick}>Send</div>
                </div>
            </div>
        </div>
    );
}