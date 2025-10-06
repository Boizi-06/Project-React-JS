import React, { useEffect, useState } from "react";
import { Form, Input, Button, Typography, Card, message } from "antd";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import "../css/Register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import type { User } from "../utils/type";

const { Title, Text } = Typography;

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  // Lấy danh sách user từ API
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

  // Submit form
  const onFinish = async (values: any) => {
    try {
      // Tìm id lớn nhất và +1
      const newId =
        users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

      const newUser: User = {
        id: newId,
        fullName: values.fullname,
        email: values.email,
        password: values.password,
      };

      // Gửi request thêm user
      await axios.post("http://localhost:8001/user", newUser);

      message.success("Đăng ký thành công!");
      navigate("/login"); // chuyển hướng sang login
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
      message.error("Đăng ký thất bại, thử lại!");
    }
  };

  return (
    <div className="register-wrapper">
      <Card className="register-card">
        <Title level={2} className="register-title">
          Đăng ký
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off" // tắt autofill
        >
          {/* Họ tên */}
          <Form.Item
            name="fullname"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
            hasFeedback
          >
            <Input
              size="large"
              placeholder="Họ và tên"
              prefix={<UserOutlined />}
              autoComplete="off"
            />
          </Form.Item>

          {/* Email */}
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  const exist = users.some((u) => u.email === value);
                  return exist
                    ? Promise.reject(new Error("Email đã tồn tại!"))
                    : Promise.resolve();
                },
              },
            ]}
            hasFeedback
          >
            <Input
              size="large"
              placeholder="Địa chỉ email"
              prefix={<MailOutlined />}
              autoComplete="off"
            />
          </Form.Item>

          {/* Password */}
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu phải ít nhất 6 ký tự!" },
            ]}
            hasFeedback
          >
            <Input.Password
              size="large"
              placeholder="Mật khẩu"
              prefix={<LockOutlined />}
              autoComplete="new-password"
            />
          </Form.Item>

          {/* Confirm Password */}
          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password
              size="large"
              placeholder="Xác nhận mật khẩu"
              prefix={<LockOutlined />}
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              className="register-btn"
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>

        <div className="register-footer">
          <Text>Bạn đã có tài khoản? </Text>
          <Link to="/login">Đăng nhập</Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;
