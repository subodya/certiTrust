from collections import defaultdict, deque
from datetime import datetime, timedelta
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routes.public import router as public_router
from .routes.admin import router as admin_router

app = FastAPI(title="CertiTrust API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Lightweight in-memory limiter placeholder for /api/verify paths.
request_history: dict[str, deque[datetime]] = defaultdict(deque)


@app.middleware("http")
async def verification_rate_limit(request: Request, call_next):
    if request.url.path.startswith("/api/verify/"):
        ip = request.client.host if request.client else "unknown"
        now = datetime.utcnow()
        queue = request_history[ip]
        cutoff = now - timedelta(minutes=1)
        while queue and queue[0] < cutoff:
            queue.popleft()
        if len(queue) >= settings.rate_limit_per_minute:
            raise HTTPException(status_code=429, detail="Too many verification requests")
        queue.append(now)
    return await call_next(request)


@app.get("/health")
def health():
    return {"ok": True}


app.include_router(public_router)
app.include_router(admin_router)
