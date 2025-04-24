import React, { useEffect, useState, useMemo } from "react";
import { TextField, Box } from "@mui/material";
import Button from "../components/Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../db";
import Modal from "@mui/material/Modal";
import { MaterialReactTable } from "material-react-table";

const AgentPage = () => {
  const [agents, setAgents] = useState([]);
  const [buttonText, setButtonText] = useState("Create");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchAgents = async () => {
    try {
      const AgentsCollection = collection(db, "agents");
      const snapshot = await getDocs(AgentsCollection);
      const AgentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAgents(AgentsData);
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_1: "",
    phone_2: "",
    company_name: "",
    company_address: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addpreparertodb = async () => {
    try {
      if (
        !formData.name &&
        !formData.email &&
        !formData.phone_1 &&
        !formData.company_name &&
        !formData.company_address
      ) {
        toast.warn("Fill Details");
        return;
      }
      setButtonText("Creating");
      await addDoc(collection(db, "agents"), formData);
      toast.success("Agent added successfully!");
      setFormData({
        name: "",
        email: "",
        phone_1: "",
        phone_2: "",
        company_name: "",
        company_address: "",
      });
      setButtonText("Create");
      handleClose();
      fetchAgents();
    } catch (error) {
      toast.error("Error occurred");
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Agent Name",
        size: 100,
        Cell: ({ cell }) => (
          <Box>
            {cell.getValue().length > 100
              ? cell.getValue().slice(0, 100) + "..."
              : cell.getValue()}
          </Box>
        ),
      },
      {
        accessorKey: "email",
        header: "Agent Email",
        size: 100,
        Cell: ({ cell }) => (
          <Box>
            {cell.getValue().length > 100
              ? cell.getValue().slice(0, 100) + "..."
              : cell.getValue()}
          </Box>
        ),
      },
      {
        accessorKey: "phone_1",
        header: "Agent Phone 1",
        size: 200,
      },
      {
        accessorKey: "phone_2",
        header: "Agent Phone 2",
        size: 200,
      },
    ],
    []
  );

  const DeleteAgent = async (id) => {
    try {
      await deleteDoc(doc(db, "agents", id));
      toast.success("Agent deleted successfully!");
      setAgents((prevAgents) => prevAgents.filter((prep) => prep.id !== id));
    } catch (error) {
      console.error("Error deleting agent:", error);
      toast.error("Error occurred while deleting agent");
    }
  };

  return (
    <>
      <div className="w-full flex flex-col bg-[#FAFAFA] justify-center items-center">
        <div className="w-[90%] flex flex-col gap-5 justify-center items-start">
          <button
            className="w-auto font-semibold rounded-[25px] bg-[#003049] text-white text-[14px] lg:text-[18px] py-2 px-4 hover:bg-[#00263d] transition-all duration-300 shadow-md hover:shadow-lg"
            onClick={handleOpen}
          >
            Create a New Agent +
          </button>
          <h1 className="text-black font-bold text-[25px] mt-5 mb-5">
            Previously Added Agents
          </h1>
        </div>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="md:w-[50%] w-[90%] gap-4 bg-white flex flex-col  rounded-md shadow-lg overflow-y-auto max-h-[80vh] items-center py-[30px]">
            <h3 className="font-bold md:text-[24px] text-[15px] text-center">
              Create a New Agent
            </h3>
            <TextField
              required
              label="Enter Agent Name"
              type="text"
              onChange={handleChange}
              name="name"
              value={formData.name}
              className="w-[70%]"
            />
            <TextField
              required
              label="Enter Agent Email"
              type="email"
              onChange={handleChange}
              name="email"
              value={formData.email}
              className="w-[70%]"
            />
            <TextField
              required
              label="Agent Phone 1"
              type="text"
              onChange={handleChange}
              name="phone_1"
              value={formData.phone_1}
              className="w-[70%]"
            />
            <TextField
              label="Agent Phone 2"
              type="text"
              onChange={handleChange}
              name="phone_2"
              value={formData.phone_2}
              className="w-[70%]"
            />
            <TextField
              required
              label="Company Name"
              type="text"
              onChange={handleChange}
              name="company_name"
              value={formData.company_name}
              className="w-[70%]"
            />
            <TextField
              required
              label="Company Address"
              type="text"
              multiline
              rows={5}
              onChange={handleChange}
              name="company_address"
              value={formData.company_address}
              className="w-[70%]"
            />

            <div className="w-[90%] mb-5 flex flex-col justify-end items-end">
              <div className="md:w-[30%] w-full pr-0 md:pr-2">
                <Button onClickProp={addpreparertodb} text={buttonText} />
              </div>
            </div>
          </div>
        </Modal>

        <div className="w-[90%] flex flex-col gap-5 justify-center items-start">
          {agents ? (
            <div className="table w-full">
              <MaterialReactTable
                enableRowSelection
                columns={columns}
                data={agents}
                renderTopToolbarCustomActions={({ table }) => {
                  const handleDelete = () => {
                    const selectedRows = table.getSelectedRowModel().flatRows;
                    if (selectedRows.length === 1) {
                      const selectedRowId = selectedRows[0].original.id;
                      alert("Deleting Agent with ID: " + selectedRowId);
                      DeleteAgent(selectedRowId);
                    } else {
                      alert("Please select a single row to delete.");
                    }
                  };
                  return (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        color="error"
                        disabled={!table.getIsSomeRowsSelected()}
                        onClick={handleDelete}
                        className="bg-[#003049] text-white rounded-lg py-2 px-6"
                      >
                        Delete
                      </button>
                    </div>
                  );
                }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default AgentPage;
