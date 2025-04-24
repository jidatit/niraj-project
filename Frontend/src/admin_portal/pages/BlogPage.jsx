import React, { useEffect, useState, useMemo } from "react";
import {
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Button as MuiButton,
  DialogActions,
} from "@mui/material";
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
import { db, storage } from "../../../db";
import { ref, uploadBytes, getDownloadURL } from "@firebase/storage";
import Modal from "@mui/material/Modal";
import { Link } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import { CloudUpload, Close } from "@mui/icons-material";
const ImageUploader = ({ label, onImageSelect, selectedImage, clearImage }) => {
  return (
    <div className="w-[70%] mx-auto text-center">
      <label className="bg-transparent group w-full hover:bg-gray-700 border-black border-[1px] rounded-lg text-white text-sm px-4 py-2.5 outline-none cursor-pointer flex items-center justify-center">
        <CloudUpload className="w-5 mr-2 group-hover:text-white text-black" />
        <span className="text-black group-hover:text-white">{label}</span>
        <input
          type="file"
          accept="image/*"
          onChange={onImageSelect}
          className="hidden"
        />
      </label>

      {selectedImage && (
        <div className="relative mt-4 flex flex-col items-center">
          <img
            className="rounded-lg max-w-full h-40 object-cover"
            src={URL.createObjectURL(selectedImage)}
            alt="Preview"
          />
          <span className="mt-2 text-sm text-gray-500">
            {selectedImage.name}
          </span>
          <button
            onClick={clearImage} // Fix: Call clearImage instead of passing null to onImageSelect
            className="absolute top-2 right-2 text-black p-1 rounded-full"
          >
            <Close fontSize="small" />
          </button>
        </div>
      )}
    </div>
  );
};
const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [buttonText, setButtonText] = useState("Submit");
  const [selectedAuthorImageData, setSelectedAuthorImageData] = useState(null);
  const [selectedBlogImageData, setSelectedBlogImageData] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const fetchBlogs = async () => {
    try {
      const blogsCollection = collection(db, "blogs");
      const snapshot = await getDocs(blogsCollection);
      const blogsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(blogsData);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };
  useEffect(() => {
    fetchBlogs();
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    topic: "",
    author_name: "",
    preview_text: "",
    MainImageUrl: "",
    authorImageUrl: "",
    dynamicContent: [{ heading: "", paragraph: "" }],
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddContent = () => {
    setFormData((prevData) => ({
      ...prevData,
      dynamicContent: [
        ...prevData.dynamicContent,
        { heading: "", paragraph: "" },
      ],
    }));
  };

  const handleDynamicContentChange = (index, type, value) => {
    const updatedContent = [...formData.dynamicContent];
    updatedContent[index][type] = value;
    setFormData((prevData) => ({
      ...prevData,
      dynamicContent: updatedContent,
    }));
  };

  const addblogtodb = async () => {
    try {
      if (!selectedAuthorImageData || !selectedBlogImageData) {
        toast.warn("Fill Details");
        return;
      }
      setButtonText("Submitting");
      let formDataCopy = { ...formData };

      if (selectedAuthorImageData) {
        const authorImageRef = ref(
          storage,
          `blogs/${formData.author_name}_author_image`
        );
        await uploadBytes(authorImageRef, selectedAuthorImageData);
        const authorImageUrl = await getDownloadURL(authorImageRef);
        formDataCopy.authorImageUrl = authorImageUrl;
      }

      if (selectedBlogImageData) {
        const blogImageRef = ref(storage, `blogs/${formData.title}_blog_image`);
        await uploadBytes(blogImageRef, selectedBlogImageData);
        const blogImageUrl = await getDownloadURL(blogImageRef);
        formDataCopy.MainImageUrl = blogImageUrl;
      }

      await addDoc(collection(db, "blogs"), formDataCopy);
      toast.success("Blog added successfully!");
      setButtonText("Submit");
      setOpen(false);
      fetchBlogs();
    } catch (error) {
      toast.error("Error occurred");
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Blog Title",
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
        accessorKey: "topic",
        header: "Topic",
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
        accessorKey: "author_name",
        header: "Author Name",
        size: 200,
      },
      {
        accessorKey: "preview_text",
        header: "Preview Text",
        size: 100,
        Cell: ({ cell }) => (
          <Box>
            {cell.getValue().length > 150
              ? cell.getValue().slice(0, 150) + "..."
              : cell.getValue()}
          </Box>
        ),
      },
      {
        header: "Actions",
        size: 200,
        Cell: ({ cell }) => (
          <Box display="flex" alignItems="center" gap="18px">
            <Link to={`/resource-center/blog/${cell.row.original.id}`}>
              <button className="bg-[#003049] rounded-[18px] px-[36px] py-[4px] text-white text-[14px]">
                View
              </button>
            </Link>
          </Box>
        ),
      },
    ],
    []
  );

  const handleDeleteClick = (table) => {
    const selectedRows = table.getSelectedRowModel().flatRows;
    console.log("Selected Rows:", selectedRows);

    if (selectedRows.length === 1) {
      setSelectedRowId(selectedRows[0].original.id);
      setOpenDeleteModal(true); // Open confirmation dialog
    } else {
      alert("Please select a single row to delete.");
    }
  };

  const handleConfirmDelete = () => {
    if (selectedRowId) {
      DeleteBlog(selectedRowId);
      setOpenDeleteModal(false);
      setSelectedRowId(null);
    }
  };

  const DeleteBlog = async (blog_id) => {
    try {
      await deleteDoc(doc(db, "blogs", blog_id));
      toast.success("Blog deleted successfully!");
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blog_id));
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Error occurred while deleting blog");
    }
  };

  return (
    <>
      <div className="w-full flex flex-col bg-[#FAFAFA] justify-center items-center">
        <div className="w-[90%] flex flex-col gap-5 justify-center items-start">
          <button
            type="button"
            className="w-auto font-semibold rounded-[25px] bg-[#003049] text-white text-[14px] lg:text-[18px] py-2 px-4 hover:bg-[#00263d] transition-all duration-300 shadow-md hover:shadow-lg"
            onClick={handleOpen}
          >
            Create a New Blog +
          </button>

          <h1 className="text-black font-bold text-[25px] mt-5 mb-5">
            Previously Added Blog
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
              Create a New Blog
            </h3>
            <TextField
              required
              label="Enter Blog Title"
              type="text"
              onChange={handleChange}
              name="title"
              value={formData.title}
              className="w-[70%]"
            />
            <TextField
              required
              label="Enter Blog Topic"
              type="text"
              onChange={handleChange}
              name="topic"
              value={formData.topic}
              className="w-[70%]"
            />
            <TextField
              required
              label="Name of Author"
              type="text"
              onChange={handleChange}
              name="author_name"
              value={formData.author_name}
              className="w-[70%]"
            />
            <TextField
              required
              label="Preview Text"
              type="text"
              onChange={handleChange}
              name="preview_text"
              value={formData.preview_text}
              className="w-[70%]"
            />

            <ImageUploader
              label="Upload Author Image"
              onImageSelect={(e) =>
                setSelectedAuthorImageData(e.target.files[0])
              }
              selectedImage={selectedAuthorImageData}
              clearImage={() => setSelectedAuthorImageData(null)} // Fix: Handle null properly
            />
            {formData.dynamicContent.map((content, index) => (
              <div
                className="w-[70%] flex flex-col justify-center items-center gap-2"
                key={index}
              >
                <TextField
                  label={`Heading ${index + 1}`}
                  value={content.heading}
                  onChange={(e) =>
                    handleDynamicContentChange(index, "heading", e.target.value)
                  }
                  className="w-full mt-2 mb-5"
                />
                <TextField
                  label={`Paragraph ${index + 1}`}
                  value={content.paragraph}
                  onChange={(e) =>
                    handleDynamicContentChange(
                      index,
                      "paragraph",
                      e.target.value
                    )
                  }
                  multiline
                  rows={4}
                  className="w-full mb-5"
                />
              </div>
            ))}

            <div className="w-auto md:w-[10%] flex justify-center">
              <Button
                onClickProp={handleAddContent}
                text="+"
                className="bg-[#003049] text-white rounded-full text-2xl md:text-3xl  hover:bg-[#00263d] transition-all duration-300 shadow-md hover:shadow-lg"
              />
            </div>

            <ImageUploader
              label="Upload Blog Image"
              onImageSelect={(e) => setSelectedBlogImageData(e.target.files[0])}
              selectedImage={selectedBlogImageData}
              clearImage={() => setSelectedBlogImageData(null)} // Fix: Handle null properly
            />
            <div className="w-[90%] mb-5 flex flex-col justify-end items-end">
              <div className="md:w-[30%] w-full pr-0 md:pr-2">
                <Button onClickProp={addblogtodb} text={buttonText} />
              </div>
            </div>
          </div>
        </Modal>

        <div className="w-[90%] flex flex-col gap-5 justify-center items-start">
          {blogs ? (
            <div className="table w-full">
              <MaterialReactTable
                enableRowSelection
                columns={columns}
                data={blogs}
                getRowId={(row) => row.id}
                renderTopToolbarCustomActions={({ table }) => (
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      type="button"
                      // disabled={!table.getIsSomeRowsSelected()}
                      onClick={() => handleDeleteClick(table)}
                      className="bg-[#003049] text-white rounded-lg py-2 px-6"
                    >
                      Delete
                    </button>
                  </div>
                )}
              />
            </div>
          ) : null}
        </div>
        <Dialog
          open={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this blog?
          </DialogContent>
          <DialogActions>
            <MuiButton
              onClick={() => setOpenDeleteModal(false)}
              color="primary"
              variant="contained"
            >
              Cancel
            </MuiButton>
            <MuiButton
              onClick={handleConfirmDelete}
              variant="contained"
              color="error"
            >
              Confirm
            </MuiButton>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default BlogPage;
