import React from "react";
import { Modal, Button } from "antd";

interface DeleteConfirmModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  open,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal
      title="Xác nhận xoá"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="delete" danger type="primary" onClick={onConfirm}>
          Xóa
        </Button>,
      ]}
    >
      <p>Bạn chắc chắn muốn xoá dự án này?</p>
    </Modal>
  );
};

export default DeleteConfirmModal;
