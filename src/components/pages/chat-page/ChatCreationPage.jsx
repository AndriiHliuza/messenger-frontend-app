import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotFoundPage from "../alert-pages/NotFoundPage";
import { useAppContext } from "../../../App";
import { useUserContext } from "../../routes/UserRoute";
import { Form, Formik } from "formik";
import { ChatType } from "../../../utils/ChatType";
import FormItem from "../auth-pages/FormItem";
import { chatCreationSchema } from "../../../utils/validation-schemas/ValidationSchemaConfig";
import "./ChatCreationPage.css"
import Search from "../../search/Search";
import ChatCreationUserItem from "./ChatCreationUserItem";
import { createChat } from "../../../axios/ChatAPI";
import { USER_ROUTE } from "../../../config";
import { ChatMemberRole } from "../../../utils/ChatMemberRole";

export default function ChatCreationPage() {

    const { user, setInformMessage } = useAppContext();
    const { userProfile } = useUserContext();
    const navigate = useNavigate();
    const [chosenUsers, setChosenUsers] = useState([]);

    const onSubmit = async (values, actions) => {
        let chatName = values.chatName;
        if (chosenUsers.length !== 0 && values.chatName) {
            let usersToAddToChat = [];
            for (let i = 0; i < chosenUsers.length; i++) {
                usersToAddToChat[i] = {
                    chatId: null,
                    user: chosenUsers[i],
                    role: ChatMemberRole.MEMBER
                }
            }
            const response = await createChat(
                chatName,
                ChatType.GROUP_CHAT,
                usersToAddToChat
            );
            let chat = response?.data;
            if (chat) {
                actions.resetForm();
                setInformMessage("Chat '" + chat.name + "' was successfully created");
                navigate(USER_ROUTE + "/" + user.uniqueName + "/chats");
            } else {
                setInformMessage("Something went wrong. Chat wasn't created.");
                actions.resetForm();
            }
        } else {
            setInformMessage("Chat should have name and users");
        }
    }

    return (
        user.username === userProfile.username
            ? (
                <Formik
                    initialValues={{
                        name: "",
                        type: ChatType.GROUP_CHAT,
                        members: [],
                    }}
                    validationSchema={chatCreationSchema}
                    onSubmit={onSubmit}
                >
                    {({ isSubmitting }) => (
                        <div className="chat-creation-page-container">
                            <div className="chat-creation-form">
                                <h1>CREATE CHAT</h1>
                                <Form>
                                    <FormItem
                                        label="Chat name:"
                                        id="chatName"
                                        name="chatName"
                                        type="text"
                                        placeholder="Write chat name here..."
                                    />
                                    <div className="filtered-user-items-container">
                                        {
                                            chosenUsers.map((chosenUser) => <ChatCreationUserItem key={chosenUser.username} chosenUser={chosenUser} chosenUsers={chosenUsers} setChosenUsers={setChosenUsers} />)
                                        }
                                    </div>
                                    <button disabled={isSubmitting} type="submit">Create</button>
                                    <hr />
                                    <Search chosenUsers={chosenUsers} setChosenUsers={setChosenUsers} />
                                </Form>
                            </div>
                        </div>
                    )}
                </Formik>
            )
            : <NotFoundPage />
    );
}