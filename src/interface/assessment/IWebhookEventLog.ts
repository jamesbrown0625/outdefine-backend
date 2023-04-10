export interface IWebhookEventLog {
  id?: number;
  webhook_event_id?: string;
  webhook_event_type?: string;
  webhook_attempt_number?: number;
  webhook_payload?: string;
}
