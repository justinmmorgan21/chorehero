import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import axios from "axios";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { HomePage } from "./Homepage";
import { ParentSignupPage } from "./ParentSignupPage";
import { LoginPage } from "./LoginPage";
import { ChildrenIndexPage } from "./ChildrenIndexPage";

const router = createBrowserRouter([
  {
    element: (
      <div>
        <Header />
        <Outlet />
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
        loader: () => axios.get("http://localhost:3000/children.json").then( response => response.data )
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;