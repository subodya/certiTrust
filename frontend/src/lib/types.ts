export type CertificateRecord = {
  certificate_id: string;
  full_name: string;
  course?: string | null;
  course_id?: string | null;
  issue_date: string;
  completion_date?: string | null;
  enrollment_date?: string | null;
  duration?: string | null;
  institute?: string | null;
  institution_id?: string | null;
  partner_id?: string | null;
  registration_number?: string | null;
  issuing_authority?: string | null;
  date_of_birth?: string | null;
  nic_number?: string | null;
  email?: string | null;
  image_url?: string | null;
  student_photo_path?: string | null;
  institution_logo_url?: string | null;
  partner_logo_url?: string | null;
  certificate_qr_path?: string | null;
  verification_url?: string | null;
  status: "valid" | "invalid";
};

export type CertificateListItem = {
  certificate_id: string;
  full_name: string;
  course: string;
  course_id?: string | null;
  institution?: string | null;
  institution_id?: string | null;
  partner?: string | null;
  partner_id?: string | null;
  issue_date?: string | null;
  verification_url: string;
  certificate_qr_path?: string | null;
  has_qr: boolean;
  status: "valid" | "invalid";
};

export type LookupItem = {
  id: string;
  name: string;
  website_url?: string | null;
  logo_url?: string | null;
  code?: string | null;
  level?: string | null;
  is_active: boolean;
};

export type LookupCreatePayload = {
  name: string;
  website_url?: string | null;
  logo_url?: string | null;
  code?: string | null;
  level?: string | null;
  is_active?: boolean;
};

export type CertificateListParams = {
  q?: string;
  status?: "valid" | "invalid";
  course_id?: string;
  institution_id?: string;
  partner_id?: string;
  limit?: number;
  offset?: number;
};
