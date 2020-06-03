import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';


import axios from 'axios';

export interface IAppProps {}

export interface IAppState {
	persons: [];
}
class Test extends React.Component<IAppProps, IAppState> {
	constructor(props: IAppProps) {
    super(props);
		this.state = {
      persons: []
    };
   
	}

  async postData() {
    try {
        const response = await fetch('http://localhost:6789/form', {
          method: "post",
          mode:"no-cors",
          headers: new Headers({
            "Content-Type": "application/json",
            Accept: "application/json"
          }),
          body: JSON.stringify({
            cmd : "sh script.sh"
           } )
        });
        console.log("done")
      } catch(e) {
        console.log(e)
      }
    
      }

  componentDidMount() {
    axios.get(`http://localhost:6789/api/test`)
      .then(res => {
        const data = res.data;
        const persons = data.data;
        this.setState({ persons });
        console.log ({persons});
      })
      .catch((error) =>{
        alert(error);
    })

      
  }
  render() {
    
		return (
		<div>
		<main className="container my-5">
			<h1 className="text-primary text-center">Files</h1>
	
      <button  onClick= {() => this.postData()}> send data   </button>
<table className="table table-hover table-dark">
<thead>
<tr>
  <th scope="col">#</th>
  <th scope="col">Script</th>


</tr>
</thead>
<tbody>
<tr>
  <th scope="row">1</th>
  <td><li>{ this.state.persons} <button>Run</button></li> </td>

</tr>


</tbody>
</table>

		</main>
		</div>
  

  
)
}
}
  


export default Test ;





