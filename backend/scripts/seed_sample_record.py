from app.db import get_supabase


def main():
    sb = get_supabase()
    course_name = "Japanese Language (Equivalent to N2)"
    institute_name = "MITL Campus"
    partner_name = "Default Partner"

    course = sb.table("courses").upsert(
        {"name": course_name, "code": "JP-N2", "level": "N2", "is_active": True},
        on_conflict="name",
    ).execute().data[0]
    institution = sb.table("institutions").upsert(
        {
            "name": institute_name,
            "website_url": "https://www.mitlcampus.lk/",
            "logo_url": "https://www.mitlcampus.lk/footerLogo.png",
            "is_active": True,
        },
        on_conflict="name",
    ).execute().data[0]
    partner = sb.table("partners").upsert(
        {
            "name": partner_name,
            "website_url": "https://univ-azteca.edu.mx/verify/",
            "logo_url": "https://images.crunchbase.com/image/upload/c_pad,f_auto,q_auto:eco,dpr_1/kn59p4g6jr515nx8gbox?ik-sanitizeSvg=true",
            "is_active": True,
        },
        on_conflict="name",
    ).execute().data[0]

    payload = {
        "certificate_id": "AZ0030213P",
        "full_name": "Pamunuwe Wedagedara Akila Madhusankha Wedagedara",
        "course": course_name,
        "course_id": course["id"],
        "issue_date": "2026-03-13",
        "completion_date": "2026-03-13",
        "enrollment_date": "2025-03-10",
        "duration": "12 Month",
        "institute": institute_name,
        "institution_id": institution["id"],
        "registration_number": "AZ0030213P",
        "issuing_authority": institute_name,
        "partner_id": partner["id"],
        "date_of_birth": "1996-11-29",
        "nic_number": "963340281V",
        "email": "madhusankhakakila@gmail.com",
        "status": "valid",
        "image_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        "student_photo_path": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        "institution_logo_url": institution["logo_url"],
        "partner_logo_url": partner["logo_url"],
        "verification_url": "/info/AZ0030213P",
    }
    sb.table("certificates").upsert(payload, on_conflict="certificate_id").execute()
    print("Seeded AZ0030213P")


if __name__ == "__main__":
    main()
