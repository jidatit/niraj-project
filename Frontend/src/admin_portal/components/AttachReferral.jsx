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

export function AttachReferralModal({ open, onClose, policy }) {
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState(null);

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

  const handleAttach = async () => {
    if (policy && value) {
      const bpRef = doc(db, "bound_policies", policy?.id);
      await updateDoc(bpRef, {
        byReferral: true,
        ReferralId: value.id,
        Referral: value,
        "user.byReferral": true,
        "user.ReferralId": value.id,
        "user.Referral": value,
      });
      onClose();
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
          Attach Referral to {policy?.user?.name}
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
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleAttach} disabled={!value} variant="contained">
            Attach
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
