import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllInvoices } from "../api/InvoiceAPI";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState(null);

  // Fetch invoices from api
  useEffect(() => {
    getAllInvoices()
      .then((response) => {
        setInvoices(response);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  return (
    <div className="row">
      <div className="col-md-12">
        <h2>Invoice List</h2>

        {invoices.length > 0 ? (
          <>
            <Link to="/create" className="btn btn-primary mb-3">
              Create Invoice
            </Link>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Invoice #.</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{invoice.number}</td>
                    <td>${invoice.amount}</td>
                    <td>{invoice.due_date}</td>
                    <td>{invoice.status}</td>
                    <td>
                      <Link
                        to={`/invoice/${invoice.id}`}
                        className="btn btn-secondary"
                      >
                        Update
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <>
            <p>No invoices found.</p>
            <Link to="/create" className="btn btn-primary">
              Create Invoice
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;
