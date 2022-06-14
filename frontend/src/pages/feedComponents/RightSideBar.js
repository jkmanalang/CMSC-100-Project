import React from "react";


export default function RightSideBar (props) {

  // when unfriended. update the database as well as the state in Feed.js using props function
  function handleUnfriend(friendId){
    const details = {
      id: localStorage.getItem("id"),
      friendId: friendId
    }

    fetch(
      "http://localhost:3001/unfriend",
      {
        method: "POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify(details)
      })
      .then(response => response.json())
      .then(body => {
        if(body.success) {
          props.updateFriendsAndRequest();
        }
      });
  }

  return (
    <div className={props.className}>
      <h3 className="r-sidebar-title">Friend Requests</h3>
      {
        // showing all friend requests
        props.freqDetails.map((req, index) => {
          return (
            <div className="f-fr" key={index}>
              <p className="name">{req.fname} {req.lname}</p>
              <button className="post-buttons r-buttons" onClick={()=>props.acceptButton(req._id)}>accept</button>
              <button className="post-buttons r-buttons" onClick={()=>props.rejectButton(req._id)}>reject</button>
            </div>
          )
        })
      }

      <h3 className="r-sidebar-title friends">Friends</h3>
      {
        // showing all friends
        props.friendsDetails.map((friend, index) => {
          return (
            <div className="f-fr" key={index}>
              <p className="name">{friend.fname} {friend.lname}</p>
              <button className="post-buttons r-buttons" onClick={()=>handleUnfriend(friend._id)}>unfriend</button>
            </div>
          )
        })
      }

      <br/><br/><br/>
      <button className="post-buttons logout" id="logout" onClick={props.logout}>LOG OUT</button>
    </div>
      
  )
}