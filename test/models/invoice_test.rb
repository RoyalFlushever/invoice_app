require "test_helper"

class InvoiceTest < ActiveSupport::TestCase

  setup do
    @invoice = Invoice.new(
      number: 'INV-001',
      amount: 1000.00,
      due_date: Date.today + 30.days
    )

    @invoice_two = invoices(:two)
  end

  # Test the validations of the invoice model
  test 'validations' do
    # Test the presence of the invoice attributes
    assert @invoice.valid?
    assert_not @invoice.errors[:number].any?
    assert_not @invoice.errors[:amount].any?
    assert_not @invoice.errors[:due_date].any?

    # Test the uniquness of the invoice number
    @invoice.save
    @duplicated_invoice = Invoice.new(number: 'INV-001')
    assert_not @duplicated_invoice.valid?
    assert @duplicated_invoice.errors[:number].any?

    # Test the numericality of the invoice amount
    @invalid_invoice = Invoice.new(amount: -100)
    assert_not @invalid_invoice.valid?
    assert @invalid_invoice.errors[:amount].any?

    # Test the comparison of the invoice due date
    @invalid_invoice = Invoice.new(due_date: Date.today - 1.day)
    assert_not @invalid_invoice.valid?
    assert @invalid_invoice.errors[:due_date].any?

    # Test the presence of the invoice scan
    @invoice.scan.attach(io: File.open(Rails.root.join('test', 'fixtures', 'files', 'invoice.pdf')), filename: 'invoice.pdf')
    assert @invoice.valid?
    assert_not @invoice.errors[:scan].any?

    # Test the content type of the invoice scan
    @invoice.scan.attach(io: File.open(Rails.root.join('test', 'fixtures', 'files', 'invalid.txt')), filename: 'invalid.txt')
    assert_not @invoice.valid?
    assert @invoice.errors[:scan].any?
    assert_equal "must be an image or pdf file", @invoice.errors[:scan].first
  end

  # Test the state machine of the invoice model
  test 'state machine' do
    # Test the initial state of a new invoice
    assert_equal :created, @invoice.status.to_sym

    # Test the transitions of the invoice state
    @invoice.scan.attach(io: File.open(Rails.root.join('test', 'fixtures', 'files', 'invoice.pdf')), filename: 'invoice.pdf')
    @invoice.approve!
    assert_equal :approved, @invoice.status.to_sym

    @invoice.purchase!
    assert_equal :purchased, @invoice.status.to_sym

    @invoice.close!
    assert_equal :closed, @invoice.status.to_sym

    @invoice_two.scan.attach(io: File.open(Rails.root.join('test', 'fixtures', 'files', 'invoice.pdf')), filename: 'invoice.pdf')
    @invoice_two.reject!
    assert_equal :rejected, @invoice_two.status.to_sym

  end
end

