import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Skeleton,
} from "@mui/material";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { toast } from "react-toastify";
import ReactQuill from "react-quill"; // Import ReactQuill
import "react-quill/dist/quill.snow.css"; // Import Quill styles

const StandardTemplateModal = ({
  open,
  handleClose,
  referral, // Required for all operations
  db,
  storage,
}) => {
  const [template, setTemplate] = useState({
    subject: "",
    body: "",
    logoPosition: "top",
  });
  const [referralLogo, setReferralLogo] = useState(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true); // Derive from auth in real app
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch referral-specific template and logo
  useEffect(() => {
    const fetchData = async () => {
      if (!referral?.id) return;
      setIsDataLoading(true);
      setError(null);
      try {
        // Fetch template
        const templateDoc = await getDoc(doc(db, "emailTemplates", referral.id));
        if (templateDoc.exists()) {
          setTemplate(templateDoc.data());
        } else {
          // Default template
          setTemplate({
            subject: "Policy Renewal Reminder from {referralName}",
            body: `<p>Dear {client_name},</p><p>This is a reminder that your policy with {referralName} is coming up for renewal.</p><p>Please contact us if you have any questions.</p><p>Best regards,</p><p>{referralName} Team</p>`,
            logoPosition: "top",
          });
        }

        // Fetch logo
        const referralLogoDoc = await getDoc(doc(db, "referralLogos", referral.id));
        if (referralLogoDoc.exists()) {
          setLogoUrl(referralLogoDoc.data().logoUrl);
        } else {
          setLogoUrl("");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setIsDataLoading(false);
      }
    };

    if (open && referral?.id) {
      fetchData();
    }
  }, [open, referral, db]);

  const handleLogoChange = (e) => {
    if (e.target.files[0]) {
      setReferralLogo(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!referral?.id) {
      setError("No referral selected.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Save template (if admin)
      if (isAdmin) {
        if (!template.subject.includes("{referralName}") || !template.body.includes("{referralName}")) {
          toast.error("Subject and body must include {referralName} placeholder.");
          setIsLoading(false);
          return;
        }
        if (!template.body.includes("{client_name}")) {
          toast.error("Template body must include {client_name} for dynamic client name insertion.");
          setIsLoading(false);
          return;
        }
        await setDoc(doc(db, "emailTemplates", referral.id), {
          ...template,
          updatedAt: new Date(),
        });
        toast.success(`Standard template for ${referral.name} saved successfully`);
      }

      // Save logo (if changed)
      if (referralLogo) {
        const logoRef = ref(storage, `referral-logos/${referral.id}`);
        await uploadBytes(logoRef, referralLogo);
        const newLogoUrl = await getDownloadURL(logoRef);
        await setDoc(doc(db, "referralLogos", referral.id), {
          logoUrl: newLogoUrl,
          updatedAt: new Date(),
        });
        toast.success(`Logo for ${referral.name} saved successfully`);
      } else if (!isAdmin && !referralLogo) {
        toast.info("No changes to save.");
      }

      setIsLoading(false);
      handleClose();
    } catch (err) {
      console.error("Error saving:", err);
      setError("Failed to save. Please try again.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (referralLogo) {
        URL.revokeObjectURL(referralLogo);
      }
    };
  }, [referralLogo]);

  // Preview helpers
  const previewName = referral?.name || "Referral";
  const previewClientName = "John Doe"; // Sample client name for preview
  const previewSubject = template.subject
    .replace(/{referralName}/g, previewName)
    .replace(/{client_name}/g, previewClientName);
  const previewBody = template.body
    .replace(/{referralName}/g, previewName)
    .replace(/{client_name}/g, previewClientName);

  const renderSkeleton = () => (
    <Box>
      <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
    </Box>
  );

  const renderPreview = () => {
    const logoElement = logoUrl || referralLogo ? (
      <Box
        component="img"
        src={referralLogo ? URL.createObjectURL(referralLogo) : logoUrl}
        alt={`${previewName} Logo`}
        sx={{ height: 80, maxWidth: 200, objectFit: "contain", my: 2 }}
      />
    ) : (
      <Box
        sx={{
          bgcolor: "#e0e0e0",
          height: 80,
          maxWidth: 200,
          my: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption">No logo</Typography>
      </Box>
    );

    switch (template.logoPosition) {
      case "top":
        return (
          <>
            {logoElement}
            <Box
              sx={{ mt: 2 }}
              dangerouslySetInnerHTML={{ __html: previewBody }}
            />
          </>
        );
      case "bottom":
        return (
          <>
            <Box
              sx={{ mt: 2 }}
              dangerouslySetInnerHTML={{ __html: previewBody }}
            />
            {logoElement}
          </>
        );
      case "after-greeting":
        return (
          <>
            <Box
              sx={{ mt: 2 }}
              dangerouslySetInnerHTML={{ __html: previewBody.split("<p>")[0] + "<p>" + previewBody.split("<p>")[1] }}
            />
            {logoElement}
            <Box
              sx={{ mt: 2 }}
              dangerouslySetInnerHTML={{ __html: previewBody.split("<p>").slice(2).join("<p>") }}
            />
          </>
        );
      case "before-signature":
        return (
          <>
            <Box
              sx={{ mt: 2 }}
              dangerouslySetInnerHTML={{ __html: previewBody.split("<p>").slice(0, -2).join("<p>") }}
            />
            {logoElement}
            <Box
              sx={{ mt: 2 }}
              dangerouslySetInnerHTML={{ __html: previewBody.split("<p>").slice(-2).join("<p>") }}
            />
          </>
        );
      default:
        return (
          <>
            {logoElement}
            <Box
              sx={{ mt: 2 }}
              dangerouslySetInnerHTML={{ __html: previewBody }}
            />
          </>
        );
    }
  };
  useEffect(() => {
    if (!referral?.id) {
      setReferralLogo(null);
      setLogoUrl("");
      return;
    }

    setReferralLogo(null); // reset the local file
    setLogoUrl(""); // clear old URL while new one loads
  }, [referral?.id]);

  return (
    <Modal
      open={open}
      onClose={() => {
        setLogoUrl("");
        handleClose();
      }}
      aria-labelledby="standard-template-modal"
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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="h2">
            Edit Standard Template and Logo for {referral?.name || "Referral"}
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
            {/* Logo Section */}
            <Box mb={3}>
              <Typography variant="subtitle1" gutterBottom>
                Logo for {referral?.name}
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                {(logoUrl || referralLogo) && (
                  <Box
                    component="img"
                    src={referralLogo ? URL.createObjectURL(referralLogo) : logoUrl}
                    alt="Referral Logo"
                    sx={{ height: 80, maxWidth: 200, objectFit: "contain" }}
                  />
                )}
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<AddPhotoAlternateIcon />}
                >
                  {logoUrl ? "Change Logo" : "Add Logo"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </Button>
              </Box>
            </Box>

            {/* Template Section (admin-only) */}
            {isAdmin && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Edit Standard Template Content for {referral?.name}
                </Typography>
                <Typography variant="caption" display="block" gutterBottom>
                  Use {"{referralName}"} placeholder to insert the referral partner's name and {"{client_name}"} for the client's name
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

                <FormControl fullWidth margin="normal">
                  <InputLabel>Logo Position</InputLabel>
                  <Select
                    value={template.logoPosition}
                    label="Logo Position"
                    onChange={(e) =>
                      setTemplate({ ...template, logoPosition: e.target.value })
                    }
                  >
                    <MenuItem value="top">Top of Email</MenuItem>
                    <MenuItem value="bottom">Bottom of Email</MenuItem>
                    <MenuItem value="after-greeting">After Greeting</MenuItem>
                    <MenuItem value="before-signature">Before Signature</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

            <Divider sx={{ my: 3 }} />
            <Box mt={2}>
              <Typography variant="subtitle1" gutterBottom>
                Preview for {referral?.name || "Referral"}
              </Typography>
              <Box sx={{ p: 3, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Subject: {previewSubject}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ mt: 2 }}>{renderPreview()}</Box>
              </Box>
            </Box>

            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button onClick={handleClose} variant="outlined">
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                variant="contained"
                disabled={isLoading}
                sx={{ backgroundColor: "#003049", color: "white" }}
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default StandardTemplateModal;