import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  CircularProgress,
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  Divider,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Stack,
} from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  FaChevronRight,
  FaChevronDown,
  FaUser,
  FaUsers,
  FaSearch,
  FaArrowLeft,
  FaTimes,
  FaExpand,
  FaCompress,
} from "react-icons/fa";
import RequestPage from "../../user_portal/pages/RequestPage";

const steps = ["Select User", "Submit Quote"];

const AdminUserSelectDialog = ({
  onUserSelect,
  db,
  buttonText = "Select User",
}) => {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState([]);
  const [users, setUsers] = useState({ clients: [], referrals: [] });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState({ clients: [], referrals: [] });
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  useEffect(() => {
    if (open) {
      fetchAllUsers();
    }
  }, [open]);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      // Fetch Clients
      const clientsQuery = query(
        collection(db, "users"),
        where("signupType", "==", "Client")
      );
      const clientsSnapshot = await getDocs(clientsQuery);
      const clientsList = clientsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch Referrals
      const referralsQuery = query(
        collection(db, "users"),
        where("signupType", "==", "Referral")
      );
      const referralsSnapshot = await getDocs(referralsQuery);
      const referralsList = referralsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAllUsers({ clients: clientsList, referrals: referralsList });
      setUsers({ clients: clientsList, referrals: referralsList });
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setUsers(allUsers);
      return;
    }

    const filteredUsers = {
      clients: allUsers.clients.filter(
        (client) =>
          client.name?.toLowerCase().includes(query) ||
          client.email?.toLowerCase().includes(query)
      ),
      referrals: allUsers.referrals.filter(
        (referral) =>
          referral.name?.toLowerCase().includes(query) ||
          referral.email?.toLowerCase().includes(query)
      ),
    };

    setUsers(filteredUsers);

    // Auto-expand categories if there are search results
    const newExpanded = [];
    if (filteredUsers.clients.length > 0) newExpanded.push("Client");
    if (filteredUsers.referrals.length > 0) newExpanded.push("Referral");
    setExpanded(newExpanded);
  };

  const handleCategoryClick = (category) => {
    setExpanded((prev) => {
      if (prev.includes(category)) {
        return prev.filter((item) => item !== category);
      }
      return [...prev, category];
    });
  };

  const handleUserSelect = (user) => {
    // onUserSelect(user);
    setSelectedUser(user);

    setActiveStep(1);
    // setOpen(false);
    // setSearchQuery("");
    // setExpanded([]);
  };
  const handleBack = () => {
    setActiveStep(0);
    setSelectedUser(null);
  };

  const handleClose = () => {
    setOpen(false);
    setSearchQuery("");
    setExpanded([]);
    setSelectedUser(null);
    setActiveStep(0);
  };
  const renderCategoryContent = (type, userList) => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" p={2}>
          <CircularProgress size={24} sx={{ color: "#005270" }} />
        </Box>
      );
    }

    if (userList.length === 0) {
      return (
        <Box pl={4} py={1}>
          <Typography color="text.secondary" variant="body2">
            No users found
          </Typography>
        </Box>
      );
    }

    return userList.map((user) => (
      <ListItem key={user.id} disablePadding>
        <ListItemButton
          onClick={() => handleUserSelect(user)}
          sx={{
            borderRadius: "8px",
            "&:hover": {
              bgcolor: "rgba(0, 82, 112, 0.08)",
            },
          }}
        >
          <ListItemIcon>
            <FaUser size={16} color="#005270" />
          </ListItemIcon>
          <ListItemText
            primary={user.name || user.email}
            secondary={user.email}
            primaryTypographyProps={{
              sx: { fontWeight: 500 },
            }}
          />
        </ListItemButton>
      </ListItem>
    ));
  };
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };
  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          px: 2,
          mt: 1,
        }}
      >
        <Button
          onClick={() => setOpen(true)}
          variant="contained"
          sx={{
            bgcolor: "#005270",
            "&:hover": { bgcolor: "#003049" },
            borderRadius: "8px",
            textTransform: "none",
          }}
        >
          {buttonText}
        </Button>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="lg"
        fullScreen={isFullScreen}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#f5f5f5",
            padding: "16px",
            borderTopLeftRadius: isFullScreen ? 0 : "12px",
            borderTopRightRadius: isFullScreen ? 0 : "12px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            {activeStep === 1 && (
              <IconButton onClick={handleBack} sx={{ mr: 1, color: "#005270" }}>
                <FaArrowLeft />
              </IconButton>
            )}
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                color: "#003049",
                textAlign: "center",
                flexGrow: 1,
                letterSpacing: "1px",
              }}
            >
              Submit A Quote For Client/Referral
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton onClick={toggleFullScreen} sx={{ color: "#005270" }}>
                {isFullScreen ? <FaCompress /> : <FaExpand />}
              </IconButton>
              <IconButton onClick={handleClose} sx={{ color: "#005270" }}>
                <FaTimes />
              </IconButton>
            </Stack>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mt: 2 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </DialogTitle>
        <Divider />

        <DialogContent sx={{ p: 2 }}>
          {activeStep === 0 ? (
            <>
              <TextField
                fullWidth
                size="small"
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearch}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaSearch color="#005270" />
                    </InputAdornment>
                  ),
                }}
              />

              <Box
                sx={{
                  height: "calc(100% - 80px)",
                  overflow: "auto",
                  border: "1px solid rgba(0, 82, 112, 0.2)",
                  borderRadius: "8px",
                }}
              >
                <List disablePadding>
                  {/* Clients Category */}
                  <ListItem
                    disablePadding
                    sx={{
                      borderBottom: "1px solid rgba(0, 82, 112, 0.1)",
                      bgcolor: "rgba(0, 82, 112, 0.03)",
                    }}
                  >
                    <ListItemButton
                      onClick={() => handleCategoryClick("Client")}
                      sx={{
                        "&:hover": {
                          bgcolor: "rgba(0, 82, 112, 0.08)",
                        },
                      }}
                    >
                      <ListItemIcon>
                        <FaUsers size={20} color="#005270" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`Clients (${users.clients.length})`}
                        primaryTypographyProps={{
                          sx: { color: "#005270", fontWeight: 500 },
                        }}
                      />
                      {expanded.includes("Client") ? (
                        <FaChevronDown size={16} color="#005270" />
                      ) : (
                        <FaChevronRight size={16} color="#005270" />
                      )}
                    </ListItemButton>
                  </ListItem>

                  {expanded.includes("Client") && (
                    <Box sx={{ bgcolor: "#f8f9fa" }}>
                      {renderCategoryContent("Client", users.clients)}
                    </Box>
                  )}

                  {/* Referrals Category */}
                  <ListItem
                    disablePadding
                    sx={{
                      borderBottom: "1px solid rgba(0, 82, 112, 0.1)",
                      bgcolor: "rgba(0, 82, 112, 0.03)",
                    }}
                  >
                    <ListItemButton
                      onClick={() => handleCategoryClick("Referral")}
                      sx={{
                        "&:hover": {
                          bgcolor: "rgba(0, 82, 112, 0.08)",
                        },
                      }}
                    >
                      <ListItemIcon>
                        <FaUsers size={20} color="#005270" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`Referrals (${users.referrals.length})`}
                        primaryTypographyProps={{
                          sx: { color: "#005270", fontWeight: 500 },
                        }}
                      />
                      {expanded.includes("Referral") ? (
                        <FaChevronDown size={16} color="#005270" />
                      ) : (
                        <FaChevronRight size={16} color="#005270" />
                      )}
                    </ListItemButton>
                  </ListItem>

                  {expanded.includes("Referral") && (
                    <Box sx={{ bgcolor: "#f8f9fa" }}>
                      {renderCategoryContent("Referral", users.referrals)}
                    </Box>
                  )}
                </List>
              </Box>
            </>
          ) : (
            <RequestPage selectedUser={selectedUser} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminUserSelectDialog;
