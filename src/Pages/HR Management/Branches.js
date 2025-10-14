// src/pages/Branches/BranchList.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import NoRecordFound from "../../Components/NoRecordFound";

import {
  BsPencil,
  BsTrash,
  BsEye,
  BsChevronDown,
  BsX,
} from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { RiAddLine } from "react-icons/ri";

import {
  getBranchListServ,
  addBranchServ,
  updateBranchServ,
  deleteBranchServ,
} from "../../services/branch.services";

function BranchList() {
  const [list, setList] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);

  const [payload, setPayload] = useState({
    searchKey: "",
    pageNo: 1,
    pageCount: 10,
    sortByField: "",
    sortOrder: "asc",
  });

  const [branchForm, setBranchForm] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    contactEmail: "",
    contactPhone: "",
  });

  // ✅ Fetch Branch List
  const handleGetBranches = async () => {
    setShowSkeleton(true);
    try {
      const res = await getBranchListServ(payload);
      setList(res?.data?.data || []);
      setTotalRecords(res?.data?.documentCount?.totalCount || 0);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load branches");
    }
    setShowSkeleton(false);
  };

  useEffect(() => {
    handleGetBranches();
  }, [payload]);

  // ✅ Modal Handlers
  const handleOpenAddModal = () => {
    setEditingBranch(null);
    setBranchForm({
      name: "",
      address: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      contactEmail: "",
      contactPhone: "",
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (branch) => {
    setEditingBranch(branch);
    setBranchForm({
      name: branch.name || "",
      address: branch.address || "",
      city: branch.city || "",
      state: branch.state || "",
      country: branch.country || "",
      zipCode: branch.zipCode || "",
      contactEmail: branch.contactEmail || "",
      contactPhone: branch.contactPhone || "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBranch(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setBranchForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Save (Create / Update)
  const handleSaveBranch = async () => {
    if (!branchForm.name || !branchForm.address || !branchForm.city || !branchForm.country) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      if (editingBranch) {
        const res = await updateBranchServ({ _id: editingBranch._id, ...branchForm });
        toast.success(res?.data?.message || "Branch updated successfully!");
      } else {
        const res = await addBranchServ(branchForm);
        toast.success(res?.data?.message || "Branch added successfully!");
      }
      handleCloseModal();
      handleGetBranches();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Operation failed.");
    }
  };

  // ✅ Delete Branch
  const handleDeleteBranch = async (id) => {
    if (window.confirm("Are you sure you want to delete this branch?")) {
      try {
        const res = await deleteBranchServ(id);
        toast.success(res?.data?.message || "Branch deleted successfully!");
        handleGetBranches();
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to delete branch.");
      }
    }
  };

  // ✅ Sorting
  const handleSort = (field) => {
    setPayload((prev) => ({
      ...prev,
      sortByField: field,
      sortOrder: prev.sortByField === field && prev.sortOrder === "asc" ? "desc" : "asc",
      pageNo: 1,
    }));
  };

  // ✅ Pagination Calculations
  const startIndex = (payload.pageNo - 1) * payload.pageCount;
  const endIndex = Math.min(startIndex + payload.pageCount, totalRecords);
  const totalPages = Math.ceil(totalRecords / payload.pageCount);

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Hr Management" selectedItem="Branches" />
      <div className="mainContainer">
        <TopNav />
        <div className="p-lg-4 p-md-3 p-2">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
            <h3 className="fw-semibold mb-0">Branch Management</h3>
            <button
              className="btn text-white px-3"
              style={{
                background: "#16A34A",
                boxShadow: "0 4px 12px rgba(22,163,74,0.3)",
                borderRadius: "0.5rem",
              }}
              onClick={handleOpenAddModal}
            >
              <RiAddLine size={20} className="me-1" />
              Add Branch
            </button>
          </div>

          {/* Search */}
          <div className="card shadow-sm p-3 mb-4 border-0 rounded-3">
            <div className="row g-2 align-items-center">
              <div className="col-lg-8 col-md-8">
                <div className="input-group">
                  <input
                    className="form-control"
                    placeholder="Search..."
                    onChange={(e) =>
                      setPayload({ ...payload, searchKey: e.target.value, pageNo: 1 })
                    }
                  />
                  <button
                    className="btn text-white px-4"
                    style={{ background: "#16A34A" }}
                    onClick={handleGetBranches}
                  >
                    <FaSearch size={16} /> Search
                  </button>
                </div>
              </div>

              <div className="col-lg-4 col-md-4 d-flex justify-content-end">
                <div className="d-flex align-items-center">
                  <span className="me-2 text-muted">Per Page:</span>
                  <select
                    className="form-select"
                    style={{ width: "auto" }}
                    value={payload.pageCount}
                    onChange={(e) =>
                      setPayload({ ...payload, pageCount: Number(e.target.value), pageNo: 1 })
                    }
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="card shadow-sm rounded-3 border-0 overflow-hidden">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr style={{ background: "#F8FAFC", color: "#6B7280" }}>
                      <th className="ps-4">#</th>
                      <th onClick={() => handleSort("name")} className="cursor-pointer">
                        Name <BsChevronDown size={12} />
                      </th>
                      <th>Address</th>
                      <th>Contact</th>
                      <th>Status</th>
                      <th>Created At</th>
                      <th className="text-center pe-4">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {showSkeleton ? (
                      Array.from({ length: payload.pageCount }).map((_, i) => (
                        <tr key={i}>
                          <td className="ps-4"><Skeleton width={20} /></td>
                          <td><Skeleton width={100} /></td>
                          <td><Skeleton width={200} /></td>
                          <td><Skeleton width={150} /></td>
                          <td><Skeleton width={60} /></td>
                          <td><Skeleton width={90} /></td>
                          <td><Skeleton width={90} /></td>
                        </tr>
                      ))
                    ) : list.length > 0 ? (
                      list.map((branch, i) => (
                        <tr key={branch._id}>
                          <td className="ps-4">
                            {(payload.pageNo - 1) * payload.pageCount + i + 1}
                          </td>
                          <td className="fw-semibold text-dark">{branch.branchName}</td>
                          <td className="text-muted">
                            {branch.address}, {branch.city}, {branch.state}, {branch.country}
                          </td>
                          <td className="text-muted">
                            <div>{branch.phone}</div>
                            <div>{branch.contactEmail}</div>
                          </td>
                          <td>
                            <span
                              className={`badge px-2 py-1 ${
                                branch.status
                                  ? "bg-success-subtle text-success"
                                  : "bg-danger-subtle text-danger"
                              }`}
                            >
                              {branch.status ? "Active" : "Inactive"}
                            </span>
                          </td>

                          <td className="text-muted">
                            {moment(branch.createdAt).format("YYYY-MM-DD")}
                          </td>
                          <td className="text-center pe-4">
                            <BsEye
                              size={18}
                              className="mx-2 text-primary"
                              style={{ cursor: "pointer" }}
                              title="View"
                            />
                            <BsPencil
                              size={18}
                              className="mx-2 text-warning"
                              style={{ cursor: "pointer" }}
                              title="Edit"
                              onClick={() => handleOpenEditModal(branch)}
                            />
                            <BsTrash
                              size={18}
                              className="mx-2 text-danger"
                              style={{ cursor: "pointer" }}
                              title="Delete"
                              onClick={() => handleDeleteBranch(branch._id)}
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          <NoRecordFound />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div
            className="modal fade show d-flex align-items-center justify-content-center"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-md modal-dialog-centered">
              <div className="modal-content rounded-4 shadow-lg border-0">
                <div className="modal-header border-0 d-flex justify-content-between">
                  <h5 className="modal-title fw-semibold">
                    {editingBranch ? "Edit Branch" : "Add New Branch"}
                  </h5>
                  <button type="button" className="btn-close" onClick={handleCloseModal}>
                    <BsX size={24} />
                  </button>
                </div>
                <div className="modal-body px-4 py-3">
                  <form>
                    {[
                      { name: "name", label: "Branch Name *" },
                      { name: "address", label: "Address" },
                      { name: "city", label: "City *" },
                      { name: "state", label: "State/Province" },
                      { name: "country", label: "Country *" },
                      { name: "zipCode", label: "ZIP/Postal Code" },
                      { name: "contactPhone", label: "Contact Phone" },
                      { name: "contactEmail", label: "Contact Email" },
                    ].map((field) => (
                      <div className="mb-3" key={field.name}>
                        <label className="form-label mb-1 text-muted fw-normal">
                          {field.label}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name={field.name}
                          value={branchForm[field.name]}
                          onChange={handleFormChange}
                        />
                      </div>
                    ))}
                  </form>
                </div>
                <div className="modal-footer border-0 d-flex justify-content-end">
                  <button className="btn btn-light" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button
                    className="btn text-white"
                    style={{ background: "#16A34A" }}
                    onClick={handleSaveBranch}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BranchList;
