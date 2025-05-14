
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Invoices from "./pages/Invoices";
import NewInvoice from "./pages/NewInvoice";
import ViewInvoice from "./pages/ViewInvoice";
import EditInvoice from "./pages/EditInvoice";
import Customers from "./pages/Customers";
import Vehicles from "./pages/Vehicles";
import TransportCompanies from "./pages/TransportCompanies";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/invoices" element={
                  <ProtectedRoute>
                    <Invoices />
                  </ProtectedRoute>
                } />
                <Route path="/invoices/new" element={
                  <ProtectedRoute>
                    <NewInvoice />
                  </ProtectedRoute>
                } />
                <Route path="/invoices/:id" element={
                  <ProtectedRoute>
                    <ViewInvoice />
                  </ProtectedRoute>
                } />
                <Route path="/invoices/:id/edit" element={
                  <ProtectedRoute>
                    <EditInvoice />
                  </ProtectedRoute>
                } />
                <Route path="/customers" element={
                  <ProtectedRoute>
                    <Customers />
                  </ProtectedRoute>
                } />
                <Route path="/vehicles" element={
                  <ProtectedRoute>
                    <Vehicles />
                  </ProtectedRoute>
                } />
                <Route path="/transport-companies" element={
                  <ProtectedRoute>
                    <TransportCompanies />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
