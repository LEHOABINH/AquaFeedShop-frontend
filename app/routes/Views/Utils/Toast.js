import React from "react";
import { toast } from "react-toastify";
import { Button, Media } from "./../../../components";

const ToastContent = ({ title, message, className, closeToast }) => (
  <Media>
    <Media middle left className="mr-3">
      <i className={`fa fa-fw fa-2x ${className}`}></i>
    </Media>
    <Media body>
      <Media heading tag="h6">
        {title}
      </Media>
      <p>{message}</p>
      <div className="d-flex mt-2">
        <Button
          color="primary"
          onClick={() => {
            closeToast;
          }}
        >
          I Understand
        </Button>
      </div>
    </Media>
  </Media>
);

const showToast = (type, content) => {
  switch (type) {
    case "success":
      toast.success(
        <ToastContent title="Success!" message={content} className="fa-check" />
      );
      break;
    case "error":
      toast.error(
        <ToastContent title="Error!" message={content} className="fa-close" />
      );
      break;
    case "warning":
      toast.warning(
        <ToastContent
          title="Warning!"
          message={content}
          className="fa-exclamation"
        />
      );
    case "attention":
      toast.error(
        <ToastContent
          title="Attention!"
          message={content}
          className="fa-question"
        />
      );
      break;
    case "info":
      toast.info(
        <ToastContent
          title="Information!"
          message={content}
          className="fa-info"
        />
      );
      break;
    // Thêm các loại toast khác nếu cần
    default:
      toast(
        <ToastContent
          title="Attention!"
          message={content}
          className="fa-question"
        />
      );
  }
};

export { showToast };
