import { BrowserRouter } from 'react-router-dom';
import './App.css';
import NavBar from "./components/navbar/NavBar"
import RoutesProcessor from './components/routes/RoutesProcessor';
import { AuthContext, isUserAuthenticated } from './utils/AuthProvider';
import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { Role } from './utils/Role';


function App() {

  const [user, setUser] = useState({
    username: "",
    uniqueName: "",
    authenticated: false,
    role: Role.VISITOR
  });

  useEffect(() => {
    async function checkIsUserAuthenticated() {
      let isAuthenticated = await isUserAuthenticated();
      if (isAuthenticated) {
        let accessToken = localStorage.getItem("access-token");
        if (accessToken) {
          setUser({
            username: jwtDecode(accessToken).sub,
            uniqueName: jwtDecode(accessToken).uniqueName,
            authenticated: isAuthenticated,
            role: jwtDecode(accessToken).role
          });
        }
      }
    }
    checkIsUserAuthenticated();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <div className="App">
          <NavBar />
          <RoutesProcessor />
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
