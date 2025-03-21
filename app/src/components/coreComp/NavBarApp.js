import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Collapse, Navbar, NavbarToggler,NavbarBrand,Nav,NavItem,NavLink} from 'reactstrap';


const NavBarApp = ({user, authenticated}) => {
    const [isOpen, setIsOpen] = useState(false);
    // console.log("auth     "+authenticated);
    // console.log(user);
    if(authenticated===undefined){
        return (
            <p>Loading...</p>
        );
    }
    return (
        <Navbar color="dark" dark expand="md">
            <NavbarBrand tag={Link} to="/">Home</NavbarBrand>
            <NavbarToggler onClick={() => { setIsOpen(!isOpen) }}/>
            <Collapse isOpen={isOpen} navbar>
              {authenticated ?
                <Nav className="justify-content-end" style={{width: "100%"}} navbar>
                    <NavItem>
                        <NavLink href="https://twitter.com/oktadev">@oktadev</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="https://github.com/oktadev/okta-spring-boot-react-crud-example">GitHub</NavLink>
                    </NavItem>
                </Nav>
                :" "}
                
            </Collapse>
        </Navbar>
    );
};

export default NavBarApp;