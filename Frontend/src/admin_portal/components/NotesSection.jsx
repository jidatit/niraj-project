import React, { useState } from "react";
import {
  Button,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const NotesSection = ({ formData, setFormData }) => {
  const [showTextArea, setShowTextArea] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const noteObject = {
      id: Date.now(),
      text: newNote,
      timestamp: new Date().toISOString(),
    };

    setFormData((prev) => ({
      ...prev,
      notes: [...(prev.notes || []), noteObject],
    }));

    setNewNote("");
    setShowTextArea(false);
  };

  const deleteNote = (noteId) => {
    setFormData((prev) => ({
      ...prev,
      notes: (prev.notes || []).filter((note) => note.id !== noteId),
    }));
  };

  return (
    <>
      <button
        type="button"
        className="inline-flex outline-none justify-center items-center gap-1 rounded-md text-white shadow-sm px-4 py-2 bg-[#003049] text-sm font-medium"
        onClick={() => setShowTextArea(!showTextArea)}
      >
        Add Notes <AddIcon />
      </button>

      {showTextArea && (
        <Box sx={{ mb: 2 }}>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Enter your note here..."
            variant="outlined"
            sx={{ mb: 1 }}
          />
          <Button
            variant="outlined"
            onClick={handleAddNote}
            disabled={!newNote.trim()}
          >
            Save
          </Button>
        </Box>
      )}

      {formData.notes?.length > 0 && (
        <Accordion
          sx={{
            width: {
              xs: "100%", // For extra-small screens
              sm: "90%", // For small screens
              md: "80%", // For medium screens
              lg: "720px", // For large screens and above
            },
          }}
          expanded={isAccordionExpanded}
          onChange={() => setIsAccordionExpanded(!isAccordionExpanded)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ChatBubbleOutlineIcon />
              <Typography>Notes ({formData.notes?.length || 0})</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {formData.notes?.map((note) => (
              <Box
                key={note.id}
                sx={{
                  mb: 2,
                  pb: 2,
                  borderBottom: "1px solid #eee",
                  "&:last-child": {
                    mb: 0,
                    pb: 0,
                    borderBottom: "none",
                  },
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="subtitle1">{note.text}</Typography>
                    {/* <Typography variant="caption" color="text.secondary">
                      {new Date(note.timestamp).toLocaleString()}
                    </Typography> */}
                    {/* <Typography sx={{ mt: 1 }}>{note.text}</Typography> */}
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => deleteNote(note.id)}
                    sx={{ alignSelf: "flex-start" }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      )}
    </>
  );
};

export default NotesSection;
