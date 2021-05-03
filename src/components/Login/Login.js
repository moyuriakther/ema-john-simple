import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import React, { useContext, useState } from 'react';
import { UserContext } from "../../App";
import { useHistory, useLocation } from "react-router";


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function Login() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    issSignedIn : false,
    password: '',
    name:'',
    email:'',
    photo:''
  })

  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };


  const provider = new firebase.auth.GoogleAuthProvider();
  const facebookProvider= new firebase.auth.FacebookAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then((res) =>{
      const {displayName, photoURL, email} = res.user;
        const signedUser ={
          issSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedUser);
    })
    .catch(err => {
      console.log(err);
      console.log(err.message);
    })
  }

  const handleFbSignIn =() =>{
    firebase
  .auth()
  .signInWithPopup(facebookProvider)
  .then((result) => {
    var credential = result.credential;
    var user = result.user;
    var accessToken = credential.accessToken;
    console.log('fb user', user);
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;
    console.log('error', error);
  });
  }

  const handleSignOut =() =>{
    firebase.auth().signOut()
    .then(() => {
      const signOutUser = {
        issSignedIn : false,
        name : '',
        email : '',
        photo : '',
        error:'',
        success: false
      }
      setUser(signOutUser);
    }).catch((error) => {
      
    });
  }

const handleSubmit = (e) => {
  if(newUser && user.email && user.password){
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
  .then((userCredential) => {
    var user = userCredential.user;
    const newUserInfo = {...user};
    newUserInfo.error = '';
    newUserInfo.success = true;
    setUser(newUserInfo);
    updateUserName(user.name);
  })
  .catch((error) => {
    const newUserInfo = {...user};
    newUserInfo.error = error.message;
    newUserInfo.success = false;
    setUser(newUserInfo);
    });
  }

  if(!newUser && user.email && user.password){
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    const newUserInfo = {...user};
    newUserInfo.error = '';
    newUserInfo.success = true;
    setUser(newUserInfo);
    setLoggedInUser(newUserInfo);
    history.replace(from);
    console.log(newUserInfo, 'sign in user info');
  })
  .catch((error) => {
    const newUserInfo = {...user};
    newUserInfo.error = error.message;
    newUserInfo.success = false;
    setUser(newUserInfo);
  });
  }
  e.preventDefault();
}

const updateUserName = name =>{
  var user = firebase.auth().currentUser;

  user.updateProfile({
     displayName: name
    }).then(function() {
      console.log('update user name');
    }).catch(function(error) {
      console.log(error)
    });
}


const handleBlur =(e) =>{
  let isFieldValid = true;
  if(e.target.name === 'email'){
    isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
  }
  if(e.target.name === 'password'){
    const isPasswordValid = e.target.name.length>6;
    const isPasswordNumber = /\d{1}/.test(e.target.value);
    isFieldValid=isPasswordValid && isPasswordNumber;
  }
  if(isFieldValid){
    const newUserInfo ={...user};
    newUserInfo[e.target.name]=e.target.value;
    setUser(newUserInfo);
    console.log(newUserInfo);
  }
  
}
const success = user.success? <h3 style={{color:'green'}}>User Successfully {newUser ? 'Created' : 'Logged In'}</h3>
                            :<h3 style={{color:'red'}}>{user.error}</h3>;

  return (
    <div style={{textAlign:'center'}}>
     {
       user.issSignedIn ?
      <button onClick={handleSignOut}>Sign Out</button>:
      <button onClick={handleSignIn}>Sign In</button>
      } <br/>
      <button onClick={handleFbSignIn}>Sign in Facebook</button>
      {
        user.issSignedIn && <div>
          <h2> Welcome, {user.name}</h2>
          <p>{user.email}</p>
          <img src={user.photo} alt="img"/>
          </div>
      }

      <h1>Our Own Authentication</h1>
      <input type="checkbox" name="newUser" onChange={() =>setNewUser(!newUser)} id=""/>
      <label htmlFor="newUser">New User Sign Up</label>
    <form onSubmit={handleSubmit}>
      {newUser &&  <input type="text" name="name" onBlur={handleBlur} placeholder="Enter your name" required/>} <br/>
        <input type="email" name="email" onBlur={handleBlur} placeholder="Enter your email" required/> <br />
        <input type="password" name="password" onBlur={handleBlur} placeholder="Enter your password" autoComplete="on" required/> <br />
        <input type="submit" value={newUser ? 'Sign Up' : 'Sign In'}/>
    </form>
    {
      success
    }

    </div>
  );
}

export default Login;
