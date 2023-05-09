export const baseURL = "https://d70b-38-75-137-97.ngrok-free.app/api/v1";


export async function getInvoice(id) {
  try {
    const response = await fetch(`${baseURL}/invoices/${id}`);
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

export async function getAllInvoices() {
  try {
    const response = await fetch(`${baseURL}/invoices`);
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

export async function createInvoice(form_data) {
  try {
    const response = await fetch(`${baseURL}/invoices`, {
      method: "POST",
      body: form_data,
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

export async function updateInvoiceStatus(id, action) {
  try {
    const response = await fetch(`${baseURL}/invoices/${id}/${action}`, {
      method: "PUT",
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}
