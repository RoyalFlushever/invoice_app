require "test_helper"

class Api::V1::InvoicesControllerTest < ActionDispatch::IntegrationTest
  fixtures :invoices

  setup do
    @invoice_one = invoices(:one)
    @invoice_one.scan.attach(io: File.open(Rails.root.join('test', 'fixtures', 'files', 'invoice.pdf')), filename: 'invoice.pdf')
  end

  # Test the index action
  test 'index action' do
    # Make a GET request to the invoices index action
    get '/api/v1/invoices', as: :json
    assert_response :success

    json_response = JSON.parse(response.body)

    assert_equal 3, json_response.length
    invoices.each_with_index do |invoice, index|
      assert_equal invoice.number, json_response[index]['number']
      assert_equal invoice.amount.to_s, json_response[index]['amount']
      assert_equal invoice.due_date.to_s, json_response[index]['due_date']
      assert_equal invoice.status, json_response[index]['status']
    end
  end

  # Test the show action
  test 'show action' do
    # Make a GET request to the invoices show action
    get '/api/v1/invoices/1', as: :json
    assert_response :success
    json_response = JSON.parse(response.body)

    assert_equal invoices(:one).number, json_response['number']
    assert_equal invoices(:one).amount.to_s, json_response['amount']
    assert_equal invoices(:one).due_date.to_s, json_response['due_date']
    assert_equal invoices(:one).status, json_response['status']
  end

  # Test the create action of invoices API
  test 'create action' do
    invoice_params = {
      number: 'INV-123',
      amount: 100.0,
      due_date: '2024-05-30',
      aascan: fixture_file_upload('invoice.pdf', 'application/pdf')
    }

    # Make a POST request to the invoices create action
    post '/api/v1/invoices', params: { invoice: invoice_params }, as: :json
    assert_response :created

    json_response = JSON.parse(response.body)

    assert_not_nil json_response['id']
    assert_equal 'INV-123', json_response['number']
    assert_equal '100.0', json_response['amount']
    assert_equal '2024-05-30', json_response['due_date']
    assert_equal :created, json_response['status'].to_sym

  end

  # Test the approve action of invoices API
  test 'approve action' do
    invoice = invoices(:one)
    invoice.scan.attach(io: File.open(Rails.root.join('test', 'fixtures', 'files', 'invoice.pdf')), filename: 'invoice.pdf')
    invoice.save!
    # Make a PUT request to the invoices approve action
    put '/api/v1/invoices/1/approve', as: :json
    assert_response :success

    json_response = JSON.parse(response.body)

    assert_equal invoices(:one).number, json_response['number']
    assert_equal invoices(:one).amount.to_s, json_response['amount']
    assert_equal invoices(:one).due_date.to_s, json_response['due_date']
    assert_equal :approved, json_response['status'].to_sym

    invoice.reload

    assert_equal :approved, invoice.status.to_sym
  end

  # Test the reject action of invoices API
  test 'reject action' do
    invoice = invoices(:one)
    # Make a PUT request to the invoices reject action
    put '/api/v1/invoices/1/reject', as: :json
    assert_response :success

    json_response = JSON.parse(response.body)

    assert_equal invoices(:one).number, json_response['number']
    assert_equal invoices(:one).amount.to_s, json_response['amount']
    assert_equal invoices(:one).due_date.to_s, json_response['due_date']
    assert_equal :rejected, json_response['status'].to_sym

    invoice.reload

    assert_equal :rejected, invoice.status.to_sym
  end

  # Test the purchase action of invoices API
  test 'purchase action' do
    invoice = invoices(:one)
    invoice.approve!
    # Make a PUT request to the invoices purchase action
    put '/api/v1/invoices/1/purchase', as: :json
    assert_response :success

    json_response = JSON.parse(response.body)

    assert_equal invoices(:one).number, json_response['number']
    assert_equal invoices(:one).amount.to_s, json_response['amount']
    assert_equal invoices(:one).due_date.to_s, json_response['due_date']
    assert_equal :purchased, json_response['status'].to_sym

    invoice.reload

    assert_equal :purchased, invoice.status.to_sym
  end

  test 'should not purchase invoice with status other than approved' do
    invoice = invoices(:one)
    # Make a PUT request to the invoices purchase action
    put '/api/v1/invoices/1/purchase', as: :json
    assert_response :unprocessable_entity

    json_response = JSON.parse(response.body)

    assert_match /Event 'purchase' cannot transition from 'created'/, json_response['error']
  end

  # Test the close action of invoices API
  test 'close action' do
    invoice = invoices(:one)
    invoice.approve!
    invoice.purchase!
    # Make a PUT request to the invoices close action
    put '/api/v1/invoices/1/close', as: :json
    assert_response :success

    json_response = JSON.parse(response.body)

    assert_equal invoices(:one).number, json_response['number']
    assert_equal invoices(:one).amount.to_s, json_response['amount']
    assert_equal invoices(:one).due_date.to_s, json_response['due_date']
    assert_equal :closed, json_response['status'].to_sym

    invoice.reload

    assert_equal :closed, invoice.status.to_sym
  end

  test 'should not close invoice with status other than purchased' do
    invoice = invoices(:one)
    # Make a PUT request to the invoices close action
    put '/api/v1/invoices/1/close', as: :json
    assert_response :unprocessable_entity

    json_response = JSON.parse(response.body)

    assert_match /Event 'close' cannot transition from 'created'/, json_response['error']
  end
end
