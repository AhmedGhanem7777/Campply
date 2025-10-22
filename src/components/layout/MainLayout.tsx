import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../Dashboard/Sidebar";
import Header from "../../Dashboard/Header";

const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#131417] text-white">
      {/* Sidebar ثابت */}
      <Sidebar />
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header />
        {/* المحتوى المتغير */}
        <main className="p-6 flex-1 bg-[#1B1C1F] rounded-tl-3xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

