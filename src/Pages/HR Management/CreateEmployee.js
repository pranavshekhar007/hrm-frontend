import React, { useState } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import { Link, useNavigate } from "react-router-dom"; // For navigation
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment"; // For date formatting

// Icons
import { IoCalendarOutline, IoCloudUploadOutline } from "react-icons/io5";
import { RiAddLine } from "react-icons/ri";
import { BsTrash } from "react-icons/bs";
import { FaFileAlt } from "react-icons/fa"; // For generic document icon

// --- DUMMY DATA FOR SELECT DROPDOWNS ---
const dummyBranches = [
  { _id: "1", name: "Main Office" },
  { _id: "2", name: "Branch A" },
  { _id: "3", name: "Branch B" },
];
const dummyDepartments = [
  { _id: "1", name: "Information Technology" },
  { _id: "2", name: "Human Resources" },
  { _id: "3", name: "Finance & Accounting" },
];
const dummyDesignations = [
  { _id: "1", name: "Software Engineer" },
  { _id: "2", name: "HR Executive" },
  { _id: "3", name: "IT Manager" },
];
const dummyEmploymentTypes = ["Full-time", "Part-time", "Contract", "Internship"];
const dummyEmploymentStatuses = ["Active", "Inactive", "On Leave", "Terminated"];
const dummyShifts = [
  { _id: "1", name: "Morning (9 AM - 6 PM)" },
  { _id: "2", name: "Evening (2 PM - 11 PM)" },
];
const dummyAttendancePolicies = [
  { _id: "1", name: "Standard Policy" },
  { _id: "2", name: "Flexible Hours" },
];
const dummyDocumentTypes = [
  { _id: "1", name: "Experience Letter" },
  { _id: "2", name: "Address Proof" },
  { _id: "3", name: "ID Proof" },
];

const initialDocument = {
  documentType: "",
  file: null, // Stores the File object
  fileName: "No file selected", // For display
  expiryDate: "",
};

