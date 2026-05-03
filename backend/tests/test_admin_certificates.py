from fastapi.testclient import TestClient
from app.main import app


client = TestClient(app)


def test_admin_requires_token():
    response = client.get("/api/admin/certificates")
    assert response.status_code == 401


def test_admin_filters_require_token():
    response = client.get(
        "/api/admin/certificates?q=ABC&status=valid&limit=10&offset=0"
    )
    assert response.status_code == 401


def test_admin_qr_generation_requires_token():
    response = client.post("/api/admin/certificates/ABC123/qr")
    assert response.status_code == 401


def test_lookup_crud_requires_token():
    response = client.post("/api/admin/courses", json={"name": "Course A", "is_active": True})
    assert response.status_code == 401
