import * as React from 'react';
import axios from 'axios';


const API_URL = 'http://localhost:6789/files-list';




class Try extends React.Component{
	  state = {
      users: [] ,
      selectedFile: null,
           
            
           
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
      axios.post("http://localhost:6789/upload", data, { 
         // receive two    parameter endpoint url ,form data
     })
     .then(res => { // then print response status
      console.log(res.statusText)
   })
  }

  async postData(value) {


    fetch('http://localhost:6789/back', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
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
      <main className="container my-5">
        <h1 className="text-primary text-center">Trainning !</h1>

    

        <input type="file" name="file" className="km-btn-file"  onChange={this.onChangeHandler}/>

        <button type="button" className="btn btn-success btn-block" onClick={this.onClickHandler}>Upload</button> 





  <table className="table table-hover table-dark">
  <thead>
  <tr>
    <th scope="col">#</th>
    <th scope="col">Script</th>
 

    <th scope="col">size</th>

    <th scope="col">    uploadDate</th>

    <th scope="col">Executer</th>
  
  </tr>
  </thead>
  <tbody>
  {this.state.users.map((user) => (
  <tr>

    <th scope="row">1</th>
   
    <td> {user.name}</td>
 
    <td> {user.size}</td>
    
    <td> {user.uploadDate}</td>
 
   <td> <button  onClick= {() => this.postData( user.name)}> Run  </button> </td>
  
  </tr>
    ))}
  
  </tbody>
  </table>
  
      </main>
      </div>
    
  
    
  )
  }
  }
    


export default Try ;





