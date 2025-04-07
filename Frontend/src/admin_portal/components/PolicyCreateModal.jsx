"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Typography,
  Box,
  Autocomplete,
  Tooltip,
  Divider,
} from "@mui/material";

import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../db";
import { getCurrentDate } from "../../utils/helperSnippets";
import { AdminBindConfirmQuoteMail } from "../../utils/mailingFuncs";
import { toast } from "react-toastify";

const PolicyCreationModal = ({ getAllPolicyBoundData, isOpen, setIsOpen }) => {
  const [loading, setLoading] = useState(false);
  // const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    user: null,
    carrier: "",
    effective_date: "",
    isMortgageOrLienholder: "no",
    company_name: "",
    qsr_type: "",
    // acc_loan_number: "",
    responsible_payment: "Insured",
    ac_age: "",
    roof_age: "",
    purchase_date: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("signupType", "==", "Client"));
        const querySnapshot = await getDocs(q);

        const usersList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data?.name ?? null,
            address: data?.mailingAddress ?? null,
            dob: data?.dateOfBirth ?? null,
            email: data?.email ?? null,
            label: data?.email ?? null,
            mailingAddress: data?.mailingAddress ?? null,
            phoneNumber: data?.phoneNumber ?? null,
            value: data?.email ?? null,
            zipCode: data?.zipCode ?? null,
            signupType: data?.signupType ?? null,
          };
        });

        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear the error when the user starts typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.user) newErrors.user = "Client is required";
    if (!formData.qsr_type) newErrors.qsr_type = "Policy type is required";
    if (!formData.carrier) newErrors.carrier = "Carrier is required";
    if (!formData.effective_date)
      newErrors.effective_date = "Effective date is required";
    if (
      formData.qsr_type === "Home" &&
      formData.isMortgageOrLienholder === "yes"
    ) {
      if (!formData.company_name)
        newErrors.company_name = "Company name is required";
      // if (!formData.acc_loan_number)
      //   newErrors.acc_loan_number = "Account/Loan number is required";
      if (!formData.responsible_payment)
        newErrors.responsible_payment = "Responsible payment is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true); // Start loading

    try {
      const policyRef = collection(db, "bound_policies");
      await addDoc(policyRef, {
        ...formData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        policyCreatedBy: "Admin",
        bound_status: "bounded",
        bound_date: getCurrentDate("dash"),
      });
      //Policy Bind Mail

      // AdminBindConfirmQuoteMail(formData.user?.name, formData.user?.email, "");
      toast.success("Policy created successfully!");

      // Reset form data after successful submission
      setFormData({
        user: null,
        carrier: "",
        effective_date: "",
        isMortgageOrLienholder: "no",
        company_name: "",
        // acc_loan_number: "",
        responsible_payment: "Insured",
      });
      getAllPolicyBoundData();

      setIsOpen(false);
    } catch (error) {
      toast.error("Error creating policy!", error?.message);
      console.error("Error creating policy:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const getDialogSize = () => {
    // if (!formData.user) return "sm";
    if (
      formData.qsr_type === "Home" &&
      formData.isMortgageOrLienholder === "yes"
    )
      return "md";
    return "sm";
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#FAFAFA",
        }}
      >
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          maxWidth={getDialogSize()}
          fullWidth
          TransitionProps={{
            enterTransition: 300,
            exitTransition: 200,
          }}
          PaperProps={{
            elevation: 8,
            sx: {
              borderRadius: "12px",
              overflow: "hidden",
            },
          }}
        >
          <DialogTitle
            sx={{
              backgroundColor: "#f5f5f5",
              padding: "16px",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                color: "#003049",
                textAlign: "center",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Create New Policy
            </Typography>
          </DialogTitle>
          <Divider />

          <DialogContent sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <Box sx={{ mt: 1, mb: 3 }}>
                <Typography variant="h6" fontWeight="semibold" gutterBottom>
                  Select Client
                </Typography>
                <Autocomplete
                  options={users}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search clients..."
                      variant="outlined"
                      sx={{ mt: 1 }}
                      error={!!errors.user}
                      helperText={errors.user}
                    />
                  )}
                  onChange={(_, newValue) => {
                    setFormData((prev) => ({ ...prev, user: newValue }));
                    setErrors((prev) => ({ ...prev, user: "" }));
                  }}
                  value={formData.user}
                  fullWidth
                  sx={{ maxHeight: 300, overflowY: "auto" }}
                />
              </Box>

              {formData.user && (
                <Box sx={{ mt: 3, mb: 3 }}>
                  <Typography variant="h6" fontWeight="semibold" gutterBottom>
                    Select Policy Type
                  </Typography>
                  <FormControl fullWidth error={!!errors.qsr_type}>
                    <Select
                      value={formData.qsr_type}
                      onChange={handleChange}
                      name="qsr_type"
                    >
                      <MenuItem value="Home">Home</MenuItem>
                      <MenuItem value="Liability">Liability</MenuItem>
                      <MenuItem value="Flood">Flood</MenuItem>
                      <MenuItem value="Auto">Auto</MenuItem>
                      <MenuItem value="Wind">Wind</MenuItem>
                    </Select>
                    {errors.qsr_type && (
                      <Typography variant="caption" color="error">
                        {errors.qsr_type}
                      </Typography>
                    )}
                  </FormControl>
                </Box>
              )}

              {formData.qsr_type && (
                <>
                  <Box sx={{ mt: 3, mb: 3 }}>
                    <Typography variant="h6" fontWeight="semibold" gutterBottom>
                      Carrier
                    </Typography>
                    <TextField
                      fullWidth
                      type="text"
                      value={formData.carrier}
                      onChange={handleChange}
                      name="carrier"
                      error={!!errors.carrier}
                      helperText={errors.carrier}
                    />
                  </Box>

                  <Box sx={{ mt: 3, mb: 3 }}>
                    <Typography variant="h6" fontWeight="semibold" gutterBottom>
                      Effective Date
                    </Typography>
                    <TextField
                      type="date"
                      value={formData.effective_date}
                      onChange={handleChange}
                      name="effective_date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      onClick={(e) => e.target.showPicker?.()}
                      error={!!errors.effective_date}
                      helperText={errors.effective_date}
                    />
                  </Box>

                  {formData.qsr_type === "Home" && (
                    <Box sx={{ mt: 3, mb: 3 }}>
                      <Typography
                        variant="h6"
                        fontWeight="semibold"
                        gutterBottom
                      >
                        Is there a mortgage or lienholder?
                      </Typography>
                      <RadioGroup
                        row
                        name="isMortgageOrLienholder"
                        value={formData.isMortgageOrLienholder}
                        onChange={handleChange}
                      >
                        <FormControlLabel
                          value="no"
                          control={<Radio />}
                          label="No"
                        />
                        <FormControlLabel
                          value="yes"
                          control={<Radio />}
                          label="Yes"
                        />
                      </RadioGroup>

                      <div className="w-full flex mt-[20px] mb-[20px] gap-2 flex-col justify-center items-start">
                        <Typography
                          variant="h6"
                          fontWeight="semibold"
                          gutterBottom
                        >
                          AC Age in Years
                        </Typography>

                        <TextField
                          className="w-full"
                          id="ac_age"
                          type="number"
                          value={formData.ac_age}
                          onChange={(e) => handleChange(e)}
                          name="ac_age"
                        />
                      </div>

                      <div className="w-full flex mt-[20px] mb-[20px] gap-2 flex-col justify-center items-start">
                        <Typography
                          variant="h6"
                          fontWeight="semibold"
                          gutterBottom
                        >
                          Roof Age in Years
                        </Typography>
                        <TextField
                          className="w-full"
                          id="roof_age"
                          type="number"
                          value={formData.roof_age}
                          onChange={(e) => handleChange(e)}
                          name="roof_age"
                        />
                      </div>
                      <div className="w-full flex mt-[20px] mb-[20px] gap-2 flex-col justify-center items-start">
                        <Typography
                          variant="h6"
                          fontWeight="semibold"
                          gutterBottom
                        >
                          Purchase Date
                        </Typography>
                        <TextField
                          className="w-full"
                          id="purchase_date"
                          type="date"
                          value={formData.purchase_date}
                          onChange={(e) => handleChange(e)}
                          name="purchase_date"
                        />
                      </div>
                    </Box>
                  )}

                  {formData.qsr_type === "Home" &&
                    formData.isMortgageOrLienholder === "yes" && (
                      <>
                        <Box sx={{ mt: 3, mb: 3 }}>
                          <Typography
                            variant="h6"
                            fontWeight="semibold"
                            gutterBottom
                          >
                            Name of the Company
                          </Typography>
                          <TextField
                            fullWidth
                            type="text"
                            value={formData.company_name}
                            onChange={handleChange}
                            name="company_name"
                            error={!!errors.company_name}
                            helperText={errors.company_name}
                          />
                        </Box>
                        {/*acc_loan_number*/}

                        {/* <Box sx={{ mt: 3, mb: 3 }}>
                          <Typography
                            variant="h6"
                            fontWeight="semibold"
                            gutterBottom
                          >
                            Account / Loan number
                          </Typography>
                          <TextField
                            fullWidth
                            type="text"
                            value={formData.acc_loan_number}
                            onChange={handleChange}
                            name="acc_loan_number"
                            error={!!errors.acc_loan_number}
                            helperText={errors.acc_loan_number}
                          />
                        </Box> */}

                        <Box sx={{ mt: 3, mb: 3 }}>
                          <Typography
                            variant="h6"
                            fontWeight="semibold"
                            gutterBottom
                          >
                            Who is responsible for payment?
                          </Typography>
                          <FormControl
                            fullWidth
                            error={!!errors.responsible_payment}
                          >
                            <Select
                              value={formData.responsible_payment}
                              onChange={handleChange}
                              name="responsible_payment"
                            >
                              <MenuItem value="Insured">Insured</MenuItem>
                              <MenuItem value="Mortgage">Mortgage</MenuItem>
                            </Select>
                            {errors.responsible_payment && (
                              <Typography variant="caption" color="error">
                                {errors.responsible_payment}
                              </Typography>
                            )}
                          </FormControl>
                        </Box>
                      </>
                    )}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      mt: 4,
                      mb: 2,
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        bgcolor: "#003049",
                        "&:hover": { bgcolor: "#005270" },
                        borderRadius: "8px",
                        textTransform: "none",
                        paddingX: 3,
                      }}
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Submit"}
                    </Button>
                  </Box>
                </>
              )}
            </form>
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
};

export default PolicyCreationModal;
