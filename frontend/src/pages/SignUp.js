import React, { Component } from "react";

// this function will be used to determined if a character is a letter
const aChar = (character) => {
  if (character.toLowerCase() !== character.toUpperCase()) return true
}

const checkPass = (password) => {
  if(password.length < 8) return false

  let checker = 0

  // checking if password contain at least one number
  for (let i=0; i < password.length; i++) {
      if (!isNaN(password.charAt(i))) {
          checker ++;
          break;
      }
  }

  // checking if password contain at least one upper case letter
  for (let i=0; i < password.length; i++) {
      if (password.charAt(i) === password.charAt(i).toUpperCase() && aChar(password.charAt(i))) {
          checker++;
          break;
      }
  }

  // checking if password contain at least one lower case letter
  for (let i=0; i < password.length; i++) {
      if (password.charAt(i) === password.charAt(i).toLowerCase() && aChar(password.charAt(i))) {
          checker++;
          break;
      }
  }

  return (checker !== 3 ? false:true)
}

export default class SignUp extends Component {

  constructor(props){
    super(props)

    this.state = {
      password: "",
      r_password: ""
    }

    // this.signup = this.signup.bind(this);
    this.handlePwordChange = this.handlePwordChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleRepeatPword = this.handleRepeatPword.bind(this)
  }

  handlePwordChange(e){
    this.setState({ password: e.target.value })

    const repeatPword = document.getElementById('s-rpassword');

    // changing the disabled property of repeat password text input
    if ((e.target.value).length > 0) {
      repeatPword.disabled = false;
    } else {
      repeatPword.disabled = true;
    }
  }

  // to handle sign up button onClick
  handleSubmit(e){
    const form = document.getElementById('form-body');

    if (checkPass(this.state.password) && (this.state.password === this.state.r_password)){
      e.preventDefault()

      this.setState({ password: "", r_password: "" })
      // alert("Form submitted")

      const user = {
        fname: document.getElementById("s-fname").value,
        lname: document.getElementById("s-lname").value,
        email: document.getElementById("s-email").value,
        password: document.getElementById("s-password").value
      }
  
      // send a POST request to localhost:3001/signup
      fetch(
        "http://localhost:3001/signup",
        {
          method: "POST",
          headers:{
            "Content-Type": "application/json"
          },
          body: JSON.stringify(user)
        })
        .then(response => response.json())
        .then(body => {
          if(body.success) {alert("Successfully saved user");}
          else {alert("Failed to save user");}
        });

      form.reset()

    } else {
      e.preventDefault()
      alert("Form has errors.")
    }
  }

  handleRepeatPword(e){
    this.setState({ r_password: e.target.value })
  }

  render() {
    const errorPrompt = "8 character; 1 uppercase; 1 lowercase; 1 number";
    const repeatPwordPrompt = "password not match";

    return (
      <div className="signup">
        <h2 className="title-text text" >Sign Up</h2>

        <form id="form-body" className="signup-form" onSubmit={this.handleSubmit}>
          <input className="index-input" type="text" required={true} id="s-fname" placeholder="First Name"/> <br/> <br/>
  
          <input className="index-input" type="text" required={true} id="s-lname" placeholder="Last Name"/> <br/> <br/>

          <input className="index-input" type="email" id="s-email" required={true} placeholder="Email"/> <br/> <br/>
          
          <input className="index-input" onChange={this.handlePwordChange} type="password" required={true} id="s-password" placeholder="Password"/> 
          <p className="passwordValidator">{this.state.password === "" ? "":(checkPass(this.state.password) ? "":errorPrompt)}</p>   

          <input className="index-input" onChange={this.handleRepeatPword} type="password" required={true} id="s-rpassword" disabled={true} placeholder="Repeat Password"/>
          <p className="passwordValidator">{this.state.r_password === "" ? "" : (this.state.password === this.state.r_password ? "":repeatPwordPrompt)}</p>

          <button className="button index-button" type="submit">Submit</button>
        </form>

        <br/>
        <p className="text">Already have an account? <a href={"http://localhost:3000/"} className="link-text" >Login</a></p>
      </div>
    )
  }
}