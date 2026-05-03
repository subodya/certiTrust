from fastapi import APIRouter, HTTPException
from ..db import get_supabase
from ..config import settings

router = APIRouter(prefix="/api", tags=["public"])


def _to_public_asset_url(bucket: str, value: str | None) -> str | None:
    if not value:
        return None
    if value.startswith("http://") or value.startswith("https://"):
        return value
    base = settings.supabase_url.rstrip("/")
    return f"{base}/storage/v1/object/public/{bucket}/{value.lstrip('/')}"


@router.get("/verify/{certificate_id}")
def verify_certificate(certificate_id: str):
    sb = get_supabase()
    result = (
        sb.table("certificates")
        .select("certificate_id,status")
        .eq("certificate_id", certificate_id)
        .limit(1)
        .execute()
    )
    if not result.data:
        return {"valid": False}
    return {"valid": result.data[0]["status"] == "valid"}


@router.get("/info/{certificate_id}")
def certificate_info(certificate_id: str):
    sb = get_supabase()
    result = (
        sb.table("certificates")
        .select("*,courses(name),institutions(name,logo_url),partners(name,logo_url)")
        .eq("certificate_id", certificate_id)
        .limit(1)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Certificate not found")
    row = result.data[0]
    course_rel = row.get("courses") or {}
    institution_rel = row.get("institutions") or {}
    partner_rel = row.get("partners") or {}

    # Keep response contract stable for existing frontend usage.
    row["course"] = course_rel.get("name") or row.get("course")
    row["institute"] = institution_rel.get("name") or row.get("institute")
    row["institution_logo_url"] = _to_public_asset_url(
        settings.brand_assets_bucket, institution_rel.get("logo_url") or row.get("institution_logo_url")
    )
    row["partner_logo_url"] = _to_public_asset_url(
        settings.brand_assets_bucket, partner_rel.get("logo_url") or row.get("partner_logo_url")
    )
    row["image_url"] = _to_public_asset_url(
        settings.student_photos_bucket, row.get("student_photo_path") or row.get("image_url")
    )
    return row
