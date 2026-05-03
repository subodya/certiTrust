import base64
import hashlib
import hmac
import json
import time
from fastapi import Header, HTTPException, status
from .config import settings
from .db import get_supabase


def _b64url_decode(value: str) -> bytes:
    padding = "=" * ((4 - len(value) % 4) % 4)
    return base64.urlsafe_b64decode(value + padding)


def _verify_hs256(token: str, secret: str) -> dict:
    parts = token.split(".")
    if len(parts) != 3:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Malformed token")

    header_raw, payload_raw, signature_raw = parts
    signing_input = f"{header_raw}.{payload_raw}".encode("utf-8")
    expected = hmac.new(secret.encode("utf-8"), signing_input, hashlib.sha256).digest()
    provided = _b64url_decode(signature_raw)
    if not hmac.compare_digest(expected, provided):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token signature")

    payload = json.loads(_b64url_decode(payload_raw).decode("utf-8"))
    now = int(time.time())
    exp = payload.get("exp")
    if exp is not None and now >= int(exp):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    nbf = payload.get("nbf")
    if nbf is not None and now < int(nbf):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token not yet valid")
    return payload


def require_admin(authorization: str | None = Header(default=None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token")

    token = authorization.replace("Bearer ", "", 1).strip()
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    claims = {}
    if settings.supabase_jwt_secret:
        claims = _verify_hs256(token, settings.supabase_jwt_secret)

    sb = get_supabase()
    try:
        user_resp = sb.auth.get_user(token)
        user = user_resp.user
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized user") from exc

    if user is None or not getattr(user, "id", None):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    if claims and claims.get("sub") and claims["sub"] != user.id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token subject mismatch")

    admin_row = (
        sb.table("admin_users")
        .select("user_id,role,is_active")
        .eq("user_id", user.id)
        .limit(1)
        .execute()
    )
    if not admin_row.data:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")

    entry = admin_row.data[0]
    if not entry.get("is_active", False):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin user inactive")

    return token
