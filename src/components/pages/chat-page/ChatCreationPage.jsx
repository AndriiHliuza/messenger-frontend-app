import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../alert-pages/LoadingPage";
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

export default function ChatCreationPage() {

    const { user } = useAppContext();
    const { userProfile } = useUserContext();
    const [isLoading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [chosenUsers, setChosenUsers] = useState([]);

    // useEffect(() => {
    //     setTimeout(() => {
    //         setLoading(false);
    //     }, 300);
    // }, []);

    const onSubmit = async (values, actions) => {
        let chatName = values.chatName;
        if (chosenUsers.length !== 0 && values.chatName) {
            let usersToAddToChat = [];
            for (let i = 0; i < chosenUsers.length; i++) {
                usersToAddToChat[i] = {
                    chatId: null,
                    user: chosenUsers[i],
                    role: null
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
                window.alert("Chat " + chat.name + " was successfully created");
                navigate(USER_ROUTE + "/" + user.uniqueName + "/chats");
            } else {
                window.alert("Something went wrong. Chat wasn't created. Try again!")
                actions.resetForm();
            }
        } else {
            window.alert("Chat should have name and users");
        } 
    }

    return (
        // isLoading
        //     ? <LoadingPage />
        //     : 
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