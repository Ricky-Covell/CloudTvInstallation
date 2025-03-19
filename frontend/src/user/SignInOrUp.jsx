import React, { useState } from "react"
import UsernameForm from "./UsernameForm"

const SignInOrUp = ({ loadUser }) => {
  
  return (
    <div>
      <UsernameForm loadUser={loadUser}/>
    </div>
  )
}

export default SignInOrUp