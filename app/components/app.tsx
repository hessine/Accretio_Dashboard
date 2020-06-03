import * as React from "react";
import * as _ from "lodash";
import * as io from "socket.io-client";

import styled from "styled-components";
import { Route, BrowserRouter as Router, Redirect } from "react-router-dom";

import NavBar from "./NavBar";
import Dashboard from "./Dashboard";
import Stopped from"./Stopped";
import { NewContainerDialog } from "./newContainerModal";
import Upload from "./Upload";
import Try from "./Try";
import Post from "./Post";
import File from "./File";
import Env from "./Env";
import Login from "./Login";


const Header = styled.div`
  background: Black;
  width: 100vw;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 25px;
  padding-right: 25px;
  img {
    width: 100px;
    height: 100px;
    margin-left: 10%;
  }
`;

const AppTitle = styled.h1`
  color: white;
  font-size: 45px;
`;

const socket = io.connect();

export const AppComponent: React.FC<{}> = () => {
  const onRunImage = (name: String): void => {
    socket.emit("image.run", { name });
  };
  return (
    <Router>
      <div>
        <Header>
          <AppTitle>Accretio</AppTitle>
          
        </Header>
        <NavBar />
        <Route exact path="/" component={() => <Login/>} />
        <Route exact path="/dashboard" component={() => <Dashboard />} />
        <Route exact path="/stop" component={() => <Stopped />} />
        <Route exact path="/about" component={() => <Upload/>} />
        <Route exact path="/post" component={() => <Post/>} />
        <Route exact path="/file" component={() => <File/>} />
        <Route exact path="/try" component={() => <Try/>} />
        <Route exact path="/env" component={() => <Env/>} />
    


        {<Route
          exact
          path="/new/container"
          component={() => <p>New Container just trigger model</p>}
        /> }
        <Route
          exact
          path="/cluster/start"
          component={() => <Upload/>} />
        
        <Route
          exact
          path="/cluster/create"
          component={() => <p>Cluster Create</p>}
        />
        <NewContainerDialog id="newContainerModal" onRunImage={onRunImage} />
      </div>
    </Router>
  );
};