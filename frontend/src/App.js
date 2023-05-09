// App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import CreateInvoice from "./components/CreateInvoice";
import InvoiceList from "./components/InvoiceList";
import InvoiceDetail from "./components/InvoiceDetail";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  return (
    <div className="container">
      <h1>Invoice Manager</h1>

      <Routes>
        <Route exact path="/" element={<InvoiceList />} />
        <Route
          path="/create"
          element={<CreateInvoice />}
        />
        <Route path="/invoice/:id" element={<InvoiceDetail />} />
      </Routes>
    </div>
  );
};
export default App;
