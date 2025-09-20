import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthUser from "../hooks/userHooks/useAuthUser";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { authUser } = useAuthUser();

  const handleSignout = () => {
    // Call signout API and redirect
    // This should be implemented with your signout hook
    navigate("/signin");
  };

  const menuItems = [
    {
      name: "Workflows",
      path: "/dashboard",
    },
    {
      name: "Credentials",
      path: "/credentials", 
      
    },
    {
      name: "Executions",
      path: "/executions",
    },
    
  ];

  return (
    <div className="w-48 bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-700">
        <h1 className="text-xl font-bold">n8n Workflow</h1>
        {authUser && (
          <p className="text-sm text-gray-300 mt-1">{authUser.email}</p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 pt-8">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center justify-center px-4 py-1.5 rounded-md transition-colors ${
                  location.pathname === item.path
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span className="font-semibold">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="h-px bg-gray-700 my-3"></div>

        {/* Projects Section */}
        <div className="pt-4">
          <h2 className="text-gray-400 uppercase text-xs font-semibold mb-2 px-2 ">Projects</h2>
          <ul className="space-y-1">
            <li>
              <Link
                to="/projects"
                className={`flex items-center justify-center px-2.5 py-1.5 rounded-md transition-colors font-semibold ${
                  location.pathname === "/projects"
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                My Projects
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      

      {/* Footer */}
      <div className="px-4 py-1.5 border-t border-gray-700">
        <button
          onClick={handleSignout}
          className="w-full flex items-center justify-center px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
        >
          <span className="font-semibold">Sign Out</span>
        </button>
      </div>
    </div>
  );
}