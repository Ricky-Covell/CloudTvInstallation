import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CloudPlayer from "./CloudPlayer";
import VideoSynthNav from "./VideoSynthNav";
import UserNav from "./UserNav";
import './CloudTv.css'
import CloudContext from "./CloudContext";
import vSynthProcessor from "./vSynthProcessor";

const CloudTv = () => {
    const navigate = useNavigate()
    const { currentUser } = useContext(CloudContext)
    
    // console.log(currentUser)

    // useEffect(() => {
    //   const isUserLoaded = () => {
    //     if (!currentUser) {
    //       navigate('/user')
    //     }
    //   }

    //   isUserLoaded()
    // }, [])

    return (
        <div id="home-container">
            <div id="clouds-container">
              { UserNav() }
              { CloudPlayer() }
              { VideoSynthNav() }              
              { vSynthProcessor() }
            </div>
          </div>
    )
}

export default CloudTv