function CreateEmployee() {
  const navigate = useNavigate();

  // State for Basic Information
  const [basicInfo, setBasicInfo] = useState({
    fullName: "",
    employeeId: "",
    email: "",
    password: "",
    phoneNumber: "",
    dob: "",
    gender: "",
    profileImageFile: null,
    profileImagePreview: null, // For displaying selected image
  });

  // State for Employment Details
  const [employmentDetails, setEmploymentDetails] = useState({
    branch: "",
    department: "",
    designation: "",
    dateOfJoining: "",
    employmentType: "Full-time", // Default
    employmentStatus: "Active", // Default
    shift: "",
    attendancePolicy: "",
  });

  // State for Contact Information
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

  // State for Banking Information
  const [bankingInfo, setBankingInfo] = useState({
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    bankIdentifierCode: "",
    bankBranch: "",
    taxPayerId: "",
  });

  // State for Documents (dynamic array)
  const [documents, setDocuments] = useState([initialDocument]);

  // Handle change for basic info, employment, contact, banking
  const handleChange = (section, e) => {
    const { name, value, type, files } = e.target;

    if (section === "basicInfo" && name === "profileImageFile") {
      const file = files[0];
      if (file) {
        setBasicInfo((prev) => ({
          ...prev,
          profileImageFile: file,
          profileImagePreview: URL.createObjectURL(file),
        }));
      } else {
        setBasicInfo((prev) => ({
          ...prev,
          profileImageFile: null,
          profileImagePreview: null,
        }));
      }
    } else if (section === "basicInfo" && name === "gender") {
      setBasicInfo((prev) => ({ ...prev, gender: value }));
    } else if (section === "employmentDetails") {
      setEmploymentDetails((prev) => ({ ...prev, [name]: value }));
    } else if (section === "contactInfo") {
      setContactInfo((prev) => ({ ...prev, [name]: value }));
    } else if (section === "bankingInfo") {
      setBankingInfo((prev) => ({ ...prev, [name]: value }));
    } else {
      setBasicInfo((prev) => ({ ...prev, [name]: value })); // Default for basic info text inputs
    }
  };

  // Handle change for dynamic document fields
  const handleDocumentChange = (index, e) => {
    const { name, value, files } = e.target;
    const updatedDocuments = documents.map((doc, i) => {
      if (i === index) {
        if (name === "file") {
          const file = files[0];
          return { ...doc, file: file, fileName: file ? file.name : "No file selected" };
        }
        return { ...doc, [name]: value };
      }
      return doc;
    });
    setDocuments(updatedDocuments);
  };

  const handleAddDocument = () => {
    setDocuments((prev) => [...prev, { ...initialDocument, key: Date.now() }]); // Add key for unique rendering
  };

  const handleRemoveDocument = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveEmployee = (e) => {
    e.preventDefault();
    // In a real app, you would send all this data to your backend
    console.log({
      basicInfo,
      employmentDetails,
      contactInfo,
      bankingInfo,
      documents,
    });
    toast.success("Employee saved successfully!");
    navigate("/employees"); // Redirect after saving
  };

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Hr Management" selectedItem="Employee" />
      <div className="mainContainer">
        <TopNav />

        <div className="p-lg-4 p-md-3 p-2">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
            <h3 className="fw-semibold mb-0">Create Employee</h3>
            <Link to="/employee-list" className="btn btn-outline-secondary d-flex align-items-center">
              <span className="material-icons-outlined me-2">&#x2190;</span> Back to Employees
            </Link>
          </div>

          <form onSubmit={handleSaveEmployee}>
            {/* Basic Information */}
            <div className="card shadow-sm p-4 mb-4 rounded-3 border-0">
              <h4 className="fw-bold mb-4">Basic Information</h4>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="fullName" className="form-label fw-semibold">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    name="fullName"
                    value={basicInfo.fullName}
                    onChange={(e) => handleChange("basicInfo", e)}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="employeeId" className="form-label fw-semibold">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="employeeId"
                    name="employeeId"
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
                    className="form-control"
                    id="email"
                    name="email"
                    value={basicInfo.email}
                    onChange={(e) => handleChange("basicInfo", e)}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="password" className="form-label fw-semibold">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={basicInfo.password}
                    onChange={(e) => handleChange("basicInfo", e)}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="phoneNumber" className="form-label fw-semibold">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phoneNumber"
                    name="phoneNumber"
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
                      type="text"
                      className="form-control"
                      id="dob"
                      name="dob"
                      value={basicInfo.dob}
                      onChange={(e) => handleChange("basicInfo", e)}
                      placeholder="dd/mm/yyyy"
                    />
                    <span className="input-group-text">
                      <IoCalendarOutline size={18} />
                    </span>
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Gender</label>
                  <div className="d-flex gap-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender"
                        id="male"
                        value="Male"
                        checked={basicInfo.gender === "Male"}
                        onChange={(e) => handleChange("basicInfo", e)}
                      />
                      <label className="form-check-label" htmlFor="male">
                        Male
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender"
                        id="female"
                        value="Female"
                        checked={basicInfo.gender === "Female"}
                        onChange={(e) => handleChange("basicInfo", e)}
                      />
                      <label className="form-check-label" htmlFor="female">
                        Female
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender"
                        id="other"
                        value="Other"
                        checked={basicInfo.gender === "Other"}
                        onChange={(e) => handleChange("basicInfo", e)}
                      />
                      <label className="form-check-label" htmlFor="other">
                        Other
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="profileImage" className="form-label fw-semibold">
                    Profile Image
                  </label>
                  <div className="card p-3 border-0" style={{ backgroundColor: '#F8FAFC' }}>
                    <div className="d-flex flex-column align-items-center justify-content-center mb-3">
                      {basicInfo.profileImagePreview ? (
                        <img
                          src={basicInfo.profileImagePreview}
                          alt="Profile Preview"
                          className="rounded-circle mb-2"
                          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          className="rounded-circle bg-light d-flex align-items-center justify-content-center mb-2"
                          style={{ width: '80px', height: '80px', fontSize: '14px', color: '#6c757d' }}
                        >
                          Image
                        </div>
                      )}
                      <div className="text-muted" style={{ fontSize: '0.9rem' }}>
                        {basicInfo.profileImageFile ? basicInfo.profileImageFile.name : 'No image selected'}
                      </div>
                    </div>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Select profile image..."
                        value={basicInfo.profileImageFile ? basicInfo.profileImageFile.name : ""}
                        readOnly
                      />
                      <label className="btn btn-outline-secondary" style={{ cursor: 'pointer' }}>
                        <IoCloudUploadOutline size={18} className="me-2" /> Browse
                        <input
                          type="file"
                          id="profileImage"
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
                    Branch
                  </label>
                  <select
                    className="form-select"
                    id="branch"
                    name="branch"
                    value={employmentDetails.branch}
                    onChange={(e) => handleChange("employmentDetails", e)}
                  >
                    <option value="">Select Branch</option>
                    {dummyBranches.map((branch) => (
                      <option key={branch._id} value={branch._id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="department" className="form-label fw-semibold">
                    Department
                  </label>
                  <select
                    className="form-select"
                    id="department"
                    name="department"
                    value={employmentDetails.department}
                    onChange={(e) => handleChange("employmentDetails", e)}
                    disabled={!employmentDetails.branch} // Disable until branch is selected
                  >
                    <option value="">Select Branch First</option>
                    {dummyDepartments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="designation" className="form-label fw-semibold">
                    Designation
                  </label>
                  <select
                    className="form-select"
                    id="designation"
                    name="designation"
                    value={employmentDetails.designation}
                    onChange={(e) => handleChange("employmentDetails", e)}
                    disabled={!employmentDetails.department} // Disable until department is selected
                  >
                    <option value="">Select Department First</option>
                    {dummyDesignations.map((desig) => (
                      <option key={desig._id} value={desig._id}>
                        {desig.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="dateOfJoining" className="form-label fw-semibold">
                    Date of Joining
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      id="dateOfJoining"
                      name="dateOfJoining"
                      value={employmentDetails.dateOfJoining}
                      onChange={(e) => handleChange("employmentDetails", e)}
                      placeholder="dd/mm/yyyy"
                    />
                    <span className="input-group-text">
                      <IoCalendarOutline size={18} />
                    </span>
                  </div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="employmentType" className="form-label fw-semibold">
                    Employment Type
                  </label>
                  <select
                    className="form-select"
                    id="employmentType"
                    name="employmentType"
                    value={employmentDetails.employmentType}
                    onChange={(e) => handleChange("employmentDetails", e)}
                  >
                    {dummyEmploymentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="employmentStatus" className="form-label fw-semibold">
                    Employment Status
                  </label>
                  <select
                    className="form-select"
                    id="employmentStatus"
                    name="employmentStatus"
                    value={employmentDetails.employmentStatus}
                    onChange={(e) => handleChange("employmentDetails", e)}
                  >
                    {dummyEmploymentStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="shift" className="form-label fw-semibold">
                    Shift
                  </label>
                  <select
                    className="form-select"
                    id="shift"
                    name="shift"
                    value={employmentDetails.shift}
                    onChange={(e) => handleChange("employmentDetails", e)}
                  >
                    <option value="">Select Shift (Optional)</option>
                    {dummyShifts.map((shift) => (
                      <option key={shift._id} value={shift._id}>
                        {shift.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="attendancePolicy" className="form-label fw-semibold">
                    Attendance Policy
                  </label>
                  <select
                    className="form-select"
                    id="attendancePolicy"
                    name="attendancePolicy"
                    value={employmentDetails.attendancePolicy}
                    onChange={(e) => handleChange("employmentDetails", e)}
                  >
                    <option value="">Select Attendance Policy (Optional)</option>
                    {dummyAttendancePolicies.map((policy) => (
                      <option key={policy._id} value={policy._id}>
                        {policy.name}
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
                <div className="col-md-6">
                  <label htmlFor="addressLine1" className="form-label fw-semibold">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="addressLine1"
                    name="addressLine1"
                    value={contactInfo.addressLine1}
                    onChange={(e) => handleChange("contactInfo", e)}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="addressLine2" className="form-label fw-semibold">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="addressLine2"
                    name="addressLine2"
                    value={contactInfo.addressLine2}
                    onChange={(e) => handleChange("contactInfo", e)}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="city" className="form-label fw-semibold">
                    City
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="city"
                    name="city"
                    value={contactInfo.city}
                    onChange={(e) => handleChange("contactInfo", e)}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="state" className="form-label fw-semibold">
                    State/Province
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="state"
                    name="state"
                    value={contactInfo.state}
                    onChange={(e) => handleChange("contactInfo", e)}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="country" className="form-label fw-semibold">
                    Country
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="country"
                    name="country"
                    value={contactInfo.country}
                    onChange={(e) => handleChange("contactInfo", e)}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="zipCode" className="form-label fw-semibold">
                    Postal/Zip Code
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="zipCode"
                    name="zipCode"
                    value={contactInfo.zipCode}
                    onChange={(e) => handleChange("contactInfo", e)}
                  />
                </div>
                <div className="col-12 mt-4">
                  <h5 className="fw-bold mb-3">Emergency Contact</h5>
                </div>
                <div className="col-md-6">
                  <label htmlFor="emergencyName" className="form-label fw-semibold">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="emergencyName"
                    name="emergencyName"
                    value={contactInfo.emergencyName}
                    onChange={(e) => handleChange("contactInfo", e)}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="relationship" className="form-label fw-semibold">
                    Relationship
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="relationship"
                    name="relationship"
                    value={contactInfo.relationship}
                    onChange={(e) => handleChange("contactInfo", e)}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="emergencyPhoneNumber" className="form-label fw-semibold">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="emergencyPhoneNumber"
                    name="emergencyPhoneNumber"
                    value={contactInfo.emergencyPhoneNumber}
                    onChange={(e) => handleChange("contactInfo", e)}
                  />
                </div>
              </div>
            </div>

            {/* Banking Information */}
            <div className="card shadow-sm p-4 mb-4 rounded-3 border-0">
              <h4 className="fw-bold mb-4">Banking Information</h4>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="bankName" className="form-label fw-semibold">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="bankName"
                    name="bankName"
                    value={bankingInfo.bankName}
                    onChange={(e) => handleChange("bankingInfo", e)}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="accountHolderName" className="form-label fw-semibold">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="accountHolderName"
                    name="accountHolderName"
                    value={bankingInfo.accountHolderName}
                    onChange={(e) => handleChange("bankingInfo", e)}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="accountNumber" className="form-label fw-semibold">
                    Account Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="accountNumber"
                    name="accountNumber"
                    value={bankingInfo.accountNumber}
                    onChange={(e) => handleChange("bankingInfo", e)}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="bankIdentifierCode" className="form-label fw-semibold">
                    Bank Identifier Code (BIC/SWIFT)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="bankIdentifierCode"
                    name="bankIdentifierCode"
                    value={bankingInfo.bankIdentifierCode}
                    onChange={(e) => handleChange("bankingInfo", e)}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="bankBranch" className="form-label fw-semibold">
                    Bank Branch
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="bankBranch"
                    name="bankBranch"
                    value={bankingInfo.bankBranch}
                    onChange={(e) => handleChange("bankingInfo", e)}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="taxPayerId" className="form-label fw-semibold">
                    Tax Payer ID
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="taxPayerId"
                    name="taxPayerId"
                    value={bankingInfo.taxPayerId}
                    onChange={(e) => handleChange("bankingInfo", e)}
                  />
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="card shadow-sm p-4 mb-4 rounded-3 border-0">
              <h4 className="fw-bold mb-4">Documents</h4>

              {documents.map((doc, index) => (
                <div key={doc.key || index} className="border rounded-3 p-3 mb-3" style={{ backgroundColor: '#F8FAFC' }}>
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
                      <label htmlFor={`docType-${index}`} className="form-label fw-semibold">
                        Document Type <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        id={`docType-${index}`}
                        name="documentType"
                        value={doc.documentType}
                        onChange={(e) => handleDocumentChange(index, e)}
                      >
                        <option value="">Select Document Type</option>
                        {dummyDocumentTypes.map((type) => (
                          <option key={type._id} value={type._id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor={`docFile-${index}`} className="form-label fw-semibold">
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
                        <label className="btn btn-outline-secondary" style={{ cursor: 'pointer' }}>
                          <IoCloudUploadOutline size={18} className="me-2" /> Browse
                          <input
                            type="file"
                            id={`docFile-${index}`}
                            name="file"
                            onChange={(e) => handleDocumentChange(index, e)}
                            hidden
                          />
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor={`expiryDate-${index}`} className="form-label fw-semibold">
                        Expiry Date
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          id={`expiryDate-${index}`}
                          name="expiryDate"
                          value={doc.expiryDate}
                          onChange={(e) => handleDocumentChange(index, e)}
                          placeholder="dd/mm/yyyy"
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
                style={{ borderRadius: "0.5rem" }}
              >
                <RiAddLine size={20} className="me-1" /> Add Document
              </button>
            </div>

            {/* Action Buttons */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                onClick={() => navigate("/create-employee")}
                style={{ borderRadius: "0.5rem" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-success px-4"
                style={{ background: "#16A34A", borderRadius: "0.5rem" }}
              >
                Save Employee
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateEmployee;