import React, { useState } from 'react';

const ImagePicker = ({ placeholderText, onImageSelect }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        onImageSelect(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <label
      className="bg-transparent group w-[70%] hover:bg-gray-700 border-black border-[1px] rounded-lg text-white text-sm px-4 py-2.5 outline-none cursor-pointer mx-auto block font-[sans-serif]">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 mr-2 group-hover:fill-white fill-black inline" viewBox="0 0 32 32">
        <path
          d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
          data-original="#000000" />
        <path
          d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
          data-original="#000000" />
      </svg>
      <span className='text-black group-hover:text-white'>{placeholderText || "Upload"}</span>
      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
      {selectedImage && <img className="mt-4 mx-auto max-w-full" src={selectedImage} />}
    </label>
  );
};

export default ImagePicker;
