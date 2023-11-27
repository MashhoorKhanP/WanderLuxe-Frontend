import { Paper } from "@mui/material";
import React,{useState, useCallback} from 'react';
import { useDropzone } from "react-dropzone";
import ProgressList from "./progressList/ProgressList";
import ImagesList from "./ImagesList";

const AddImages: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback( (acceptedFile :File[]) => {
    setFiles(acceptedFile)
    console.log(acceptedFile)
  },[])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept:{'image/*':[]}
  })
  return (
    <>
    <Paper 
  sx={{
    cursor:'pointer',
    background:'#00000',
    color:'#bdbdbd',
    border:'1px dashed #ccc',
    '&:hover':{border:'1px solid #ccc'}
  }}
  >
    <div style={{padding:'16px'}} {...getRootProps()}> 
      <input {...getInputProps()}/>
      {isDragActive ?(
        <p style={{color:'green'}}>Drop the files here...</p>
      ):(
        <p>Drag 'n' Drop image files here / Click to select files </p>
      )}
      <em>(image with  *.jpeg, *.png, *.jpg extension will be accepted)</em>
    </div>
  </Paper>
  <ProgressList {...{files}}/>
  <ImagesList/>
  </>
  
  );
};

export default AddImages;