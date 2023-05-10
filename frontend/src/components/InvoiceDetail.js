// InvoiceDetail.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { getInvoice, updateInvoiceStatus } from "../api/InvoiceAPI";

const InvoiceDetail = () => {
  // State variables
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [showModal, setShowModal] = useState(false); // State variable to show or hide the modal
  const [action, setAction] = useState(null); // State variable to store the action to be performed

  // Get the invoice id from the url
  const { id } = useParams();

  // Fetch invoice data from api
  useEffect(() => {
    getInvoice(id)
      .then((response) => {
        debugger;
        setInvoice(response);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [id]);

  // Handle modal show
  const handleShow = (action) => {
    // Set the action state variable
    setAction(action);
    // Show the modal
    setShowModal(true);
  };

  // Handle modal close
  const handleClose = () => {
    // Reset the action state variable
    setAction(null);
    // Hide the modal
    setShowModal(false);
  };

  // Handle modal confirm
  const handleConfirm = () => {
    // Call the handleStatusChange function with the invoice id and action
    updateInvoiceStatus(invoice.id, action)
      .then((response) => {
        if(response.error) {
          setError(response.error);
        } else {
          setMessage(`Invoice ${response.number} is ${response.status} successfully.`);
          setInvoice(response);
        }
      })
    // Hide the modal
    setShowModal(false);
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <h2>Invoice Detail</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}
        {invoice ? (
          <>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th>Invoice #.</th>
                  <td>{invoice.number}</td>
                </tr>
                <tr>
                  <th>Amount</th>
                  <td>${invoice.amount}</td>
                </tr>
                <tr>
                  <th>Due Date</th>
                  <td>{invoice.due_date}</td>
                </tr>
                <tr>
                  <th>Scan</th>
                  <td>
                    {/* You can add some logic to display the invoice scan file here */}
                    {invoice.scan_filename}
                  </td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>{invoice.status}</td>
                </tr>
              </tbody>
            </table>

            {invoice.status === "created" && (
              <>
                <button
                  onClick={() => handleShow("approve")} // Call handleShow with submit action
                  className="btn btn-success btn-sm"
                >
                  Approve
                </button>{" "}
                <button
                  onClick={() => handleShow("reject")} // Call handleShow with reject action
                  className="btn btn-danger btn-sm"
                >
                  Reject
                </button>{" "}
              </>
            )}
            {invoice.status === "approved" && (
              <button
                onClick={() => handleShow("purchase")} // Call handleShow with purchase action
                className="btn btn-primary btn-sm"
              >
                Purchase
              </button>
            )}
            {invoice.status === "purchased" && (
              <button
                onClick={() => handleShow("close")} // Call handleShow with purchase action
                className="btn btn-primary btn-sm"
              >
                Close
              </button>
            )}
            {invoice.status === "rejected" && (
              <> {/* You can add more actions here */}</>
            )}
            {invoice.status === "closed" && (
              <> {/* You can add more actions here */}</>
            )} {" "}

            {/* You can add a link to go back to the invoice list here */}
            <Link to="/">Back to List</Link>

            {/* Modal component */}
            <Modal show={showModal} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Action</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to {action} this invoice?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleConfirm}>
                  Confirm
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetail;
