import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import { useCookies } from 'react-cookie';

const Home = () => {

  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(undefined);
  const [cookies] = useCookies(['XSRF-TOKEN']);

  useEffect(() => {
    // setLoading(true);
    fetch('api/user', { credentials: 'include' })
      .then(response => response.text())
      .then(body => {
        if (body === '') {
          setAuthenticated(false);
        } else {
          setUser(JSON.parse(body));
          setAuthenticated(true);
        }
        setLoading(false);
      });
  }, [setAuthenticated, setLoading, setUser])

  const login = () => {
    let port = (window.location.port ? ':' + window.location.port : '');
    if (port === ':3000') {
      port = ':8080';
    }
    // redirect to a protected URL to trigger authentication
    window.location.href = `//${window.location.hostname}${port}/api/private`;
  }

  const logout = async () => {
    try {
        const res = await fetch('api/logout', {
            method: 'POST', credentials: 'include',
            headers: { 'X-XSRF-TOKEN': cookies['XSRF-TOKEN'] }
        });

        if (!res.ok) {
            throw new Error("Logout failed");
        }

        const response = await res.json();

        if (!response.logoutUrl || !response.idToken) {
            throw new Error("Invalid logout response");
        }

        window.location.href = `${response.logoutUrl}?id_token_hint=${response.idToken}`
            + `&post_logout_redirect_uri=${window.location.origin}`;
    } catch (error) {
        console.error("Error during logout:", error);
        // Handle error (e.g., show a message to the user)
    }
};
  const message = user ?
    <h2>Welcome, {user.name}!</h2> :
    <p>Please log in to manage your JUG Tour.</p>;

  const button = authenticated ?
    <div>
      <Button color="link"><Link to="/groups">Manage JUG Tour</Link></Button>
      <br/>
      <Button color="link" onClick={logout}>Logout</Button>
    </div> :
    <Button color="primary" onClick={login}>Login</Button>;

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Container fluid>
        {message}
        {button}
      </Container>
    </div>
  );
}

export default Home;