import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../db";
import {
  Autocomplete,
  Box,
  Button,
  Modal,
  TextField,
  Typography,
} from "@mui/material";

export function AttachReferralModal({ open, onClose, client, selectedReferral, fetchClientReferralsData }) {
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState(selectedReferral || null);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch referral partners
  useEffect(() => {
    if (open) {
      (async () => {
        const q = query(
          collection(db, "users"),
          where("signupType", "==", "Referral")
        );
        const snap = await getDocs(q);
        setOptions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      })();
    }
  }, [open]);

  // 🔹 Reset / preload selected referral when client changes
  useEffect(() => {
    if (selectedReferral) {
      setValue(selectedReferral);
    } else {
      setValue(null);
    }
  }, [selectedReferral]);

  // 🔹 Attach or update referral
  const handleAttach = async () => {
    if (!client || !value) return;
    setLoading(true);

    try {
      const { id: referralId, name, email } = value;
      const referralData = { name, email };

      const clientRef = doc(db, "users", client.id);
      await updateDoc(clientRef, {
        hasReferral: true,
        referralId,
        referralData,
        updatedAt: new Date(),
      });

      await fetchClientReferralsData();

      onClose();
    } catch (error) {
      console.error("Error attaching referral:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Optional: remove referral if needed
  const handleRemove = async () => {
    if (!client) return;
    setLoading(true);

    try {
      const clientRef = doc(db, "users", client.id);
      await updateDoc(clientRef, {
        hasReferral: false,
        referralId: null,
        referralData: null,
        updatedAt: new Date(),
      });

      await fetchClientReferralsData();
      onClose();
    } catch (error) {
      console.error("Error removing referral:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" gutterBottom>
          {client?.referralId ? "Edit Referral" : "Attach Referral"}{" "}
          to {client?.name || "Client"}
        </Typography>

        <Autocomplete
          options={options}
          getOptionLabel={(opt) => opt.name || ""}
          value={value}
          onChange={(e, val) => setValue(val)}
          renderInput={(params) => (
            <TextField {...params} label="Referral Partner" />
          )}
        />

        <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
          {client?.referralId && (
            <Button color="error" onClick={handleRemove} disabled={loading}>
              Remove
            </Button>
          )}
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleAttach}
            disabled={!value || loading}
            variant="contained"
            sx={{ backgroundColor: "#003049", color: "white" }}
          >
            {loading
              ? client?.referralId
                ? "Updating..."
                : "Attaching..."
              : client?.referralId
                ? "Update"
                : "Attach"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
