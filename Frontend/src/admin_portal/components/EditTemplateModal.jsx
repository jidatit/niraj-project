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

const EditTemplateModal = ({ open, handleClose, templateType }) => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const templateId = templateType === "AC" ? "acPersonnelTemplate" : "roofPersonnelTemplate";

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const templateRef = doc(db, "emailTemplates", templateId);
        const templateDoc = await getDoc(templateRef);
        if (templateDoc.exists()) {
          setSubject(templateDoc.data().subject);
          setBody(templateDoc.data().body);
        } else {
          // Set type-specific default template
          const defaults = {
            AC: {
              subject: "AC Repair Contacts",
              body: "Dear Client,\n\nYour AC unit is approaching its expiration age. Here are our recommended AC repair personnel:\n\n{personnelDetails}\n\nBest regards,\nYour Company"
            },
            Roof: {
              subject: "Roof Maintenance Alert",
              body: "Dear Client,\n\nYour roof is nearing its expiration age. Here are our trusted roofing professionals:\n\n{personnelDetails}\n\nBest regards,\nYour Company"
            }
          };
          setSubject(defaults[templateType].subject);
          setBody(defaults[templateType].body);
        }
      } catch (error) {
        console.error(`Error fetching ${templateType} template:`, error);
        toast.error(`Error fetching ${templateType} template`);
      }
    };

    if (open) {
      fetchTemplate();
    }
  }, [open, templateType]);

  const handleSave = async () => {
    // Validate that {personnelDetails} is in the body
    if (!body.includes("{personnelDetails}")) {
      setError("Body must include {personnelDetails} placeholder.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      await setDoc(doc(db, "emailTemplates", templateId), {
        subject,
        body,
        updatedAt: new Date(),
      });
      console.log(`${templateType} template saved successfully`);
      toast.success(`${templateType} template saved successfully`);
      handleClose();
    } catch (error) {
      toast.error(`Error saving ${templateType} template: ${error?.message}`);
      console.error(`Error saving ${templateType} template:`, error);
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
            Edit {templateType} Email Template
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <TextField
          fullWidth
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          margin="normal"
          multiline
          rows={8}
          error={!!error}
          helperText={
            error || `Use {personnelDetails} to dynamically insert the top 3 matching ${templateType.toLowerCase()} repair personnel details.`
          }
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

export default EditTemplateModal;