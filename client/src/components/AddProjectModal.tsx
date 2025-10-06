import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

interface AddUpdateProjectProps {
  open: boolean;
  onCancel: () => void;
  onSave: (values: any) => void;
  initialValues?: any; // 👈 quan trọng
}

const CLOUD_NAME = "dnjubw5ta";
const UPLOAD_PRESET = "boizi2006";

const AddUpdateProject: React.FC<AddUpdateProjectProps> = ({
  open,
  onCancel,
  onSave,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");

  // khi mở modal sửa => fill dữ liệu vào form
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setImageUrl(initialValues.img || "");
    }
  }, [initialValues, form]);

  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();

      if (data.secure_url) {
        setImageUrl(data.secure_url);
        onSuccess?.(data, file);
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
      form.resetFields();
      setFileList([]);
      setImageUrl("");
    });
  };

  return (
    <Modal
      title={initialValues?.id ? "Sửa dự án" : "Thêm dự án"}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Lưu
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

export default AddUpdateProject;
