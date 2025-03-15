import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../db";
import { toast } from "react-toastify";

const EditTemplateModal = ({ open, handleClose }) => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch the template when the modal opens
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const templateRef = doc(db, "emailTemplates", "personnelTemplate");
        const templateDoc = await getDoc(templateRef);
        if (templateDoc.exists()) {
          setSubject(templateDoc.data().subject);
          setBody(templateDoc.data().body);
        } else {
          // Set default template if it doesn't exist
          setSubject("Personnel Contact Information");
          setBody(
            "Dear Client,\n\nHere are the contact details for the personnel related to your expiring product:\n\n{personnelDetails}\n\nBest regards,\nYour Company"
          );
        }
      } catch (error) {
        console.error("Error fetching template:", error);
      }
    };

    if (open) {
      fetchTemplate();
    }
  }, [open]);

  // Save the template
  const handleSave = async () => {
    setIsLoading(true);
    try {
      await setDoc(doc(db, "emailTemplates", "personnelTemplate"), {
        subject,
        body,
        updatedAt: new Date(),
      });
      console.log("Template saved successfully");
      toast.success("Template saved successfully");
      handleClose();
    } catch (error) {
      toast.error(`Error saving template : ${error?.message}`);
      console.error("Error saving template:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-template-modal"
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
            Edit Email Template
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Subject Field */}
        <TextField
          fullWidth
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          margin="normal"
        />

        {/* Body Field */}
        <TextField
          fullWidth
          label="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          margin="normal"
          multiline
          rows={8}
          helperText="Use {personnelDetails} to dynamically insert the top 3 matching personnel details."
        />

        {/* Save Button */}
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

export default EditTemplateModal;
