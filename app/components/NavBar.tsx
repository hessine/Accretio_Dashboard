import * as React from "react";
import { useMappedState } from "react-use-mapped-state";
import styled from "styled-components";
import { withRouter } from "react-router-dom";

import NavItem from "./NavItem";

const NavWrapper = styled.div`
  background: black;
  width: 100vw;
  height: 50px;
  color: white;
  display: flex;
  &:first-child {
    margin-left: 20px;
  }
  a,
  a:visited,
  a:active {
    color: white;
    text-decoration: none;
  }
`;

type NavOptions = Array<NavOption>;

export interface NavOption {
  icon: any | null;
  title: string;
  path: string;
}

const navOptions: NavOptions = [
  { icon: null, title: "Dashboard", path: "/dashboard" },
  { icon: null, title: "stopped", path: "/stop" },
  { icon: null, title: "Data", path: "/post" },
  { icon: null, title: "Test", path: "/file" },
  { icon: null, title: "Environment", path: "/env" },
  { icon: null, title: "About", path: "/about" },
  { icon: null, title: "Trainnig", path: "/try" }

];

const NavBar: React.FC<{ location?: any }> = props => {
  console.log(props.location);
  return (
    <NavWrapper>
      {navOptions.map(navOption => {
        return (
          <NavItem
            isSelected={props.location.pathname === navOption.path}
            data={navOption}
          />
        );
      })}
    </NavWrapper>
  );
};

export default withRouter(NavBar);