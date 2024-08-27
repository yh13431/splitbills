import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import CreateGroup from "./pages/CreateGroup";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddBills from "./pages/AddBills";
import AddUsers from "./pages/AddUsers";
import ViewGroup from "./pages/ViewGroup";

const queryClient = new QueryClient()

const Dashboard = () => {
  return (
  <>
    <Header/>
    <Outlet />
  </>
  )
} 

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
    ),
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/create-group",
        element: <CreateGroup />
      },
      {
        path: "/add-users/:id",
        element: <AddUsers />
      },
      {
        path: "/add-bills/:id",
        element: <AddBills />
      },
      {
        path: "/view-group/:id",
        element: <ViewGroup />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/login",
        element: <Login />
      },
    ]
  },
]);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;