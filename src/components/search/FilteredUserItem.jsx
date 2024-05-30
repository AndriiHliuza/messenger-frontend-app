import { React } from "react";
import "./FilteredUserItem.css"

export default function FilteredUserItem(props) {

    const { userToShow, chosenUsers, setChosenUsers } = props;
    
    const onFilteredUserItemAddButtonClick = () => {
        let isUserAlreadyAdded = false;
        for (let i = 0; i < chosenUsers.length; i++) {
            if (chosenUsers[i].username === userToShow.username) {
                isUserAlreadyAdded = true;
            }
        }

        if (!isUserAlreadyAdded) {
            setChosenUsers([...chosenUsers, userToShow]);
        } else {
            window.alert("You have already added this user to the group");
        } 
    }

    return (
        <div className="filtered-user-item-container">
            <div className="filtered-user-item">
                <div className="filtered-user-item-info">
                    <h4>Username:</h4>
                    <div className="filtered-user-item-info-uniqueName">{userToShow.uniqueName}</div>
                </div>
                <div className="filtered-user-item-add-user-button" onClick={onFilteredUserItemAddButtonClick}>ADD</div>
            </div>
        </div>
    );
}