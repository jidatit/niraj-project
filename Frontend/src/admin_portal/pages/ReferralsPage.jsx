import React, { useState, useEffect } from "react";
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
import { ToastContainer } from "react-toastify";
import CustomTemplateModal from "../components/CustomTempModal";
// import StandardTemplateModal from "../components/StandardTemplateModal";
import AddPersonnelModal from "../components/PersonnelModal";
import EditTemplateModal from "../components/EditTemplateModal";

const ReferralsPage = () => {
  const [selectedTab, setSelectedTab] = useState("referralPartners");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for personnel data
  const [personnelData, setPersonnelData] = useState([]);
  const [isPersonnelLoading, setIsPersonnelLoading] = useState(true);

  const [openEditTemplateModal, setOpenEditTemplateModal] = useState(false);
  // State for the "Add Personnel" modal
  const [openAddPersonnelModal, setOpenAddPersonnelModal] = useState(false);
  const [personnelType, setPersonnelType] = useState(""); // "AC Repair" or "Roof Repair"

  const handleOpenAddPersonnelModal = (type) => {
    setPersonnelType(type);
    setOpenAddPersonnelModal(true);
  };

  const handleCloseAddPersonnelModal = () => {
    setOpenAddPersonnelModal(false);
  };

  const [openModal, setOpenModal] = useState(false);
  const [openCustomModal, setOpenCustomModal] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);

  const handleOpenStandardTemplate = (referral) => {
    setSelectedReferral(referral);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenCustomTemplate = (referral) => {
    setSelectedReferral(referral);
    setOpenCustomModal(true);
  };

  const handleCloseCustomModal = () => {
    setOpenCustomModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const collectionName =
        selectedTab === "referralPartners" ? "users" : "Personnels";
      const q = query(
        collection(db, collectionName),
        where("signupType", "==", "Referral")
      );
      const snapshot = await getDocs(q);
      setData(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    const fetchPersonnelData = async () => {
      setIsPersonnelLoading(true);
      try {
        const q = query(collection(db, "Personnels"));
        const snapshot = await getDocs(q);
        setPersonnelData(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (error) {
        console.error("Error fetching personnel data:", error);
      } finally {
        setIsPersonnelLoading(false);
      }
    };
    if (selectedTab === "referralPartners") {
      fetchData();
    } else if (selectedTab === "personnel") {
      fetchPersonnelData();
    }
  }, [selectedTab]);

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
            // color="primary"
            size="small"
            style={{
              marginRight: "8px",
              backgroundColor: "#003049",
              color: "white",
            }}
            onClick={() => handleOpenStandardTemplate(row.original)}
          >
            Standard Template
          </Button>
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
    { accessorKey: "name", header: "Name", size: 150 },
    { accessorKey: "address", header: "Address", size: 200 },
    { accessorKey: "zipCodes", header: "Zip Codes", size: 150 },
    { accessorKey: "contactInfo", header: "Contact Info", size: 200 },
    { accessorKey: "type", header: "Type", size: 100 }, // "AC Repair" or "Roof Repair"
  ];

  const renderSkeleton = () => {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Skeleton variant="text" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3].map((row) => (
              <TableRow key={row}>
                <TableCell>
                  <Skeleton variant="text" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <>
      <ToastContainer />
      <div className="w-full flex flex-col bg-[#FAFAFA] justify-center items-center">
        <div className="w-[90%] grid md:grid-cols-2 gap-5 grid-cols-1 lg:grid-cols-3 justify-center items-center">
          {/* Referral Partners Tab */}
          <div
            className={`group hover:bg-[#003049] px-2 py-4 transition-all delay-75 cursor-pointer rounded-md shadow-md flex lg:flex-row gap-2 flex-col justify-center items-center ${
              selectedTab === "referralPartners"
                ? "bg-[#003049] text-white"
                : ""
            }`}
            onClick={() => setSelectedTab("referralPartners")}
          >
            <div className="flex w-[60%] flex-col justify-center items-center lg:items-start gap-1">
              <p className="lg:text-[18px] lg:text-start text-center font-bold group-hover:text-white">
                Referral Partners
              </p>
              <p className="lg:text-[14px] lg:w-[80%] lg:text-start text-center font-light group-hover:text-white">
                You have {data?.length} Referral Partners
              </p>
            </div>
            <img src={papericon} alt="" />
          </div>

          {/* Personnel Tab */}
          <div
            className={`group hover:bg-[#003049] px-2 py-4 transition-all delay-75 cursor-pointer rounded-md shadow-md flex lg:flex-row gap-2 flex-col justify-center items-center ${
              selectedTab === "personnel" ? "bg-[#003049] text-white" : ""
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
        </div>

        {selectedTab === "personnel" && (
          <div className="w-full flex justify-end mt-4 gap-4">
            <Button
              variant="contained"
              style={{ backgroundColor: "#003049", color: "white" }}
              onClick={() => handleOpenAddPersonnelModal("AC Repair")} // Default to AC Repair
            >
              Add New Personnel
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: "#003049", color: "white" }}
              onClick={() => setOpenEditTemplateModal(true)} // Open the edit template modal
            >
              Edit Email Template
            </Button>
          </div>
        )}
        {/* Table */}
        <div className="w-full flex flex-col justify-center items-center mt-[30px]">
          {selectedTab === "referralPartners" ? (
            loading ? (
              renderSkeleton()
            ) : data.length > 0 ? (
              <div className="table w-full">
                <MaterialReactTable columns={columns} data={data} />
              </div>
            ) : (
              <p className="text-center mt-5">No Referral Partners Found....</p>
            )
          ) : isPersonnelLoading ? (
            renderSkeleton()
          ) : personnelData.length > 0 ? (
            <div className="table w-full">
              <MaterialReactTable
                columns={personnelColumns}
                data={personnelData}
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
      />

      <AddPersonnelModal
        open={openAddPersonnelModal}
        handleClose={handleCloseAddPersonnelModal}
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
    </>
  );
};

export default ReferralsPage;
