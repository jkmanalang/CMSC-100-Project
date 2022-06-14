import React from "react";
import CreatePost from "./CreatePost.js";
import ReactDOM from 'react-dom';


export default function Posts (props) {

  // for saving edited post. update database and state in Feed.js
  function saveEditedPost(postId){
    const inputId = "text"+postId;
    const buttonId = "button"+postId;
    const inputEdit = document.getElementById(inputId);
    const buttonEdit = document.getElementById(buttonId);

    if(inputEdit.value === "") {
      inputEdit.style.display = "none";
      buttonEdit.style.display = "none";
    } else {
      const details = {
        postId: postId,
        newTime: new Date(Date.now()),
        newContent: inputEdit.value
      }

      fetch(
        "http://localhost:3001/editpost",
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
            props.updatePosts()
            inputEdit.value = "";
          }
        });

      inputEdit.style.display = "none";
      buttonEdit.style.display = "none";
    }
  }

  function editPost(postId){
    const inputId = "text"+postId;
    const buttonId = "button"+postId;
    const inputEdit = document.getElementById(inputId);
    const buttonEdit = document.getElementById(buttonId);
    
    inputEdit.value = "";

    // getting property of display from style
    const value = window.getComputedStyle(ReactDOM.findDOMNode(inputEdit)).getPropertyValue("display");

    // hiding/showing of edit elements
    if(value === "none"){
      inputEdit.style.display = "inline-block";
      buttonEdit.style.display = "inline-block";
    } else {
      inputEdit.style.display = "none";
      buttonEdit.style.display = "none";
    }
  }

  // update database when a post is deleted. as well the state in Feed.js
  function deletePost(postId){
    fetch(
      "http://localhost:3001/deletePost",
      {
        method: "POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify({postId: postId})
      })
      .then(response => response.json())
      .then(body => {
        if(body.success) {
          props.updatePosts()
        }
      });
  }

  // show buttons and elements needed for edit post if the post is from the current user
  function showButtons(authorId, id, postId) {
    if(authorId === id){
      return(
        <div>
          <input className="edit-post-input" type="text" required={true} id={"text"+postId} style={{display: "none"}}/>
          <button className="post-buttons" id={"button"+postId} style={{display: "none"}} onClick={()=>saveEditedPost(postId)}>Post</button>
          <button className="post-buttons" id="editButton" onClick={()=>editPost(postId)}>Edit</button>
          <button className="post-buttons" id={"delete"+postId} onClick={()=>deletePost(postId)}>Delete</button>
        </div>
      )
    } 
    else return null
  }

  function getDate(date){
    const day = date.slice(0, 10)
    const time = date.slice(11,19)

    return day + " " + time
  }

  return (
    <div className={props.className}>

      {/* to create post */}
      <CreatePost createPosts={props.createPosts}/>

      {
        // showing all posts
        props.posts.map((post, index) => {
          return(
            <div key={index} className="post-div">
              <h3 className="post-content">{post.content}</h3>
              <p className="post-details">{post.authorName} • {getDate(post.timestamp)}</p>
              {showButtons(post.author, props.id, post._id)}
            </div>
          )
        })
      }

    </div>
      
  )

}