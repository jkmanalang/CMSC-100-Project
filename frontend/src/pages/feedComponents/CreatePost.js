import React from "react";


export default function CreatePost (props) {


  return(
    <div className="create-post">
      <textarea type="text" required={true} id="content" placeholder={"What's on your mind, "+ localStorage.getItem("username")}/>

      <button id="post-button" className="button" onClick={() => props.createPosts()}>Post</button>
    </div>
  )

}