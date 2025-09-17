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
      icon: "⚡",
    },
    {
      name: "Credentials",
      path: "/credentials", 
      icon: "🔑",
    },
    {
      name: "Executions",
      path: "/executions",
      icon: "📊",
    },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">n8n Workflow</h1>
        {authUser && (
          <p className="text-sm text-gray-300 mt-1">{authUser.email}</p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                  location.pathname === item.path
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleSignout}
          className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
        >
          <span className="text-lg">🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
