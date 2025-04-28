import React, { useState } from "react";
import { Avatar } from "@mui/material";
import ImageUploadModal from "./PhotoUploadModal";
export default function ProfilePhoto({ value, rowMeta }) {
  const enrollmentKey = rowMeta?.rowData[15];
  const name = rowMeta?.rowData[3];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updatedPicTable, setUpdatePicTable] = useState("");
  const onClose = () => {
    setDialogOpen(false);
  };
  const openDialog = () => {
    setDialogOpen(true);
  };
  const displayImage = updatedPicTable || value;
  return (
    <div>
      <div onClick={openDialog}>
        <Avatar
          src={displayImage || undefined}
          alt={rowMeta.rowData[2]}
          style={{
            width: "60px",
            height: "60px",
            cursor: "pointer",
            backgroundColor: !displayImage ? "#ddd" : "transparent",
            fontSize: "14px",
            color: "#555",
          }}
        >
          {!displayImage ? "Add" : null}
        </Avatar>
      </div>
      <ImageUploadModal
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        handleClose={onClose}
        openDialog={openDialog}
        src={value}
        updatedPicTable={updatedPicTable}
        enrollmentKey={enrollmentKey}
        name={name}
        setUpdatePicTable={setUpdatePicTable}
      />
    </div>
  );
}