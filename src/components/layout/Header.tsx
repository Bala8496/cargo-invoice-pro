
import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-invoice-blue rounded-md flex items-center justify-center">
            <span className="text-white font-semibold text-lg">T</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Transport Invoicing</h1>
        </div>

        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user.name}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
