import React, { Component } from "react";
import { Navigate  } from "react-router-dom";
import Cookies from "universal-cookie";

import LeftSideBar from "./feedComponents/LeftSideBar.js";
import RightSideBar from "./feedComponents/RightSideBar.js";
import Posts from "./feedComponents/Posts.js";

export default class Feed extends Component {

  constructor(props){
    super(props);

    this.state = {
      checkedIfLoggedIn: false,
      isLoggedIn: null,
      username: localStorage.getItem("username"),
      id: localStorage.getItem("id"),
      searchedUsers: [],
      friends: [],
      friendsDetails: [],
      frequests: [],
      frequestsDetails: [],
      posts: []
    }

    this.logout = this.logout.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.acceptButton = this.acceptButton.bind(this);
    this.rejectButton = this.rejectButton.bind(this);
    this.updateFriendDeets = this.updateFriendDeets.bind(this);
    this.updateFRequestsDeets = this.updateFRequestsDeets.bind(this);
    this.getPosts = this.getPosts.bind(this);
    this.createPosts = this.createPosts.bind(this);
    this.updateFriendsAndRequest = this.updateFriendsAndRequest.bind(this);

  }

  // is a life cycle method. like constructor or render. no need to bind this keyword
  componentDidMount() {
    // Send POST request to check if user is logged in

    fetch("http://localhost:3001/checkIfLoggedIn",
    {
      method: "POST",
      credentials: "include"
    })
    .then(response => response.json())
    .then(body => {
      if(body.isLoggedIn) {
        this.setState({ checkedIfLoggedIn: true, isLoggedIn: true})
      } else {
        this.setState({ checkedIfLoggedIn: true, isLoggedIn: false })
      }
    })

    this.updateFriendsAndRequest();
  }

  // getting values for state.friends, frequests, name
  updateFriendsAndRequest(){
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
        friends: body.friends,
        frequests: body.frequests,
      }, () => {

        this.updateFriendDeets()
        this.updateFRequestsDeets()
        this.getPosts()

      });
    });
  }

  // populating the friend requests details
  updateFRequestsDeets(){
    fetch('http://localhost:3001/findUserMany', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ids: this.state.frequests })
    })
    .then(response => response.json())
    .then(body => {
      this.setState({
        frequestsDetails: body
      })
    })
  }
  
  // populating the friend details
  updateFriendDeets(){
    fetch('http://localhost:3001/findUserMany', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ids: this.state.friends })
    })
    .then(response => response.json())
    .then(body => {
      this.setState({
        friendsDetails: body
      });
    });
  }

  // for Right Side Bar -> remove cookies and remove item from local storage. set user as not logged in
  logout(e){
    e.preventDefault();

    // Delete cookie with authToken
    const cookies = new Cookies();
    cookies.remove("authToken");

    // Delete username in local storage
    localStorage.removeItem("username");
    localStorage.removeItem("id");

    this.setState({ isLoggedIn: false });
  }

  // for Left Side Bar -> getting users based on the user input. save to this.state.searchedUsers
  handleSearch() {
    const userSearch = document.getElementById("search").value;

    const post = {
      userName: userSearch,
      currentUser: this.state.id
    }

    // if input is empty, do not fetch
    if (post.userName === "" ) this.setState({ searchedUsers: []})
    else {
      fetch(
        "http://localhost:3001/search",
        {
          method: "POST",
          headers:{
            "Content-Type": "application/json"
          },
          body: JSON.stringify(post)
        })
        .then(response => response.json())
        .then(body => {
          this.setState({ 
            searchedUsers: body
          });
        });
    }
  }

  // for Right Side Bar -> update database when a friend request is ACCEPTED. reflect values in this state also
  acceptButton(idParam){

    const details = {
      id: this.state.id,
      acceptId: idParam
    }

    fetch(
      "http://localhost:3001/acceptRequest",
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
          this.updateFriendsAndRequest();
          this.getPosts()
        }
      });
  }

  // for Right Side Bar -> update database when a friend request is REJECTED. reflect values in this state also
  rejectButton(idParam) {
    const detail = {
      id: this.state.id,
      rejectId: idParam
    }

    fetch(
      "http://localhost:3001/rejectRequest",
      {
        method: "POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify(detail)
      })
      .then(response => response.json())
      .then(body => {
        if(body.success) {
          this.updateFriendsAndRequest();
        }
      });
  }

  // getting all posts that this user should see, saving to this.state.posts
  getPosts() {
    const ids = {
      id: this.state.id,
      friendsId: this.state.friends
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

  // for Posts component -> create post then reflect values to state
  createPosts() {
    const post = document.getElementById('content');

    const postDetail = {
      timestamp: new Date(Date.now()),
      author: localStorage.getItem("id"),
      authorName: localStorage.getItem("username"),
      content: post.value
    }

    fetch(
      "http://localhost:3001/newpost",
      {
        method: "POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify(postDetail)
      })
      .then(response => response.json())
      .then(body => {
        if(body.success) {
          console.log("Successfully saved post");
          this.getPosts();
        }
        else {alert("Failed to save post");}
        
      });

    post.value="";

  }

  render() {
    if (!this.state.checkedIfLoggedIn) {
      // delay redirect/render
      return (<div></div>)
    }

    else {
      if (this.state.isLoggedIn) {
        // render the page
        return (
          <div className="feed">
            {/* this div is just a placeholder for the fixed positioned LeftSideBar */}
            <div className="leftsidebar-placeholder"></div>

            {/* left side bar of feed */}
            <LeftSideBar className="left-side-bar" search={this.handleSearch} users={this.state.searchedUsers} currentUser={this.state.id}/>

            {/* middle part of feed */}
            <Posts className="posts" username={this.state.username} 
              id={this.state.id} posts={this.state.posts} createPosts={this.createPosts}
              showEditButton={this.showEditButton} updatePosts={this.getPosts}/>

            {/* right side bar of feed */}
            <RightSideBar className="right-side-bar" logout={this.logout} 
              freqDetails={this.state.frequestsDetails} 
              friendsDetails={this.state.friendsDetails}
              acceptButton={this.acceptButton}
              rejectButton={this.rejectButton}
              updateFriendsAndRequest={this.updateFriendsAndRequest}/>
          </div>
        )
      }

      else {
        // redirect if user is not logged in
        return <Navigate  to="/" />
      }
    }
  }
}