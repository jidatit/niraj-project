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
  CircularProgress,
} from "@mui/material";

import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../../../db";
import { getCurrentDate } from "../../utils/helperSnippets";
import { AdminBindConfirmQuoteMail } from "../../utils/mailingFuncs";
import { toast } from "react-toastify";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
const PAGE_SIZE = 15;
const initialFormData = {
  user: null,
  referral: null,
  policy_number: "",
  insured_address: "",
  carrier: "",
  effective_date: "",
  exp_date: "",
  purchase_date: "",
  qsr_type: "",
  isMortgageOrLienholder: "no",
  company_name: "",
  responsible_payment: "Insured",
  ac_age: "",
  roof_age: "",
};
const PolicyCreationModal = ({
  getAllPolicyBoundData,
  isOpen,
  setIsOpen,
  editData,
  isEditMode,
}) => {
  const [loading, setLoading] = useState(false);
  // const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [lastUserDoc, setLastUserDoc] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [formData, setFormData] = useState({
    user: null,
    referral: null,
    carrier: "",
    effective_date: "",
    isMortgageOrLienholder: "no",
    company_name: "",
    qsr_type: "",
    // acc_loan_number: "",
    policy_number: "", // ← new
    insured_address: "", // ← new
    responsible_payment: "Insured",
    ac_age: "",
    roof_age: "",
    purchase_date: "",
    exp_date: "",
  });
  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setInputValue("");
    setInputRef("");
  };
  // referral pagination state
  const [referrals, setReferrals] = useState([]);
  const [loadingRefs, setLoadingRefs] = useState(false);
  const [lastRefDoc, setLastRefDoc] = useState(null);
  const [inputRef, setInputRef] = useState("");

  // load users page
  const loadCollection = async (type, search = "", cursor = null) => {
    const isRef = type === "Referral";
    const setLoading = isRef ? setLoadingRefs : setLoadingUsers;
    const setLastDoc = isRef ? setLastRefDoc : setLastUserDoc;
    const setData = isRef ? setReferrals : setUsers;

    let baseQuery = query(
      collection(db, "users"),
      where("signupType", "==", isRef ? "Referral" : "Client"),
      orderBy("nameInLower"),
      limit(PAGE_SIZE)
    );

    if (search) {
      baseQuery = query(
        baseQuery,
        where("nameInLower", ">=", search?.toLowerCase())
      );
    }
    if (cursor) {
      baseQuery = query(baseQuery, startAfter(cursor));
    }

    setLoading(true);
    const snap = await getDocs(baseQuery);
    const docs = snap?.docs.map((d) => {
      const data = d.data() || {};
      return {
        id: d.id,
        name: data.name ?? null,
        address: data.mailingAddress ?? null,
        dob: data.dateOfBirth ?? null,
        email: data.email ?? null,
        label: data.email ?? null,
        mailingAddress: data.mailingAddress ?? null,
        phoneNumber: data.phoneNumber ?? null,
        value: data.email ?? null,
        zipCode: data.zipCode ?? null,
        signupType: data.signupType ?? null,
      };
    });

    setData((prev) => (cursor ? [...prev, ...docs] : docs));
    setLastDoc(snap.docs[snap.docs.length - 1] || null);
    setLoading(false);
  };

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode && editData) {
      setFormData({
        user: editData.user || null,
        referral: editData.Referral || null,
        policy_number: editData.policy_number || "",
        insured_address: editData.insured_address || "",
        carrier: editData.carrier || "",
        effective_date: editData.effective_date || "",
        exp_date: editData.exp_date || "",
        purchase_date: editData.purchase_date || "",
        qsr_type: editData.qsr_type || "",
        isMortgageOrLienholder: editData.isMortgageOrLienholder || "no",
        company_name: editData.company_name || "",
        responsible_payment: editData.responsible_payment || "Insured",
        ac_age: editData.ac_age || "",
        roof_age: editData.roof_age || "",
      });

      // *** ADD THESE TWO LINES ***
      setInputValue(editData.user?.name ?? "N/A");
      setInputRef(editData.Referral?.name ?? "N/A");
    } else {
      setFormData({
        user: null,
        referral: null,
        policy_number: "",
        insured_address: "",
        carrier: "",
        effective_date: "",
        exp_date: "",
        purchase_date: "",
        qsr_type: "",
        isMortgageOrLienholder: "no",
        company_name: "",
        responsible_payment: "Insured",
        ac_age: "",
        roof_age: "",
      });
      // reset your inputs too
      setInputValue("");
      setInputRef("");
    }
  }, [isEditMode, editData]);

  // initial load / search triggers
  useEffect(() => {
    if (isOpen) {
      setLastUserDoc(null);
      loadCollection("Client", inputValue, null);
      setLastRefDoc(null);
      loadCollection("Referral", inputRef, null);
    }
  }, [isOpen, inputValue, inputRef]);

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
    const errorMessages = [];

    // Required field validations
    if (!formData.user) {
      newErrors.user = "Client is required";
      errorMessages.push("Client is required");
    }
    if (!formData.policy_number) {
      newErrors.policy_number = "Policy number is required";
      errorMessages.push("Policy number is required");
    }
    if (!formData.insured_address) {
      newErrors.insured_address = "Insured address is required";
      errorMessages.push("Insured address is required");
    }
    if (!formData.qsr_type) {
      newErrors.qsr_type = "Policy type is required";
      errorMessages.push("Policy type is required");
    }
    if (!formData.carrier) {
      newErrors.carrier = "Carrier is required";
      errorMessages.push("Carrier is required");
    }
    if (!formData.effective_date) {
      newErrors.effective_date = "Effective date is required";
      errorMessages.push("Effective date is required");
    }
    if (!formData.exp_date) {
      newErrors.exp_date = "Expiry date is required";
      errorMessages.push("Expiry date is required");
    }

    // Mortgage/lienholder specific validations
    if (
      formData.qsr_type === "Home" &&
      formData.isMortgageOrLienholder === "yes"
    ) {
      if (!formData.company_name) {
        newErrors.company_name = "Company name is required";
        errorMessages.push("Company name is required for mortgage/lienholder");
      }
      if (!formData.responsible_payment) {
        newErrors.responsible_payment = "Responsible payment is required";
        errorMessages.push(
          "Responsible payment is required for mortgage/lienholder"
        );
      }
    }

    setErrors(newErrors);

    // Show toast with all validation errors if any
    if (errorMessages.length > 0) {
      toast.error(
        <div>
          <strong>Please fix the following errors:</strong>
          <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
            {errorMessages.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>,
        {
          autoClose: 5000, // Stay open longer for multiple errors
          style: { maxWidth: "400px" },
        }
      );
      return false;
    }

    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      // pull out referral so it doesn't get spread in as `referral`
      const { referral, ...rest } = formData;
      const payload = { ...rest };

      if (referral) {
        payload.byReferral = true;
        payload.ReferralId = referral.id;
        payload.Referral = referral;
        payload.user = {
          ...payload.user,
          byReferral: true,
          ReferralId: referral.id,
          Referral: referral,
        };
      }

      if (isEditMode && editData) {
        const ref = doc(db, "bound_policies", editData.id);
        await updateDoc(ref, { ...payload, updatedAt: serverTimestamp() });
        toast.success("Policy updated successfully!");
      } else {
        await addDoc(collection(db, "bound_policies"), {
          ...payload,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          policyCreatedBy: "Admin",
          bound_status: "bounded",
          bound_date: getCurrentDate("dash"),
        });
        toast.success("Policy created successfully!");
      }

      getAllPolicyBoundData();
      resetForm();
      setIsOpen(false);
    } catch (err) {
      toast.error(
        `Error ${isEditMode ? "updating" : "creating"} policy: ${err.message}`
      );
    } finally {
      setLoading(false);
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
      <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                {isEditMode ? "Edit Policy" : "Create New Policy"}
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
                    getOptionLabel={(option) => option?.name || ""} // Safely get name
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Box>
                          <Typography>{option.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.email}
                          </Typography>
                        </Box>
                      </li>
                    )}
                    loading={loadingUsers}
                    inputValue={inputValue}
                    onInputChange={(e, v, r) => {
                      if (r === "input") {
                        setInputValue(v);
                      }
                    }}
                    ListboxProps={{
                      onScroll: (e) => {
                        const node = e.currentTarget;
                        if (
                          node.scrollTop + node.clientHeight >=
                            node.scrollHeight - 4 &&
                          lastUserDoc
                        ) {
                          loadCollection("Client", inputValue, lastUserDoc);
                        }
                      },
                      style: { maxHeight: 200, overflow: "auto" },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Search clients..."
                        error={!!errors.user}
                        helperText={errors.user}
                      />
                    )}
                    onChange={(_, v) => {
                      setFormData((f) => ({ ...f, user: v }));
                      // Update input value when selection changes
                      if (v) {
                        setInputValue(v.name);
                      }
                    }}
                    value={formData.user}
                    fullWidth
                    disabled={isEditMode}
                    isOptionEqualToValue={(option, value) =>
                      option?.id === value?.id
                    }
                  />
                </Box>

                <Box mb={2}>
                  <Typography variant="h6" fontWeight="semibold" gutterBottom>
                    Attach Referral (optional)
                  </Typography>
                  <Autocomplete
                    options={referrals}
                    getOptionLabel={(option) => option?.name || ""} // Safely get name
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Box>
                          <Typography>{option.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.email}
                          </Typography>
                        </Box>
                      </li>
                    )}
                    loading={loadingRefs}
                    inputValue={inputRef}
                    onInputChange={(e, v, r) => {
                      if (r === "input") {
                        setInputRef(v);
                      }
                    }}
                    ListboxProps={{
                      onScroll: (e) => {
                        const node = e.currentTarget;
                        if (
                          node.scrollTop + node.clientHeight >=
                            node.scrollHeight - 4 &&
                          lastRefDoc
                        ) {
                          loadCollection("Referral", inputRef, lastRefDoc);
                        }
                      },
                      style: { maxHeight: 200, overflow: "auto" },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Search referrals..."
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingRefs && (
                                <CircularProgress color="inherit" size={20} />
                              )}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    onChange={(_, v) => {
                      setFormData((f) => ({ ...f, referral: v }));
                      // Update input value when selection changes
                      if (v) {
                        setInputRef(v.name);
                      }
                    }}
                    value={formData.referral}
                    fullWidth
                    disabled={isEditMode}
                    isOptionEqualToValue={(option, value) =>
                      option?.id === value?.id
                    }
                  />
                </Box>
                {/* Policy Number */}
                <Box sx={{ mt: 3, mb: 3 }}>
                  <Typography variant="h6" fontWeight="semibold" gutterBottom>
                    Policy Number
                  </Typography>
                  <TextField
                    fullWidth
                    name="policy_number"
                    value={formData.policy_number}
                    onChange={handleChange}
                    error={!!errors.policy_number}
                    helperText={errors.policy_number}
                  />
                </Box>

                {/* Insured Address */}
                <Box sx={{ mt: 3, mb: 3 }}>
                  <Typography variant="h6" fontWeight="semibold" gutterBottom>
                    Insured Address
                  </Typography>
                  <TextField
                    fullWidth
                    name="insured_address"
                    value={formData.insured_address}
                    onChange={handleChange}
                    error={!!errors.insured_address}
                    helperText={errors.insured_address}
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
                        disabled={isEditMode}
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
                      <Typography
                        variant="h6"
                        fontWeight="semibold"
                        gutterBottom
                      >
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

                    <Box sx={{ mt: 3, mb: 3, width: "100%" }}>
                      <Typography
                        variant="h6"
                        fontWeight="semibold"
                        gutterBottom
                      >
                        Effective Date
                      </Typography>
                      <DatePicker
                        inputFormat="MM/dd/yyyy"
                        value={
                          formData?.effective_date
                            ? new Date(formData?.effective_date)
                            : null
                        }
                        onChange={(newDate) => {
                          if (newDate && !isNaN(newDate)) {
                            const isoDate = newDate.toISOString().split("T")[0];
                            handleChange({
                              target: {
                                name: "effective_date",
                                value: isoDate,
                              },
                            });
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={!!errors.effective_date}
                            helperText={errors.effective_date}
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                        sx={{ width: "100%" }} // Add this line
                      />
                    </Box>

                    {/* Expiry Date */}
                    <Box sx={{ mt: 3, mb: 3, width: "100%" }}>
                      <Typography
                        variant="h6"
                        fontWeight="semibold"
                        gutterBottom
                      >
                        Expiry Date
                      </Typography>
                      <DatePicker
                        inputFormat="MM/dd/yyyy"
                        value={
                          formData?.exp_date
                            ? new Date(formData?.exp_date)
                            : null
                        }
                        onChange={(newDate) => {
                          if (newDate && !isNaN(newDate)) {
                            const isoDate = newDate.toISOString().split("T")[0];
                            handleChange({
                              target: { name: "exp_date", value: isoDate },
                            });
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={!!errors.exp_date}
                            helperText={errors.exp_date}
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                        sx={{ width: "100%" }} // Add this line
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
                          <DatePicker
                            inputFormat="MM/dd/yyyy"
                            value={
                              formData?.purchase_date
                                ? new Date(formData?.purchase_date)
                                : null
                            }
                            onChange={(newDate) => {
                              if (newDate && !isNaN(newDate)) {
                                const isoDate = newDate
                                  .toISOString()
                                  .split("T")[0];
                                handleChange({
                                  target: {
                                    name: "purchase_date",
                                    value: isoDate,
                                  },
                                });
                              }
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                className="w-full"
                                error={!!errors.purchase_date}
                                helperText={errors.purchase_date}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                            sx={{ width: "100%" }}
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
                        {loading
                          ? "Submitting..."
                          : isEditMode
                          ? "Update Policy"
                          : "Submit"}
                      </Button>
                    </Box>
                  </>
                )}
              </form>
            </DialogContent>
          </Dialog>
        </Box>
      </LocalizationProvider>
    </>
  );
};

export default PolicyCreationModal;
