import { useCallback } from "react"
import { Box, Modal } from "@mui/material"
import { CiCircleRemove } from "react-icons/ci"
import { useDropzone } from "react-dropzone"

export default function InspectionModalFlood({ open, onClose, files, setFiles }) {
    const onDrop = useCallback(
        (acceptedFiles) => {
            setFiles((prev) => [...prev, ...acceptedFiles])
        },
        [setFiles]
    )

    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index))
    }

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".pdf"],
        },
    })

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                className="w-[90%] md:w-[50%]"
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <div>
                    {/* Dropzone area */}
                    <div {...getRootProps()} style={{ cursor: "pointer" }}>
                        <input {...getInputProps()} />
                        <label className="bg-white text-gray-500 font-semibold text-base rounded max-w-md h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto">
                            {files.length === 0 ? (
                                <>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-11 mb-2 fill-gray-500"
                                        viewBox="0 0 32 32"
                                    >
                                        <path d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z" />
                                        <path d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z" />
                                    </svg>
                                    Upload file
                                    <p className="text-xs text-center px-2 font-medium text-gray-400 mt-2">
                                        PNG, JPG, SVG, WEBP, and GIF are Allowed.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="w-full flex flex-col justify-center items-center gap-2">
                                        <p className="font-semibold text-center text-[12px]">
                                            Files selected successfully...
                                        </p>
                                        <p className="font-light text-center text-[11px]">
                                            Click outside to close modal...
                                        </p>
                                    </div>
                                </>
                            )}
                        </label>
                    </div>

                    {/* File List */}
                    {files.length > 0 && (
                        <div className="mt-2 mb-2">
                            <h2 className="mt-1 mb-1 italic font-semibold">Selected Files:</h2>
                            <ul className="grid gap-2 grid-cols-1">
                                {files.map((file, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center justify-between p-2 border rounded"
                                    >
                                        <div className="flex items-center">
                                            {file.type.includes("image") ? (
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`File ${index + 1}`}
                                                    className="w-8 h-8 mr-2 rounded"
                                                />
                                            ) : (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-8 h-8 mr-2 fill-current text-gray-500"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M19 4H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM5 2c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h14c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1H5z"
                                                    />
                                                </svg>
                                            )}
                                            <span
                                                className="max-w-[150px] md:max-w-[300px] truncate"
                                                title={file.name}
                                            >
                                                {file.name}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="ml-2 px-2 py-1 text-sm text-red-600 rounded hover:bg-red-600 hover:text-white transition"
                                        >
                                            <CiCircleRemove size={28} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </Box>
        </Modal>
    )
}
