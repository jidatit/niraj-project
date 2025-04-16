// components/EmptyState.jsx
import { Box, Typography } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { SentimentSatisfied } from "@mui/icons-material";

const EmptyState = ({ message, icon = "inbox" }) => {
  const icons = {
    inbox: <InboxIcon sx={{ fontSize: 60, color: "text.secondary" }} />,
    sad: (
      <SentimentDissatisfiedIcon
        sx={{ fontSize: 60, color: "text.secondary" }}
      />
    ),
    happy: (
      <SentimentSatisfied sx={{ fontSize: 60, color: "text.secondary" }} />
    ),
    // Add more icons as needed
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
        my: 4,
        textAlign: "center",
      }}
    >
      {icons[icon] || icons.inbox}
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ mt: 2, fontWeight: "medium" }}
      >
        {message || "No data available"}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {icon === "inbox"
          ? "When you have data, it will appear here"
          : "Check back later or try a different search"}
      </Typography>
    </Box>
  );
};

export default EmptyState;
