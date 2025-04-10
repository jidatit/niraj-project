import React, { useEffect, useState, useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import Button from "./Button";
import {
  Modal,
  Slide,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  FilledInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../../../db";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { getType } from "../../utils/helperSnippets";
import { useAuth } from "../../AuthContext";
import { ClientQuoteBindMail } from "../../utils/mailingFuncs";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { ImCross } from "react-icons/im";

const CustomTablePreviewClient = ({ qid, qsr_type, table2_data, user }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [tableCols1, setTableCols1] = useState(null);

  const [openbindoptions, setopenbindoptions] = useState(false);
  const [SlideModal, setSlideModal] = useState(false);

  const [formData, setFormData] = useState({
    effective_date: "",
    isMortgageOrLienholder: "", // only in Home, if yes then below values
    company_name: "",
    acc_loan_number: "",
    responsible_payment: "",
    ac_age: "",
    roof_age: "",
    purchase_date: "",
    exp_date: "",
  });

  const onClose = () => {
    setSlideModal(false);
  };

  const table_columns_lia = useMemo(
    () => [
      {
        accessorKey: "liability_coverage_amount",
        header: "Liability Coverage Amount",
        size: 200,
      },
      {
        accessorKey: "um_coverage",
        header: "U/M Coverage",
        size: 150,
      },
      {
        accessorKey: "cyber_liability",
        header: "Cyber Liability",
        size: 150,
      },
      {
        accessorKey: "identity_theft",
        header: "Identity Theft",
        size: 150,
      },
    ],
    []
  );
  const table_columns_flood = useMemo(
    () => [
      {
        accessorKey: "dwelling",
        header: "Dwelling",
        size: 200,
      },
      {
        accessorKey: "personal_property",
        header: "Personal Property",
        size: 150,
      },
    ],
    []
  );
  const table_columns_auto = useMemo(
    () => [
      {
        accessorKey: "bodily_injury",
        header: "Bodily Injury",
        size: 200,
      },
      {
        accessorKey: "property_damage",
        header: "Property Damage",
        size: 150,
      },
      {
        accessorKey: "um",
        header: "U/M",
        size: 150,
      },
      {
        accessorKey: "collision_deductible",
        header: "Collision Deductible",
        size: 150,
      },
      {
        accessorKey: "rental",
        header: "Rental",
        size: 150,
      },
      {
        accessorKey: "roadside",
        header: "Roadside",
        size: 150,
      },
      {
        accessorKey: "comprehensive_deductible",
        header: "Comprehensive Deductible",
        size: 150,
      },
    ],
    []
  );
  const table_columns_home = useMemo(
    () => [
      {
        accessorKey: "dwelling",
        header: "Dwelling",
        size: 150,
      },
      {
        accessorKey: "other_structures",
        header: "Other Structures",
        size: 150,
      },
      {
        accessorKey: "contents",
        header: "Contents",
        size: 150,
      },
      {
        accessorKey: "loss_of_use",
        header: "Loss of Use",
        size: 150,
      },
      {
        accessorKey: "liability",
        header: "Liability",
        size: 150,
      },
      {
        accessorKey: "medical_payments",
        header: "Medical Payments",
        size: 150,
      },
      {
        accessorKey: "aop_deductible",
        header: "AOP Deductible",
        size: 150,
      },
      {
        accessorKey: "hurricane_deductible",
        header: "Hurricane Deductible",
        size: 150,
      },
    ],
    []
  );

  useEffect(() => {
    let columns;
    if (qsr_type.toLowerCase() === "liability") {
      columns = table_columns_lia;
    } else if (qsr_type.toLowerCase() === "auto") {
      columns = table_columns_auto;
    } else if (qsr_type.toLowerCase() === "flood") {
      columns = table_columns_flood;
    } else if (qsr_type.toLowerCase() === "home") {
      columns = table_columns_home;
    } else {
      columns = null;
    }
    setTableCols1(columns);
  }, [qsr_type]);

  const table_columns_2 = useMemo(
    () => [
      {
        accessorKey: "carrier",
        header: "Carrier",
        size: 200,
      },
      {
        accessorKey: "premium",
        header: "Premium",
        size: 800,
        Cell: ({ cell }) => (
          <Box>
            {cell.getValue() == 0.0
              ? "Risk does not meet underwriting guidelines."
              : cell.getValue()}
          </Box>
        ),
      },
    ],
    []
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [bindingDisable, setBindingDisable] = useState(false);

  const handleBindQuote = async () => {
    try {
      setBindingDisable(true);
      await addDoc(collection(db, "bind_req_quotes"), {
        ...formData,
        qid,
        qsr_type,
        user: { ...user },
        byReferral: user?.byReferral || false,
        ReferralId: user?.ReferralId || null,
        Referral: user?.Referral || null,
        bound_status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await updateStatusStep(qsr_type, qid);
      onClose();
      ClientQuoteBindMail(
        currentUser.data?.name,
        currentUser.data?.email,
        qsr_type
      );
      toast.success("Quote bind request with success!");
      setTimeout(() => {
        navigate("/user_portal");
      }, 2000);
    } catch (error) {
      toast.error("Error Requesting Bind Quote!");
    } finally {
      setBindingDisable(false);
    }
  };

  const updateStatusStep = async (type, id) => {
    try {
      const collectionRef = getType(type);
      const docRef = doc(db, collectionRef, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          status_step: "3",
        });

        const prepQuotesRef = collection(db, "prep_quotes");
        const querySnapshot = await getDocs(prepQuotesRef);

        querySnapshot.forEach(async (doc) => {
          if (doc.data().q_id === id) {
            const prepQuoteRef = doc.ref;
            await updateDoc(prepQuoteRef, {
              isBounded: true,
              boundBy: "Client",
            });
          }
        });
        toast.success("Status and quote update successful!");
      } else {
        toast.error("Document not found!");
      }
    } catch (error) {
      console.log("error updating", error);
      toast.error("Error updating status and quote!");
    }
  };

  const [FilteredSearchCarriers, setFilteredSearchCarriers] =
    useState(table2_data);
  const [SearchValueForCarriers, setSearchValueForCarriers] = useState("");
  const SearchCarriersFilter = (value) => {
    setSearchValueForCarriers(value);
    const filteredData = table2_data.filter((carrier) =>
      carrier.carrier.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSearchCarriers(filteredData);
  };

  return (
    <>
      <div className="w-full flex mt-[20px] flex-col justify-center items-start">
        <ToastContainer />
        {table_columns_2 && table2_data && (
          <div className="w-full">
            <MaterialReactTable
              columns={table_columns_2}
              data={table2_data}
              enableBottomToolbar={true}
              enableTopToolbar={false}
              enableTableHead={false}
            />
          </div>
        )}

        <div className="w-full mb-5 flex flex-col justify-end items-end">
          <div className="md:w-[30%] mt-[30px] mb-[30px] w-full">
            <Button
              onClickProp={() => setopenbindoptions(!openbindoptions)}
              text={"BIND"}
              icon={true}
            />
          </div>
          {openbindoptions && (
            <div className="mt-1 divide-y divide-solid w-full rounded-md bg-[#ffffff] border-black border-[1px] shadow-lg">
              <div className="w-full hover:bg-slate-200 rounded-md cursor-pointer pl-[20px] py-2 flex flex-col justify-center items-start">
                <p className="font-normal italic">
                  (
                  {table2_data &&
                    table2_data.filter((row) => row.premium != 0.0).length}
                  ) <span>Carriers available to bind</span>
                </p>
              </div>

              <FormControl fullWidth variant="filled">
                <InputLabel htmlFor="filled-adornment-search">
                  Type to search carriers...
                </InputLabel>
                <FilledInput
                  value={SearchValueForCarriers}
                  onChange={(e) => SearchCarriersFilter(e.target.value)}
                  endAdornment={
                    <InputAdornment
                      onClick={() => {
                        setSearchValueForCarriers("");
                        setFilteredSearchCarriers(table2_data);
                      }}
                      position="end"
                    >
                      <IconButton edge="start">
                        {SearchValueForCarriers.length > 0 ? (
                          <ImCross />
                        ) : (
                          <FaSearch />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>

              {FilteredSearchCarriers &&
                FilteredSearchCarriers.filter((row) => row.premium != 0.0).map(
                  (row, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setFormData((prevData) => ({
                          ...prevData,
                          carrier: row.carrier,
                        }));
                        setSlideModal(true);
                      }}
                      className="w-full hover:bg-slate-200 rounded-md cursor-pointer pl-[20px] py-2 flex flex-col justify-center items-start"
                    >
                      <p className="font-semibold">
                        {row.carrier}{" "}
                        <span className="font-normal ml-5">
                          {row.premium == 0.0
                            ? "Risk does not meet underwriting guidelines."
                            : row.premium}
                        </span>{" "}
                      </p>
                    </div>
                  )
                )}
              {FilteredSearchCarriers.length === 0 && (
                <div className="w-full hover:bg-slate-200 rounded-md cursor-pointer pl-[20px] py-2 flex flex-col justify-center items-center">
                  <p className="font-semibold">No carriers found.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <Modal
          open={SlideModal}
          onClose={onClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Slide
            direction="right"
            in={SlideModal}
            mountOnEnter
            unmountOnExit
            style={{ transition: "transform 2s ease-in-out" }}
          >
            <div className="w-[95%] overflow-y-auto max-h-[80vh] lg:w-[50%] p-10 lg:p-20 bg-white flex flex-col justify-start items-center rounded-lg shadow-md">
              {qsr_type && (
                <div className="w-full flex flex-col justify-center items-center md:items-start">
                  <h1 className="lg:text-[32px] md:text-start text-center font-bold md:text-[24px] text-[18px]">
                    Fill out Form for {qsr_type} Quote
                  </h1>
                </div>
              )}

              <div className="w-full flex mt-[20px] mb-[20px] gap-2 flex-col justify-center items-start">
                <p className="lg:text-[22px] md:text-start text-center font-semibold md:text-[18px] text-[13px]">
                  Confirm the effective date of the policy
                </p>
                <TextField
                  className="w-full"
                  id="effective_date"
                  type="date"
                  value={formData.effective_date}
                  onChange={(e) => handleChange(e)}
                  name="effective_date"
                />
              </div>
              <div className="w-full flex mt-[20px] mb-[20px] gap-2 flex-col justify-center items-start">
                <p className="lg:text-[22px] md:text-start text-center font-semibold md:text-[18px] text-[13px]">
                  Confirm the epxpiry date of the policy
                </p>
                <TextField
                  className="w-full"
                  id="exp_date"
                  type="date"
                  value={formData.exp_date}
                  onChange={(e) => handleChange(e)}
                  name="exp_date"
                />
              </div>

              {/* New Inputs for AC Age, Roof Age, and Purchase Date */}

              {qsr_type && qsr_type.toLowerCase() === "home" && (
                <>
                  <div className="w-full flex mt-[20px] mb-[20px] gap-2 flex-col justify-center items-start">
                    <p className="lg:text-[22px] md:text-start text-center font-semibold md:text-[18px] text-[13px]">
                      Is there a mortgage or lienholder?
                    </p>
                    <FormControl className="w-full" variant="outlined">
                      <InputLabel id="binary-select1">Yes / No</InputLabel>
                      <Select
                        labelId="binary-select-label"
                        id="binary-select1"
                        value={formData.isMortgageOrLienholder}
                        onChange={(e) => handleChange(e)}
                        label="Yes / No"
                        name="isMortgageOrLienholder"
                      >
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className="w-full flex mt-[20px] mb-[20px] gap-2 flex-col justify-center items-start">
                    <p className="lg:text-[22px] md:text-start text-center font-semibold md:text-[18px] text-[13px]">
                      AC Age in Years
                    </p>
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
                    <p className="lg:text-[22px] md:text-start text-center font-semibold md:text-[18px] text-[13px]">
                      Roof Age in Years
                    </p>
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
                    <p className="lg:text-[22px] md:text-start text-center font-semibold md:text-[18px] text-[13px]">
                      Purchase Date
                    </p>
                    <TextField
                      className="w-full"
                      id="purchase_date"
                      type="date"
                      value={formData.purchase_date}
                      onChange={(e) => handleChange(e)}
                      name="purchase_date"
                    />
                  </div>

                  {formData.isMortgageOrLienholder === "yes" && (
                    <>
                      <div className="w-full flex mt-[20px] mb-[20px] gap-2 flex-col justify-center items-start">
                        <p className="lg:text-[22px] md:text-start text-center font-semibold md:text-[18px] text-[13px]">
                          Name of the Company
                        </p>
                        <TextField
                          className="w-full"
                          id="company_name"
                          type="text"
                          value={formData.company_name}
                          onChange={(e) => handleChange(e)}
                          name="company_name"
                        />
                      </div>
                      <div className="w-full flex mt-[20px] mb-[20px] gap-2 flex-col justify-center items-start">
                        <p className="lg:text-[22px] md:text-start text-center font-semibold md:text-[18px] text-[13px]">
                          Account / Loan number
                        </p>
                        <TextField
                          className="w-full"
                          id="acc_loan_number"
                          type="text"
                          value={formData.acc_loan_number}
                          onChange={(e) => handleChange(e)}
                          name="acc_loan_number"
                        />
                      </div>
                      <div className="w-full flex mt-[20px] mb-[20px] gap-2 flex-col justify-center items-start">
                        <p className="lg:text-[22px] md:text-start text-center font-semibold md:text-[18px] text-[13px]">
                          Who is responsible for payment?
                        </p>
                        <FormControl className="w-full" variant="outlined">
                          <InputLabel id="binary-select1">
                            Insured / Mortgage
                          </InputLabel>
                          <Select
                            labelId="binary-select-label"
                            id="binary-select1"
                            value={formData.responsible_payment}
                            onChange={(e) => handleChange(e)}
                            label="Insured / Mortgage"
                            name="responsible_payment"
                          >
                            <MenuItem value="Insured">Insured</MenuItem>
                            <MenuItem value="Mortgage">Mortgage</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </>
                  )}
                </>
              )}

              <div className="w-full flex flex-col justify-end items-end">
                <div className="md:w-[30%] relative mt-[30px] mb-[30px] w-full">
                  <Button
                    isDisabled={bindingDisable}
                    onClickProp={handleBindQuote}
                    text={"Submit"}
                  />
                </div>
              </div>
            </div>
          </Slide>
        </Modal>
      </div>
    </>
  );
};

export default CustomTablePreviewClient;
