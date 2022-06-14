import React, { Component } from "react";


export default class User extends Component {

  constructor(props){
    super(props)

    this.state = {
      id: window.location.search.replace("?id=", ""),
      fname: "",
      lname: "",
      email: "",
      friends: [],
      frequests: [],
      currentUserId: localStorage.getItem("id"),
      currentUserfrequests : [],
      posts: []
    }

    this.handleSendFriendReq = this.handleSendFriendReq.bind(this);
    this.buttonVisibility = this.buttonVisibility.bind(this);
    this.getPosts = this.getPosts.bind(this);
    this.getDate = this.getDate.bind(this);
  }

  componentDidMount() {

    // filling values of state
    fetch('http://localhost:3001/findUser', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id: this.state.id })
		})
    .then(response => response.json())
    .then(body => {
      this.setState({
        fname: body.fname,
        lname: body.lname,
        friends: body.friends,
        frequests: body.frequests,
        email: body.email
      })
    })

    // getting this user's friend request. this is to retrict sending friend request to this user.
    fetch('http://localhost:3001/findUser', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id: this.state.currentUserId })
		})
    .then(response => response.json())
    .then(body => {
      this.setState({
        currentUserfrequests: body.frequests
      })
    })

    this.getPosts()
  }

  // getting this user's posts
  getPosts() {
    const ids = {
      id: this.state.id,
      friendsId: []
    }

    fetch(
      "http://localhost:3001/getPosts",
      {
        method: "POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify(ids)
      })
      .then(response => response.json())
      .then(body => {
        this.setState({
          posts: body
        })
      });
  }

  // friend request sent. update database and this.state.frequests
  handleSendFriendReq() {
    const details = {
      friendRequestId: this.state.id,
      currentUser: this.state.currentUserId
    }

    fetch('http://localhost:3001/friendrequestsent', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify( details )
		})
    .then(response => response.json())
    .then(body => {
      if(body.success){
        this.setState({
          frequests: [...this.state.frequests, details.currentUser]
        })
      }
    });
  }

  // conditional elements. scenarios: already friend, sent friend request, this user sent you friend request, button for sending friend request
  buttonVisibility() {
    if(this.state.friends.includes(this.state.currentUserId)) return <p className="identifier">friend</p>
    else if (this.state.frequests.includes(this.state.currentUserId)) return <p className="identifier">friend request sent</p>
    else if (this.state.currentUserfrequests.includes(this.state.id)) return <p className="identifier">this user sent you a friend request</p>
    else return <button onClick={this.handleSendFriendReq} className="post-buttons">Send friend request</button>
  } 

  getDate(date) {
    const day = date.slice(0, 10)
    const time = date.slice(11,19)

    return day + " " + time
  }

  render() {
    return(
      <div className="user-page">
        <div className="user-div1">
          <h3 className="user-text">{this.state.fname} {this.state.lname}</h3>
          <p className="user-text"> &lt;{this.state.email}&gt; </p>
          {this.buttonVisibility()} 
          <br/> 
          <a href={"http://localhost:3000/dashboard"}>
            <button id="back-button">⇦</button> 
          </a>
        </div>

        <div className="user-div2">
        {
          // showing posts from this user
          this.state.posts.map((post, index) => {
            return(
              <div key={index} className="post-div">
                <h3 className="post-content">{post.content}</h3>
                <p className="post-details">{post.authorName} • {this.getDate(post.timestamp)}</p>
              </div>
            )
          })
        }
        </div>

      </div>
    )
  }
}
