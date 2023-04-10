export interface ICandidateAssessmentInfo {
  id?: number;
  email?: string;
  introduction_status?: string;
  hackerearth_status?: string;
  interview_status?: string;
  manually_passed?: boolean;

  // Admin fields
  notes_taken?: string; // JSON array format
  rating?: string; // JSON array format
  coding_skills?: string; // JSON array format
  technical_skills?: string; // JSON array format
  interview_technical_skills?: string; // JSON array format

  // Hackerearth, Record
  confirmed?: boolean;
  confirmed_type?: string;
  confirmed_id?: number;
  mcq_passed?: boolean;
  mcq_taken_count?: number;
  mcq_url?: string;

  coding_test_id?: number;
  coding_passed?: boolean;
  coding_taken_count?: number;
  coding_url?: string;

  // Cal.com Schedule Fields
  booking_uid?: string;

  /**
   * @notice unnecessary links
   */
  // portfolio_link?: string
  // recorded_video_link?: string
  // experience_summary?: string
}
