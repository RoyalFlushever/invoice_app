class Api::V1::InvoicesController < ApplicationController

  # Rescue from AASM exceptions
  rescue_from AASM::InvalidTransition do |exception|
    render json: { error: exception.message }, status: :unprocessable_entity
  end

  # GET /api/v1/invoices
  def index
    @invoices = Invoice.all
    render json: @invoices
  end

  # GET /api/v1/invoices/:id
  def show
    @invoice = Invoice.find(params[:id]).as_json(methods: [:scan_filename])
    render json: @invoice
  end

  # POST /api/v1/invoices
  def create
    @invoice = Invoice.create(invoice_params)
    if @invoice.save
      render json: @invoice, status: :created
    else
      render json: @invoice.errors, status: :unprocessable_entity
    end
  end

  # PUT /api/v1/invoices/:id/approve
  def approve
    @invoice = Invoice.find(params[:id])
    if @invoice.approve!
      render json: @invoice, status: :ok
    else
      render json: @invoice.errors, message: 'hey there', status: :unprocessable_entity
    end
  end

  # PUT /api/v1/invoices/:id/reject
  def reject
    @invoice = Invoice.find(params[:id])
    if @invoice.reject!
      render json: @invoice, status: :ok
    else
      render json: @invoice.errors, status: :unprocessable_entity
    end
  end

  # PUT /api/v1/invoices/:id/purchase
  def purchase
    @invoice = Invoice.find(params[:id])
    if @invoice.purchase!
      render json: @invoice, status: :ok
    else
      render json: @invoice.errors, status: :unprocessable_entity
    end
  end

  # PUT /api/v1/invoices/:id/close
  def close
    @invoice = Invoice.find(params[:id])
    if @invoice.close!
      render json: @invoice, status: :ok
    else
      reject json: @invoice.errors, status: :unprocessable_entity
    end
  end

  private

  def invoice_params
    params.require(:invoice).permit(:number, :amount, :due_date, :scan, :status)
  end
end
