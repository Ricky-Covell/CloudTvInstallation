import axios from 'axios'

class CloudTvApi {
   
  static async getCloudUrls() {
    try {
      let response = await axios.get('http://127.0.0.1:5000/cloudset')
      return { 
        urls: Object.values(response.data)
      }        
    } catch {
      console.error("Couldn't retrive cloud URLS", err);
    }
  }

  static async loadUser(username) {
    try{
      let response = await axios.get(`http://127.0.0.1:5000/user/${username}`)
    } catch {

    }
  }

  
}

export default CloudTvApi