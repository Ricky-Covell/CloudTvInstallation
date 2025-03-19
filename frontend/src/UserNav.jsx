import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";

const UserNav = () => {
  const navigate = useNavigate()

  const userNavLinks = () => {
    return (
      <div>
        <a href="/">Cloud Journal</a>
        <a href="/">Capture</a>
        <a href="/">About</a>
        <a href="/">Auth</a>
      </div>
    )
  }

  const signupClicked = () => {
    navigate('/signup')
  }

  return (
    <div id="uNav-container" class='cloud-flexbox'>      
      {/* <h3>User Nav</h3> */}
          {/* <h1 id="cloudTV-logo">c    l    o    u    d    T    V </h1> */}
          {/* <a href="/"><h4>Cloud Journal</h4></a> */}
          {/* <a href="/"><h4>Capture</h4></a> */}
          {/* <a href="/"><h4>About</h4></a> */}
          {/* <a  onClick={signupClicked}><h4>Signup</h4></a> */}
    </div>
  )
}

export default UserNav