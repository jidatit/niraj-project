import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import { TextField, InputLabel } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePolicyPreview = ({ data, open, handleClose }) => {
  const [showImages, setShowImages] = useState(false);
  const { address, ishomebuild, newPurchase, persons, files } = data;

  const renderTextField = (label, value) => (
    <div className='flex w-full flex-col justify-center items-start gap-2'>
      <InputLabel htmlFor="name">{label}</InputLabel>
      <TextField
        className='w-full'
        id="name"
        label={label}
        variant="outlined"
        value={value}
        disabled
      />
    </div>
  );

  const renderFilePreview = (file) => {
    const url = file.file;
    const fileType = getFileType(url);

    if (fileType === 'image') {
      return <img src={url} alt="File Preview" className="max-w-[200px] max-h-[200px] mb-2" />;
    } else if (fileType === 'pdf') {
      return <iframe src={url} type="application/pdf" className='w-full h-[200px]'></iframe>;
    } else {
      return <a href={url} target="_blank" rel="noopener noreferrer">Download File</a>;
    }
  };

  const getFileType = (url) => {
    if (url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg') || url.includes('.gif')) {
      return 'image';
    } else if (url.includes('.pdf')) {
      return 'pdf';
    } else {
      return 'other';
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="md:w-[50%] w-[90%] gap-4 bg-white flex flex-col rounded-md shadow-lg overflow-y-auto max-h-[80vh] items-center py-[30px] px-[60px]">

          <div className='w-full flex mt-[10px] flex-col justify-start items-start'>
            <button
              disabled
              className="text-white justify-center bg-[#003049] outline-none md:text-[24px] font-semibold rounded-lg text-sm px-5 py-4 text-center inline-flex items-center shadow-md transition duration-300 ease-in-out hover:bg-[#00213A]"
              type="button"
            >Policy Type: ( Home )</button>
            <h1 className='font-bold mt-[20px] lg:text-[25px]'>Form for Home Quote</h1>
          </div>

          {persons && persons.map((person, index) => (
            <>
              <div className='w-full flex flex-col justify-center items-start'><p className='font-bold text-[17px]'>Person {index + 1}</p></div>
              <div key={index} className='w-full grid grid-cols-1 mt-[10px] mb-[20px] lg:grid-cols-2 gap-5 justify-center items-center'>
                {person.name && renderTextField(`Name to be Insured  ${index + 1}`, person.name)}
                {person.dob && renderTextField(`Date of Birth ${index + 1}`, person.dob)}
              </div>
            </>
          ))}

          {address && renderTextField("Address to be insured", address)}

          <div className='w-full grid grid-cols-1 mt-[20px] mb-[20px] lg:grid-cols-2 gap-5 justify-center items-center'>
            {ishomebuild && renderTextField("Is this home built before 2005?", ishomebuild)}
            {newPurchase && renderTextField("New Purchase?", newPurchase)}
          </div>

          {files && files.length > 0 && (
            <div className="w-full mb-4">
              <button
                className="text-white justify-center bg-[#17A600] outline-none md:text-[20px] font-light rounded-lg text-sm px-5 py-4 text-center inline-flex items-center shadow-md"
                type="button"
                onClick={() => setShowImages(!showImages)}
              >
                {showImages ? 'Hide Uploaded Inspections' : 'View Uploaded Inspections'}
              </button>
              {showImages === true && files.map((file, index) => (
                <div key={index}>
                  <ul>
                    <a href={file.file} target='_blank' download>
                      <button className='bg-blue-500 rounded-lg text-white font-semibold px-2 py-2 mt-[10px] mb-[10px]'>Download File</button>
                    </a>
                    <li key={file.name}>
                      {renderFilePreview(file)}
                    </li>
                  </ul>
                </div>
              ))}

            </div>
          )}

          <div className='w-full flex mt-[10px] flex-col justify-center items-center'>
            <Link onClick={handleClose} className='w-full' to={`/admin_portal/editor?qsr_type=${data.policyType}&q_id=${data.id}&qu_id=${data.user.id}`} target="_blank">
              <button
                className="text-white w-full justify-center bg-[#F77F00] outline-none md:text-[15px] font-semibold rounded-lg text-[12px] px-5 py-4 text-center inline-flex items-center shadow-md"
                type="button"
              >
                Send the Customer a Customized Quote According to their Requirements
              </button>
            </Link>
          </div>

        </div>
      </Modal>
    </>
  );
};

export default HomePolicyPreview;