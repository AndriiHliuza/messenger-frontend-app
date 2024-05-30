import { BrowserRouter } from "react-router-dom";
import "./App.css";
import NavBar from "./components/navbar/NavBar"
import RoutesProcessor from './components/routes/RoutesProcessor';
import { isUserAuthenticated } from './utils/AuthProvider';
import { useEffect, useState, createContext, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { Role } from "./utils/Role";
import { getUserByUsernameAndRole } from "./axios/UserAPI";
import { QueryClient, QueryClientProvider } from "react-query";
import { USER_ROUTE } from "./config";

const queryClient = new QueryClient();

export const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

function App() {

  const [user, setUser] = useState({
    username: "",
    uniqueName: "",
    authenticated: false,
    role: Role.VISITOR
  });
  const [isInformMessageShow, setInformMessageShow] = useState(false);
  const [informMessage, setInformMessage] = useState("");

  useEffect(() => {
    async function checkIsUserAuthenticated() {
      let isAuthenticated = await isUserAuthenticated();
      if (isAuthenticated) {
        let accessToken = localStorage.getItem("access-token");
        if (accessToken) {
          const username = jwtDecode(accessToken).sub;
          const role = jwtDecode(accessToken).role;
          if (username && role) {
            const response = await getUserByUsernameAndRole(username, role);
            const data = response?.data;
            if (data && data?.username && data?.username === username) {
              const uniqueName = data.uniqueName;
              setUser({
                username: username,
                uniqueName: uniqueName,
                authenticated: isAuthenticated,
                role: role
              });
            }
          }
        }
      }
    }
    checkIsUserAuthenticated();
  }, []);

  useEffect(() => {
    if (informMessage) {
      setInformMessageShow(true);

      setTimeout(() => {
        setInformMessageShow(false);
        setInformMessage("");
      }, 5000);
    }
  }, [informMessage]);

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={{ user, setUser, setInformMessage }}>
        <BrowserRouter>
          <div className="App">
            <NavBar />
            <RoutesProcessor />
            <div className={isInformMessageShow ? "inform-message-container inform-message-container-show" : "inform-message-container"}>
              <div className="inform-message">{informMessage}</div>
            </div>
          </div>
        </BrowserRouter>
      </AppContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
