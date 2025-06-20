import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Typography, Box, Modal, TextField, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';

const baseURL = import.meta.env.VITE_API_URL;

const WhatsappSMS = () => {
  const [tableData, setTableData] = useState([]);
  const [tempTableData, setTempTableData] = useState([]);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [campaignName, setCampaignName] = useState('');
  const campaignOptions = ['test_api_campaign'];

  const handleFileUploadGeneric = async (file) => {
    setUploadedFileName(file.name);
    const extension = file.name.split('.').pop().toLowerCase();

    const postData = async (data) => {
      const payload = data.map(row => ({
        name: row.name || '',
        contact_number: row.whatsapp || row.mobile || ''
      }));

      try {
        const res = await fetch(`${baseURL}student/outreach/bulkInsert`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dataArr: payload })
        });

        const result = await res.json();

        if (res.ok) {
          console.log('✅ Data inserted successfully:', result);
        } else {
          console.error('❌ Failed to insert data:', result);
        }
      } catch (err) {
        console.error('❌ Error during data insert:', err);
      }
    };

    if (extension === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async function (results) {
          const filteredData = results.data.map(row => ({
            name: row.name || '',
            whatsapp: row.whatsapp || '',
            mobile: row.mobile || ''
          }));
          setTempTableData(filteredData);
          await postData(filteredData);
        }
      });
    } else if (extension === 'xlsx') {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        const filteredData = jsonData.map(row => ({
          name: row.name || '',
          whatsapp: row.whatsapp || '',
          mobile: row.mobile || ''
        }));
        setTempTableData(filteredData);
        await postData(filteredData);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Only .csv and .xlsx files are supported.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileUploadGeneric(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileUploadGeneric(file);
  };

const fetchUploadedData = async () => {
  try {
    const response = await fetch(`${baseURL}student/outreach/data?page=1&pageSize=10`);
    const result = await response.json();
    const formattedData = result.data.map(row => ({
      name: row.name,
      whatsapp: row.contact_number,
      mobile: row.contact_number
    }));
    setTableData(formattedData);
  } catch (error) {
    console.error('Failed to fetch data', error);
  }
};


  const handleDownloadTemplate = () => {
    const templateData = [{
      name: 'Md Nasir',
      whatsapp: '9560962XXX',
      mobile: '9560962XXX'
    }];
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Template.xlsx");
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Welcome to Outreach Dashboard
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={() => setOpenUploadModal(true)}>
            Import Excel / CSV
          </Button>
          {tableData.length > 0 && (
            <Button variant="contained" color="primary">
              Send
            </Button>
          )}
        </Box>

        <Button variant="contained" sx={{ bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' } }} onClick={() => navigate('/create-campaign')}>
          Manage Campaign
        </Button>
      </Box>

      {tableData.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>WhatsApp</b></TableCell>
                <TableCell><b>Mobile</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.whatsapp}</TableCell>
                  <TableCell>{row.mobile}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Modal open={openUploadModal} onClose={() => {
        setOpenUploadModal(false);
        setTempTableData([]);
      }}>
        <Box
          sx={{
            width: 450,
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            mx: 'auto',
            mt: '10%',
            textAlign: 'center',
            outline: 'none'
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <Typography variant="h6" gutterBottom>
            Kindly follow these instructions to import data:
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Campaign</InputLabel>
            <Select
              value={campaignName}
              label="Select Campaign"
              onChange={(e) => setCampaignName(e.target.value)}
            >
              {campaignOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ textAlign: 'left', mb: 2 }}>
            <ul>
              <li>Download the template using "Download Template" button.</li>
              <li>Fill out the name, whatsapp, and mobile columns.</li>
              <li>Drag & drop your file here or click to upload.</li>
            </ul>
          </Box>

          <Button variant="outlined" onClick={handleDownloadTemplate} sx={{ mb: 2 }}>
            Download Template
          </Button>

          <Box
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 2,
              py: 4,
              px: 2,
              bgcolor: '#f9f9f9',
              cursor: 'pointer'
            }}
            onClick={() => fileInputRef.current.click()}
          >
            <Typography>
              Click or drag Excel/CSV file to this area<br />
              <small>(Supported: .xlsx, .csv)</small>
            </Typography>
            <input
              type="file"
              accept=".xlsx,.csv"
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            {uploadedFileName && (
              <Typography sx={{ mt: 1, color: 'gray' }}>
                Uploaded File: {uploadedFileName}
              </Typography>
            )}
          </Box>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              onClick={() => {
                fetchUploadedData();
                setOpenUploadModal(false);
              }}
              sx={{ mr: 2 }}
              disabled={tempTableData.length === 0}
            >
              OK
            </Button>
            <Button variant="outlined" onClick={() => setOpenUploadModal(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default WhatsappSMS;
