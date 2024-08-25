import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import CreateBill from "./pages/CreateBill";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";

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
        path: "/create-bill",
        element: <CreateBill />
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