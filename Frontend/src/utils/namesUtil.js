// Helper function for name handling
export const getDisplayName = (user) => {
  if (user?.firstName && user?.lastName)
    return `${user?.firstName} ${user?.lastName}`;
  return user?.name || user?.email || "Unknown";
};
