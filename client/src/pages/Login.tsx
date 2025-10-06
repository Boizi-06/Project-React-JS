import React, { useEffect, useState } from "react";
import { Form, Input, Button, Typography, Card } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import "../css/Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import type { User } from "../utils/type";

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get<User[]>("http://localhost:8001/user");
        setUsers(res.data);
      } catch (error) {
        console.error("Lỗi khi fetch user:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = () => {
    // reset lỗi trước khi check
    form.setFields([
      { name: "email", errors: [] },
      { name: "password", errors: [] },
    ]);

    const findUser = users.find((u) => u.email === inputEmail);

    if (!findUser) {
      form.setFields([
        { name: "email", errors: ["Không tìm thấy Email người dùng"] },
      ]);
      return;
    }

    if (findUser.password !== inputPassword) {
      form.setFields([{ name: "password", errors: ["Sai mật khẩu"] }]);
      return;
    }

    navigate("/ProjectManager");
  };

  return (
    <div className="login-wrapper">
      <Card className="login-card">
        <Title level={2} className="login-title">
          Đăng nhập
        </Title>

        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ type: "email", message: "Email không hợp lệ!" }]}
            hasFeedback
          >
            <Input
              size="large"
              placeholder="Địa chỉ email"
              prefix={<MailOutlined />}
              onChange={(e) => setInputEmail(e.target.value)}
              autoComplete="off"
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ min: 6, message: "Mật khẩu phải ít nhất 6 ký tự!" }]}
            hasFeedback
          >
            <Input.Password
              size="large"
              placeholder="Mật khẩu"
              prefix={<LockOutlined />}
              onChange={(e) => setInputPassword(e.target.value)}
              autoComplete="off"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              className="login-btn"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <div className="login-footer">
          <Text>Chưa có tài khoản? </Text>
          <Link to={"/register"}>Đăng ký</Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
