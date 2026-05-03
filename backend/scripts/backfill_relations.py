from app.db import get_supabase


def get_or_create_course(sb, name: str | None):
    if not name:
        return None
    existing = sb.table("courses").select("id").eq("name", name).limit(1).execute()
    if existing.data:
        return existing.data[0]["id"]
    created = sb.table("courses").insert({"name": name, "is_active": True}).execute()
    return created.data[0]["id"] if created.data else None


def get_or_create_institution(sb, name: str | None, logo_url: str | None):
    if not name:
        return None
    existing = sb.table("institutions").select("id").eq("name", name).limit(1).execute()
    if existing.data:
        return existing.data[0]["id"]
    created = (
        sb.table("institutions")
        .insert({"name": name, "logo_url": logo_url, "is_active": True})
        .execute()
    )
    return created.data[0]["id"] if created.data else None


def get_or_create_partner(sb, name: str | None, logo_url: str | None):
    if not name:
        return None
    existing = sb.table("partners").select("id").eq("name", name).limit(1).execute()
    if existing.data:
        return existing.data[0]["id"]
    created = (
        sb.table("partners")
        .insert({"name": name, "logo_url": logo_url, "is_active": True})
        .execute()
    )
    return created.data[0]["id"] if created.data else None


def main():
    sb = get_supabase()
    records = (
        sb.table("certificates")
        .select(
            "certificate_id,course,institute,issuing_authority,course_id,institution_id,partner_id,institution_logo_url,partner_logo_url,image_url"
        )
        .execute()
    )
    updated = 0
    for record in records.data or []:
        course_id = record.get("course_id") or get_or_create_course(sb, record.get("course"))
        institution_name = record.get("institute") or record.get("issuing_authority")
        institution_id = record.get("institution_id") or get_or_create_institution(
            sb, institution_name, record.get("institution_logo_url")
        )
        partner_id = record.get("partner_id") or get_or_create_partner(
            sb, "Default Partner", record.get("partner_logo_url")
        )

        patch = {
            "course_id": course_id,
            "institution_id": institution_id,
            "partner_id": partner_id,
        }
        if record.get("image_url") and not record.get("student_photo_path"):
            patch["student_photo_path"] = record["image_url"]
        if not record.get("verification_url"):
            patch["verification_url"] = f"/info/{record['certificate_id']}"

        sb.table("certificates").update(patch).eq("certificate_id", record["certificate_id"]).execute()
        updated += 1

    print(f"Backfilled {updated} certificates")


if __name__ == "__main__":
    main()
