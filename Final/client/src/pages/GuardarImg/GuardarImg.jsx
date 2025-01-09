import React, { useState } from "react";
import axios from "axios";

const GuardarImg = () => {
    const [file, setFile] = useState(null); // For previewing the image
    const [image, setImage] = useState(null); // For storing the selected file
    const [selectedFile, setSelectedFile] = useState(null); // For
   
    // Handle file input
    const handleFileInput = (e) => {
        console.log("handleFileInput working!!!");
        const selectedFile = e.target.files[0];
        setFile(URL.createObjectURL(selectedFile)); // Preview the selected file
        setImage(selectedFile); // Store the file for upload
        setSelectedFile(selectedFile); // Store the selected file
       // formData.append('my-image-file', selectedFile);
       console.log('Selected file:', selectedFile);

    };

    // Handle the file upload
    const handleClick = async (event) => {
        event.preventDefault();
    
        const formData = new FormData();
        formData.append('file', image); // Assuming image is a File object
    
        // Logging to ensure formData is populated correctly
        console.log('formData before sending:', formData);
    
        try {
            const response = await axios.post('http://localhost:3000/image-upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Important for file upload
                },
            });
            console.log('File uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error during the Axios POST request:', error.response ? error.response.data : error.message);
        }
    };
    
      
      

    return (
        <div className="container mt-5">
            <h2>Add Image</h2>
            <input type="file" onChange={handleFileInput} />
            <button onClick={handleClick}>Upload!!!</button>
            {file && (
                <img
                    src={file}
                    alt="Preview"
                    style={{ marginTop: "20px", width: "300px" }}
                />
            )}
        </div>
    );
};

export { GuardarImg };
