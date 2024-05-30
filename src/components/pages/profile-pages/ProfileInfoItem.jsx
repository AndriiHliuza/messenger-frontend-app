import { React } from "react";
import "./ProfileInfo.css";

export default function UserInfoItem(props) {

    const { itemName, itemValue } = props;

    return (
      <div className="user-info-item">
        <div className="item-name">{itemName}</div>
        <div className="item-value">{itemValue}</div>
      </div>
    );
  }