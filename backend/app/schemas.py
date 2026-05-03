from pydantic import BaseModel, Field, EmailStr
from typing import Literal


class CertificateBase(BaseModel):
    full_name: str = Field(min_length=2)
    course: str | None = None
    course_id: str | None = None
    issue_date: str
    completion_date: str | None = None
    enrollment_date: str | None = None
    duration: str | None = None
    institute: str | None = None
    institution_id: str | None = None
    registration_number: str | None = None
    issuing_authority: str | None = None
    partner_id: str | None = None
    date_of_birth: str | None = None
    nic_number: str | None = None
    email: EmailStr | None = None
    image_url: str | None = None
    student_photo_path: str | None = None
    institution_logo_url: str | None = None
    partner_logo_url: str | None = None
    certificate_qr_path: str | None = None
    verification_url: str | None = None
    status: Literal["valid", "invalid"] = "valid"


class CertificateCreate(CertificateBase):
    certificate_id: str = Field(min_length=3)


class CertificateUpdate(CertificateBase):
    pass


class LookupBase(BaseModel):
    name: str = Field(min_length=2)
    website_url: str | None = None
    logo_url: str | None = None
    is_active: bool = True


class CourseCreate(BaseModel):
    name: str = Field(min_length=2)
    code: str | None = None
    level: str | None = None
    is_active: bool = True


class CourseUpdate(CourseCreate):
    pass


class InstitutionCreate(LookupBase):
    pass


class InstitutionUpdate(LookupBase):
    pass


class PartnerCreate(LookupBase):
    pass


class PartnerUpdate(LookupBase):
    pass


class SettingUpdate(BaseModel):
    key: str = Field(min_length=1)
    value: dict | list | str | int | float | bool | None


class UploadSignRequest(BaseModel):
    bucket: Literal["student-photos", "brand-assets", "certificate-qr"]
    file_name: str = Field(min_length=3)
    content_type: str = Field(min_length=3)


class UploadFileRequest(BaseModel):
    file_base64: str = Field(min_length=3)
    content_type: str = "application/octet-stream"
