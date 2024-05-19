import { React, useState, useEffect } from "react";
import { useUserContext } from "../../routes/UserRoute";
import { createPost, getUserPosts } from "../../../axios/PostApi";
import "./ProfilePage.css";
import ProfilePostsItem from "./ProfilePostItem";
import { useAppContext } from "../../../App";

export default function ProfilePostsArea() {

    const { user, setInformMessage } = useAppContext();
    const { userProfile } = useUserContext();
    const [posts, setPosts] = useState([]);
    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");

    useEffect(() => {
        async function getPosts() {
            let response = await getUserPosts(userProfile?.username);
            let data = response?.data;

            if (data) {
                setPosts(data);
            }
        }
        getPosts();
    }, [userProfile]);

    const onCreatePostButtonClick = async () => {
        if (postTitle && postContent) {
            let postCreationResponse = await createPost(userProfile, postTitle, postContent);
            let postCreationResponseData = postCreationResponse?.data;
            if (postCreationResponseData) {
                let postsResponse = await getUserPosts(userProfile?.username);
                let postsResponseData = postsResponse?.data;
                if (postsResponseData) {
                    setPosts(postsResponseData);
                }
                setInformMessage("New post was created")
                setPostTitle("");
                setPostContent("");
            }
        } else if (!postTitle) {
            setInformMessage("Provide Title")
        } else if (!postContent) {
            setInformMessage("Provide Content")
        }
    }

    return (
        <div className="user-posts-area-container">
            <div className="user-posts-area">
                <h2>Posts</h2>
                {
                    user?.username === userProfile?.username
                        ? <div className="user-post-textarea-container">
                            <div className="user-post-textarea">
                                <input
                                    type="text"
                                    id="postTitle"
                                    name="postTitle"
                                    className="user-post-content-title-input-field"
                                    placeholder="Title"
                                    value={postTitle}
                                    onChange={(event) => setPostTitle(event.target.value)}
                                />
                                <textarea
                                    className="user-post-content-textarea-field"
                                    id="postContent"
                                    name="postContent"
                                    value={postContent}
                                    placeholder='Share your thoghts'
                                    onChange={(event) => setPostContent(event.target.value)}
                                ></textarea>
                                <div
                                    className="user-post-create-button"
                                    onClick={onCreatePostButtonClick}
                                >Submit</div>
                                {
                                    posts.length !== 0
                                        ? <hr />
                                        : ""
                                }
                            </div>
                        </div>
                        : ""
                }
                {
                    posts.map((post) => {
                        return <ProfilePostsItem key={post.postId} post={post} setPosts={setPosts} />
                    })
                }
            </div>
        </div>
    );
}