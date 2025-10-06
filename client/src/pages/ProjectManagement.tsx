import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

import DeleteConfirmModal from "../components/DeleteConfirmModal";
import "../css/ProjectManager.css";
import { Link } from "react-router-dom";
import AddUpdateProject from "../components/AddProjectModal";

interface Project {
  id: number;
  projectName: string;
  img: string;
  description?: string;
  members: {
    userId: number;
    fullName: string;
    role: string;
  }[];
}

const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Lấy danh sách project từ API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:8001/project");
        setProjects(res.data);
      } catch (error) {
        console.error("Lỗi khi fetch dự án:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Xử lý thêm/sửa dự án
  const handleSave = async (data: Project) => {
    if (!data.members) {
      data.members = [];
    }
    if (!data.task) {
      data.task = [];
    }
    // data.members = [];
    // (data as any).task = [];

    try {
      if (editingProject) {
        // Update project
        await axios.put(`http://localhost:8001/project/${editingProject.id}`, {
          ...editingProject,
          ...data,
        });
      } else {
        // Add project
        await axios.post("http://localhost:8001/project", data);
      }
      // Reload projects
      const res = await axios.get("http://localhost:8001/project");
      setProjects(res.data);
    } catch (error) {
      console.error("Lỗi khi lưu dự án:", error);
    }
    setOpen(false);
    setEditingProject(null); // reset lại sau khi lưu
  };

  // Xử lý xóa dự án
  const handleDelete = async () => {
    if (!selectedProject) return;
    try {
      await axios.delete(`http://localhost:8001/project/${selectedProject.id}`);
      setProjects((prev) => prev.filter((p) => p.id !== selectedProject.id));
    } catch (error) {
      console.error("Lỗi khi xóa dự án:", error);
    }
    setDeleteOpen(false);
  };

  return (
    <div className="project-page">
      <Header />

      <main className="project-container">
        <div className="project-header">
          <h2>Quản Lý Dự Án Nhóm</h2>
          <button
            className="btn-add"
            onClick={() => {
              setEditingProject(null);
              setOpen(true);
            }}
          >
            + Thêm Dự Án
          </button>
        </div>

        <input
          className="search-input"
          type="text"
          placeholder="Tìm kiếm dự án"
        />

        {loading ? (
          <p>Đang tải dự án...</p>
        ) : (
          <table className="project-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên Dự Án</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.projectName}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => {
                        setEditingProject(p); // gán dữ liệu đang sửa
                        setOpen(true);
                      }}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => {
                        setSelectedProject(p);
                        setDeleteOpen(true);
                      }}
                    >
                      Xóa
                    </button>
                    <Link to={`/project/${p.id}`}>
                      <button className="btn-share">Chi tiết</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="pagination">
          <button>1</button>
          <button>2</button>
          <button>3</button>
        </div>
      </main>

      <Footer />

      {/* Modal thêm/sửa dự án */}
      <AddUpdateProject
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSave}
        initialValues={editingProject || {}}
      />

      {/* Modal xác nhận xóa */}
      <DeleteConfirmModal
        open={deleteOpen}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ProjectManagement;
