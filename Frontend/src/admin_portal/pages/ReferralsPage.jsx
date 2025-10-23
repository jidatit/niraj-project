import React, { useState, useEffect, useCallback } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, storage } from "../../../db";
import papericon from "../../assets/dash/quotes/paper.png";
import { MaterialReactTable } from "material-react-table";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import StandardTemplateModal from "../components/StandartTempModal";
import CustomTemplateModal from "../components/CustomTempModal";
import AddPersonnelModal from "../components/PersonnelModal";
import EditTemplateModal from "../components/EditTemplateModal";
import { Box, Chip } from "@mui/material";
import RenewalQuoteTemplateModal from "../components/RenewalQuoteModel";
import { AttachReferralModal } from "../components/AttachReferral";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
const ReferralsPage = () => {
  const [selectedTab, setSelectedTab] = useState("referralPartners");
  const [referralPartnersData, setReferralPartnersData] = useState([]);
  const [clientReferralsData, setClientReferralsData] = useState([]);
  const [personnelData, setPersonnelData] = useState([]);
  const [loadingReferralPartners, setLoadingReferralPartners] = useState(true);
  const [loadingClientReferrals, setLoadingClientReferrals] = useState(true);
  const [isPersonnelLoading, setIsPersonnelLoading] = useState(true);
  const [openRenewalModal, setOpenRenewalModal] = useState(false);
  const [openEditTemplateModal, setOpenEditTemplateModal] = useState(false);
  const [openAddPersonnelModal, setOpenAddPersonnelModal] = useState(false);
  const [personnelType, setPersonnelType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [templateType, setTemplateType] = useState("AC");
  const [openCustomModal, setOpenCustomModal] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [openAttachModal, setOpenAttachModal] = useState(false);

  //handlers for standard template:
  const [modalMode, setModalMode] = useState("template");

  const handleOpenStandardTemplate = (referral) => {
    setSelectedReferral(referral);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleOpenAddPersonnelModal = (type) => {
    setPersonnelType(type);
    setOpenAddPersonnelModal(true);
  };

  const handleCloseAddPersonnelModal = () => {
    setOpenAddPersonnelModal(false);
  };


  const handleOpenCustomTemplate = (referral) => {
    setSelectedReferral(referral);
    setOpenCustomModal(true);
  };

  const handleCloseCustomModal = () => {
    setOpenCustomModal(false);
  };

  const openPersonnelModal = (type) => {
    setTemplateType(type);
    setOpenEditTemplateModal(true);
  };

  // Fetch client referrals data
  const fetchClientReferralsData = useCallback(async () => {
    setLoadingClientReferrals(true);
    try {
      const clientQuery = query(collection(db, "users"), where("signupType", "==", "Client"));
      const clientSnapshot = await getDocs(clientQuery);
      setClientReferralsData(clientSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching client referrals:", error);
    } finally {
      setLoadingClientReferrals(false);
    }
  }, []);

  // Fetch personnel data
  const fetchPersonnelData = useCallback(async () => {
    setIsPersonnelLoading(true);
    try {
      const personnelQuery = query(collection(db, "Personnels"));
      const personnelSnapshot = await getDocs(personnelQuery);
      setPersonnelData(personnelSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching personnel data:", error);
    } finally {
      setIsPersonnelLoading(false);
    }
  }, []);

  // Fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch Referral Partners
        setLoadingReferralPartners(true);
        const referralQuery = query(collection(db, "users"), where("signupType", "==", "Referral"));
        const referralSnapshot = await getDocs(referralQuery);
        setReferralPartnersData(referralSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoadingReferralPartners(false);

        // Fetch Client Referrals
        await fetchClientReferralsData();

        // Fetch Personnel
        await fetchPersonnelData();
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoadingReferralPartners(false);
        setLoadingClientReferrals(false);
        setIsPersonnelLoading(false);
      }
    };

    fetchAllData();
  }, [fetchClientReferralsData, fetchPersonnelData]);

  const columns = [
    { accessorKey: "name", header: "Name", size: 150 },
    { accessorKey: "email", header: "Email", size: 200 },
    { accessorKey: "mailingAddress", header: "Mailing Address" },
    {
      accessorKey: "actions",
      header: "Actions",
      size: 250,
      Cell: ({ row }) => (
        <div>
          <Button
            variant="contained"
            size="small"
            style={{ marginRight: "8px", backgroundColor: "#003049", color: "white" }}
            onClick={() => handleOpenStandardTemplate(row.original)}
          >
            Standard Template
          </Button>
          {/* <Button
            variant="contained"
            size="small"
            color="tableAction"
            startIcon={<EditIcon />}
            onClick={() => handleOpenStandardTemplate("template", row.original)}
          >
            Standard Template
          </Button> */}
          <Button
            onClick={() => handleOpenCustomTemplate(row.original)}
            variant="contained"
            color="primary"
            size="small"
          >
            Custom Template
          </Button>
        </div>
      ),
    },
  ];

  const personnelColumns = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "address", header: "Address" },
    {
      accessorKey: "zipCodes",
      header: "Zip Codes",
      Cell: ({ cell }) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {cell.getValue().map((zip, index) => (
            <Chip key={index} label={zip} sx={{ backgroundColor: "#003049", color: "white" }} />
          ))}
        </Box>
      ),
    },
    { accessorKey: "contactInfo", header: "Contact Info" },
    { accessorKey: "type", header: "Repair Type" },
  ];

  const clientReferralColumns = [
    { accessorKey: "name", header: "Name", size: 150 },
    { accessorKey: "email", header: "Email", size: 200 },
    {
      accessorKey: "referralId",
      header: "Referral Attached",
      Cell: ({ row }) => {
        const referralName = row?.original?.referralData?.name;
        return referralName ? (
          <span>{referralName}</span>
        ) : (
          <span style={{ color: "#999" }}>No referral attached</span>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      size: 200,
      Cell: ({ row }) => (
        <Button
          variant="contained"
          size="small"
          style={{ backgroundColor: "#003049", color: "white" }}
          onClick={() => {
            setSelectedClient(row.original);
            setSelectedReferral(row.original.referralData || null);
            setOpenAttachModal(true);
          }}
        >
          {row.original.referralId ? "Edit Referral" : "Attach Referral"}
        </Button>
      ),
    },
  ];

  const renderSkeleton = () => {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Skeleton variant="text" /></TableCell>
              <TableCell><Skeleton variant="text" /></TableCell>
              <TableCell><Skeleton variant="text" /></TableCell>
              <TableCell><Skeleton variant="text" /></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3].map((row) => (
              <TableRow key={row}>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell><Skeleton variant="text" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <>
      <div className="w-full flex flex-col bg-[#FAFAFA] justify-center items-center">
        <div className="w-[90%] grid md:grid-cols-2 gap-5 grid-cols-1 lg:grid-cols-3 justify-center items-center mb-4">
          {/* Referral Partners Tab */}
          <div
            className={`group hover:bg-[#003049] px-2 py-4 transition-all delay-75 cursor-pointer rounded-md shadow-md flex lg:flex-row gap-2 flex-col justify-center items-center ${selectedTab === "referralPartners" ? "bg-[#003049] text-white" : ""
              }`}
            onClick={() => setSelectedTab("referralPartners")}
          >
            <div className="flex w-[60%] flex-col justify-center items-center lg:items-start gap-1">
              <p className="lg:text-[18px] lg:text-start text-center font-bold group-hover:text-white">
                Referral Partners
              </p>
              <p className="lg:text-[14px] lg:w-[80%] lg:text-start text-center font-light group-hover:text-white">
                You have {referralPartnersData?.length} Referral Partners
              </p>
            </div>
            <img src={papericon} alt="" />
          </div>

          {/* Personnel Tab */}
          <div
            className={`group hover:bg-[#003049] px-2 py-4 transition-all delay-75 cursor-pointer rounded-md shadow-md flex lg:flex-row gap-2 flex-col justify-center items-center ${selectedTab === "personnel" ? "bg-[#003049] text-white" : ""
              }`}
            onClick={() => setSelectedTab("personnel")}
          >
            <div className="flex w-[60%] flex-col justify-center items-center lg:items-start gap-1">
              <p className="lg:text-[18px] lg:text-start text-center font-bold group-hover:text-white">
                Personnel
              </p>
              <p className="lg:text-[14px] lg:w-[80%] lg:text-start text-center font-light group-hover:text-white">
                You have {personnelData?.length} Personnels
              </p>
            </div>
            <img src={papericon} alt="" />
          </div>

          {/* Client Referrals Tab */}
          <div
            className={`group hover:bg-[#003049] px-2 py-4 transition-all delay-75 cursor-pointer rounded-md shadow-md flex lg:flex-row gap-2 flex-col justify-center items-center ${selectedTab === "clientReferrals" ? "bg-[#003049] text-white" : ""
              }`}
            onClick={() => setSelectedTab("clientReferrals")}
          >
            <div className="flex w-[60%] flex-col justify-center items-center lg:items-start gap-1">
              <p className="lg:text-[18px] lg:text-start text-center font-bold group-hover:text-white">
                Client Referrals
              </p>
              <p className="lg:text-[14px] lg:w-[80%] lg:text-start text-center font-light group-hover:text-white">
                Manage client-referral relationships
              </p>
            </div>
            <img src={papericon} alt="" />
          </div>
        </div>

        {selectedTab === "referralPartners" && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mb: 2, width: "90%" }}>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              startIcon={<EditIcon />}
              onClick={() => setOpenRenewalModal(true)}
            >
              Edit Renewal Template
            </Button>
          </Box>
        )}

        {selectedTab === "personnel" && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mb: 2, width: "90%" }}>
            <Button
              variant="contained"
              color="success"
              size="medium"
              startIcon={<AddIcon />}
              onClick={() => handleOpenAddPersonnelModal("AC Repair")}
            >
              Add New Personnel
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: "#003049", color: "white" }}
              size="medium"
              startIcon={<EditIcon />}
              onClick={() => openPersonnelModal("Roof")}
            >
              Edit Roof Template
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="medium"
              startIcon={<EditIcon />}
              onClick={() => openPersonnelModal("AC")}
            >
              Edit AC Template
            </Button>
          </Box>
        )}

        {/* Table */}
        <div className="w-full flex flex-col justify-center items-center mt-[30px]">
          {selectedTab === "referralPartners" ? (
            loadingReferralPartners ? (
              renderSkeleton()
            ) : referralPartnersData.length > 0 ? (
              <div className="table w-full">
                <MaterialReactTable
                  columns={columns}
                  data={referralPartnersData}
                  initialState={{ density: "compact" }}
                />
              </div>
            ) : (
              <p className="text-center mt-5">No Referral Partners Found....</p>
            )
          ) : selectedTab === "clientReferrals" ? (
            loadingClientReferrals ? (
              renderSkeleton()
            ) : clientReferralsData.length > 0 ? (
              <div className="table w-full">
                <MaterialReactTable
                  columns={clientReferralColumns}
                  data={clientReferralsData}
                  initialState={{ density: "compact" }}
                />
              </div>
            ) : (
              <p className="text-center mt-5">No Clients Found....</p>
            )
          ) : isPersonnelLoading ? (
            renderSkeleton()
          ) : personnelData.length > 0 ? (
            <div className="table w-full">
              <MaterialReactTable
                columns={personnelColumns}
                data={personnelData}
                initialState={{ density: "compact" }}
              />
            </div>
          ) : (
            <p className="text-center mt-5">No Personnel Found....</p>
          )}
        </div>
      </div>

      <EditTemplateModal
        open={openEditTemplateModal}
        handleClose={() => setOpenEditTemplateModal(false)}
        templateType={templateType}
      />

      <AddPersonnelModal
        open={openAddPersonnelModal}
        handleClose={handleCloseAddPersonnelModal}
        db={db}
        fetchPersonnelData={fetchPersonnelData}
      />

      <RenewalQuoteTemplateModal
        open={openRenewalModal}
        handleClose={() => setOpenRenewalModal(false)}
        db={db}
      />

      <StandardTemplateModal
        open={openModal}
        handleClose={handleCloseModal}
        referral={selectedReferral}
        db={db}
        storage={storage}
      />

      <CustomTemplateModal
        open={openCustomModal}
        handleClose={handleCloseCustomModal}
        referral={selectedReferral}
        db={db}
        storage={storage}
      />

      <AttachReferralModal
        open={openAttachModal}
        onClose={() => setOpenAttachModal(false)}
        client={selectedClient}
        selectedReferral={selectedReferral}
        fetchClientReferralsData={fetchClientReferralsData} // Pass refetch function
      />
    </>
  );
};

export default ReferralsPage;