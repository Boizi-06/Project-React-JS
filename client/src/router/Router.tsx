import { Routes, Route } from "react-router-dom";
import ProjectManagement from "../pages/ProjectManagement";
import ProjectDetail from "../pages/ProjectDetail";

import Register from "../pages/Register";
import Login from "../pages/Login";
// import MultipleUpload from "../components/MultipleUpload";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/projectmanager" element={<ProjectManagement />} />
      <Route path="/login" element={<Login />} />
      <Route path="/project/:id" element={<ProjectDetail />} />
    </Routes>
  );
};

export default AppRoutes;
