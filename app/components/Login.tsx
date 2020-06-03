import * as React from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:6789/files-list';




class Login extends React.Component{
	  state = {
      users: [] ,
      selectedFile: null
           
            
           
    };

    onChangeHandler=event=>{
      this.setState({
        selectedFile: event.target.files[0],
        loaded: 0,
      })
    }
   
    onClickHandler = () => {
      const data = new FormData()
      data.append('file', this.state.selectedFile)
      axios.post("http://localhost:5642/upload", data, { 
         // receive two    parameter endpoint url ,form data
     })
     .then(res => { // then print response status
      console.log(res.statusText)
   })
  }

  async postData(value) {


    fetch('http://localhost:6789/back', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
     

      body: JSON.stringify({
        user: {
            name: value,
            email: "john@example.com"
        }
    })
});
  }

  componentDidMount() {
    const url = `${API_URL}`;
    axios.get(url).then(response => response.data)
    .then((data) => {
      this.setState({ users: data })
      console.log(this.state.users)
     })
  }
  render() {

    return (
   
   <div>
       Login
   </div>
    
    
  
    
  )
  }
  }
    


export default Login ;





