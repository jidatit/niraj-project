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

const StandardTemplateModal = ({
  open,
  handleClose,
  mode, // "template" or "logo"
  referral, // Required for "logo" mode
  db,
  storage,
}) => {
  const [standardTemplate, setStandardTemplate] = useState({
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

  // Fetch shared standard template (always, for preview or editing)
  useEffect(() => {
    const fetchStandardTemplate = async () => {
      setIsDataLoading(true);
      setError(null);
      try {
        const templateDoc = await getDoc(doc(db, "emailTemplates", "standard"));
        if (templateDoc.exists()) {
          setStandardTemplate(templateDoc.data());
        } else {
          // Default template
          setStandardTemplate({
            subject: "Policy Renewal Reminder from {referralName}",
            body: "Dear Client,\n\nThis is a reminder that your policy with {referralName} is coming up for renewal.\n\nPlease contact us if you have any questions.\n\nBest regards,\n{referralName} Team",
            logoPosition: "top",
          });
        }
      } catch (err) {
        console.error("Error fetching standard template:", err);
        setError("Failed to fetch template data. Please try again.");
      } finally {
        setIsDataLoading(false);
      }
    };

    // Fetch referral logo if in "logo" mode
    const fetchReferralLogo = async () => {
      if (mode === "logo" && referral?.id) {
        setIsDataLoading(true);
        try {
          const referralLogoDoc = await getDoc(doc(db, "referralLogos", referral.id));
          if (referralLogoDoc.exists()) {
            setLogoUrl(referralLogoDoc.data().logoUrl);
          } else {
            setLogoUrl("");
          }
        } catch (err) {
          console.error("Error fetching referral logo:", err);
          setError("Failed to fetch logo. Please try again.");
        } finally {
          setIsDataLoading(false);
        }
      }
    };

    if (open) {
      fetchStandardTemplate();
      if (mode === "logo") {
        fetchReferralLogo();
      }
    }
  }, [open, mode, referral, db]);

  const handleLogoChange = (e) => {
    if (e.target.files[0]) {
      setReferralLogo(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (mode === "template" && isAdmin) {
        // Validate placeholder
        if (!standardTemplate.subject.includes("{referralName}") || !standardTemplate.body.includes("{referralName}")) {
          setError("Subject and body must include {referralName} placeholder.");
          setIsLoading(false);
          return;
        }
        await setDoc(doc(db, "emailTemplates", "standard"), {
          ...standardTemplate,
          updatedAt: new Date(),
        });
        toast.success("Standard template saved successfully");
      } else if (mode === "logo" && referral?.id) {
        if (referralLogo) {
          const logoRef = ref(storage, `referral-logos/${referral.id}`);
          await uploadBytes(logoRef, referralLogo);
          const newLogoUrl = await getDownloadURL(logoRef);
          await setDoc(doc(db, "referralLogos", referral.id), {
            logoUrl: newLogoUrl,
            updatedAt: new Date(),
          });
          toast.success("Logo saved successfully");
        } else {
          toast.info("No changes to save.");
        }
      }
      setIsLoading(false);
      handleClose();
    } catch (err) {
      console.error("Error saving:", err);
      setError("Failed to save. Please try again.");
      setIsLoading(false);
    }
  };

  // Preview helpers
  const previewName = mode === "logo" ? referral?.name || "Referral" : "Referral Partner";
  const previewSubject = standardTemplate.subject.replace(/{referralName}/g, previewName);
  const previewBody = standardTemplate.body.replace(/{referralName}/g, previewName);

  const renderSkeleton = () => (
    <Box>
      <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
    </Box>
  );

  const renderPreview = () => {
    const bodyParagraphs = previewBody.split("\n").map((para, idx) => (
      <Typography key={idx} variant="body2" paragraph>
        {para}
      </Typography>
    ));

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
        <Typography variant="caption">No logo (per-referral)</Typography>
      </Box>
    );

    switch (standardTemplate.logoPosition) {
      case "top":
        return (
          <>
            {logoElement}
            {bodyParagraphs}
          </>
        );
      case "bottom":
        return (
          <>
            {bodyParagraphs}
            {logoElement}
          </>
        );
      case "after-greeting":
        return (
          <>
            {bodyParagraphs[0]}
            {logoElement}
            {bodyParagraphs.slice(1)}
          </>
        );
      case "before-signature":
        const signatureIndex = bodyParagraphs.length - 2 >= 0 ? bodyParagraphs.length - 2 : bodyParagraphs.length - 1;
        return (
          <>
            {bodyParagraphs.slice(0, signatureIndex)}
            {logoElement}
            {bodyParagraphs.slice(signatureIndex)}
          </>
        );
      default:
        return (
          <>
            {logoElement}
            {bodyParagraphs}
          </>
        );
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose();
        setLogoUrl("");
      }}
      aria-labelledby="email-template-modal"
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
            {mode === "template" ? "Edit Standard Template" : `Edit Logo for ${referral?.name || "Referral"}`}
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
            {mode === "logo" && (
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
            )}

            {mode === "template" && isAdmin && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Edit Standard Template Content
                </Typography>
                <Typography variant="caption" display="block" gutterBottom>
                  Use {"{referralName}"} placeholder to insert the referral partner's name
                </Typography>

                <TextField
                  fullWidth
                  label="Email Subject"
                  value={standardTemplate.subject}
                  onChange={(e) =>
                    setStandardTemplate({ ...standardTemplate, subject: e.target.value })
                  }
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Email Body"
                  value={standardTemplate.body}
                  onChange={(e) =>
                    setStandardTemplate({ ...standardTemplate, body: e.target.value })
                  }
                  margin="normal"
                  multiline
                  rows={8}
                />

                <FormControl fullWidth margin="normal">
                  <InputLabel>Logo Position</InputLabel>
                  <Select
                    value={standardTemplate.logoPosition}
                    label="Logo Position"
                    onChange={(e) =>
                      setStandardTemplate({ ...standardTemplate, logoPosition: e.target.value })
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
                Preview {mode === "template" ? "(Generic)" : `(for ${referral?.name})`}
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
                style={{ backgroundColor: "#003049", color: "white" }}
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