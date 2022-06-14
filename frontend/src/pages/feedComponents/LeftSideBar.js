import React from "react";


export default function LeftSideBar (props) {

  return (
    <div className={props.className}>
      <input type="text" onChange={props.search} required={true} id="search" placeholder="Find someone?"/> <br/> <br/>

      {
        // showing all searched users
        props.users.map((user, index) => {
          if(props.currentUser === user._id) return null
          else {
            return (
              <div key={index}>
                <a href={"/user?id=" + user._id} key={index}>
                  <button className="searched-user"> {user.fname} {user.lname}</button> 
                </a>
              </div>
            )
          }
      })
      }
    </div>
      
  )

}