class Invoice < ApplicationRecord
  has_one_attached :scan

  validates :number, :amount, :due_date, presence: true
  validates :number, uniqueness: true
  validates :amount, numericality: { greater_than: 0 }
  validates :due_date, comparison: { greater_than: Proc.new { Date.today } }

  validate :scan_content_type

  include AASM

  aasm column: :status do
    state :created, initial: true
    state :rejected, :approved, :purchased, :closed

    event :approve do
      transitions from: :created, to: :approved, guard: :has_invoice_scan?
    end

    event :reject do
      transitions from: :created, to: :rejected
    end

    event :purchase do
      transitions from: :approved, to: :purchased
    end

    event :close do
      transitions from: :purchased, to: :closed
    end
  end

  def scan_content_type
    if scan.attached? && !scan.content_type.in?(%w(application/pdf image/png image/jpeg))
      errors.add(:scan, 'must be an image or pdf file')
    end
  end

  def scan_filename
    scan.attached? && scan.attachment.filename
  end

  def has_invoice_scan?
    scan.attached? && (scan.content_type == 'application/pdf' || scan.content_type.start_with?('image/'))
  end
end
