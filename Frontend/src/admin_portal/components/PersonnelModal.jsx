import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const AddPersonnelModal = ({ open, handleClose, db }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [zipCodes, setZipCodes] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [type, setType] = useState("AC Repair"); // Default to AC Repair
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !address || !zipCodes || !contactInfo) {
      toast.error("Please fill all fields.");
      return;
    }

    setIsLoading(true);
    try {
      await addDoc(collection(db, "Personnels"), {
        name,
        address,
        zipCodes: zipCodes.split(",").map((code) => code.trim()),
        contactInfo,
        type,
        createdAt: new Date(),
      });
      toast.success("Personnel added successfully");
      handleClose();
    } catch (error) {
      console.error("Error adding personnel:", error);
      toast.error("Failed to add personnel. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="add-personnel-modal"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "80%", md: "60%" },
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5" component="h2">
            Add New Personnel
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Repair Type Dropdown */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Repair Type</InputLabel>
          <Select
            value={type}
            label="Repair Type"
            onChange={(e) => setType(e.target.value)}
          >
            <MenuItem value="AC Repair">AC Repair</MenuItem>
            <MenuItem value="Roof Repair">Roof Repair</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Zip Codes (comma-separated)"
          value={zipCodes}
          onChange={(e) => setZipCodes(e.target.value)}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Contact Info"
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
          margin="normal"
          required
        />

        <Box
          sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
        >
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={isLoading}
            style={{ backgroundColor: "#003049", color: "white" }}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddPersonnelModal;
