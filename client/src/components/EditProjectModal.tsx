import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const CLOUD_NAME = "dnjubw5ta";
const UPLOAD_PRESET = "boizi2006";

interface EditProjectModalProps {
  open: boolean;
  onCancel: () => void;
  onSave: (values: any) => void;
  initialValues: any; // dữ liệu dự án cũ
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({
  open,
  onCancel,
  onSave,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setImageUrl(initialValues.img || "");
      setFileList(
        initialValues.img
          ? [
              {
                uid: "-1",
                name: "project-img",
                status: "done",
                url: initialValues.img,
              },
            ]
          : []
      );
    }
  }, [initialValues, form]);

  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.secure_url) {
        setImageUrl(res.data.secure_url);
        onSuccess?.(res.data, file);
        message.success("Upload thành công!");
      } else {
        throw new Error("Không lấy được secure_url");
      }
    } catch (err) {
      console.error("Upload error:", err);
      onError?.(err);
      message.error("Upload thất bại!");
    }
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSave({ ...initialValues, ...values, img: imageUrl });
    });
  };

  return (
    <Modal
      title="Sửa dự án"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Cập nhật
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên dự án"
          name="projectName"
          rules={[{ required: true, message: "Vui lòng nhập tên dự án!" }]}
        >
          <Input placeholder="Nhập tên dự án" />
        </Form.Item>

        <Form.Item label="Hình ảnh dự án">
          <Upload
            customRequest={handleUpload}
            listType="picture"
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
          >
            <Button icon={<UploadOutlined />}>Chọn file</Button>
          </Upload>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="project"
              style={{ width: "100%", marginTop: 10, borderRadius: 8 }}
            />
          )}
        </Form.Item>

        <Form.Item label="Mô tả dự án" name="description">
          <Input.TextArea rows={4} placeholder="Nhập mô tả dự án" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProjectModal;
