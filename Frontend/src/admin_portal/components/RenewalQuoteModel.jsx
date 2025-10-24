import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  IconButton,
  Divider,
  Skeleton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import ReactQuill from "react-quill"; // Import ReactQuill
import "react-quill/dist/quill.snow.css"; // Import Quill styles

const RenewalQuoteTemplateModal = ({ open, handleClose, db }) => {
  const [template, setTemplate] = useState({
    subject: "",
    body: "", // Will store HTML content
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      setIsDataLoading(true);
      setError(null);
      try {
        const docRef = doc(db, "emailTemplates", "renewalQuote");
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setTemplate(snap.data());
        } else {
          setTemplate({
            subject: "Your renewal quote is ready",
            body: `<p>Dear {client_name},</p><p>Your renewal quote is now available. Please go to your dashboard and submit a bind request.</p><p>Thank you,</p><p>Team</p>`,
          });
        }
      } catch (err) {
        console.error("Error fetching renewal template:", err);
        setError("Failed to load template. Please try again.");
      } finally {
        setIsDataLoading(false);
      }
    };

    if (open) fetchTemplate();
  }, [open, db]);

  const handleSave = async () => {
    if (!template.body.includes("{client_name}")) {
      toast.error("Template body must include {client_name} for dynamic client name insertion.");
      return;
    }

    setIsLoading(true);
    try {
      await setDoc(doc(db, "emailTemplates", "renewalQuote"), {
        subject: template.subject,
        body: template.body,
        updatedAt: new Date(),
      });
      toast.success("Renewal template saved");
      handleClose();
    } catch (err) {
      console.error("Error saving renewal template:", err);
      setError("Failed to save. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderSkeleton = () => (
    <Box>
      <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
    </Box>
  );

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="renewal-template-modal"
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
              Renewal Quote Email Template
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {error ? (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          ) : isDataLoading ? (
            renderSkeleton()
          ) : (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Edit Email Content
              </Typography>
              <TextField
                fullWidth
                label="Email Subject"
                value={template.subject}
                onChange={(e) =>
                  setTemplate({ ...template, subject: e.target.value })
                }
                margin="normal"
              />
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Email Body (use formatting tools below)
                </Typography>
                <Typography variant="caption" display="block" gutterBottom>
                  Use  {"{client_name}"} placeholder to insert the client's name
                </Typography>
                <ReactQuill
                  theme="snow"
                  value={template.body}
                  onChange={(value) => setTemplate({ ...template, body: value })}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ["bold", "italic", "underline", "strike", "blockquote"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link", "image"],
                      ["clean"],
                    ],
                  }}
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Preview
                </Typography>
                <Box sx={{ p: 3, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Subject: {template.subject}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box
                    sx={{ mt: 2 }}
                    dangerouslySetInnerHTML={{ __html: template.body }}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                <Button onClick={handleClose} variant="outlined">
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  variant="contained"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default RenewalQuoteTemplateModal;