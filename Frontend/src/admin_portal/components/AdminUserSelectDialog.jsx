import React, { useState, useEffect, useCallback } from "react";
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
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  startAfter,
  getCountFromServer,
} from "firebase/firestore";
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
const ITEMS_PER_PAGE = 15;

const AdminUserSelectDialog = ({
  onUserSelect,
  db,
  buttonText = "Select User",
  open,
  setOpen,
  PreRenwalQuote,
}) => {
  const [expanded, setExpanded] = useState([]);
  const [users, setUsers] = useState({ clients: [], referrals: [] });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastVisible, setLastVisible] = useState({
    clients: null,
    referrals: null,
  });
  const [isLoading, setIsLoading] = useState({
    clients: false,
    referrals: false,
  });
  const [hasMore, setHasMore] = useState({
    clients: true,
    referrals: true,
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [totalCounts, setTotalCounts] = useState({
    clients: 0,
    referrals: 0,
  });

  useEffect(() => {
    if (open) {
      fetchTotalCounts();
      fetchAllUsers();
    }
  }, [open]);

  const fetchTotalCounts = async () => {
    try {
      const clientsQuery = query(
        collection(db, "users"),
        where("signupType", "==", "Client")
      );
      const referralsQuery = query(
        collection(db, "users"),
        where("signupType", "==", "Referral")
      );

      const [clientsSnapshot, referralsSnapshot] = await Promise.all([
        getCountFromServer(clientsQuery),
        getCountFromServer(referralsQuery),
      ]);

      setTotalCounts({
        clients: clientsSnapshot.data().count,
        referrals: referralsSnapshot.data().count,
      });
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  const fetchAllUsers = async (searchTerm = "") => {
    setLoading(true);
    try {
      await Promise.all([
        fetchUsers("Client", searchTerm),
        fetchUsers("Referral", searchTerm),
      ]);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (type, searchTerm = "", loadMore = false) => {
    setIsLoading((prev) => ({ ...prev, [type.toLowerCase() + "s"]: true }));

    try {
      let baseQuery = query(
        collection(db, "users"),
        where("signupType", "==", type),
        orderBy("nameInLower"),
        limit(ITEMS_PER_PAGE)
      );

      if (searchTerm) {
        baseQuery = query(
          collection(db, "users"),
          where("signupType", "==", type),
          where("nameInLower", ">=", searchTerm?.toLowerCase()),
          where("nameInLower", "<=", searchTerm?.toLowerCase() + "\uf8ff"),
          limit(ITEMS_PER_PAGE)
        );
      }

      if (loadMore && lastVisible[type.toLowerCase() + "s"]) {
        baseQuery = query(
          baseQuery,
          startAfter(lastVisible[type.toLowerCase() + "s"])
        );
      }

      const snapshot = await getDocs(baseQuery);
      const fetchedUsers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setLastVisible((prev) => ({
        ...prev,
        [type.toLowerCase() + "s"]: snapshot.docs[snapshot.docs.length - 1],
      }));

      setHasMore((prev) => ({
        ...prev,
        [type.toLowerCase() + "s"]: snapshot.docs.length === ITEMS_PER_PAGE,
      }));

      setUsers((prev) => ({
        ...prev,
        [type.toLowerCase() + "s"]: loadMore
          ? [...prev[type.toLowerCase() + "s"], ...fetchedUsers]
          : fetchedUsers,
      }));
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    } finally {
      setIsLoading((prev) => ({ ...prev, [type.toLowerCase() + "s"]: false }));
    }
  };

  const handleSearch = useCallback((searchValue) => {
    setSearchQuery(searchValue);
    if (searchValue.trim() === "") {
      fetchAllUsers();
    } else {
      fetchAllUsers(searchValue);
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      handleSearch(searchValue);
    }, 500),
    []
  );

  const handleLoadMore = async (type) => {
    if (
      !isLoading[type.toLowerCase() + "s"] &&
      hasMore[type.toLowerCase() + "s"]
    ) {
      await fetchUsers(type, searchQuery, true);
    }
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
    setSelectedUser(user);
    setActiveStep(1);
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
    if (loading && !userList.length) {
      return (
        <Box display="flex" justifyContent="center" p={2}>
          <CircularProgress size={24} sx={{ color: "#005270" }} />
        </Box>
      );
    }

    return (
      <>
        {userList.map((user) => (
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
        ))}

        {hasMore[type.toLowerCase() + "s"] && (
          <Box display="flex" justifyContent="center" p={1}>
            <Button
              onClick={() => handleLoadMore(type)}
              disabled={isLoading[type.toLowerCase() + "s"]}
              startIcon={
                isLoading[type.toLowerCase() + "s"] && (
                  <CircularProgress size={20} />
                )
              }
            >
              {isLoading[type.toLowerCase() + "s"] ? "Loading..." : "Load More"}
            </Button>
          </Box>
        )}
      </>
    );
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
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
              {`Submit ${PreRenwalQuote ? "Manual Renewal" : ""
                } Quote For Client/Referral`}{" "}
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
                value={inputValue}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setInputValue(newValue);
                  debouncedSearch(newValue);
                }}
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
                        primary={`Clients (${users.clients.length} / ${totalCounts.clients})`}
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
                        primary={`Referrals (${users.referrals.length} / ${totalCounts.referrals})`}
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
            <RequestPage
              selectedUser={selectedUser}
              PreRenwalQuote={PreRenwalQuote}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default AdminUserSelectDialog;
