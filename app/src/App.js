import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import './App.css';
import Home from './components/Home';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import HomeLoggedIn from './components/HomeLoggedIn';

function App() {

  const [authenticating, setAuthenticating] = useState(false);
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies(['XSRF-TOKEN']);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch('api/user', { credentials: 'include' });
        const body = await response.json();
        console.log('response:', response.authenticated);
        console.log('body:', body.authenticated);
        if (body.authenticated === false) {
          setAuthenticating(false);
        } else {
          // console.log('body:', body);
          setAuthenticating(true);
          setUser(JSON.parse(body));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setAuthenticating, setLoading, setUser]);
  
if (loading) {
  return <p>...Loading...</p>;
}
  return (
    <>
      <Router>
        <Routes>
          {authenticating ? 
           ( <Route path="/" element={<HomeLoggedIn authenticating={authenticating} />}/>) :
           ( <Route path="/" element={<Home/>}/>)}
        </Routes>
      </Router>
    </>
  );
}

export default App;
