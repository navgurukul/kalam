import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton, Avatar, Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from 'react-router-dom';

const WhatsappSMSForm = () => {
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([
    {
      name: 'Demo Campaign',
      template: null,
      params: ['param1'],
      isEdit: false,
    },
  ]);

  const handleEditToggle = (index) => {
    const updated = [...campaigns];
    updated[index].isEdit = !updated[index].isEdit;
    setCampaigns(updated);
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...campaigns];
    updated[index][field] = value;
    setCampaigns(updated);
  };

  const handleParamChange = (campIndex, paramIndex, value) => {
    const updated = [...campaigns];
    updated[campIndex].params[paramIndex] = value;
    setCampaigns(updated);
  };

  const handleAddParam = (campIndex) => {
    const updated = [...campaigns];
    updated[campIndex].params.push('');
    setCampaigns(updated);
  };

  const handleFileChange = (index, file) => {
    const updated = [...campaigns];
    updated[index].template = file;
    setCampaigns(updated);
  };

  const handleAddCampaign = () => {
    setCampaigns([
      ...campaigns,
      { name: '', template: null, params: [''], isEdit: true },
    ]);
  };

  return (
    <Box sx={{ px: 4, py: 5, maxWidth: 1200, mx: 'auto' }}>
      <Button variant="outlined" color="primary" onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        ⬅ Go Back
      </Button>

      <Typography variant="h4" gutterBottom fontWeight="bold">
        Campaign Manager
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Button variant="contained" color="success" onClick={handleAddCampaign} sx={{ mb: 3 }}>
        + Add New Campaign
      </Button>

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><b>Campaign Name</b></TableCell>
              <TableCell><b>Template</b></TableCell>
              <TableCell><b>Params</b></TableCell>
              <TableCell><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campaigns.map((campaign, index) => (
              <TableRow key={index} hover>
                {/* Campaign Name */}
                <TableCell sx={{ verticalAlign: 'top', width: '25%' }}>
                  {campaign.isEdit ? (
                    <TextField
                      fullWidth
                      label="Campaign Name"
                      size="small"
                      value={campaign.name}
                      onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                    />
                  ) : (
                    <Typography>{campaign.name}</Typography>
                  )}
                </TableCell>

                {/* Template */}
                <TableCell sx={{ verticalAlign: 'top', width: '25%' }}>
                  {campaign.isEdit ? (
                    <>
                      <Button component="label" variant="outlined" size="small">
                        Upload Image
                        <input
                          hidden
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(index, e.target.files[0])}
                        />
                      </Button>
                      {campaign.template && (
                        <Avatar
                          src={URL.createObjectURL(campaign.template)}
                          variant="rounded"
                          sx={{ mt: 1, width: 70, height: 70 }}
                        />
                      )}
                    </>
                  ) : (
                    campaign.template ? (
                      <Avatar
                        src={URL.createObjectURL(campaign.template)}
                        variant="rounded"
                        sx={{ width: 70, height: 70 }}
                      />
                    ) : <Typography color="text.secondary">No Image</Typography>
                  )}
                </TableCell>

                {/* Params */}
                <TableCell sx={{ verticalAlign: 'top', width: '30%' }}>
                  {campaign.isEdit ? (
                    <>
                      {campaign.params.map((param, i) => (
                        <TextField
                          key={i}
                          fullWidth
                          size="small"
                          label={`Param ${i + 1}`}
                          value={param}
                          onChange={(e) => handleParamChange(index, i, e.target.value)}
                          sx={{ mb: 1 }}
                        />
                      ))}
                      <Button
                        size="small"
                        onClick={() => handleAddParam(index)}
                        variant="text"
                      >
                        + Add Param
                      </Button>
                    </>
                  ) : (
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {campaign.params.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  )}
                </TableCell>

                {/* Action */}
                <TableCell sx={{ verticalAlign: 'top', textAlign: 'center' }}>
                  <IconButton
                    onClick={() => handleEditToggle(index)}
                    color={campaign.isEdit ? 'success' : 'primary'}
                  >
                    {campaign.isEdit ? <SaveIcon /> : <EditIcon />}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default WhatsappSMSForm;
