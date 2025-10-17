import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { IoCalendarOutline, IoCloudUploadOutline } from "react-icons/io5";
import { RiAddLine } from "react-icons/ri";
import { BsTrash } from "react-icons/bs";

import { getBranchListServ } from "../../services/branch.services";
import { getDepartmentsByBranchServ } from "../../services/department.services";
import { getDesignationsByDepartmentServ } from "../../services/designation.services";
import { getDocumentTypeListServ } from "../../services/documentType.services";
import {
  getEmployeeDetailsServ,
  updateEmployeeServ,
  deleteEmployeeDocumentServ,
} from "../../services/employee.services";

const initialDocument = {
  documentType: "",
  file: null,
  fileName: "No file selected",
  expiryDate: "",
  _id: null, // to identify existing documents
};

function EditEmployee() {
  const navigate = useNavigate();
  const { id } = useParams(); // get employee id from route params

  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);

  const [basicInfo, setBasicInfo] = useState({
    fullName: "",
    employeeId: "",
    email: "",
    phoneNumber: "",
    dob: "",
    gender: "",
    profileImageFile: null,
    profileImagePreview: null,
  });

  const [employmentDetails, setEmploymentDetails] = useState({
    branch: "",
    department: "",
    designation: "",
    dateOfJoining: "",
    employmentType: "FullTime",
    employmentStatus: "Active",
    shift: "",
    attendancePolicy: "",
  });

  const [contactInfo, setContactInfo] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    emergencyName: "",
    relationship: "",
    emergencyPhoneNumber: "",
  });

  const [bankingInfo, setBankingInfo] = useState({
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    bankIdentifierCode: "",
    bankBranch: "",
    taxPayerId: "",
  });

  const [documents, setDocuments] = useState([{ ...initialDocument }]);
  const [loading, setLoading] = useState(true);

  // Load initial dropdowns
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [branchRes, docTypeRes] = await Promise.all([
          getBranchListServ({}),
          getDocumentTypeListServ({}),
        ]);
        setBranches(branchRes.data.data || []);
        setDocumentTypes(docTypeRes.data.data || []);
      } catch (err) {
        toast.error("Failed to load dropdown data");
      }
    };
    fetchDropdowns();
  }, []);

  // Fetch employee details
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await getEmployeeDetailsServ(id);
        const emp = res.data.data;

        // Basic Info
        setBasicInfo({
          fullName: emp.fullName || "",
          employeeId: emp.employeeId || "",
          email: emp.email || "",
          phoneNumber: emp.phoneNumber || "",
          dob: emp.dob ? emp.dob.split("T")[0] : "",
          gender: emp.gender || "",
          profileImageFile: null,
          profileImagePreview: emp.profileImage || null,
        });

        // Employment Details
        setEmploymentDetails({
          branch: emp.branch?._id || "",
          department: emp.department?._id || "",
          designation: emp.designation?._id || "",
          dateOfJoining: emp.dateOfJoining
            ? emp.dateOfJoining.split("T")[0]
            : "",
          employmentType: emp.employmentType || "FullTime",
          employmentStatus: emp.employmentStatus || "Active",
          shift: emp.shift || "",
          attendancePolicy: emp.attendancePolicy || "",
        });

        // Contact Info
        setContactInfo({
          addressLine1: emp.addressLine1 || "",
          addressLine2: emp.addressLine2 || "",
          city: emp.city || "",
          state: emp.state || "",
          country: emp.country || "",
          zipCode: emp.zipCode || "",
          emergencyName: emp.emergencyName || "",
          relationship: emp.relationship || "",
          emergencyPhoneNumber: emp.emergencyPhoneNumber || "",
        });

        // Banking Info
        setBankingInfo({
          bankName: emp.bankName || "",
          accountHolderName: emp.accountHolderName || "",
          accountNumber: emp.accountNumber || "",
          bankIdentifierCode: emp.bankIdentifierCode || "",
          bankBranch: emp.bankBranch || "",
          taxPayerId: emp.taxPayerId || "",
        });

        // Documents
        setDocuments(
          emp.documents?.length
            ? emp.documents.map((d) => ({
                _id: d._id,
                documentType: d.documentType?._id || "",
                expiryDate: d.expiryDate ? d.expiryDate.split("T")[0] : "",
                file: null,
                fileName: d.documentName || "Uploaded file",
              }))
            : [{ ...initialDocument }]
        );

        setLoading(false);
      } catch (err) {
        toast.error("Failed to load employee details");
        navigate("/employee-list");
      }
    };
    fetchEmployee();
  }, [id, navigate]);

  // Auto-fetch departments/designations
  useEffect(() => {
    const fetchDepts = async () => {
      if (employmentDetails.branch) {
        const res = await getDepartmentsByBranchServ(employmentDetails.branch);
        setDepartments(res.data.data || []);
      }
    };
    fetchDepts();
  }, [employmentDetails.branch]);

  useEffect(() => {
    const fetchDesigs = async () => {
      if (employmentDetails.department) {
        const res = await getDesignationsByDepartmentServ(
          employmentDetails.department
        );
        setDesignations(res.data.data || []);
      }
    };
    fetchDesigs();
  }, [employmentDetails.department]);

  const handleChange = (section, e) => {
    const { name, value, files } = e.target;
    if (section === "basicInfo" && name === "profileImageFile") {
      const file = files?.[0];
      setBasicInfo((prev) => ({
        ...prev,
        profileImageFile: file || null,
        profileImagePreview: file
          ? URL.createObjectURL(file)
          : prev.profileImagePreview,
      }));
    } else if (section === "basicInfo") {
      setBasicInfo((prev) => ({ ...prev, [name]: value }));
    } else if (section === "employmentDetails") {
      setEmploymentDetails((prev) => ({ ...prev, [name]: value }));
    } else if (section === "contactInfo") {
      setContactInfo((prev) => ({ ...prev, [name]: value }));
    } else if (section === "bankingInfo") {
      setBankingInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDocumentChange = (index, e) => {
    const { name, value, files } = e.target;
    setDocuments((prevDocs) =>
      prevDocs.map((doc, i) => {
        if (i !== index) return doc;
        if (name === "file") {
          const file = files?.[0];
          return {
            ...doc,
            file,
            fileName: file ? file.name : "No file selected",
          };
        }
        return { ...doc, [name]: value };
      })
    );
  };

  const handleRemoveDocument = async (index, documentId) => {
    if (documentId) {
      try {
        await deleteEmployeeDocumentServ(id, documentId);
        toast.success("Document deleted successfully");
      } catch {
        toast.error("Failed to delete document");
      }
    }
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddDocument = () => {
    setDocuments((prev) => [...prev, { ...initialDocument }]);
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.entries(basicInfo).forEach(([key, val]) => {
        if (key === "profileImageFile" && val) {
          formData.append("profileImage", val);
        } else if (key !== "profileImagePreview") {
          formData.append(key, val ?? "");
        }
      });

      Object.entries(employmentDetails).forEach(([key, val]) => {
        formData.append(key, val ?? "");
      });

      Object.entries(contactInfo).forEach(([key, val]) => {
        formData.append(key, val ?? "");
      });

      Object.entries(bankingInfo).forEach(([key, val]) => {
        formData.append(key, val ?? "");
      });

      const documentsMeta = documents.map((doc) => ({
        _id: doc._id || null,
        documentType: doc.documentType,
        expiryDate: doc.expiryDate,
      }));
      formData.append("documentsData", JSON.stringify(documentsMeta));
      documents.forEach((doc) => {
        if (doc.file) formData.append("documents", doc.file);
      });

      const res = await updateEmployeeServ({ id, formData });
      toast.success("Employee updated successfully!");
      navigate("/employee-list");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update employee");
    }
  };

  if (loading) return <div className="p-5 text-center">Loading...</div>;

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Hr Management" selectedItem="Employee" />
      <div className="mainContainer">
        <TopNav />
        <div className="p-lg-4 p-md-3 p-2">
          <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
            <h3 className="fw-semibold mb-0">Edit Employee</h3>
            <Link
              to="/employee-list"
              className="btn btn-outline-secondary d-flex align-items-center"
            >
              <span className="material-icons-outlined me-2">&#x2190;</span>{" "}
              Back to Employees
            </Link>
          </div>

          <form onSubmit={handleUpdateEmployee}>
            {/* Basic Info Card */}
            <div className="card shadow-sm p-4 mb-4 rounded-3 border-0">
              <h4 className="fw-bold mb-4">Basic Information</h4>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="fullName" className="form-label fw-semibold">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className="form-control"
                    value={basicInfo.fullName}
                    onChange={(e) => handleChange("basicInfo", e)}
                  />
                </div>
                <div className="col-md-6">
                  <label
                    htmlFor="employeeId"
                    className="form-label fw-semibold"
                  >
                    Employee ID <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="employeeId"
                    name="employeeId"
                    className="form-control"
                    value={basicInfo.employeeId}
                    onChange={(e) => handleChange("basicInfo", e)}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={basicInfo.email}
                    onChange={(e) => handleChange("basicInfo", e)}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="password" className="form-label fw-semibold">
                    Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    value={basicInfo.password}
                    onChange={(e) => handleChange("basicInfo", e)}
                  />
                </div>
                <div className="col-md-6">
                  <label
                    htmlFor="phoneNumber"
                    className="form-label fw-semibold"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    className="form-control"
                    value={basicInfo.phoneNumber}
                    onChange={(e) => handleChange("basicInfo", e)}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="dob" className="form-label fw-semibold">
                    Date of Birth
                  </label>
                  <div className="input-group">
                    <input
                      type="date"
                      id="dob"
                      name="dob"
                      className="form-control"
                      value={basicInfo.dob}
                      onChange={(e) => handleChange("basicInfo", e)}
                    />
                    <span className="input-group-text">
                      <IoCalendarOutline size={18} />
                    </span>
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Gender</label>
                  <div className="d-flex gap-4">
                    {["Male", "Female", "Other"].map((g) => (
                      <div className="form-check" key={g}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="gender"
                          id={g}
                          value={g}
                          checked={basicInfo.gender === g}
                          onChange={(e) => handleChange("basicInfo", e)}
                        />
                        <label className="form-check-label" htmlFor={g}>
                          {g}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Profile Image
                  </label>
                  <div
                    className="card p-3 border-0"
                    style={{ backgroundColor: "#F8FAFC" }}
                  >
                    <div className="d-flex flex-column align-items-center justify-content-center mb-3">
                      {basicInfo.profileImagePreview ? (
                        <img
                          src={basicInfo.profileImagePreview}
                          alt="Profile Preview"
                          className="rounded-circle mb-2"
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          className="rounded-circle bg-light d-flex align-items-center justify-content-center mb-2"
                          style={{
                            width: "80px",
                            height: "80px",
                            fontSize: "14px",
                            color: "#6c757d",
                          }}
                        >
                          Image
                        </div>
                      )}
                      <div
                        className="text-muted"
                        style={{ fontSize: "0.9rem" }}
                      >
                        {basicInfo.profileImageFile
                          ? basicInfo.profileImageFile.name
                          : "No image selected"}
                      </div>
                    </div>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Select profile image..."
                        value={
                          basicInfo.profileImageFile
                            ? basicInfo.profileImageFile.name
                            : ""
                        }
                        readOnly
                      />
                      <label
                        className="btn btn-outline-secondary"
                        style={{ cursor: "pointer" }}
                      >
                        <IoCloudUploadOutline size={18} className="me-2" />{" "}
                        Browse
                        <input
                          type="file"
                          name="profileImageFile"
                          accept="image/*"
                          onChange={(e) => handleChange("basicInfo", e)}
                          hidden
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Details */}
            <div className="card shadow-sm p-4 mb-4 rounded-3 border-0">
              <h4 className="fw-bold mb-4">Employment Details</h4>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="branch" className="form-label fw-semibold">
                    Branch <span className="text-danger">*</span>
                  </label>
                  <select
                    id="branch"
                    name="branch"
                    className="form-select"
                    value={employmentDetails.branch}
                    onChange={(e) => handleChange("employmentDetails", e)}
                  >
                    <option value="">Select Branch</option>
                    {branches.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.branchName || b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label
                    htmlFor="department"
                    className="form-label fw-semibold"
                  >
                    Department
                  </label>
                  <select
                    id="department"
                    name="department"
                    className="form-select"
                    disabled={!employmentDetails.branch}
                    value={employmentDetails.department}
                    onChange={(e) => handleChange("employmentDetails", e)}
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label
                    htmlFor="designation"
                    className="form-label fw-semibold"
                  >
                    Designation
                  </label>
                  <select
                    id="designation"
                    name="designation"
                    className="form-select"
                    disabled={!employmentDetails.department}
                    value={employmentDetails.designation}
                    onChange={(e) => handleChange("employmentDetails", e)}
                  >
                    <option value="">Select Designation</option>
                    {designations.map((ds) => (
                      <option key={ds._id} value={ds._id}>
                        {ds.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label
                    htmlFor="dateOfJoining"
                    className="form-label fw-semibold"
                  >
                    Date Of Joining <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type="date"
                      id="dateOfJoining"
                      name="dateOfJoining"
                      className="form-control"
                      value={employmentDetails.dateOfJoining}
                      onChange={(e) => handleChange("employmentDetails", e)}
                    />
                    <span className="input-group-text">
                      <IoCalendarOutline size={18} />
                    </span>
                  </div>
                </div>
                <div className="col-md-6">
                  <label
                    htmlFor="employmentType"
                    className="form-label fw-semibold"
                  >
                    Employment Type
                  </label>
                  <select
                    id="employmentType"
                    name="employmentType"
                    className="form-select"
                    value={employmentDetails.employmentType}
                    onChange={(e) => handleChange("employmentDetails", e)}
                  >
                    {[
                      "FullTime",
                      "PartTime",
                      "Contract",
                      "Internship",
                      "Temporary",
                    ].map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label
                    htmlFor="employmentStatus"
                    className="form-label fw-semibold"
                  >
                    Employment Status
                  </label>
                  <select
                    id="employmentStatus"
                    name="employmentStatus"
                    className="form-select"
                    value={employmentDetails.employmentStatus}
                    onChange={(e) => handleChange("employmentDetails", e)}
                  >
                    {["Active", "Inactive", "Probation", "Terminated"].map(
                      (status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="shift" className="form-label fw-semibold">
                    Shift
                  </label>
                  <select
                    id="shift"
                    name="shift"
                    className="form-select"
                    value={employmentDetails.shift}
                    onChange={(e) => handleChange("employmentDetails", e)}
                  >
                    <option value="">Select Shift</option>
                    {[
                      "Morning Shift (09:00 - 18:00)",
                      "Evening Shift (14:00 - 23:00)",
                      "Night Shift (22:00 - 07:00)",
                    ].map((shift) => (
                      <option key={shift} value={shift}>
                        {shift}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label
                    htmlFor="attendancePolicy"
                    className="form-label fw-semibold"
                  >
                    Attendance Policy
                  </label>
                  <select
                    id="attendancePolicy"
                    name="attendancePolicy"
                    className="form-select"
                    value={employmentDetails.attendancePolicy}
                    onChange={(e) => handleChange("employmentDetails", e)}
                  >
                    <option value="">Select Policy</option>
                    {[
                      "Standard Attendance Policy",
                      "Flexible Attendance Policy",
                      "Strict Attendance Policy",
                    ].map((policy) => (
                      <option key={policy} value={policy}>
                        {policy}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="card shadow-sm p-4 mb-4 rounded-3 border-0">
              <h4 className="fw-bold mb-4">Contact Information</h4>
              <div className="row g-3">
                {[
                  { name: "addressLine1", label: "Address Line 1" },
                  { name: "addressLine2", label: "Address Line 2" },
                  { name: "city", label: "City" },
                  { name: "state", label: "State / Province" },
                  { name: "country", label: "Country" },
                  { name: "zipCode", label: "Postal / Zip Code" },
                ].map(({ name, label }) => (
                  <div className="col-md-6" key={name}>
                    <label htmlFor={name} className="form-label fw-semibold">
                      {label}
                    </label>
                    <input
                      type="text"
                      id={name}
                      name={name}
                      className="form-control"
                      value={contactInfo[name]}
                      onChange={(e) => handleChange("contactInfo", e)}
                    />
                  </div>
                ))}
                <div className="col-12 mt-4">
                  <h5 className="fw-bold mb-3">Emergency Contact</h5>
                </div>
                {[
                  { name: "emergencyName", label: "Name" },
                  { name: "relationship", label: "Relationship" },
                  { name: "emergencyPhoneNumber", label: "Phone Number" },
                ].map(({ name, label }) => (
                  <div className="col-md-6" key={name}>
                    <label htmlFor={name} className="form-label fw-semibold">
                      {label}
                    </label>
                    <input
                      type="text"
                      id={name}
                      name={name}
                      className="form-control"
                      value={contactInfo[name]}
                      onChange={(e) => handleChange("contactInfo", e)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Banking Information */}
            <div className="card shadow-sm p-4 mb-4 rounded-3 border-0">
              <h4 className="fw-bold mb-4">Banking Information</h4>
              <div className="row g-3">
                {[
                  { name: "bankName", label: "Bank Name" },
                  { name: "accountHolderName", label: "Account Holder Name" },
                  { name: "accountNumber", label: "Account Number" },
                  {
                    name: "bankIdentifierCode",
                    label: "Bank Identifier Code (BIC/SWIFT)",
                  },
                  { name: "bankBranch", label: "Bank Branch" },
                  { name: "taxPayerId", label: "Tax Payer ID" },
                ].map(({ name, label }) => (
                  <div className="col-md-6" key={name}>
                    <label htmlFor={name} className="form-label fw-semibold">
                      {label}
                    </label>
                    <input
                      type="text"
                      id={name}
                      name={name}
                      className="form-control"
                      value={bankingInfo[name]}
                      onChange={(e) => handleChange("bankingInfo", e)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div className="card shadow-sm p-4 mb-4 rounded-3 border-0">
              <h4 className="fw-bold mb-4">Documents</h4>
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="border rounded-3 p-3 mb-3"
                  style={{ backgroundColor: "#F8FAFC" }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold mb-0">Document #{index + 1}</h6>
                    {documents.length > 1 && (
                      <BsTrash
                        size={18}
                        className="text-danger"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleRemoveDocument(index)}
                      />
                    )}
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Document Type <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        name="documentType"
                        value={doc.documentType}
                        onChange={(e) => handleDocumentChange(index, e)}
                      >
                        <option value="">Select Document Type</option>
                        {documentTypes.map((dt) => (
                          <option key={dt._id} value={dt._id}>
                            {dt.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        File <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="No file selected"
                          value={doc.fileName}
                          readOnly
                        />
                        <label
                          className="btn btn-outline-secondary"
                          style={{ cursor: "pointer" }}
                        >
                          <IoCloudUploadOutline size={18} className="me-2" />{" "}
                          Browse
                          <input
                            type="file"
                            name="file"
                            onChange={(e) => handleDocumentChange(index, e)}
                            hidden
                          />
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Expiry Date
                      </label>
                      <div className="input-group">
                        <input
                          type="date"
                          name="expiryDate"
                          className="form-control"
                          value={doc.expiryDate}
                          onChange={(e) => handleDocumentChange(index, e)}
                        />
                        <span className="input-group-text">
                          <IoCalendarOutline size={18} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-outline-secondary d-flex align-items-center px-3"
                onClick={handleAddDocument}
              >
                <RiAddLine size={20} className="me-1" /> Add Document
              </button>
            </div>

            {/* Action Buttons */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                onClick={() => navigate("/employee-list")}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-success px-4">
                Save Employee
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditEmployee;
