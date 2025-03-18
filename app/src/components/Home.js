import React from 'react';
import { useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import App from '../App';

const Home = () => {
   
    const login = () => {
        let port=(window.location.port ? ':'+window.location.port: '');
        if(port === ':3000'){
            port=':8080';
        }
        window.location.href = `//${window.location.hostname}${port}/api/private`;
    }

    return (
        <div>
            <h1>Welcome to the Contact App</h1>
            <h2>Manage Your Contacts please Login Click</h2>
           
            <Button color="primary" onClick={login}>Login with Google</Button>
           
           
        </div>
    );
};

export default Home;
