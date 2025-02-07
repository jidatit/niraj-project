export const handleDownload = async (file) => {
  try {
    const response = await fetch(file.file);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = file.name || "download"; // Set proper filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl); // Cleanup
  } catch (error) {
    console.error("Download failed:", error);
  }
};
