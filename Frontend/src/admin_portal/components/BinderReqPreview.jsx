import React from "react";
import {
  Modal,
  Slide,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const BinderReqPreview = ({ data, isSlideModalOpen, onClose }) => {
  return (
    <>
      <Modal
        open={isSlideModalOpen}
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
          in={isSlideModalOpen}
          mountOnEnter
          unmountOnExit
          style={{ transition: "transform 2s ease-in-out" }}
        >
          <div className="w-[95%] overflow-y-auto max-h-[80vh] lg:w-[50%] p-10 lg:p-20 bg-white flex flex-col justify-start items-center rounded-lg shadow-md">
            {data && (
              <div className="w-full flex flex-col justify-center items-center md:items-start">
                <h1 className="lg:text-[32px] md:text-start text-center font-bold md:text-[24px] text-[18px]">
                  Binder Form for {data.qsr_type} Quote
                </h1>
              </div>
            )}

            {data && (
              <>
                <div className="w-full flex mt-[20px] mb-[20px] gap-2 flex-col justify-center items-start">
                  <p className="lg:text-[22px] md:text-start text-center font-semibold md:text-[18px] text-[13px]">
                    Selected Carrier
                  </p>
                  <TextField
                    className="w-full"
                    id="carrier"
                    type="text"
                    disabled
                    value={data.carrier}
                    name="carrier"
                  />
                </div>

                <div className="w-full flex mb-[20px] gap-2 flex-col justify-center items-start">
                  <p className="lg:text-[22px] md:text-start text-center font-semibold md:text-[18px] text-[13px]">
                    Confirm the effective date of the policy
                  </p>
                  <TextField
                    className="w-full"
                    id="effective_date"
                    type="date"
                    disabled
                    value={data.effective_date}
                    name="effective_date"
                  />
                </div>

                {data.qsr_type && data.qsr_type.toLowerCase() === "home" && (
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
                          value={data.isMortgageOrLienholder}
                          label="Yes / No"
                          disabled
                          name="isMortgageOrLienholder"
                        >
                          <MenuItem value="yes">Yes</MenuItem>
                          <MenuItem value="no">No</MenuItem>
                        </Select>
                      </FormControl>
                    </div>

                    {data.isMortgageOrLienholder === "yes" && (
                      <>
                        <div className="w-full flex mt-[20px] mb-[20px] gap-2 flex-col justify-center items-start">
                          <p className="lg:text-[22px] md:text-start text-center font-semibold md:text-[18px] text-[13px]">
                            Name of the Company
                          </p>
                          <TextField
                            className="w-full"
                            id="company_name"
                            type="text"
                            value={data.company_name}
                            disabled
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
                            value={data.acc_loan_number}
                            disabled
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
                              value={data.responsible_payment}
                              disabled
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
              </>
            )}
          </div>
        </Slide>
      </Modal>
    </>
  );
};

export default BinderReqPreview;
