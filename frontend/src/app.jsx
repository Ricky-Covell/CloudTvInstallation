import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import CloudContext from "./CloudContext.jsx";
import CloudTvApi from "./api/CloudTvApi.js";
import CloudTv from './CloudTv.jsx'
import SignInOrUp from "./user/SignInOrUp.jsx";

export const USER_STORAGE_ID = "cloudTV-user";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [clouds, setClouds] = useState()

  useEffect(() => {
      const getClouds = async () => {
        let { urls } = await CloudTvApi.getCloudUrls()
        setClouds(urls)
        setIsLoaded(true);
      }
      
      const getCurrentUser = () => {
        let storedUser = localStorage.getItem(USER_STORAGE_ID)
        if (storedUser) {
          setCurrentUser(storedUser)
        }
      }

        setIsLoaded(false)
        getCurrentUser()
        getClouds()
      }, [])


    const loadUser = async (username) => {
      try {
        let user = await CloudTvApi.loadUser(username)
        localStorage.setItem(USER_STORAGE_ID, username)
        setCurrentUser(user)
      } catch (err) {
        console.error("App loadUserInfo: problem loading", err);
        setCurrentUser(null);
      }
      
    }
      
    if (isLoaded === false) {
      return (
        <div>
        </div>
      ) 
    }
    
    return (
         <BrowserRouter>
           <CloudContext.Provider value={{ currentUser, clouds }}>
            <main>
             <Routes>
              <Route exact path="/" element={<CloudTv />} />
              <Route exact path="/user" element={<SignInOrUp loadUser={loadUser}/>}/>
             </Routes>
            </main>
           </CloudContext.Provider>            
         </BrowserRouter>
    );
  }
  
  export default App;
  