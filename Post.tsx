import * as React from "react";


class Post extends React.Component {

  async postData() {


    fetch('http://localhost:5642/zaab', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
     

      body: JSON.stringify({
        user: {
            name: "sh test3.sh",
            email: "john@example.com"
        }
    })
});
  }
  render() {
    return (
    <div>
 <h2>Trainning!</h2>;

 <button  onClick= {() => this.postData()}> send data   </button>

    </div>
    )
   
}
}

export default Post;