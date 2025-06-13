import React, { useState } from 'react';
import Papa from 'papaparse';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Typography, Box, Modal, TextField
} from '@mui/material';

const baseURL = import.meta.env.VITE_API_URL;

const WhatsappSMS = () => {
  const [tableData, setTableData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [params, setParams] = useState([]);
  const [campaignData, setCampaignData] = useState({
    name: '',
    template: null
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const filteredData = results.data.map(row => ({
          name: row.name || '',
          whatsapp: row.whatsapp || '',
          mobile: row.mobile || ''
        }));
        setTableData(filteredData);
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'template') {
      setCampaignData(prev => ({ ...prev, template: files[0] }));
    } else {
      setCampaignData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleParamChange = (index, value) => {
    const updatedParams = [...params];
    updatedParams[index] = value;
    setParams(updatedParams);
  };

  const handleAddParam = () => {
    setParams([...params, ""]);
  };

  const handleSendCampaign = async () => {
    if (!campaignData.name || tableData.length === 0) {
      alert("Please provide campaign name and upload CSV data.");
      return;
    }

    const students = tableData.map(row => ({
      name: row.name,
      contactNumber: Number(row.whatsapp)
    }));

    const payload = {
      students,
      campaignName: campaignData.name,
      params: params.filter(p => p.trim() !== "")
    };

    try {
      const response = await fetch(`${baseURL}student/outreach/whatsappMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        alert("Campaign sent successfully!");
        console.log(result);
      } else {
        const errorText = await response.text();
        alert("Failed to send campaign: " + errorText);
      }
    } catch (error) {
      alert("Error sending request: " + error.message);
    }
  };

  return (
<Box sx={{ padding: 4 }}>
  {/* BUTTONS CENTERED */}
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 2,
      flexWrap: 'wrap',
      mb: 4
    }}
  >
    <Button variant="contained" component="label">
      Upload CSV
      <input type="file" accept=".csv" hidden onChange={handleFileUpload} />
    </Button>

    <Button variant="outlined" onClick={() => setOpenModal(true)}>
      Create Campaign
    </Button>

    {tableData.length > 0 && campaignData.name && (
      <Button variant="contained" color="success" onClick={handleSendCampaign}>
        Send
      </Button>
    )}
  </Box>

  {/* TABLE DISPLAY */}
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

  {/* MODAL SAME AS BEFORE */}
<Modal open={openModal} onClose={() => setOpenModal(false)}>
  <Box
    sx={{
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400, bgcolor: 'background.paper',
      borderRadius: 2, boxShadow: 24, p: 4
    }}
  >
    <Typography variant="h6" gutterBottom>
      Create Campaign
    </Typography>

    <TextField
      fullWidth margin="normal"
      name="name" label="Campaign Name"
      value={campaignData.name}
      onChange={handleInputChange}
    />

    <Button
      variant="outlined"
      component="label"
      fullWidth
      sx={{ marginTop: 2 }}
    >
      Upload Template Image
      <input
        type="file"
        hidden name="template"
        accept="image/*"
        onChange={handleInputChange}
      />
    </Button>

    {campaignData.template && (
      <Typography variant="body2" sx={{ mt: 1 }}>
        Selected: {campaignData.template.name}
      </Typography>
    )}

    <Typography variant="subtitle1" sx={{ mt: 3 }}>Params</Typography>
    {params.map((param, index) => (
      <TextField
        key={index}
        fullWidth
        margin="normal"
        label={`Param ${index + 1}`}
        value={param}
        onChange={(e) => handleParamChange(index, e.target.value)}
      />
    ))}

    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
      <Button variant="contained" onClick={handleAddParam}>
        Add Params
      </Button>
      <Button variant="outlined" color="secondary" onClick={() => setOpenModal(false)}>
        Okay
      </Button>
    </Box>
  </Box>
</Modal>

</Box>

  );
};

export default WhatsappSMS;
