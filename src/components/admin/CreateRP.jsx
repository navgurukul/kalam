import {
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React from "react";
import { HalfCircleSpinner } from "react-epic-spinners";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changeFetching } from "../../store/slices/uiSlice";

const baseUrl = import.meta.env.VITE_API_URL;

const CreateRP = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { isFetching } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  const [rolePrivilege, setRolePrivilege] = React.useState("SelectRP");
  const [rpName, setRPName] = React.useState("");
  const [rpDesc, setRPDesc] = React.useState("");

  const getAPIKey = (rp) => (rp === "Role" ? "roles" : "privilege");

  const handleRPChange = (e) => setRolePrivilege(e.target.value);

  const handleRPNameChange = (e) => setRPName(e.target.value);
  const handleRPDescChange = (e) => setRPDesc(e.target.value);

  const handleSubmit = async () => {
    if (window.confirm(`Create ${rolePrivilege} by Name ${rpName}?`)) {
      try {
        dispatch(changeFetching(true));
        await axios.post(`${baseUrl}role/create${rolePrivilege}`, {
          [getAPIKey(rolePrivilege)]: rpName,
          description: rpDesc,
        });
        enqueueSnackbar(`${rolePrivilege} created by name ${rpName}`, {
          variant: "success",
        });
        dispatch(changeFetching(false));
        setRolePrivilege("SelectRP");
        setRPName("");
        setRPDesc("");
      } catch (e) {
        enqueueSnackbar(`Error while creating ${rolePrivilege}`, {
          variant: "error",
        });
        console.error(e);
        dispatch(changeFetching(false));
      }
    }
  };
  return (
    <Container sx={{ py: "1rem" }} maxWidth="md">
      <Typography sx={{ mb: "2.4rem" }} variant="h4">
        Enter New Role/Privilege Details
      </Typography>
      <FormControl fullWidth sx={{ my: "0.4rem" }}>
        <InputLabel>Select Role/Privilege</InputLabel>
        <Select
          fullWidth
          label="Select Role/Privilege"
          placeholder="Select Role/Privilege"
          name="select-rp"
          value={rolePrivilege}
          onChange={handleRPChange}
        >
          <MenuItem disabled value="SelectRP">
            Select an Option
          </MenuItem>
          {["Role", "Privilege"].map((el) => (
            <MenuItem key={el} value={el}>
              {el}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        name={`${rolePrivilege} name`}
        label={`${rolePrivilege} Name`}
        placeholder={`${rolePrivilege} Name`}
        value={rpName}
        onChange={handleRPNameChange}
        disabled={rolePrivilege === "selectrp"}
        sx={{ my: "0.4rem" }}
      />
      <TextField
        fullWidth
        name={`${rolePrivilege} desc`}
        label={`${rolePrivilege} Description`}
        placeholder={`A little description for ${rolePrivilege}`}
        value={rpDesc}
        onChange={handleRPDescChange}
        disabled={rolePrivilege === "selectrp"}
        sx={{ my: "0.8rem" }}
      />

      <Box
        sx={{
          my: "0.8rem",
          px: "0.4rem",

          display: "flex",
          justifyContent: "flex-end",
          gap: "0.6rem",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={rolePrivilege === "SelectRP" || rpName === ""}
        >
          {isFetching ? (
            <HalfCircleSpinner size={24} />
          ) : (
            `Create ${rolePrivilege}`
          )}
        </Button>
        <Button variant="outlined" color="primary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Box>
    </Container>
  );
};

export default CreateRP;
