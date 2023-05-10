// src/App.test.js
import React from 'react';
import { render, screen, waitFor, fireEvent, getByTestId } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Router, RouterProvider, createMemoryRouter } from 'react-router-dom';
import App from './App';
import InvoiceDetail from './components/InvoiceDetail';

const baseURL = "http://localhost:3000/api/v1";

global.fetch = jest.fn();

describe('App', () => {
  beforeEach(() => {
    fetch.mockResolvedValue({
      json: () =>
        Promise.resolve([
          {
            id: 1,
            number: 'INV-001',
            amount: 1000,
            due_date: '2023-05-31',
            status: 'created',
          },
          {
            id: 2,
            number: 'INV-002',
            amount: 2000,
            due_date: '2023-06-30',
            status: 'approved',
          },
        ]),
    });
  });

  afterEach(() => {
    fetch.mockReset();
  });

  // it('renders the app title', () => {
  //   render(
  //     <BrowserRouter>
  //       <App />
  //     </BrowserRouter>
  //   );
  //   expect(screen.getByText('Invoice Manager')).toBeInTheDocument();
  // });

  // it('fetches and displays the invoices', async () => {
  //   render(
  //     <BrowserRouter>
  //       <App />
  //     </BrowserRouter>
  //   );
  //   expect(fetch).toHaveBeenCalledWith(`${baseURL}/invoices`);
  //   // expect(fetch).toHaveBeenCalledTimes(1);
  //   await waitFor(() => screen.getByText('INV-001'));
  //   expect(screen.getByText('INV-001')).toBeInTheDocument();
  //   expect(screen.getByText('$1000')).toBeInTheDocument();
  //   expect(screen.getByText('2023-05-31')).toBeInTheDocument();
  //   expect(screen.getByText('created')).toBeInTheDocument();
  //   expect(screen.getByText('INV-002')).toBeInTheDocument();
  //   expect(screen.getByText('$2000')).toBeInTheDocument();
  //   expect(screen.getByText('2023-06-30')).toBeInTheDocument();
  //   expect(screen.getByText('approved')).toBeInTheDocument();
  // });

  // it('creates a new invoice', async () => {
  //   const file = new File(['invoice scan'], 'invoice.pdf', { type: 'application/pdf' });
  //   fetch.mockResolvedValueOnce({
  //     json: () =>
  //       Promise.resolve({
  //         id: 3,
  //         number: 'INV-003',
  //         amount: 3000,
  //         due_date: '2023-07-31',
  //         status: 'created',
  //         scan: file,
  //       }),
  //   });

  //   render(
  //     <BrowserRouter>
  //       <App />
  //     </BrowserRouter>
  //   );

  //   await userEvent.click(screen.getByText('Create Invoice'));
  //   userEvent.type(screen.getByLabelText('Invoice #.'), 'INV-003');
  //   userEvent.type(screen.getByLabelText('Amount'), '3000');
  //   userEvent.type(screen.getByLabelText('Due Date'), '2023-07-31');
  //   const fileInput = screen.getByTestId('dropzone');
  //   Object.defineProperty(fileInput, 'files', {
  //     value: [file],
  //   });
  //   fireEvent.drop(fileInput);
  //   expect(await screen.findByText('invoice.pdf')).toBeInTheDocument();
  //   userEvent.click(screen.getByText('Submit'));
  //   expect(fetch).toHaveBeenCalledWith(`${baseURL}/invoices`, expect.any(Object));
  //   await waitFor(() => screen.getByText('Invoice created successfully.'));
  //   expect(screen.getByText('Invoice created successfully.')).toBeInTheDocument();
  // });

  it('updates an invoice', async () => {
    fetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          id: 2,
          action: 'close'
        })
    });

    const routes = [
      {
        path: "/invoice/2",
        element: <InvoiceDetail />,
      }
    ]

    const router = createMemoryRouter(routes, {
      initialEntries: ["/", "/invoice/2"],
      initialIndex: 1,
    });

    render(<RouterProvider router={router} />);
    await new Promise(resolve => setTimeout(resolve, 400));
    await waitFor(() => screen.getByText('INV-002'));
    expect(screen.getByText('Close')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Close'));
    await userEvent.click(screen.getByText('Confirm'));
    expect(fetch).toHaveBeenCalledWith(`${baseURL}/invoices/2/close`, expect.any(Object));
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(screen.getByText('closed')).toBeInTheDocument();
    expect(screen.getByText('Invoice Inv-002 is closed successfully.')).toBeInTheDocument();
  });
});
