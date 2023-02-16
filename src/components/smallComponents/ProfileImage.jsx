import React, { useRef, useState } from 'react'
import { Avatar } from '@mui/material'
import { useSnackbar } from 'notistack'
import axios from 'axios';

export const baseUrl = `${import.meta.env.VITE_API_URL}`;

export default function ProfileImage({value, rowMeta}) {
    const [imageFile, setImageFile] = useState({
      file: null,
      updatedURL: ''
    });
    
    const { enqueueSnackbar } = useSnackbar();
    
    const fileInputRef = useRef(null);

    const updateProfilePhoto = (e) => {
        const file = e.target.files[0];
        //check if file size is greater than 1mb
        if (file.size > 1000000) {
          enqueueSnackbar("File size should not exceed 1MB", { variant: "error" });
          return;
        }
        setImageFile(prev=>({...prev, file}));
    };

    const openFilePrompt = ()=>{
      if(fileInputRef.current){
        fileInputRef.current.click();
      }
    };

    const savePhoto = async ()=>{
      try{
        const enrollmentKey = rowMeta?.rowData[15];
        if(!enrollmentKey){
          enqueueSnackbar("Enrollment key no available", {
            variant: "error",
          });
          return;
        }
        const tempFormdata = new FormData();
        tempFormdata.append("file", imageFile.file);

        const dataURL = `${baseUrl}on_assessment/details/photo/${enrollmentKey}`;

        const response = await axios.post(dataURL, tempFormdata);

        enqueueSnackbar("Image Uploaded Successfully", {
          variant: "success",
        });

        setImageFile(prev=>({...prev, file: null}))
      }catch(e){
        enqueueSnackbar("Could not upload image", {
          variant: "error",
        });
      }
    };

    return (
          
              value ? (
                    <div>
                        <Avatar
                            src={value}
                            alt={rowMeta.rowData[2]}
                            style={{
                              width: "60px",
                              height: "60px",
                              // borderRadius: "50%",
                              // objectFit: "cover",
                        }}/>
                        <input
                          onChange={(e) => updateProfilePhoto(e)}
                          id="ProfileImage"
                          type="file"
                          name="ProfileImage"
                          ref={fileInputRef}
                          style={{ display: "none" }}
                          required
                          accept=".png,.jpg,.jpeg"
                        />
                        {
                          imageFile?.file ? 
                          <button type='button' onClick={savePhoto}>Upload</button>:
                          <button type='button' onClick={openFilePrompt}>Change</button>
                        }
                        {imageFile?.file?.name && <p style={{width: "60px", overflowX: "hidden", display: "static"}}>{imageFile?.file?.name}</p>}
                    </div>
              ) : 
              (<p></p>)
          
    )
}
