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
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const AddPersonnelModal = ({ open, handleClose, db, fetchPersonnelData }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [zipCodes, setZipCodes] = useState([]); // Use an array for zip codes
  const [currentZipCode, setCurrentZipCode] = useState(""); // Temporary input for a single zip code
  const [contactInfo, setContactInfo] = useState("");
  const [type, setType] = useState("AC Repair"); // Default to AC Repair
  const [isLoading, setIsLoading] = useState(false);

  // Function to add a zip code to the list
  const handleAddZipCode = () => {
    if (currentZipCode.trim() && !zipCodes.includes(currentZipCode.trim())) {
      setZipCodes([...zipCodes, currentZipCode.trim()]);
      setCurrentZipCode(""); // Clear the input field
    }
  };

  // Function to remove a zip code from the list
  const handleDeleteZipCode = (zipToDelete) => {
    setZipCodes(zipCodes.filter((zip) => zip !== zipToDelete));
  };

  const handleSave = async () => {
    if (!name || !address || zipCodes.length === 0 || !contactInfo) {
      toast.error("Please fill all fields and add at least one zip code.");
      return;
    }

    setIsLoading(true);
    try {
      await addDoc(collection(db, "Personnels"), {
        name,
        address,
        zipCodes, // Save zip codes as an array
        contactInfo,
        type,
        createdAt: new Date(),
      });
      fetchPersonnelData();
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

        {/* Zip Codes Input */}
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Add Zip Code"
            value={currentZipCode}
            onChange={(e) => setCurrentZipCode(e.target.value)}
            margin="normal"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAddZipCode();
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleAddZipCode}
            sx={{ mt: 1 }}
            disabled={!currentZipCode.trim()}
          >
            Add Zip Code
          </Button>
          <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
            {zipCodes.map((zip, index) => (
              <Chip
                key={index}
                label={zip}
                onDelete={() => handleDeleteZipCode(zip)}
                sx={{ backgroundColor: "#003049", color: "white" }}
              />
            ))}
          </Box>
        </Box>

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
