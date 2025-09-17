import { Route, Routes, Navigate } from "react-router-dom";
// import { Toaster } from "react-hot-toast"; // Temporarily commented out
import useAuthUser from "./hooks/userHooks/useAuthUser";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import WorkflowEditor from "./pages/WorkflowEditor";
import Sidebar from "./pages/Sidebar";
import Credentials from "./pages/Credentials";
import Executions from "./pages/Executions";

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoading, authUser } = useAuthUser();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  if (!authUser) {
    return <Navigate to="/signin" replace />;
  }
  
  return <>{children}</>;
}

// Public Route Component (redirect to dashboard if already authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isLoading, authUser } = useAuthUser();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  if (authUser) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

// Dashboard Layout Component
function DashboardLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        <WorkflowEditor />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="h-screen">
      {/* <Toaster position="top-right" /> Temporarily commented out */}
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/signin" 
          element={
            <PublicRoute>
              <Signin />
            </PublicRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/workflow/:id" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/credentials" 
          element={
            <ProtectedRoute>
              <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1">
                  <Credentials />
                </div>
              </div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/executions" 
          element={
            <ProtectedRoute>
              <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1">
                  <Executions />
                </div>
              </div>
            </ProtectedRoute>
          } 
        />
        
        {/* Default Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}
