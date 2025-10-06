import React from "react";
import "../css/Layout.css";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="logo">Quản Lý Dự Án</div>
      <nav className="nav-links">
        <Link to={"/projectmanager"}>
          <a href="/projects">Dự Án</a>
        </Link>
        <a href="/tasks">Nhiệm Vụ của tôi</a>
        <Link to={"/Login"}>
          <a href="/logout">Đăng Xuất</a>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
