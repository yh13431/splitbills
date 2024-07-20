import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import CreateBill from "./pages/CreateBill";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Header from "./components/Header";

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