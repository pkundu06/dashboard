import React, { Component } from "react";
import { NavItem, Nav, NavDropdown, MenuItem ,DropdownButton} from "react-bootstrap";

class HeaderLinks extends Component {

    handleSelect = (url) =>{
        window.open(url);
    };
  render() {
    return (
      <div>
        <Nav>
          <NavItem eventKey={1} href="#">
            <i className="fa fa-dashboard" />
            <p className="hidden-lg hidden-md">Dashboard</p>
          </NavItem>
        </Nav>

      </div>
    );
  }
}

export default HeaderLinks;
