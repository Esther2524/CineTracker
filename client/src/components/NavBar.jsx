import React from 'react';
import AuthButton from "./AuthButton";
import { Menu } from "semantic-ui-react";
import { Link, useNavigate } from "react-router-dom"; 
import { useAuth0 } from '@auth0/auth0-react';

export const NavBar = () => {
    const { isAuthenticated, loginWithRedirect } = useAuth0();
    // const navigate = useNavigate();

    const handleProtectedItemClick = (e) => {
        if (!isAuthenticated) {
            // Prevent default link behavior
            e.preventDefault();
            loginWithRedirect(); 
        }
    };

    return (
        <Menu fixed="top" size="huge">
            <Menu.Item as={Link} to="/" style={{ fontSize: "1.5rem" }}> 
                Home 
            </Menu.Item>

            <Menu.Item 
                as={Link} 
                to="/collections" 
                style={{ fontSize: "1.5rem" }} 
                onClick={handleProtectedItemClick}
            > 
                My Collection 
            </Menu.Item>

            <Menu.Item 
                as={Link} 
                to="/profile" 
                style={{ fontSize: "1.5rem" }} 
                onClick={handleProtectedItemClick}
            > 
                Profile 
            </Menu.Item>

            <Menu.Item 
                as={Link} 
                to="/auth-debugger" 
                style={{ fontSize: "1.5rem" }} 
                onClick={handleProtectedItemClick}
            > 
                Auth Debugger 
            </Menu.Item>


            <Menu.Menu position="right">
                <Menu.Item style={{ fontSize: "1.5rem" }}> 
                    <AuthButton />
                </Menu.Item>
            </Menu.Menu>

            

        </Menu>
    );
};
