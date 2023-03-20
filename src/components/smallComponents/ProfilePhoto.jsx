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

  return value ? (
    <div>
      <div onClick={openDialog}>
        <Avatar
          src={updatedPicTable ? updatedPicTable : value}
          alt={rowMeta.rowData[2]}
          style={{
            width: "60px",
            height: "60px",
            cursor: "pointer",
          }}
        />
      </div>
      <ImageUploadModal
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        handleClose={onClose}
        openDialog={openDialog}
        src={value}
        enrollmentKey={enrollmentKey}
        name={name}
        setUpdatePicTable={setUpdatePicTable}
      />
    </div>
  ) : (
    <p></p>
  );
}
