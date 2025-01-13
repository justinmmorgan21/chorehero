import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import axios from "axios";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { HomePage } from "./HomePage";
import { ParentSignupPage } from "./ParentSignupPage";
import { LoginPage } from "./LoginPage";
import { ChildrenIndexPage } from "./ChildrenIndexPage";
import { ChoresIndexPage } from "./ChoresIndexPage";
import { RewardsIndexPage } from "./RewardsIndexPage";
import apiConfig from "./apiConfig";

const router = createBrowserRouter([
  {
    element: (
      <div>
        <Header />
        <div className="main">
          <Outlet />
        </div>
        <Footer />
      </div>
    ),
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/signup",
        element: <ParentSignupPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/children",
        element: <ChildrenIndexPage />,
        loader: () => axios.get(`${apiConfig.backendBaseUrl}/children.json`).then( response => response.data )
      },
      {
        path: "/chores",
        element: <ChoresIndexPage />,
        loader: () => axios.get(`${apiConfig.backendBaseUrl}/chores.json`).then( response => response.data )
      },
      {
        path: "/rewards",
        element: <RewardsIndexPage />,
        loader: () => axios.get(`${apiConfig.backendBaseUrl}/rewards.json`).then( response => response.data )
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;