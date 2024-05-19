import { React, useState, useEffect } from "react";
import { useUserContext } from "../../routes/UserRoute";
import "./ProfilePage.css";
import { useAppContext } from "../../../App";
import { deletePost, getUserPosts } from "../../../axios/PostApi";

export default function ProfilePostsItem(props) {

    const { post, setPosts } = props;
    const { user, setInformMessage } = useAppContext();
    const { userProfile } = useUserContext();

    const onDeleteProfilePostButtonClick = async () => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            let deletePostResponse = await deletePost(post?.postId);
            let deletePostResponseData = deletePostResponse?.data;
            if (deletePostResponseData) {
                let postsResponse = await getUserPosts(userProfile?.username);
                let postsResponseData = postsResponse?.data;
                if (postsResponseData) {
                    setPosts(postsResponseData);
                }
                setInformMessage("Post was deleted");
            } else {
                setInformMessage("Post was not deleted");
            }
        }
    }

    return (
        <div className="profile-post-container">
            <div className="profile-post">
                <div className="profile-post-title">{post.title}</div>
                <hr />
                <div className="profile-post-content">{post.content}</div>
                {
                    user?.username === post?.user?.username
                        ? <div
                            className="profile-post-delete-button"
                            onClick={onDeleteProfilePostButtonClick}
                        >Delete</div>
                        : ""
                }
            </div>
        </div>
    );
}