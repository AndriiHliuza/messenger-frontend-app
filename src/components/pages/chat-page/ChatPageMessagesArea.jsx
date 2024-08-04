import { React, useState, useRef, useEffect } from 'react';
import "./ChatPageMessagesArea.css";
import ChatPageMessage from './ChatPageMessage';
import { sendMessageToChat, updateMessageInChat } from '../../../axios/MessageApi';
import { MessageType } from '../../../utils/MessageType';
import forge from "node-forge";
import CryptoJS from 'crypto-js';
import { useAppContext } from '../../../App';
import Picker from '@emoji-mart/react'

export default function ChatPageMessagesArea(props) {

    const { setInformMessage } = useAppContext();
    const chatPageMessagesArea = useRef();
    const messageTextAreaRef = useRef();
    const { chat, setChat, isMemberTabOpened, isAdmin } = props;
    const [textValue, setTextValue] = useState("");
    const [updatedMessage, setUpdatedMessage] = useState(null);
    const [isMessageUpdating, setMessageUpdating] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleEmojiSelect = (emoji) => {
        let cursorPosition = messageTextAreaRef.current.selectionStart;
        let textStart = textValue.substring(0, cursorPosition);
        let textEnd = textValue.substring(cursorPosition);
        setTextValue(textStart + "" + emoji.native + "" + textEnd);
    }

    useEffect(() => {
        chatPageMessagesArea.current.scrollTop = chatPageMessagesArea.current.scrollHeight;
    }, [chat]);

    useEffect(() => {
        let content = updatedMessage?.content;
        if (content) {
            setTextValue(content);
        } else {
            setTextValue("");
        }
    }, [updatedMessage])

    const onCancelMessageUpdatingButtonClick = () => {
        setMessageUpdating(false);
        setUpdatedMessage(null);
    }

    const onConfirmMessageUpdatingButtonClick = async () => {
        let chatId = chat.id;
        let messageId = updatedMessage?.id;
        if (textValue && chatId && messageId && textValue != updatedMessage?.content) {
            let aesKey = localStorage.getItem("aes-key");
            if (aesKey) {
                let rawKey = CryptoJS.enc.Base64.parse(aesKey);
                let encryptedText = CryptoJS.AES.encrypt(textValue, rawKey, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
                let encryptedData = encryptedText.ciphertext.toString(CryptoJS.enc.Base64);
                let messageId = updatedMessage?.id;
                let message = {
                    id: updatedMessage?.id,
                    sender: updatedMessage?.sender,
                    chatId: updatedMessage?.chatId,
                    content: encryptedData,
                    sendTime: updatedMessage?.sendTime,
                    type: updatedMessage?.type,
                    status: updatedMessage?.status
                }
                let response = await updateMessageInChat(chatId, messageId, message);
                let data = response?.data;
                if (data) {
                    setMessageUpdating(false);
                } else {
                    setInformMessage(`Your message "${textValue}" wasn't updated`);
                }
                setTextValue("");
                setShowEmojiPicker(false);
            }
        } else {
            window.alert(`Your message "${textValue}" wasn't changed`);
        }
    }

    const onSendMessageButtonClick = async () => {
        let chatId = chat.id;
        if (textValue && chatId) {
            let aesKey = localStorage.getItem("aes-key");
            if (aesKey) {
                let rawKey = CryptoJS.enc.Base64.parse(aesKey);
                let encryptedText = CryptoJS.AES.encrypt(textValue, rawKey, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
                let encryptedData = encryptedText.ciphertext.toString(CryptoJS.enc.Base64);
                let response = await sendMessageToChat(chatId, encryptedData, MessageType.NEW_MESSAGE);
                let sentMessage = response?.data;
                if (!sentMessage) {
                    setInformMessage(`Your message "${textValue}" wasn't updated`);
                }
                setTextValue("");
                setShowEmojiPicker(false);
            }
        }
    }

    return (
        <div className={isMemberTabOpened ? "hide-chat-page-messages-area-container" : "chat-page-messages-area-container"}>
            <div className="chat-page-messages-area" ref={chatPageMessagesArea}>
                {
                    chat.messages.map((message) => {
                        return <ChatPageMessage
                            key={message.sendTime}
                            chat={chat}
                            setChat={setChat}
                            message={message}
                            setUpdatedMessage={setUpdatedMessage}
                            isMessageUpdating={isMessageUpdating}
                            setMessageUpdating={setMessageUpdating}
                            isAdmin={isAdmin}
                        />
                    })
                }
            </div>
            <div className="chat-page-write-message-area-container">
                <div className="chat-page-write-message-area">
                    <textarea
                        ref={messageTextAreaRef}
                        id="message"
                        name="message"
                        value={textValue}
                        placeholder='Type here...'
                        onChange={(event) => setTextValue(event.target.value)}
                        className="chat-page-write-message-textarea"
                    ></textarea>
                    <div className="emoji-area">
                        <button className="emoji-picker-button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😀</button>
                        {showEmojiPicker && (
                            <div className="emoji-picker-container">
                                <Picker onEmojiSelect={handleEmojiSelect} />
                            </div>
                        )}
                    </div>
                    {
                        isMessageUpdating
                            ? <>
                                <div className="chat-page-send-message-button" onClick={onCancelMessageUpdatingButtonClick}>Cancel</div>
                                <div className="chat-page-send-message-button" onClick={onConfirmMessageUpdatingButtonClick}>Update</div>
                            </>
                            : <div className="chat-page-send-message-button" onClick={onSendMessageButtonClick}>Send</div>
                    }

                </div>
            </div>
        </div>
    );
}