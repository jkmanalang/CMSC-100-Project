import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";


export default class Login extends Component {

  constructor(props){
    super(props)

    this.state = {
      isLoggedIn: null,
    }

    this.login = this.login.bind(this);
  }

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
            this.setState({ isLoggedIn: true })
        } else {
            this.setState({ isLoggedIn: false })
        }
    })
  }

  // to handle login button onClick
  login(e) {
    e.preventDefault();

    const credentials = {
      email: document.getElementById("l-email").value,
      password: document.getElementById("l-password").value
    }

    // Send a POST request
    fetch(
      "http://localhost:3001/login",
      {
        method: "POST",
        // redirect: "/dashboard",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
      })
      .then(response => response.json())
      .then(body => {
        if(!body.success) {alert("Failed to log in");}
        else {
          // successful log in. store the token as a cookie

          const cookies = new Cookies();
          cookies.set(
            "authToken",
            body.token,
            {
              path: "localhost:3001/",
              age: 60*60, // 1 hour
              sameSite: "lax"
            });
            
            // storing username gotten from the server to local storage
            localStorage.setItem("username", body.username); // need user for client side rendering 
            localStorage.setItem("id", body.id); 
            // alert("Successfully logged in");
            this.setState({ isLoggedIn: true })
        }
      });
  }

  render() {

    if (!this.state.isLoggedIn) {
      // render the page
      return (
        <div className="login">
          <h2 className="title-text text">Log In</h2>
          <form className="login-form">
            <input className="index-input" type="text" id="l-email" placeholder="Email" />
            <input className="index-input" type="password" id="l-password" placeholder="Password" />
            <button className="button index-button" id="login" onClick={this.login}>Log In</button>
          </form>

          <br/>
          <p className="text">Doesn't have an account? <a href={"http://localhost:3000/signup"} className="link-text" >Sign Up</a></p>
        </div>
      )
    }

    else {
        // redirect 
        return <Navigate  to="/dashboard" />
    }

  }
}