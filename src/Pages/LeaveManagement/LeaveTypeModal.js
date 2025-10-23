// src/pages/LeaveTypes/LeaveTypeModal.jsx
import React from "react";
// Reusing the modal style from the reference code

function LeaveTypeModal({
  showModal,
  editingLeaveType,
  leaveTypeForm,
  handleCloseModal,
  handleFormChange,
  handleSaveLeaveType,
}) {
  if (!showModal) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        overflowY: "auto",
        padding: "1rem",
      }}
    >
      <div
        className="modal-content p-4 rounded-4 bg-white"
        style={{ width: 364, maxHeight: "90vh", overflowY: "auto" }}
      >
        <div className="d-flex justify-content-end mb-3">
          <img
            src="https://cdn-icons-png.flaticon.com/128/9068/9068699.png"
            style={{ height: 20, cursor: "pointer" }}
            onClick={handleCloseModal}
            alt="Close"
          />
        </div>

        <h5 className="mb-4">{editingLeaveType ? "Edit Leave Type" : "Add Leave Type"}</h5>

        {/* Leave Type Name */}
        <div className="mb-3">
          <label className="form-label">Leave Type Name *</label>
          <input
            type="text"
            name="leaveType"
            className="form-control"
            value={leaveTypeForm.leaveType}
            onChange={handleFormChange}
            placeholder="e.g., Annual Leave"
          />
        </div>

        {/* Max Days Per Year */}
        <div className="mb-3">
          <label className="form-label">Max Days/Year *</label>
          <input
            type="number"
            name="maxDaysPerYear"
            className="form-control"
            value={leaveTypeForm.maxDaysPerYear}
            onChange={handleFormChange}
            placeholder="e.g., 21"
            min="1"
          />
        </div>

        {/* Paid/Unpaid Status */}
        <div className="form-check mb-3">
          <input
            type="checkbox"
            name="isPaid"
            className="form-check-input"
            checked={leaveTypeForm.isPaid}
            onChange={handleFormChange}
          />
          <label className="form-check-label">Paid Leave</label>
        </div>

        {/* Color Picker for Badge/Display (Optional but good for UI) */}
        <div className="mb-3">
          <label className="form-label">Display Color</label>
          <input
            type="color"
            name="color"
            className="form-control form-control-color"
            value={leaveTypeForm.color}
            onChange={handleFormChange}
            title="Choose a color for the badge"
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            rows="3"
            value={leaveTypeForm.description}
            onChange={handleFormChange}
            placeholder="Enter a brief description of the leave type"
          ></textarea>
        </div>

        {/* Active/Inactive Status */}
        <div className="form-check mb-3">
          <input
            type="checkbox"
            name="status"
            className="form-check-input"
            checked={leaveTypeForm.status}
            onChange={handleFormChange}
          />
          <label className="form-check-label">Active</label>
        </div>

        <button className="btn btn-success w-100 mt-3" onClick={handleSaveLeaveType}>
          {editingLeaveType ? "Update" : "Submit"}
        </button>
      </div>
    </div>
  );
}

export default LeaveTypeModal;