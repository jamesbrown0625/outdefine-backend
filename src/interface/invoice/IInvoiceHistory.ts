export interface IInvoiceHistory {
  invoice_number?: number
  slug?: string
  freelancer_id?: number
  position?: string
  company_id?: number
  date_issued?: Date
  date_due?: Date
  date_received?: Date
  charges?: string
  other_charges?: string
  amount?: number
  invoice_type?: string
}
