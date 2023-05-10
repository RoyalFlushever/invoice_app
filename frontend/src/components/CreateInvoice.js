// CreateInvoice.js
import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { useNavigate, Link } from "react-router-dom";
import { createInvoice } from "../api/InvoiceAPI";

const CreateInvoice = () => {
  // State variables
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [invoiceDueDate, setInvoiceDueDate] = useState("");
  const [invoiceScan, setInvoiceScan] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "invoiceNumber") {
      setInvoiceNumber(value);
    } else if (name === "invoiceAmount") {
      setInvoiceAmount(value);
    } else if (name === "invoiceDueDate") {
      setInvoiceDueDate(value);
    }
  };

  // Handle file drop
  const handleDrop = (acceptedFiles) => {
    setInvoiceScan(acceptedFiles[0]);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // Create form data object
    const formData = new FormData();
    formData.append("invoice[number]", invoiceNumber);
    formData.append("invoice[amount]", invoiceAmount);
    formData.append("invoice[due_date]", invoiceDueDate);
    formData.append("invoice[scan]", invoiceScan);

    // Post form data to api
    createInvoice(formData)
      .then((response) => {
        // Reset form fields
        setInvoiceNumber("");
        setInvoiceAmount("");
        setInvoiceDueDate("");
        setInvoiceScan(null);
        // Set success message
        setMessage("Invoice created successfully.");
        // Redirect to the invoice list after 3 seconds
        setTimeout(() => {
          navigate("/");
        }, 3000);
      })
      .catch((error) => {
        // Set error message
        setError(error.message);
      });
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <h2>Create Invoice</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="invoiceNumber">Invoice #.</label>
            <input
              type="text"
              id="invoiceNumber"
              name="invoiceNumber"
              value={invoiceNumber}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="invoiceAmount">Amount</label>
            <input
              type="number"
              id="invoiceAmount"
              name="invoiceAmount"
              value={invoiceAmount}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="invoiceDueDate">Due Date</label>
            <input
              type="date"
              id="invoiceDueDate"
              name="invoiceDueDate"
              value={invoiceDueDate}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="invoiceScan">Scan</label>
            <Dropzone onDrop={handleDrop}>
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} className="dropzone">
                  <input data-testid="dropzone" {...getInputProps()} />
                  {invoiceScan ? (
                    <div className="file-info">
                      <span>{invoiceScan.name}</span>
                      <span>{(invoiceScan.size / 1024).toFixed(2)} KB</span>
                      <button
                        type="button"
                        onClick={() => setInvoiceScan(null)}
                      >
                        X
                      </button>
                    </div>
                  ) : (
                    <p className="drag-area">
                      Drag and drop a file here, or click to select a file
                    </p>
                  )}
                </div>
              )}
            </Dropzone>
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button> {" "}
          <Link to="/" className="btn btn-link">
            Back to List
          </Link>
        </form>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {message && (
        <>
          <div className="alert alert-success">{message}</div>
          {/* You can add a link to go back to the invoice list here */}
        </>
      )}
    </div>
  );
};

export default CreateInvoice;
