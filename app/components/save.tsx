import * as React from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:6789/files-list';




class File extends React.Component{
	  state = {
      users: []
           
            
           
    };
   


  async postData() {


    fetch('http://localhost:6789/back', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
     

      body: JSON.stringify({
        user: {
            name: "script.sh",
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
        <h1 className="text-primary text-center">Files</h1>
    
       
  <table className="table table-hover table-dark">
  <thead>
  <tr>
    <th scope="col">#</th>
    <th scope="col">Script</th>
    <th scope="col">path</th>

    <th scope="col">size</th>

    <th scope="col">filetype</th>
    <th scope="col">    uploadDate</th>

    <th scope="col">Executer</th>
  
  </tr>
  </thead>
  <tbody>
  {this.state.users.map((user) => (
  <tr>

    <th scope="row">1</th>
    <td> {user.name}</td>
    <td> {user.path}</td>
    <td> {user.size}</td>
    <td> {user.filetype}</td>
    <td> {user.uploadDate}</td>
 
   <td> <button  onClick= {() => this.postData()}> send data   </button> </td>
  
  </tr>
    ))}
  
  </tbody>
  </table>
  
      </main>
      </div>
    
  
    
  )
  }
  }
    


export default File ;





