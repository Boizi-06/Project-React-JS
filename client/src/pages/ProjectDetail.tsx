import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/ProjectDetail.css";
import {
  Collapse,
  Avatar,
  Button,
  Table,
  Tag,
  Input,
  Select,
  Spin,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";
import type { Project } from "../utils/type";

const { Panel } = Collapse;
const { Option } = Select;

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // lấy id từ URL
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<Project>(`http://localhost:8001/project/${id}`)
      .then((res) => {
        setProject(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi gọi API:", err);
        setLoading(false);
      });
  }, [id]);

  const columns = [
    { title: "Tên Nhiệm Vụ", dataIndex: "taskName", key: "taskName" },
    { title: "Người Phụ Trách", dataIndex: "assigneeId", key: "assigneeId" },
    {
      title: "Ưu Tiên",
      dataIndex: "priority",
      key: "priority",
      render: (priority: string) => {
        let color = "default";
        if (priority === "thấp") color = "green";
        if (priority === "trung bình") color = "orange";
        if (priority === "cao") color = "red";
        return <Tag color={color}>{priority}</Tag>;
      },
    },
    { title: "Ngày Bắt Đầu", dataIndex: "asginDate", key: "asginDate" },
    { title: "Hạn Chót", dataIndex: "dueDate", key: "dueDate" },
    {
      title: "Tiến độ",
      dataIndex: "progress",
      key: "progress",
      render: (status: string) => {
        let color = "blue";
        if (status === "đúng tiến độ") color = "green";
        if (status === "có rủi ro") color = "orange";
        if (status === "trễ hạn") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: () => (
        <>
          <Button type="primary" size="small" style={{ marginRight: 6 }}>
            Sửa
          </Button>
          <Button danger size="small">
            Xóa
          </Button>
        </>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!project) {
    return <p style={{ textAlign: "center" }}>Không tìm thấy dự án</p>;
  } else {
    console.log("prj", project);
  }

  // Nhóm task theo status (To Do, In Progress, Pending, Done)
  const taskGroups = ["To Do", "In Progress", "Pending", "Done"].map(
    (status) => ({
      section: status,
      items: project.task.filter(
        (t) => t.status.toLowerCase() === status.toLowerCase()
      ),
    })
  );

  return (
    <div className="project-detail-page">
      <Header />

      <main className="detail-container">
        <div className="project-info">
          <div className="project-intro">
            <img
              src={project.img || "https://via.placeholder.com/220x140"}
              alt="project-img"
              className="project-image"
            />
            <div className="project-description">
              <h2>{project.projectName}</h2>
              <p>
                {project.description
                  ? project.description
                  : "mô tả dự án đang cập nhật..."}
              </p>
              <Button type="primary">+ Thêm nhiệm vụ</Button>
            </div>
          </div>

          <div className="project-members">
            <h3>Thành viên</h3>
            <Button style={{ marginBottom: 10 }}>+ Thêm thành viên</Button>
            <div className="member-list">
              {project.members.map((m) => (
                <div className="member" key={m.userId}>
                  <Avatar
                    style={{ backgroundColor: "#1890ff" }}
                    icon={<UserOutlined />}
                  >
                    {m.fullName.charAt(0)}
                  </Avatar>
                  <div>
                    <p className="member-name">{m.fullName}</p>
                    <p className="member-role">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="task-section">
          <div className="task-header">
            <h3>Danh Sách Nhiệm Vụ</h3>
            <div className="task-tools">
              <Select defaultValue="Sắp xếp theo" style={{ width: 150 }}>
                <Option value="priority">Ưu tiên</Option>
                <Option value="asginDate">Ngày bắt đầu</Option>
                <Option value="progress">Tiến độ</Option>
              </Select>
              <Input placeholder="Tìm kiếm nhiệm vụ." />
            </div>
          </div>

          <Collapse defaultActiveKey={["To Do"]}>
            {taskGroups.map((group) => (
              <Panel header={group.section} key={group.section}>
                <Table
                  columns={columns}
                  dataSource={group.items}
                  rowKey={(r) => r.id}
                  pagination={false}
                />
              </Panel>
            ))}
          </Collapse>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
