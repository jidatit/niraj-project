import React from "react";
import logo from "../../assets/dash/modal/logo.png";
import { Modal, Slide } from "@mui/material";
import CustomTablePreviewAdmin from "./CustomTablePreviewAdmin";
import { formatKey } from "../../utils/helperSnippets";

const DeliveredQuotePreviewAdmin = ({
  data,
  openModal,
  onClose,
  bindQuote,
  getAllDeliveredQuotes,
  getAllBinderRequestedQuotes,
}) => {
  const getDesiredOrder = (qsrType) => {
    switch (qsrType) {
      case "Home":
        return [
          "dwelling",
          "other_structures",
          "contents",
          "loss_of_use",
          "liability",
          "medical_payments",
          "aop_deductible",
          "hurricane_deductible",
        ];
      case "Auto":
        return [
          "bodily_injury",
          "property_damage",
          "u_m",
          "collision_deductible",
          "rental",
          "roadside",
          "comprehensive_deductible",
        ];
      case "Flood":
        return ["dwelling", "personal_property"];
      case "Liability":
        return [
          "liability_coverage_amount",
          "u_m_coverage",
          "cyber_liability",
          "identity_theft",
        ];
      default:
        return [];
    }
  };

  const desiredOrder = getDesiredOrder(data?.qsr_type);
  return (
    <>
      <Modal
        open={openModal}
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
          in={openModal}
          mountOnEnter
          unmountOnExit
          style={{ transition: "transform 2s ease-in-out" }}
        >
          <div className="w-[95%] overflow-y-auto max-h-[80vh] lg:w-[70%] p-10 lg:p-20 bg-white flex flex-col justify-start items-center rounded-lg shadow-md">
            {data && (
              <div className="w-full grid grid-cols-1 gap-20 lg:grid-cols-2 justify-center items-center">
                <div className="w-full flex flex-col justify-start items-start gap-3">
                  <h1 className="font-bold underline text-[20px]">Agent:</h1>
                  <div className="w-full flex flex-col text-[16px] font-normal justify-start items-start gap-1">
                    <p>
                      {data.agent.company_name ||
                        "The John Galt Insurance Agency"}
                    </p>
                    <p>
                      {data.agent.company_address ||
                        "3303 W Commercial Blvd Suite 200 Fort Lauderdale, FL 33309"}
                    </p>
                    <p>
                      <span className="font-medium">Agent: </span>
                      {data.agent.name || "Niraj Thaker"}
                    </p>
                    <p>
                      <span className="font-medium">Email: </span>
                      {data.agent.email || "nirajt@john-galt.com"}
                    </p>
                    <p>
                      <span className="font-medium">Phone 1: </span>
                      {data.agent.phone_1 || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Phone 2: </span>
                      {data.agent.phone_2 || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="w-full flex flex-col justify-center items-center">
                  <img
                    className="w-full max-w-[300px] max-h-[250px]"
                    src={logo}
                    alt=""
                  />
                </div>

                <div className="w-full flex flex-col justify-start items-start gap-3">
                  <h1 className="font-bold underline text-[20px]">
                    Quote For:
                  </h1>
                  <div className="w-full flex flex-col text-[16px] font-normal justify-start items-start gap-1">
                    <p>{data.user.name || "SEAN JONES"}</p>
                    <p>
                      {data.user.address ||
                        "4025 NE 34TH AVE FT LAUDERDALE, FL 33308"}
                    </p>
                    <p>
                      <span className="font-medium">Phone Number: </span>
                      {data.user.phoneNumber || "(954) 647-6569"}
                    </p>
                    <p>
                      <span className="font-medium">Email: </span>
                      {data.user.email || "seanfjones@aol.com"}
                    </p>
                  </div>
                </div>

                <div className="w-full flex flex-col justify-start items-start gap-3">
                  <h1 className="font-bold underline text-[20px]">
                    Original Coverages:
                  </h1>
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 justify-between flex-wrap items-center gap-x-5">
                    {data.tablesData.table_1?.map((item, index) => (
                      <div
                        key={index}
                        className="w-full flex flex-col text-[16px] font-normal justify-start items-start gap-1"
                      >
                        {desiredOrder.map(
                          (key) =>
                            item[key] !== undefined && (
                              <p key={key}>
                                <span className="font-medium">
                                  {formatKey(key)}:{" "}
                                </span>
                                {item[key]}
                              </p>
                            )
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {data && (
              <div className="flex flex-col mt-[40px] mb-[40px] lg:flex-row w-full justify-center lg:gap-0 gap-2 lg:justify-between items-center">
                <h2 className="font-bold text-[18px] lg:text-start text-center lg:text-[26px]">
                  Quote Summary Report{" "}
                  <span className="font-light">
                    ({data.qsr_type || "QSR type"})
                  </span>
                </h2>
                <p className="lg:text-[26px] font-semibold">
                  {data.date || "03 / 18 / 2024"}
                </p>
              </div>
            )}

            <div className="w-full flex flex-col justify-center items-center">
              {data && data.qsr_type && (
                <CustomTablePreviewAdmin
                  qid={data?.q_id}
                  qsr_type={data.qsr_type}
                  table1_data={data.tablesData.table_1}
                  table2_data={data.tablesData.table_2}
                  bindQuote={bindQuote}
                  user={data?.user}
                  getAllDeliveredQuotes={getAllDeliveredQuotes}
                  getAllBinderRequestedQuotes={getAllBinderRequestedQuotes}
                />
              )}
            </div>
          </div>
        </Slide>
      </Modal>
    </>
  );
};

export default DeliveredQuotePreviewAdmin;
