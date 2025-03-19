import React, { useState } from "react"
import { useNavigate } from "react-router"

const UsernameForm = ({ loadUser }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: ''
  })

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData(data => ({ ...data, [name]: value }))
  }

  const handleSubmit= async (evt) => {
    navigate('/')
    evt.preventDefault();
    let result = await loadUser(formData.username);
    if (result.success) {
      navigate('/');
    } else {
      setFormErrors(result.errors);
    }
  }

  return (
     <div>
        <form action="post" onSubmit={handleSubmit}>
          <div>
            <label>Username</label>
            <input type="text" 
              name='username'
              value={formData.username}
              onChange={handleChange}
            />
            
            
          </div>
          <div>
            {/* <label>Password</label>
            <input type="text" 
              name='password'
              value={formData.password}
              onChange={handleSubmit}
            /> */}
            
            {/* <button
                    type="submit"
                    className="btn btn-primary float-right"
            >
              <p>Signup</p>
            </button> */}
            
          </div>
        </form>
     </div>
  )
}

export default UsernameForm