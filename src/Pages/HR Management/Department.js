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
  BsChevronDown,
} from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { RiAddLine } from "react-icons/ri";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { MdOutlineWorkOutline } from "react-icons/md";

import {
  getDepartmentListServ,
  addDepartmentServ,
  updateDepartmentServ,
  deleteDepartmentServ,
} from "../../services/department.services";

// ============================================
// MAIN COMPONENT
// ============================================
function DepartmentList() {
  const [list, setList] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

  const [payload, setPayload] = useState({
    searchKey: "",
    pageNo: 1,
    pageCount: 10,
    sortByField: "createdAt",
    sortByOrder: "desc",
  });

  const [departmentForm, setDepartmentForm] = useState({
    name: "",
    branch: "",
    description: "",
  });

  // ============================================
  // FETCH DEPARTMENTS
  // ============================================
  const handleGetDepartments = async () => {
    setShowSkeleton(true);
    try {
      const res = await getDepartmentListServ(payload);
      setList(res?.data?.data || []);
      setTotalRecords(res?.data?.total || 0);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to load departments");
    } finally {
      setShowSkeleton(false);
    }
  };

  useEffect(() => {
    handleGetDepartments();
  }, [payload]);

  // ============================================
  // MODAL HANDLERS
  // ============================================
  const handleOpenAddModal = () => {
    setEditingDepartment(null);
    setDepartmentForm({ name: "", branch: "", description: "" });
    setShowModal(true);
  };

  const handleOpenEditModal = (department) => {
    setEditingDepartment(department);
    setDepartmentForm({
      name: department.name || "",
      branch: department.branch?._id || "",
      description: department.description || "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDepartment(null);
    setDepartmentForm({ name: "", branch: "", description: "" });
  };

  // ============================================
  // FORM HANDLERS
  // ============================================
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setDepartmentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDepartment = async () => {
    if (!departmentForm.name || !departmentForm.branch) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      if (editingDepartment) {
        // Update API
        await updateDepartmentServ({
          _id: editingDepartment._id,
          ...departmentForm,
        });
        toast.success("Department updated successfully!");
      } else {
        // Create API
        await addDepartmentServ(departmentForm);
        toast.success("Department created successfully!");
      }

      handleCloseModal();
      handleGetDepartments();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Operation failed");
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await deleteDepartmentServ(id);
        toast.success("Department deleted successfully!");
        handleGetDepartments();
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to delete department");
      }
    }
  };

  const handleSort = (field) => {
    setPayload((prev) => ({
      ...prev,
      sortByField: field,
      sortByOrder:
        prev.sortByField === field && prev.sortByOrder === "asc" ? "desc" : "asc",
      pageNo: 1,
    }));
  };

  // Pagination
  const startIndex = (payload.pageNo - 1) * payload.pageCount;
  const endIndex = Math.min(startIndex + payload.pageCount, totalRecords);
  const totalPages = Math.ceil(totalRecords / payload.pageCount);

  // ============================================
  // RENDER UI
  // ============================================
  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Hr Management" selectedItem="Department" />
      <div className="mainContainer">
        <TopNav />

        <div className="p-lg-4 p-md-3 p-2">
          {/* Page Header */}
          <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
            <h3 className="fw-semibold mb-0">Department Management</h3>
            <button
              className="btn text-white px-3"
              style={{
                background: "#16A34A",
                borderRadius: "0.5rem",
              }}
              onClick={handleOpenAddModal}
            >
              <RiAddLine size={20} className="me-1" />
              Add Department
            </button>
          </div>

          {/* Search Bar */}
          <div className="card shadow-sm p-3 mb-4 rounded-3 border-0">
            <div className="row g-2 align-items-center">
              <div className="col-lg-8 col-md-8">
                <div className="input-group">
                  <input
                    className="form-control"
                    placeholder="Search by Name, Branch, or Description..."
                    onChange={(e) =>
                      setPayload({
                        ...payload,
                        searchKey: e.target.value,
                        pageNo: 1,
                      })
                    }
                  />
                  <button
                    className="btn text-white px-4"
                    style={{ background: "#16A34A" }}
                    onClick={handleGetDepartments}
                  >
                    <FaSearch size={16} />
                    &nbsp;Search
                  </button>
                </div>
              </div>

              {/* Per Page */}
              <div className="col-lg-4 col-md-4 d-flex justify-content-end">
                <div className="d-flex align-items-center">
                  <span className="me-2 text-muted">Per Page:</span>
                  <select
                    className="form-select"
                    value={payload.pageCount}
                    onChange={(e) =>
                      setPayload({
                        ...payload,
                        pageCount: Number(e.target.value),
                        pageNo: 1,
                      })
                    }
                    style={{ width: "auto" }}
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
          <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr style={{ background: "#F8FAFC" }}>
                      <th className="ps-4">#</th>
                      <th>
                        <div
                          className="d-flex align-items-center cursor-pointer"
                          onClick={() => handleSort("name")}
                        >
                          Name <MdOutlineWorkOutline size={14} className="ms-1" />
                          <BsChevronDown
                            size={12}
                            className={`ms-1 ${
                              payload.sortByField === "name" &&
                              payload.sortOrder === "desc"
                                ? "rotate-180"
                                : ""
                            }`}
                            style={{ transition: "transform 0.2s" }}
                          />
                        </div>
                      </th>
                      <th>
                        <div
                          className="d-flex align-items-center cursor-pointer"
                          onClick={() => handleSort("branch")}
                        >
                          Branch <HiOutlineBuildingOffice2 size={14} className="ms-1" />
                          <BsChevronDown
                            size={12}
                            className={`ms-1 ${
                              payload.sortByField === "branch" &&
                              payload.sortOrder === "desc"
                                ? "rotate-180"
                                : ""
                            }`}
                            style={{ transition: "transform 0.2s" }}
                          />
                        </div>
                      </th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Created At</th>
                      <th className="text-center pe-4">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {showSkeleton ? (
                      Array.from({ length: payload.pageCount }).map((_, i) => (
                        <tr key={i}>
                          <td className="ps-4 py-3">
                            <Skeleton width={20} />
                          </td>
                          <td>
                            <Skeleton width={120} />
                          </td>
                          <td>
                            <Skeleton width={100} />
                          </td>
                          <td>
                            <Skeleton width={250} />
                          </td>
                        </tr>
                      ))
                    ) : list.length > 0 ? (
                      list.map((department, i) => (
                        <tr key={department._id} className="border-bottom">
                          <td className="ps-4 py-3">
                            {(payload.pageNo - 1) * payload.pageCount + i + 1}
                          </td>
                          <td className="fw-semibold text-dark">
                            {department.name}
                          </td>
                          <td className="text-muted">
                            {department.branch?.branchName || "—"}
                          </td>
                          <td className="text-muted">
                            {department.description || "—"}
                          </td>
                          <td>
                            <span
                              className={`badge px-2 py-1 ${
                                department.status
                                  ? "bg-success-subtle text-success"
                                  : "bg-danger-subtle text-danger"
                              }`}
                            >
                              {department.status ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="text-muted">
                            {moment(department.createdAt).format("YYYY-MM-DD")}
                          </td>
                          <td className="text-center pe-4 py-3">
                            <BsPencil
                              size={18}
                              className="mx-2 text-warning"
                              style={{ cursor: "pointer" }}
                              title="Edit"
                              onClick={() => handleOpenEditModal(department)}
                            />
                            <BsTrash
                              size={18}
                              className="mx-2 text-danger"
                              style={{ cursor: "pointer" }}
                              title="Delete"
                              onClick={() =>
                                handleDeleteDepartment(department._id)
                              }
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

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="text-muted">
              Showing {startIndex + 1} to {endIndex} of {totalRecords} departments
            </div>
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${payload.pageNo === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() =>
                      setPayload((prev) => ({ ...prev, pageNo: prev.pageNo - 1 }))
                    }
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      payload.pageNo === page ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() =>
                        setPayload((prev) => ({ ...prev, pageNo: page }))
                      }
                    >
                      {page}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    payload.pageNo === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      setPayload((prev) => ({ ...prev, pageNo: prev.pageNo + 1 }))
                    }
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div
            className="modal fade show d-flex align-items-center justify-content-center"
            style={{
              display: "block",
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1050,
            }}
          >
            <div className="modal-dialog modal-sm modal-dialog-centered">
              <div className="modal-content rounded-4 shadow-lg border-0">
                <div className="modal-header border-0 d-flex justify-content-between px-4">
                  <h5 className="modal-title">
                    {editingDepartment ? "Edit Department" : "Add Department"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                  />
                </div>

                <div className="modal-body px-4">
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Department Name *</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={departmentForm.name}
                        onChange={handleFormChange}
                        placeholder="Enter department name"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Branch *</label>
                      <input
                        type="text"
                        name="branch"
                        className="form-control"
                        value={departmentForm.branch}
                        onChange={handleFormChange}
                        placeholder="Enter Branch ID"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        name="description"
                        className="form-control"
                        rows="3"
                        value={departmentForm.description}
                        onChange={handleFormChange}
                      ></textarea>
                    </div>
                  </form>
                </div>

                <div className="modal-footer border-0 px-4 pb-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn text-white"
                    style={{ background: "#16A34A" }}
                    onClick={handleSaveDepartment}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DepartmentList;
