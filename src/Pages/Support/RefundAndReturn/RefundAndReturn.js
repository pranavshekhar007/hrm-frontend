import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../../Components/Sidebar";
import TopNav from "../../../Components/TopNav";
import {
  getSupportDetailsServ,
  updateSupportDetailsServ,
} from "../../../services/support.service";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import NoRecordFound from "../../../Components/NoRecordFound";
import JoditEditor from "jodit-react";
import {useNavigate} from "react-router-dom"
function UserRefundAndReturn() {
  const navigate = useNavigate()
  const staticsArr = [
    {
      title: "User",
      count: "Refund and Returns",
      bgColor: "#6777EF",
      path:"/user-refund-return"
    },
  ];
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [_id, setId] = useState("");
  const [btnLoader, setBtnLoader] = useState(false);
  const contentRef = useRef(""); // ✅ Store content without causing re-renders

  // Jodit Editor Config
  const config = {
    placeholder: "Start typing...",
    height: "400px",
  };

  // Fetch Terms & Conditions
  const getSupportDetailsFunc = async () => {
    try {
      const response = await getSupportDetailsServ();
      if (response?.data?.data) {
        setContent(response.data.data.refundAndReturn || "");
        contentRef.current = response.data.data.refundAndReturn || "";
        setId(response.data.data._id);
      }
    } catch (error) {
      console.error("Error fetching Refund and Returns:", error);
      toast.error("Failed to fetch Refund and Returns.");
    }
  };

  useEffect(() => {
    getSupportDetailsFunc();
  }, []);

  // Handle Update Request
  const handleSupportUpdateDetails = async () => {
    if (!contentRef.current.trim()) {
      toast.warn("Content cannot be empty!");
      return;
    }

    setBtnLoader(true);
    try {
      const response = await updateSupportDetailsServ({ _id, refundAndReturn: contentRef.current });
      if (response?.data?.statusCode === 200) {
        toast.success(response.data.message);
        getSupportDetailsFunc();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Internal Server Error");
    }
    setBtnLoader(false);
  };
  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Policy" selectedItem="Refund and Returns" />
      <div className="mainContainer">
        <TopNav />
        <div className="p-lg-4 p-md-3 p-2">
          <div
            className="row mx-0 p-0"
            style={{
              position: "relative",
              top: "-75px",
              marginBottom: "-75px",
            }}
          >
            {staticsArr?.map((v, i) => {
              return (
                <div className="col-md-4 col-12 ">
                  <div onClick={()=>navigate(v?.path)} className={"topCard  py-4 px-3 rounded mb-3 " + (v?.title=="User" ? " shadow border ":" shadow-sm")}>
                    <div className="d-flex align-items-center ">
                      <div
                        className="p-2 shadow rounded"
                        style={{ background: v?.bgColor }}
                      >
                        <img src="https://cdn-icons-png.flaticon.com/128/10349/10349031.png" />
                      </div>
                      <div className="ms-3">
                        <h6>{v?.title}</h6>
                        <h5 className="text-secondary">{v?.count}</h5>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="main-content">
            <section className="section">
              <div className="d-flex">
                <h4
                  className="p-2 text-light shadow rounded mb-4 mt-3"
                  style={{ background: "#6777EF" }}
                >
                 Refund And Return
                </h4>
              </div>

              <JoditEditor
                ref={editor}
                config={config}
                value={content}
                onChange={(newContent) => {
                  contentRef.current = newContent; // ✅ Update ref without re-rendering
                }}
              />

              {/* Update Button */}
              <button
                className="btn btn-primary w-100 mt-3"
                onClick={handleSupportUpdateDetails}
                disabled={btnLoader}
              >
                {btnLoader ? "Updating ..." : "Update"}
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserRefundAndReturn;
