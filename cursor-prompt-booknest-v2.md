# Cursor AI Prompt — Booknest v2: Multi-Role Service & Booking Platform

---

## ROLE & CONTEXT

You are a senior full-stack engineer building **Booknest** — a dual-role service marketplace and booking management platform. Every authenticated user can simultaneously be a **service provider** (they onboarded a service) AND a **customer** (they linked to other services). There are no separate role types — context determines the view.

This is a **monorepo** with React + Vite (TypeScript) frontend and Python FastAPI backend connected to Microsoft SQL Server. Build this project completely — every file, every route, every component — with zero placeholder code. Every piece must work end-to-end.

---

## CORE PRODUCT CONCEPTS — READ CAREFULLY

### 1. Universal User Model
Every registered user has one account. The same account can:
- **Onboard a service** → they become a service provider and can manage bookings, customers, analytics for that service
- **Link to services** → they become a customer of those services and can see their bookings and updates

A user who runs a photography studio AND visits a salon is both a provider and a customer in the same account. The UI reflects both contexts simultaneously.

### 2. User Identity & Uniqueness
Every user has:
- A **display name** (non-unique, e.g. "Rahul Sharma")
- A **unique handle** (like GitHub usernames, e.g. `@rahul_sharma_92`) — auto-suggested on signup, editable, must be globally unique
- A **profile avatar** — either uploaded or auto-generated as an initials circle with a consistent color derived from the handle
- A **numeric user ID** (internal)

When a service provider creates a booking, they search for customers by name or handle. The handle + avatar combination provides visual uniqueness when multiple users share the same display name.

### 3. Service Onboarding
Any user can onboard a service. A service has:
- Name, category, description, cover image URL, location (city/area)
- Base price, duration, color accent
- The owner is the user who onboarded it (tracked via `owner_user_id`)

### 4. Service Categories
Services are organized into categories (Photography, Salon & Grooming, Spa & Wellness, Fitness, Education, Events, Home Services, Others). The Explore page shows all active services grouped by category.

### 5. Customer Linking
When a user "adds" a service to their account, a `user_service_links` record is created. This is the "linked services" concept:
- The user can now see that service in their **My Services** (customer view)
- The service provider can now see that user in their **Customers** list
- When creating a booking, the service provider can search from their linked customers

### 6. Bookings — Dual Visibility
When a service provider creates a booking and assigns it to a specific user (by handle/name lookup):
- The **service provider** sees it in their booking management, calendar, and analytics
- The **customer (the assigned user)** sees it in their **My Services → [ServiceName] → My Bookings** and in their personal **Calendar**

Both views update in real time via TanStack Query cache invalidation.

### 7. Customer Booking Requests (Future-ready structure, basic implementation now)
A customer can request a booking from a linked service by selecting date, start time, end time, and adding notes. The service provider sees this as a `requested` status booking and can accept (→ `confirmed`) or decline (→ `cancelled`).

### 8. Notifications / Latest Feed
Each user has a notification feed. Notifications are NOT push notifications — they are database records shown in a **Latest** page and in a topbar badge.

Notification triggers:
- Service provider creates/updates a booking for a customer → customer gets notified
- Service provider posts an offer/announcement → all linked customers of that service are notified
- Booking status changes → the other party is notified
- A user links to a service → service provider gets notified

Notifications have: `id`, `user_id` (recipient), `type` (booking_created | booking_updated | status_changed | offer_posted | new_customer_linked), `title`, `body`, `is_read`, `related_service_id`, `related_booking_id`, `created_at`

### 9. Navigation Contexts
The app has two primary navigation contexts:

**My Account (Customer View)** — what the logged-in user sees as a customer:
- Dashboard (personal overview)
- My Services (linked services list → per-service booking history)
- Calendar (personal calendar showing all bookings across all linked services)
- Latest (notification feed)
- Explore (browse and link to new services)

**My Service (Provider View)** — shown when the user has onboarded a service (accessible via sidebar toggle or dedicated section):
- Service Dashboard (metrics, today's bookings)
- Manage Bookings (full CRUD booking table)
- Customers (list of linked customers, searchable)
- Calendar (service calendar)
- Analytics (charts)
- Offers & Posts

The sidebar elegantly switches between these two contexts. If the user has no service onboarded, the provider section shows an "Onboard your service" CTA.

---

## TECH STACK

### Frontend
- **React 18** with **Vite 5**
- **TypeScript** (strict mode)
- **React Router v6** (client-side routing)
- **TanStack Query v5** (server state, caching, mutations)
- **React Hook Form + Zod** (forms and validation)
- **Framer Motion** (page transitions and micro-interactions)
- **Recharts** (analytics charts)
- **Axios** (HTTP client, with interceptors)
- **date-fns** (date manipulation)
- **Lucide React** (icons)
- **CSS Variables** only — NO Tailwind, NO CSS-in-JS, NO styled-components

### Backend
- **Python 3.12**
- **FastAPI** (REST API)
- **SQLAlchemy 2.0** (ORM, sync sessions)
- **Alembic** (migrations)
- **Pydantic v2** (schemas)
- **pyodbc** (MS SQL Server)
- **python-jose[cryptography]** (JWT tokens)
- **passlib[bcrypt]** (password hashing)
- **python-dotenv** (env config)
- **uvicorn** (ASGI server)

### Database
- **Microsoft SQL Server** (via pyodbc + SQLAlchemy)

---

## MONOREPO FOLDER STRUCTURE

```
booknest/
├── .env.example
├── .gitignore
├── README.md
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── alembic.ini
│   ├── alembic/
│   │   ├── env.py
│   │   └── versions/
│   │       └── 001_initial_schema.py
│   └── app/
│       ├── __init__.py
│       ├── config.py
│       ├── database.py
│       ├── dependencies.py          ← get_current_user, get_db
│       ├── models/
│       │   ├── __init__.py
│       │   ├── user.py
│       │   ├── service.py
│       │   ├── service_category.py
│       │   ├── user_service_link.py
│       │   ├── booking.py
│       │   ├── notification.py
│       │   └── offer.py
│       ├── schemas/
│       │   ├── __init__.py
│       │   ├── auth.py
│       │   ├── user.py
│       │   ├── service.py
│       │   ├── service_category.py
│       │   ├── user_service_link.py
│       │   ├── booking.py
│       │   ├── notification.py
│       │   ├── offer.py
│       │   └── analytics.py
│       ├── routers/
│       │   ├── __init__.py
│       │   ├── auth.py
│       │   ├── users.py
│       │   ├── services.py
│       │   ├── service_categories.py
│       │   ├── user_service_links.py
│       │   ├── bookings.py
│       │   ├── notifications.py
│       │   ├── offers.py
│       │   └── analytics.py
│       └── utils/
│           ├── __init__.py
│           ├── auth_helpers.py
│           └── date_helpers.py
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── vite.config.ts
    ├── .env.example
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── index.css
        ├── api/
        │   ├── axios.ts
        │   ├── auth.ts
        │   ├── users.ts
        │   ├── services.ts
        │   ├── serviceCategories.ts
        │   ├── userServiceLinks.ts
        │   ├── bookings.ts
        │   ├── notifications.ts
        │   ├── offers.ts
        │   └── analytics.ts
        ├── components/
        │   ├── layout/
        │   │   ├── AppLayout.tsx
        │   │   ├── Sidebar.tsx         ← dual-context sidebar
        │   │   └── Topbar.tsx
        │   ├── ui/
        │   │   ├── Button.tsx
        │   │   ├── Badge.tsx
        │   │   ├── Input.tsx
        │   │   ├── Select.tsx
        │   │   ├── Textarea.tsx
        │   │   ├── Modal.tsx
        │   │   ├── Drawer.tsx
        │   │   ├── Card.tsx
        │   │   ├── MetricCard.tsx
        │   │   ├── Avatar.tsx          ← initials avatar with handle-derived color
        │   │   ├── Spinner.tsx
        │   │   ├── EmptyState.tsx
        │   │   └── NotificationBadge.tsx
        │   ├── calendar/
        │   │   ├── CalendarGrid.tsx
        │   │   └── DayPanel.tsx
        │   ├── bookings/
        │   │   ├── BookingCard.tsx
        │   │   ├── BookingForm.tsx
        │   │   ├── BookingDrawer.tsx
        │   │   └── BookingTable.tsx
        │   ├── services/
        │   │   ├── ServiceCard.tsx     ← explore grid card
        │   │   ├── ServiceForm.tsx     ← onboard/edit service
        │   │   └── ServiceDrawer.tsx   ← service detail slide-in
        │   └── notifications/
        │       └── NotificationItem.tsx
        ├── context/
        │   └── AuthContext.tsx         ← auth state, current user, token
        ├── hooks/
        │   ├── useAuth.ts
        │   ├── useBookings.ts
        │   ├── useServices.ts
        │   ├── useServiceCategories.ts
        │   ├── useUserServiceLinks.ts
        │   ├── useNotifications.ts
        │   ├── useOffers.ts
        │   └── useAnalytics.ts
        ├── pages/
        │   ├── auth/
        │   │   ├── LoginPage.tsx
        │   │   └── RegisterPage.tsx
        │   ├── customer/
        │   │   ├── DashboardPage.tsx
        │   │   ├── MyServicesPage.tsx
        │   │   ├── ServiceDetailPage.tsx   ← /my-services/:linkId
        │   │   ├── CalendarPage.tsx
        │   │   ├── ExplorePage.tsx
        │   │   └── LatestPage.tsx
        │   └── provider/
        │       ├── ProviderDashboardPage.tsx
        │       ├── ManageBookingsPage.tsx
        │       ├── CustomersPage.tsx
        │       ├── ProviderCalendarPage.tsx
        │       ├── AnalyticsPage.tsx
        │       ├── OffersPage.tsx
        │       └── OnboardServicePage.tsx
        ├── types/
        │   └── index.ts
        └── utils/
            ├── date.ts
            ├── format.ts
            └── avatar.ts               ← handle → color mapping
```

---

## DATABASE SCHEMA

### `users`
```sql
CREATE TABLE users (
  id           INT IDENTITY(1,1) PRIMARY KEY,
  handle       NVARCHAR(50)  NOT NULL UNIQUE,   -- @rahul_sharma_92
  display_name NVARCHAR(150) NOT NULL,
  email        NVARCHAR(150) NOT NULL UNIQUE,
  password_hash NVARCHAR(255) NOT NULL,
  phone        NVARCHAR(20),
  avatar_url   NVARCHAR(500),
  created_at   DATETIME2 DEFAULT GETDATE(),
  updated_at   DATETIME2 DEFAULT GETDATE()
);
```

### `service_categories`
```sql
CREATE TABLE service_categories (
  id         INT IDENTITY(1,1) PRIMARY KEY,
  name       NVARCHAR(100) NOT NULL UNIQUE,
  icon       NVARCHAR(50),               -- lucide icon name string
  color      NVARCHAR(20) DEFAULT '#3b82f6',
  sort_order INT DEFAULT 0
);
```

### `services`
```sql
CREATE TABLE services (
  id              INT IDENTITY(1,1) PRIMARY KEY,
  owner_user_id   INT NOT NULL REFERENCES users(id),
  category_id     INT NOT NULL REFERENCES service_categories(id),
  name            NVARCHAR(150) NOT NULL,
  description     NVARCHAR(1000),
  location        NVARCHAR(200),
  cover_image_url NVARCHAR(500),
  base_price      DECIMAL(10,2) DEFAULT 0,
  duration_minutes INT DEFAULT 60,
  color           NVARCHAR(20) DEFAULT '#3b82f6',
  is_active       BIT DEFAULT 1,
  created_at      DATETIME2 DEFAULT GETDATE(),
  updated_at      DATETIME2 DEFAULT GETDATE()
);
```

### `user_service_links`
```sql
CREATE TABLE user_service_links (
  id           INT IDENTITY(1,1) PRIMARY KEY,
  user_id      INT NOT NULL REFERENCES users(id),
  service_id   INT NOT NULL REFERENCES services(id),
  linked_at    DATETIME2 DEFAULT GETDATE(),
  CONSTRAINT uq_user_service UNIQUE (user_id, service_id)
);
```

### `bookings`
```sql
CREATE TABLE bookings (
  id              INT IDENTITY(1,1) PRIMARY KEY,
  service_id      INT NOT NULL REFERENCES services(id),
  customer_user_id INT REFERENCES users(id),    -- NULL if walk-in (no account)
  customer_name   NVARCHAR(150) NOT NULL,        -- display name at booking time
  customer_handle NVARCHAR(50),                  -- handle at booking time (NULL if walk-in)
  staff_name      NVARCHAR(150) NOT NULL,
  booking_date    DATE NOT NULL,
  start_time      TIME NOT NULL,
  end_time        TIME,
  status          NVARCHAR(20) NOT NULL DEFAULT 'confirmed'
                  CHECK (status IN ('requested','confirmed','pending','cancelled','no_show','completed')),
  amount          DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes           NVARCHAR(500),
  created_by_user_id INT NOT NULL REFERENCES users(id),  -- who created the booking
  created_at      DATETIME2 DEFAULT GETDATE(),
  updated_at      DATETIME2 DEFAULT GETDATE()
);
```

### `notifications`
```sql
CREATE TABLE notifications (
  id                  INT IDENTITY(1,1) PRIMARY KEY,
  recipient_user_id   INT NOT NULL REFERENCES users(id),
  type                NVARCHAR(50) NOT NULL,
  title               NVARCHAR(200) NOT NULL,
  body                NVARCHAR(500),
  is_read             BIT DEFAULT 0,
  related_service_id  INT REFERENCES services(id),
  related_booking_id  INT REFERENCES bookings(id),
  created_at          DATETIME2 DEFAULT GETDATE()
);
```

### `offers`
```sql
CREATE TABLE offers (
  id           INT IDENTITY(1,1) PRIMARY KEY,
  service_id   INT NOT NULL REFERENCES services(id),
  title        NVARCHAR(200) NOT NULL,
  body         NVARCHAR(1000) NOT NULL,
  valid_until  DATE,
  is_active    BIT DEFAULT 1,
  created_at   DATETIME2 DEFAULT GETDATE()
);
```

---

## BACKEND — FULL IMPLEMENTATION

### `backend/app/config.py`
```python
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    DB_SERVER:   str
    DB_NAME:     str
    DB_USER:     str
    DB_PASSWORD: str
    DB_DRIVER:   str  = "ODBC Driver 17 for SQL Server"
    SECRET_KEY:  str  = "change-this-secret-key-in-production"
    ALGORITHM:   str  = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7   # 7 days
    CORS_ORIGINS: List[str] = ["http://localhost:5173"]

    @property
    def database_url(self) -> str:
        driver = self.DB_DRIVER.replace(" ", "+")
        return (
            f"mssql+pyodbc://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_SERVER}/{self.DB_NAME}"
            f"?driver={driver}"
        )

    class Config:
        env_file = ".env"

settings = Settings()
```

### `backend/app/database.py`
```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from .config import settings

engine = create_engine(settings.database_url, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### `backend/app/utils/auth_helpers.py`
```python
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from ..config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(user_id: int) -> str:
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(
        {"sub": str(user_id), "exp": expire},
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )

def decode_token(token: str) -> int:
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    return int(payload["sub"])
```

### `backend/app/dependencies.py`
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from .database import get_db
from .models.user import User
from .utils.auth_helpers import decode_token
from jose import JWTError

bearer = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db),
) -> User:
    try:
        user_id = decode_token(credentials.credentials)
    except (JWTError, Exception):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user
```

### Models

**`backend/app/models/user.py`**
```python
from sqlalchemy import Column, Integer, String, DateTime, func
from ..database import Base

class User(Base):
    __tablename__ = "users"
    id            = Column(Integer, primary_key=True, index=True)
    handle        = Column(String(50),  nullable=False, unique=True, index=True)
    display_name  = Column(String(150), nullable=False)
    email         = Column(String(150), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    phone         = Column(String(20))
    avatar_url    = Column(String(500))
    created_at    = Column(DateTime, server_default=func.now())
    updated_at    = Column(DateTime, server_default=func.now(), onupdate=func.now())
```

**`backend/app/models/service_category.py`**
```python
from sqlalchemy import Column, Integer, String
from ..database import Base

class ServiceCategory(Base):
    __tablename__ = "service_categories"
    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String(100), nullable=False, unique=True)
    icon       = Column(String(50))
    color      = Column(String(20), default="#3b82f6")
    sort_order = Column(Integer, default=0)
```

**`backend/app/models/service.py`**
```python
from sqlalchemy import Column, Integer, String, Numeric, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from ..database import Base

class Service(Base):
    __tablename__ = "services"
    id               = Column(Integer, primary_key=True, index=True)
    owner_user_id    = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id      = Column(Integer, ForeignKey("service_categories.id"), nullable=False)
    name             = Column(String(150), nullable=False)
    description      = Column(String(1000))
    location         = Column(String(200))
    cover_image_url  = Column(String(500))
    base_price       = Column(Numeric(10, 2), default=0)
    duration_minutes = Column(Integer, default=60)
    color            = Column(String(20), default="#3b82f6")
    is_active        = Column(Boolean, default=True)
    created_at       = Column(DateTime, server_default=func.now())
    updated_at       = Column(DateTime, server_default=func.now(), onupdate=func.now())
    owner            = relationship("User", foreign_keys=[owner_user_id])
    category         = relationship("ServiceCategory")
```

**`backend/app/models/user_service_link.py`**
```python
from sqlalchemy import Column, Integer, DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import relationship
from ..database import Base

class UserServiceLink(Base):
    __tablename__ = "user_service_links"
    __table_args__ = (UniqueConstraint("user_id", "service_id", name="uq_user_service"),)
    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)
    linked_at  = Column(DateTime, server_default=func.now())
    user       = relationship("User")
    service    = relationship("Service")
```

**`backend/app/models/booking.py`**
```python
from sqlalchemy import Column, Integer, String, Date, Time, Numeric, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from ..database import Base

class Booking(Base):
    __tablename__ = "bookings"
    id                  = Column(Integer, primary_key=True, index=True)
    service_id          = Column(Integer, ForeignKey("services.id"), nullable=False)
    customer_user_id    = Column(Integer, ForeignKey("users.id"), nullable=True)
    customer_name       = Column(String(150), nullable=False)
    customer_handle     = Column(String(50))
    staff_name          = Column(String(150), nullable=False)
    booking_date        = Column(Date, nullable=False)
    start_time          = Column(Time, nullable=False)
    end_time            = Column(Time)
    status              = Column(String(20), default="confirmed")
    amount              = Column(Numeric(10, 2), default=0)
    notes               = Column(String(500))
    created_by_user_id  = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at          = Column(DateTime, server_default=func.now())
    updated_at          = Column(DateTime, server_default=func.now(), onupdate=func.now())
    service             = relationship("Service")
    customer_user       = relationship("User", foreign_keys=[customer_user_id])
    created_by          = relationship("User", foreign_keys=[created_by_user_id])
```

**`backend/app/models/notification.py`**
```python
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from ..database import Base

class Notification(Base):
    __tablename__ = "notifications"
    id                = Column(Integer, primary_key=True, index=True)
    recipient_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type              = Column(String(50), nullable=False)
    title             = Column(String(200), nullable=False)
    body              = Column(String(500))
    is_read           = Column(Boolean, default=False)
    related_service_id = Column(Integer, ForeignKey("services.id"), nullable=True)
    related_booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=True)
    created_at        = Column(DateTime, server_default=func.now())
    related_service   = relationship("Service")
```

**`backend/app/models/offer.py`**
```python
from sqlalchemy import Column, Integer, String, Boolean, Date, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from ..database import Base

class Offer(Base):
    __tablename__ = "offers"
    id          = Column(Integer, primary_key=True, index=True)
    service_id  = Column(Integer, ForeignKey("services.id"), nullable=False)
    title       = Column(String(200), nullable=False)
    body        = Column(String(1000), nullable=False)
    valid_until = Column(Date)
    is_active   = Column(Boolean, default=True)
    created_at  = Column(DateTime, server_default=func.now())
    service     = relationship("Service")
```

### Schemas

**`backend/app/schemas/auth.py`**
```python
from pydantic import BaseModel, EmailStr

class RegisterRequest(BaseModel):
    handle:       str          # @handle, validated: 3-30 chars, alphanumeric + underscore
    display_name: str
    email:        EmailStr
    password:     str          # min 8 chars
    phone:        str | None = None

class LoginRequest(BaseModel):
    email:    EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type:   str = "bearer"
    user:         "UserRead"

from .user import UserRead
TokenResponse.model_rebuild()
```

**`backend/app/schemas/user.py`**
```python
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserRead(BaseModel):
    id:           int
    handle:       str
    display_name: str
    email:        str
    phone:        Optional[str]
    avatar_url:   Optional[str]
    created_at:   datetime
    model_config = {"from_attributes": True}

class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    phone:        Optional[str] = None
    avatar_url:   Optional[str] = None
```

**`backend/app/schemas/service_category.py`**
```python
from pydantic import BaseModel

class ServiceCategoryRead(BaseModel):
    id:         int
    name:       str
    icon:       str | None
    color:      str
    sort_order: int
    model_config = {"from_attributes": True}
```

**`backend/app/schemas/service.py`**
```python
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from .user import UserRead
from .service_category import ServiceCategoryRead

class ServiceBase(BaseModel):
    name:             str
    category_id:      int
    description:      Optional[str]  = None
    location:         Optional[str]  = None
    cover_image_url:  Optional[str]  = None
    base_price:       float          = 0
    duration_minutes: int            = 60
    color:            str            = "#3b82f6"

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(BaseModel):
    name:             Optional[str]   = None
    category_id:      Optional[int]   = None
    description:      Optional[str]   = None
    location:         Optional[str]   = None
    cover_image_url:  Optional[str]   = None
    base_price:       Optional[float] = None
    duration_minutes: Optional[int]   = None
    color:            Optional[str]   = None
    is_active:        Optional[bool]  = None

class ServiceRead(ServiceBase):
    id:             int
    owner_user_id:  int
    is_active:      bool
    created_at:     datetime
    owner:          UserRead
    category:       ServiceCategoryRead
    model_config = {"from_attributes": True}
```

**`backend/app/schemas/user_service_link.py`**
```python
from pydantic import BaseModel
from datetime import datetime
from .service import ServiceRead
from .user import UserRead

class UserServiceLinkRead(BaseModel):
    id:         int
    user_id:    int
    service_id: int
    linked_at:  datetime
    service:    ServiceRead
    user:       UserRead
    model_config = {"from_attributes": True}

class LinkCreate(BaseModel):
    service_id: int
```

**`backend/app/schemas/booking.py`**
```python
from pydantic import BaseModel
from datetime import date, time, datetime
from typing import Optional
from .service import ServiceRead
from .user import UserRead

class BookingBase(BaseModel):
    service_id:       int
    customer_user_id: Optional[int]  = None
    customer_name:    str
    customer_handle:  Optional[str]  = None
    staff_name:       str
    booking_date:     date
    start_time:       time
    end_time:         Optional[time] = None
    status:           str            = "confirmed"
    amount:           float          = 0
    notes:            Optional[str]  = None

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BaseModel):
    customer_user_id: Optional[int]  = None
    customer_name:    Optional[str]  = None
    customer_handle:  Optional[str]  = None
    staff_name:       Optional[str]  = None
    booking_date:     Optional[date] = None
    start_time:       Optional[time] = None
    end_time:         Optional[time] = None
    status:           Optional[str]  = None
    amount:           Optional[float]= None
    notes:            Optional[str]  = None

class BookingRead(BookingBase):
    id:                 int
    service:            ServiceRead
    customer_user:      Optional[UserRead]
    created_by_user_id: int
    created_at:         datetime
    updated_at:         datetime
    model_config = {"from_attributes": True}
```

**`backend/app/schemas/notification.py`**
```python
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class NotificationRead(BaseModel):
    id:                 int
    recipient_user_id:  int
    type:               str
    title:              str
    body:               Optional[str]
    is_read:            bool
    related_service_id: Optional[int]
    related_booking_id: Optional[int]
    created_at:         datetime
    model_config = {"from_attributes": True}
```

**`backend/app/schemas/offer.py`**
```python
from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional
from .service import ServiceRead

class OfferBase(BaseModel):
    title:       str
    body:        str
    valid_until: Optional[date] = None

class OfferCreate(OfferBase):
    pass

class OfferUpdate(BaseModel):
    title:       Optional[str]  = None
    body:        Optional[str]  = None
    valid_until: Optional[date] = None
    is_active:   Optional[bool] = None

class OfferRead(OfferBase):
    id:         int
    service_id: int
    is_active:  bool
    created_at: datetime
    service:    ServiceRead
    model_config = {"from_attributes": True}
```

**`backend/app/schemas/analytics.py`**
```python
from pydantic import BaseModel
from typing import List

class DailyVolume(BaseModel):
    date:  str
    count: int

class ServiceBreakdown(BaseModel):
    service: str
    count:   int
    revenue: float
    color:   str

class StaffPerformance(BaseModel):
    staff:   str
    count:   int
    revenue: float

class AnalyticsSummary(BaseModel):
    total_bookings:    int
    confirmed_count:   int
    pending_count:     int
    cancelled_count:   int
    no_show_count:     int
    completed_count:   int
    total_revenue:     float
    unique_customers:  int
    daily_volume:      List[DailyVolume]
    service_breakdown: List[ServiceBreakdown]
    staff_performance: List[StaffPerformance]
```

### Routers

**`backend/app/routers/auth.py`**
```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from ..schemas.user import UserRead
from ..utils.auth_helpers import hash_password, verify_password, create_access_token
import re

router = APIRouter(prefix="/auth", tags=["auth"])

def validate_handle(handle: str) -> str:
    handle = handle.lstrip("@").lower()
    if not re.match(r"^[a-z0-9_]{3,30}$", handle):
        raise HTTPException(400, "Handle must be 3-30 chars: letters, numbers, underscores only")
    return handle

@router.post("/register", response_model=TokenResponse, status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    handle = validate_handle(payload.handle)
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(400, "Email already registered")
    if db.query(User).filter(User.handle == handle).first():
        raise HTTPException(400, "Handle already taken")
    user = User(
        handle=handle,
        display_name=payload.display_name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        phone=payload.phone,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token(user.id)
    return TokenResponse(access_token=token, user=UserRead.model_validate(user))

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")
    token = create_access_token(user.id)
    return TokenResponse(access_token=token, user=UserRead.model_validate(user))

@router.get("/me", response_model=UserRead)
def get_me(current_user: User = Depends(lambda: None)):
    # Injected via dependency in main.py using get_current_user
    pass
```

Note: wire `/auth/me` with `get_current_user` in `main.py` by overriding the dependency. Here is the corrected version:

```python
# Replace the /auth/me route above with:
from ..dependencies import get_current_user

@router.get("/me", response_model=UserRead)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
```

**`backend/app/routers/users.py`**
```python
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..dependencies import get_current_user
from ..models.user import User
from ..schemas.user import UserRead, UserUpdate

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/search", response_model=List[UserRead])
def search_users(
    q: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    """Search users by handle or display_name — used when creating bookings."""
    pattern = f"%{q}%"
    return (
        db.query(User)
        .filter((User.handle.ilike(pattern)) | (User.display_name.ilike(pattern)))
        .limit(10)
        .all()
    )

@router.patch("/me", response_model=UserRead)
def update_me(
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user
```

**`backend/app/routers/service_categories.py`**
```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.service_category import ServiceCategory
from ..schemas.service_category import ServiceCategoryRead

router = APIRouter(prefix="/service-categories", tags=["service_categories"])

@router.get("/", response_model=List[ServiceCategoryRead])
def get_categories(db: Session = Depends(get_db)):
    return db.query(ServiceCategory).order_by(ServiceCategory.sort_order).all()
```

**`backend/app/routers/services.py`**
```python
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from ..database import get_db
from ..dependencies import get_current_user
from ..models.service import Service
from ..models.user_service_link import UserServiceLink
from ..schemas.service import ServiceCreate, ServiceUpdate, ServiceRead

router = APIRouter(prefix="/services", tags=["services"])

def _load(service_id: int, db: Session) -> Service:
    svc = (
        db.query(Service)
        .options(joinedload(Service.owner), joinedload(Service.category))
        .filter(Service.id == service_id)
        .first()
    )
    if not svc:
        raise HTTPException(404, "Service not found")
    return svc

@router.get("/", response_model=List[ServiceRead])
def get_services(
    category_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    """Public — returns all active services for Explore page."""
    q = (
        db.query(Service)
        .options(joinedload(Service.owner), joinedload(Service.category))
        .filter(Service.is_active == True)
    )
    if category_id:
        q = q.filter(Service.category_id == category_id)
    return q.order_by(Service.name).all()

@router.get("/mine", response_model=ServiceRead)
def get_my_service(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Returns the service owned by the current user, if any."""
    svc = (
        db.query(Service)
        .options(joinedload(Service.owner), joinedload(Service.category))
        .filter(Service.owner_user_id == current_user.id)
        .first()
    )
    if not svc:
        raise HTTPException(404, "No service onboarded")
    return svc

@router.post("/", response_model=ServiceRead, status_code=201)
def create_service(
    payload: ServiceCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    existing = db.query(Service).filter(Service.owner_user_id == current_user.id).first()
    if existing:
        raise HTTPException(400, "You have already onboarded a service. Update it instead.")
    svc = Service(**payload.model_dump(), owner_user_id=current_user.id)
    db.add(svc)
    db.commit()
    db.refresh(svc)
    return _load(svc.id, db)

@router.patch("/mine", response_model=ServiceRead)
def update_my_service(
    payload: ServiceUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    svc = db.query(Service).filter(Service.owner_user_id == current_user.id).first()
    if not svc:
        raise HTTPException(404, "No service onboarded")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(svc, field, value)
    db.commit()
    return _load(svc.id, db)
```

**`backend/app/routers/user_service_links.py`**
```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from ..database import get_db
from ..dependencies import get_current_user
from ..models.user_service_link import UserServiceLink
from ..models.service import Service
from ..models.user import User
from ..models.notification import Notification
from ..schemas.user_service_link import UserServiceLinkRead, LinkCreate
from ..schemas.user import UserRead

router = APIRouter(prefix="/user-service-links", tags=["user_service_links"])

def _notify(db: Session, recipient_id: int, notif_type: str, title: str, body: str,
            service_id: int | None = None):
    db.add(Notification(
        recipient_user_id=recipient_id,
        type=notif_type,
        title=title,
        body=body,
        related_service_id=service_id,
    ))

@router.get("/my-linked-services", response_model=List[UserServiceLinkRead])
def get_my_linked_services(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(UserServiceLink)
        .options(
            joinedload(UserServiceLink.service).joinedload(Service.owner),
            joinedload(UserServiceLink.service).joinedload(Service.category),
            joinedload(UserServiceLink.user),
        )
        .filter(UserServiceLink.user_id == current_user.id)
        .all()
    )

@router.post("/", response_model=UserServiceLinkRead, status_code=201)
def link_to_service(
    payload: LinkCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    svc = db.query(Service).filter(Service.id == payload.service_id).first()
    if not svc:
        raise HTTPException(404, "Service not found")
    if svc.owner_user_id == current_user.id:
        raise HTTPException(400, "Cannot link to your own service")
    exists = db.query(UserServiceLink).filter(
        UserServiceLink.user_id == current_user.id,
        UserServiceLink.service_id == payload.service_id
    ).first()
    if exists:
        raise HTTPException(400, "Already linked to this service")

    link = UserServiceLink(user_id=current_user.id, service_id=payload.service_id)
    db.add(link)

    # Notify service owner about new customer
    _notify(
        db, svc.owner_user_id, "new_customer_linked",
        f"New customer linked: @{current_user.handle}",
        f"{current_user.display_name} (@{current_user.handle}) has added your service '{svc.name}'.",
        service_id=svc.id,
    )
    db.commit()
    db.refresh(link)

    return (
        db.query(UserServiceLink)
        .options(
            joinedload(UserServiceLink.service).joinedload(Service.owner),
            joinedload(UserServiceLink.service).joinedload(Service.category),
            joinedload(UserServiceLink.user),
        )
        .filter(UserServiceLink.id == link.id)
        .first()
    )

@router.delete("/{link_id}", status_code=204)
def unlink_service(
    link_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    link = db.query(UserServiceLink).filter(
        UserServiceLink.id == link_id,
        UserServiceLink.user_id == current_user.id,
    ).first()
    if not link:
        raise HTTPException(404, "Link not found")
    db.delete(link)
    db.commit()

@router.get("/service/{service_id}/customers", response_model=List[UserRead])
def get_service_customers(
    service_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Returns all users linked to a service owned by current_user."""
    svc = db.query(Service).filter(
        Service.id == service_id,
        Service.owner_user_id == current_user.id,
    ).first()
    if not svc:
        raise HTTPException(403, "Not your service")
    links = db.query(UserServiceLink).options(joinedload(UserServiceLink.user)).filter(
        UserServiceLink.service_id == service_id
    ).all()
    return [l.user for l in links]
```

**`backend/app/routers/bookings.py`**
```python
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from datetime import date
from ..database import get_db
from ..dependencies import get_current_user
from ..models.booking import Booking
from ..models.service import Service
from ..models.notification import Notification
from ..models.user import User
from ..schemas.booking import BookingCreate, BookingUpdate, BookingRead

router = APIRouter(prefix="/bookings", tags=["bookings"])

def _load_booking(booking_id: int, db: Session) -> Booking:
    b = (
        db.query(Booking)
        .options(
            joinedload(Booking.service).joinedload(Service.owner),
            joinedload(Booking.service).joinedload(Service.category),
            joinedload(Booking.customer_user),
            joinedload(Booking.created_by),
        )
        .filter(Booking.id == booking_id)
        .first()
    )
    if not b:
        raise HTTPException(404, "Booking not found")
    return b

def _notify(db: Session, recipient_id: int, notif_type: str, title: str, body: str,
            service_id: int | None = None, booking_id: int | None = None):
    db.add(Notification(
        recipient_user_id=recipient_id,
        type=notif_type,
        title=title,
        body=body,
        related_service_id=service_id,
        related_booking_id=booking_id,
    ))

@router.get("/provider", response_model=List[BookingRead])
def get_provider_bookings(
    booking_date: Optional[date] = Query(None),
    status:       Optional[str]  = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Returns bookings for the service owned by current_user."""
    svc = db.query(Service).filter(Service.owner_user_id == current_user.id).first()
    if not svc:
        raise HTTPException(404, "No service onboarded")
    q = (
        db.query(Booking)
        .options(
            joinedload(Booking.service).joinedload(Service.owner),
            joinedload(Booking.service).joinedload(Service.category),
            joinedload(Booking.customer_user),
            joinedload(Booking.created_by),
        )
        .filter(Booking.service_id == svc.id)
    )
    if booking_date:
        q = q.filter(Booking.booking_date == booking_date)
    if status:
        q = q.filter(Booking.status == status)
    return q.order_by(Booking.booking_date.desc(), Booking.start_time).all()

@router.get("/customer", response_model=List[BookingRead])
def get_customer_bookings(
    service_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Returns bookings where current_user is the customer."""
    q = (
        db.query(Booking)
        .options(
            joinedload(Booking.service).joinedload(Service.owner),
            joinedload(Booking.service).joinedload(Service.category),
            joinedload(Booking.customer_user),
            joinedload(Booking.created_by),
        )
        .filter(Booking.customer_user_id == current_user.id)
    )
    if service_id:
        q = q.filter(Booking.service_id == service_id)
    return q.order_by(Booking.booking_date.desc(), Booking.start_time).all()

@router.post("/", response_model=BookingRead, status_code=201)
def create_booking(
    payload: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    svc = db.query(Service).filter(Service.id == payload.service_id).first()
    if not svc:
        raise HTTPException(404, "Service not found")
    if svc.owner_user_id != current_user.id:
        raise HTTPException(403, "Not your service")

    booking = Booking(**payload.model_dump(), created_by_user_id=current_user.id)
    db.add(booking)
    db.flush()

    # Notify customer if they have an account
    if payload.customer_user_id:
        _notify(
            db,
            payload.customer_user_id,
            "booking_created",
            f"New booking at {svc.name}",
            f"A booking has been created for you on {payload.booking_date} at {payload.start_time}.",
            service_id=svc.id,
            booking_id=booking.id,
        )
    db.commit()
    return _load_booking(booking.id, db)

@router.patch("/{booking_id}", response_model=BookingRead)
def update_booking(
    booking_id: int,
    payload: BookingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(404, "Booking not found")
    svc = db.query(Service).filter(Service.id == booking.service_id).first()
    if svc.owner_user_id != current_user.id:
        raise HTTPException(403, "Not your service")

    old_status = booking.status
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(booking, field, value)
    db.flush()

    # Notify customer on status change
    if payload.status and payload.status != old_status and booking.customer_user_id:
        _notify(
            db,
            booking.customer_user_id,
            "status_changed",
            f"Booking status updated — {svc.name}",
            f"Your booking on {booking.booking_date} is now '{payload.status}'.",
            service_id=svc.id,
            booking_id=booking.id,
        )
    db.commit()
    return _load_booking(booking_id, db)

@router.delete("/{booking_id}", status_code=204)
def delete_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(404, "Booking not found")
    svc = db.query(Service).filter(Service.id == booking.service_id).first()
    if svc.owner_user_id != current_user.id:
        raise HTTPException(403, "Not your service")
    db.delete(booking)
    db.commit()
```

**`backend/app/routers/notifications.py`**
```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..dependencies import get_current_user
from ..models.notification import Notification
from ..models.user import User
from ..schemas.notification import NotificationRead

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("/", response_model=List[NotificationRead])
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Notification)
        .filter(Notification.recipient_user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .limit(50)
        .all()
    )

@router.get("/unread-count")
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    count = db.query(Notification).filter(
        Notification.recipient_user_id == current_user.id,
        Notification.is_read == False,
    ).count()
    return {"count": count}

@router.patch("/mark-all-read", status_code=204)
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db.query(Notification).filter(
        Notification.recipient_user_id == current_user.id,
        Notification.is_read == False,
    ).update({"is_read": True})
    db.commit()

@router.patch("/{notification_id}/read", status_code=204)
def mark_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.recipient_user_id == current_user.id,
    ).update({"is_read": True})
    db.commit()
```

**`backend/app/routers/offers.py`**
```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from ..database import get_db
from ..dependencies import get_current_user
from ..models.offer import Offer
from ..models.service import Service
from ..models.user_service_link import UserServiceLink
from ..models.notification import Notification
from ..models.user import User
from ..schemas.offer import OfferCreate, OfferUpdate, OfferRead

router = APIRouter(prefix="/offers", tags=["offers"])

@router.get("/feed", response_model=List[OfferRead])
def get_offer_feed(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Returns offers from services the current user is linked to."""
    linked_service_ids = [
        l.service_id for l in
        db.query(UserServiceLink).filter(UserServiceLink.user_id == current_user.id).all()
    ]
    if not linked_service_ids:
        return []
    return (
        db.query(Offer)
        .options(joinedload(Offer.service).joinedload(Service.owner),
                 joinedload(Offer.service).joinedload(Service.category))
        .filter(Offer.service_id.in_(linked_service_ids), Offer.is_active == True)
        .order_by(Offer.created_at.desc())
        .all()
    )

@router.get("/my-service", response_model=List[OfferRead])
def get_my_service_offers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    svc = db.query(Service).filter(Service.owner_user_id == current_user.id).first()
    if not svc:
        raise HTTPException(404, "No service onboarded")
    return (
        db.query(Offer)
        .options(joinedload(Offer.service).joinedload(Service.owner),
                 joinedload(Offer.service).joinedload(Service.category))
        .filter(Offer.service_id == svc.id)
        .order_by(Offer.created_at.desc())
        .all()
    )

@router.post("/", response_model=OfferRead, status_code=201)
def create_offer(
    payload: OfferCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    svc = db.query(Service).filter(Service.owner_user_id == current_user.id).first()
    if not svc:
        raise HTTPException(404, "No service onboarded")

    offer = Offer(**payload.model_dump(), service_id=svc.id)
    db.add(offer)
    db.flush()

    # Notify all linked customers
    linked = db.query(UserServiceLink).filter(UserServiceLink.service_id == svc.id).all()
    for link in linked:
        db.add(Notification(
            recipient_user_id=link.user_id,
            type="offer_posted",
            title=f"New offer from {svc.name}",
            body=payload.title,
            related_service_id=svc.id,
        ))
    db.commit()
    db.refresh(offer)
    return (
        db.query(Offer)
        .options(joinedload(Offer.service).joinedload(Service.owner),
                 joinedload(Offer.service).joinedload(Service.category))
        .filter(Offer.id == offer.id)
        .first()
    )

@router.patch("/{offer_id}", response_model=OfferRead)
def update_offer(
    offer_id: int,
    payload: OfferUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(404, "Offer not found")
    svc = db.query(Service).filter(
        Service.id == offer.service_id,
        Service.owner_user_id == current_user.id,
    ).first()
    if not svc:
        raise HTTPException(403, "Not your service")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(offer, field, value)
    db.commit()
    return (
        db.query(Offer)
        .options(joinedload(Offer.service).joinedload(Service.owner),
                 joinedload(Offer.service).joinedload(Service.category))
        .filter(Offer.id == offer_id)
        .first()
    )
```

**`backend/app/routers/analytics.py`**
```python
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date, timedelta
from ..database import get_db
from ..dependencies import get_current_user
from ..models.booking import Booking
from ..models.service import Service
from ..models.user import User
from ..schemas.analytics import AnalyticsSummary, DailyVolume, ServiceBreakdown, StaffPerformance

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/summary", response_model=AnalyticsSummary)
def get_analytics_summary(
    date_from: Optional[date] = Query(None),
    date_to:   Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    svc = db.query(Service).filter(Service.owner_user_id == current_user.id).first()
    if not svc:
        from fastapi import HTTPException
        raise HTTPException(404, "No service onboarded")

    if not date_from:
        date_from = date.today().replace(day=1)
    if not date_to:
        date_to = date.today()

    bookings = (
        db.query(Booking)
        .filter(
            Booking.service_id == svc.id,
            Booking.booking_date >= date_from,
            Booking.booking_date <= date_to,
        )
        .all()
    )

    statuses = {"confirmed": 0, "pending": 0, "cancelled": 0, "no_show": 0, "completed": 0}
    for b in bookings:
        statuses[b.status] = statuses.get(b.status, 0) + 1

    revenue = sum(float(b.amount) for b in bookings if b.status in ("confirmed", "completed"))
    unique_customers = len(set(b.customer_user_id for b in bookings if b.customer_user_id))

    daily_map: dict = {}
    for i in range((date_to - date_from).days + 1):
        daily_map[(date_from + timedelta(days=i)).isoformat()] = 0
    for b in bookings:
        daily_map[b.booking_date.isoformat()] = daily_map.get(b.booking_date.isoformat(), 0) + 1

    staff_map: dict = {}
    for b in bookings:
        if b.staff_name not in staff_map:
            staff_map[b.staff_name] = {"count": 0, "revenue": 0.0}
        staff_map[b.staff_name]["count"] += 1
        if b.status in ("confirmed", "completed"):
            staff_map[b.staff_name]["revenue"] += float(b.amount)

    return AnalyticsSummary(
        total_bookings=len(bookings),
        confirmed_count=statuses["confirmed"],
        pending_count=statuses["pending"],
        cancelled_count=statuses["cancelled"],
        no_show_count=statuses["no_show"],
        completed_count=statuses["completed"],
        total_revenue=revenue,
        unique_customers=unique_customers,
        daily_volume=[DailyVolume(date=k, count=v) for k, v in sorted(daily_map.items())],
        service_breakdown=[],   # Single-service analytics doesn't need breakdown
        staff_performance=[
            StaffPerformance(staff=k, count=v["count"], revenue=v["revenue"])
            for k, v in sorted(staff_map.items(), key=lambda x: -x[1]["revenue"])
        ],
    )
```

### `backend/main.py`
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import (
    auth, users, services, service_categories,
    user_service_links, bookings, notifications, offers, analytics,
)

app = FastAPI(title="Booknest API", version="2.0.0", docs_url="/docs")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,               prefix="/api/v1")
app.include_router(users.router,              prefix="/api/v1")
app.include_router(service_categories.router, prefix="/api/v1")
app.include_router(services.router,           prefix="/api/v1")
app.include_router(user_service_links.router, prefix="/api/v1")
app.include_router(bookings.router,           prefix="/api/v1")
app.include_router(notifications.router,      prefix="/api/v1")
app.include_router(offers.router,             prefix="/api/v1")
app.include_router(analytics.router,          prefix="/api/v1")

@app.get("/api/v1/health")
def health():
    return {"status": "ok", "version": "2.0.0"}
```

### `backend/requirements.txt`
```
fastapi==0.111.0
uvicorn[standard]==0.29.0
sqlalchemy==2.0.30
alembic==1.13.1
pyodbc==5.1.0
pydantic==2.7.1
pydantic-settings==2.2.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-dotenv==1.0.1
```

---

## ALEMBIC MIGRATION WITH SEED DATA

**`alembic/versions/001_initial_schema.py`** — create all tables + seed:

```python
"""Initial schema with seed data"""
from alembic import op
import sqlalchemy as sa
from datetime import date, timedelta

def upgrade():
    # Create tables in dependency order
    op.create_table("users",
        sa.Column("id",            sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("handle",        sa.String(50),  nullable=False, unique=True),
        sa.Column("display_name",  sa.String(150), nullable=False),
        sa.Column("email",         sa.String(150), nullable=False, unique=True),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("phone",         sa.String(20)),
        sa.Column("avatar_url",    sa.String(500)),
        sa.Column("created_at",    sa.DateTime, server_default=sa.func.now()),
        sa.Column("updated_at",    sa.DateTime, server_default=sa.func.now()),
    )
    op.create_table("service_categories",
        sa.Column("id",         sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("name",       sa.String(100), nullable=False, unique=True),
        sa.Column("icon",       sa.String(50)),
        sa.Column("color",      sa.String(20), server_default="#3b82f6"),
        sa.Column("sort_order", sa.Integer, server_default="0"),
    )
    op.create_table("services",
        sa.Column("id",               sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("owner_user_id",    sa.Integer, sa.ForeignKey("users.id"), nullable=False),
        sa.Column("category_id",      sa.Integer, sa.ForeignKey("service_categories.id"), nullable=False),
        sa.Column("name",             sa.String(150), nullable=False),
        sa.Column("description",      sa.String(1000)),
        sa.Column("location",         sa.String(200)),
        sa.Column("cover_image_url",  sa.String(500)),
        sa.Column("base_price",       sa.Numeric(10,2), server_default="0"),
        sa.Column("duration_minutes", sa.Integer, server_default="60"),
        sa.Column("color",            sa.String(20), server_default="#3b82f6"),
        sa.Column("is_active",        sa.Boolean, server_default="1"),
        sa.Column("created_at",       sa.DateTime, server_default=sa.func.now()),
        sa.Column("updated_at",       sa.DateTime, server_default=sa.func.now()),
    )
    op.create_table("user_service_links",
        sa.Column("id",         sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("user_id",    sa.Integer, sa.ForeignKey("users.id"), nullable=False),
        sa.Column("service_id", sa.Integer, sa.ForeignKey("services.id"), nullable=False),
        sa.Column("linked_at",  sa.DateTime, server_default=sa.func.now()),
        sa.UniqueConstraint("user_id", "service_id", name="uq_user_service"),
    )
    op.create_table("bookings",
        sa.Column("id",                 sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("service_id",         sa.Integer, sa.ForeignKey("services.id"), nullable=False),
        sa.Column("customer_user_id",   sa.Integer, sa.ForeignKey("users.id")),
        sa.Column("customer_name",      sa.String(150), nullable=False),
        sa.Column("customer_handle",    sa.String(50)),
        sa.Column("staff_name",         sa.String(150), nullable=False),
        sa.Column("booking_date",       sa.Date, nullable=False),
        sa.Column("start_time",         sa.Time, nullable=False),
        sa.Column("end_time",           sa.Time),
        sa.Column("status",             sa.String(20), server_default="confirmed"),
        sa.Column("amount",             sa.Numeric(10,2), server_default="0"),
        sa.Column("notes",              sa.String(500)),
        sa.Column("created_by_user_id", sa.Integer, sa.ForeignKey("users.id"), nullable=False),
        sa.Column("created_at",         sa.DateTime, server_default=sa.func.now()),
        sa.Column("updated_at",         sa.DateTime, server_default=sa.func.now()),
    )
    op.create_table("notifications",
        sa.Column("id",                 sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("recipient_user_id",  sa.Integer, sa.ForeignKey("users.id"), nullable=False),
        sa.Column("type",               sa.String(50), nullable=False),
        sa.Column("title",              sa.String(200), nullable=False),
        sa.Column("body",               sa.String(500)),
        sa.Column("is_read",            sa.Boolean, server_default="0"),
        sa.Column("related_service_id", sa.Integer, sa.ForeignKey("services.id")),
        sa.Column("related_booking_id", sa.Integer, sa.ForeignKey("bookings.id")),
        sa.Column("created_at",         sa.DateTime, server_default=sa.func.now()),
    )
    op.create_table("offers",
        sa.Column("id",          sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("service_id",  sa.Integer, sa.ForeignKey("services.id"), nullable=False),
        sa.Column("title",       sa.String(200), nullable=False),
        sa.Column("body",        sa.String(1000), nullable=False),
        sa.Column("valid_until", sa.Date),
        sa.Column("is_active",   sa.Boolean, server_default="1"),
        sa.Column("created_at",  sa.DateTime, server_default=sa.func.now()),
    )

    # ── SEED DATA ─────────────────────────────────────────────────────
    from passlib.context import CryptContext
    pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

    conn = op.get_bind()

    # Seed users — password is "Password123!" for all
    hashed = pwd.hash("Password123!")
    users_data = [
        ("priya_sharma",    "Priya Sharma",    "priya@example.com",   hashed, "9876543210"),
        ("rahul_mehta_92",  "Rahul Mehta",     "rahul@example.com",   hashed, "9123456789"),
        ("ananya_patel",    "Ananya Patel",    "ananya@example.com",  hashed, "9988776655"),
        ("vikram_nair",     "Vikram Nair",     "vikram@example.com",  hashed, "9012345678"),
        ("sneha_k",         "Sneha Kulkarni",  "sneha@example.com",   hashed, "9345678901"),
        ("arjun_singh",     "Arjun Singh",     "arjun@example.com",   hashed, "9567890123"),
        ("divya_rao",       "Divya Rao",       "divya@example.com",   hashed, "9678901234"),
        ("karan_mehta",     "Karan Mehta",     "karan@example.com",   hashed, "9789012345"),
    ]
    for handle, name, email, ph, phone in users_data:
        conn.execute(sa.text(
            "INSERT INTO users (handle, display_name, email, password_hash, phone) "
            "VALUES (:h, :n, :e, :p, :ph)"
        ), {"h": handle, "n": name, "e": email, "p": ph, "ph": phone})

    # Seed categories
    categories = [
        ("Photography",      "Camera",       "#8b5cf6", 1),
        ("Salon & Grooming", "Scissors",     "#ec4899", 2),
        ("Spa & Wellness",   "Leaf",         "#10b981", 3),
        ("Fitness",          "Dumbbell",     "#f59e0b", 4),
        ("Education",        "BookOpen",     "#3b82f6", 5),
        ("Events",           "PartyPopper",  "#f43f5e", 6),
        ("Home Services",    "Home",         "#06b6d4", 7),
        ("Others",           "Grid",         "#94a3b8", 8),
    ]
    for name, icon, color, sort in categories:
        conn.execute(sa.text(
            "INSERT INTO service_categories (name, icon, color, sort_order) "
            "VALUES (:n, :i, :c, :s)"
        ), {"n": name, "i": icon, "c": color, "s": sort})

    # Seed services — provider users: priya(1)=Photography, rahul(2)=Salon, divya(7)=Spa
    services_data = [
        (1, 1, "Priya Captures",   "Professional photography — portraits, events, weddings.", "Mumbai, Bandra",   "#8b5cf6", 5000,  120),
        (2, 2, "Rahul's Salon",    "Premium haircuts, styling, beard grooming.",               "Pune, Koregaon",   "#ec4899", 800,   60),
        (7, 3, "Divya Wellness",   "Holistic spa, massage, and relaxation therapy.",           "Nagpur, Sitabuldi","#10b981", 2200,  90),
    ]
    for owner, cat, name, desc, loc, color, price, dur in services_data:
        conn.execute(sa.text(
            "INSERT INTO services (owner_user_id, category_id, name, description, location, color, base_price, duration_minutes) "
            "VALUES (:o, :c, :n, :d, :l, :col, :p, :dur)"
        ), {"o": owner, "c": cat, "n": name, "d": desc, "l": loc, "col": color, "p": price, "dur": dur})

    # Seed user_service_links — ananya(3), vikram(4), sneha(5), arjun(6), karan(8) link to salon(service_id=2)
    # arjun(6) and karan(8) also link to spa(3), sneha(5) links to photography(1)
    links = [(3,2),(4,2),(5,2),(6,2),(8,2),(6,3),(8,3),(5,1),(3,3)]
    for uid, sid in links:
        conn.execute(sa.text(
            "INSERT INTO user_service_links (user_id, service_id) VALUES (:u, :s)"
        ), {"u": uid, "s": sid})

    # Seed bookings — spread across current month for service_id=2 (Rahul's Salon)
    today = date.today()
    start = today.replace(day=1)
    statuses = ["confirmed","confirmed","confirmed","pending","cancelled","no_show","completed"]
    staff = ["Rahul Mehta", "Karan Mehta"]
    bookings_seed = [
        (2, 3, "Ananya Patel",  "ananya_patel",  staff[0], 0,  "09:00", "10:00", "confirmed", 800,  "Regular haircut"),
        (2, 4, "Vikram Nair",   "vikram_nair",   staff[1], 2,  "10:00", "10:45", "confirmed", 500,  ""),
        (2, 5, "Sneha Kulkarni","sneha_k",       staff[0], 3,  "11:00", "12:00", "pending",   800,  ""),
        (2, 6, "Arjun Singh",   "arjun_singh",   staff[1], 5,  "09:30", "10:30", "confirmed", 800,  "Special styling"),
        (2, 8, "Karan Mehta",   "karan_mehta",   staff[0], 7,  "14:00", "14:45", "cancelled", 500,  ""),
        (2, 3, "Ananya Patel",  "ananya_patel",  staff[1], 8,  "10:00", "11:00", "completed", 800,  ""),
        (2, 4, "Vikram Nair",   "vikram_nair",   staff[0], 10, "11:30", "12:15", "confirmed", 500,  ""),
        (2, 5, "Sneha Kulkarni","sneha_k",       staff[1], 11, "09:00", "10:00", "confirmed", 800,  "Color touch-up"),
        (2, 6, "Arjun Singh",   "arjun_singh",   staff[0], 12, "14:00", "15:00", "no_show",   800,  ""),
        (2, 8, "Karan Mehta",   "karan_mehta",   staff[1], 14, "10:00", "11:00", "pending",   800,  ""),
        (3, 6, "Arjun Singh",   "arjun_singh",   "Divya Rao", 1, "10:00","11:30","confirmed", 2200, "Full body massage"),
        (3, 8, "Karan Mehta",   "karan_mehta",   "Divya Rao", 3, "14:00","15:30","confirmed", 2200, ""),
        (3, 6, "Arjun Singh",   "arjun_singh",   "Divya Rao", 8, "11:00","12:30","pending",   2200, ""),
        (1, 5, "Sneha Kulkarni","sneha_k",       "Priya Sharma",5,"09:00","11:00","confirmed", 5000, "Portrait session"),
    ]
    for sid, cuid, cname, chandle, sname, day_offset, st, et, status, amt, notes in bookings_seed:
        bdate = (start + timedelta(days=day_offset)).isoformat()
        creator = {1: 1, 2: 2, 3: 7}[sid]
        conn.execute(sa.text(
            "INSERT INTO bookings (service_id, customer_user_id, customer_name, customer_handle, "
            "staff_name, booking_date, start_time, end_time, status, amount, notes, created_by_user_id) "
            "VALUES (:sid, :cuid, :cn, :ch, :sn, :bd, :st, :et, :stat, :amt, :notes, :creator)"
        ), {"sid":sid,"cuid":cuid,"cn":cname,"ch":chandle,"sn":sname,"bd":bdate,
            "st":st,"et":et,"stat":status,"amt":amt,"notes":notes,"creator":creator})

def downgrade():
    for table in ["offers","notifications","bookings","user_service_links",
                  "services","service_categories","users"]:
        op.drop_table(table)
```

---

## FRONTEND — FULL IMPLEMENTATION

### `frontend/src/types/index.ts`
```typescript
export interface User {
  id:           number
  handle:       string      // without @
  display_name: string
  email:        string
  phone:        string | null
  avatar_url:   string | null
  created_at:   string
}

export interface ServiceCategory {
  id:         number
  name:       string
  icon:       string | null
  color:      string
  sort_order: number
}

export interface Service {
  id:               number
  owner_user_id:    number
  category_id:      number
  name:             string
  description:      string | null
  location:         string | null
  cover_image_url:  string | null
  base_price:       number
  duration_minutes: number
  color:            string
  is_active:        boolean
  created_at:       string
  owner:            User
  category:         ServiceCategory
}

export interface UserServiceLink {
  id:         number
  user_id:    number
  service_id: number
  linked_at:  string
  service:    Service
  user:       User
}

export type BookingStatus = 'requested' | 'confirmed' | 'pending' | 'cancelled' | 'no_show' | 'completed'

export interface Booking {
  id:                 number
  service_id:         number
  customer_user_id:   number | null
  customer_name:      string
  customer_handle:    string | null
  staff_name:         string
  booking_date:       string
  start_time:         string
  end_time:           string | null
  status:             BookingStatus
  amount:             number
  notes:              string | null
  created_by_user_id: number
  created_at:         string
  updated_at:         string
  service:            Service
  customer_user:      User | null
}

export interface BookingCreate {
  service_id:       number
  customer_user_id?: number
  customer_name:    string
  customer_handle?: string
  staff_name:       string
  booking_date:     string
  start_time:       string
  end_time?:        string
  status:           BookingStatus
  amount:           number
  notes?:           string
}

export interface BookingUpdate extends Partial<BookingCreate> {}

export interface Notification {
  id:                 number
  recipient_user_id:  number
  type:               string
  title:              string
  body:               string | null
  is_read:            boolean
  related_service_id: number | null
  related_booking_id: number | null
  created_at:         string
}

export interface Offer {
  id:          number
  service_id:  number
  title:       string
  body:        string
  valid_until: string | null
  is_active:   boolean
  created_at:  string
  service:     Service
}

export interface AnalyticsSummary {
  total_bookings:    number
  confirmed_count:   number
  pending_count:     number
  cancelled_count:   number
  no_show_count:     number
  completed_count:   number
  total_revenue:     number
  unique_customers:  number
  daily_volume:      { date: string; count: number }[]
  service_breakdown: { service: string; count: number; revenue: number; color: string }[]
  staff_performance: { staff: string; count: number; revenue: number }[]
}

export interface TokenResponse {
  access_token: string
  token_type:   string
  user:         User
}
```

### `frontend/src/utils/avatar.ts`
```typescript
// Derives a consistent color from a user's handle
const PALETTE = [
  '#2563eb','#7c3aed','#059669','#d97706','#dc2626',
  '#0891b2','#65a30d','#c026d3','#ea580c','#0284c7',
]

export function getAvatarColor(handle: string): string {
  let hash = 0
  for (let i = 0; i < handle.length; i++) {
    hash = handle.charCodeAt(i) + ((hash << 5) - hash)
  }
  return PALETTE[Math.abs(hash) % PALETTE.length]
}

export function getInitials(displayName: string): string {
  return displayName
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
}
```

### `frontend/src/context/AuthContext.tsx`
```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { User } from '../types'

interface AuthState {
  user:     User | null
  token:    string | null
  isLoading: boolean
}

interface AuthContextValue extends AuthState {
  login:  (user: User, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const TOKEN_KEY = 'booknest_token'
const USER_KEY  = 'booknest_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user:      null,
    token:     null,
    isLoading: true,
  })

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    const raw   = localStorage.getItem(USER_KEY)
    if (token && raw) {
      try {
        setState({ user: JSON.parse(raw), token, isLoading: false })
      } catch {
        setState({ user: null, token: null, isLoading: false })
      }
    } else {
      setState(s => ({ ...s, isLoading: false }))
    }
  }, [])

  const login = (user: User, token: string) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    setState({ user, token, isLoading: false })
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setState({ user: null, token: null, isLoading: false })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider')
  return ctx
}
```

### `frontend/src/api/axios.ts`
```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1',
  timeout: 10000,
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('booknest_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    const message = err.response?.data?.detail ?? err.message ?? 'An error occurred'
    if (err.response?.status === 401) {
      localStorage.removeItem('booknest_token')
      localStorage.removeItem('booknest_user')
      window.location.href = '/login'
    }
    return Promise.reject(new Error(message))
  }
)

export default api
```

### API modules

**`frontend/src/api/auth.ts`**
```typescript
import api from './axios'
import type { TokenResponse } from '../types'

export const authApi = {
  register: (payload: { handle: string; display_name: string; email: string; password: string; phone?: string }) =>
    api.post<TokenResponse>('/auth/register', payload).then(r => r.data),
  login: (email: string, password: string) =>
    api.post<TokenResponse>('/auth/login', { email, password }).then(r => r.data),
  me: () =>
    api.get<TokenResponse['user']>('/auth/me').then(r => r.data),
}
```

**`frontend/src/api/services.ts`**
```typescript
import api from './axios'
import type { Service } from '../types'

export const servicesApi = {
  getAll: (params?: { category_id?: number }) =>
    api.get<Service[]>('/services', { params }).then(r => r.data),
  getMine: () =>
    api.get<Service>('/services/mine').then(r => r.data),
  create: (payload: Partial<Service>) =>
    api.post<Service>('/services', payload).then(r => r.data),
  updateMine: (payload: Partial<Service>) =>
    api.patch<Service>('/services/mine', payload).then(r => r.data),
}
```

**`frontend/src/api/userServiceLinks.ts`**
```typescript
import api from './axios'
import type { UserServiceLink, User } from '../types'

export const userServiceLinksApi = {
  getMyLinkedServices: () =>
    api.get<UserServiceLink[]>('/user-service-links/my-linked-services').then(r => r.data),
  link: (service_id: number) =>
    api.post<UserServiceLink>('/user-service-links', { service_id }).then(r => r.data),
  unlink: (link_id: number) =>
    api.delete(`/user-service-links/${link_id}`),
  getServiceCustomers: (service_id: number) =>
    api.get<User[]>(`/user-service-links/service/${service_id}/customers`).then(r => r.data),
}
```

**`frontend/src/api/bookings.ts`**
```typescript
import api from './axios'
import type { Booking, BookingCreate, BookingUpdate } from '../types'

export const bookingsApi = {
  getProviderBookings: (params?: { booking_date?: string; status?: string }) =>
    api.get<Booking[]>('/bookings/provider', { params }).then(r => r.data),
  getCustomerBookings: (params?: { service_id?: number }) =>
    api.get<Booking[]>('/bookings/customer', { params }).then(r => r.data),
  create: (payload: BookingCreate) =>
    api.post<Booking>('/bookings', payload).then(r => r.data),
  update: (id: number, payload: BookingUpdate) =>
    api.patch<Booking>(`/bookings/${id}`, payload).then(r => r.data),
  delete: (id: number) =>
    api.delete(`/bookings/${id}`),
}
```

**`frontend/src/api/notifications.ts`**
```typescript
import api from './axios'
import type { Notification } from '../types'

export const notificationsApi = {
  getAll: () =>
    api.get<Notification[]>('/notifications').then(r => r.data),
  getUnreadCount: () =>
    api.get<{ count: number }>('/notifications/unread-count').then(r => r.data),
  markAllRead: () =>
    api.patch('/notifications/mark-all-read'),
  markRead: (id: number) =>
    api.patch(`/notifications/${id}/read`),
}
```

**`frontend/src/api/offers.ts`** — feed, my-service, create, update patterns
**`frontend/src/api/analytics.ts`** — GET `/analytics/summary?date_from=&date_to=`
**`frontend/src/api/users.ts`** — searchUsers(q), updateMe(payload)
**`frontend/src/api/serviceCategories.ts`** — getAll()

### Hooks

Each hook uses TanStack Query. Build all of these completely:

**`frontend/src/hooks/useAuth.ts`** — wraps `useAuthContext()`, provides `login()` and `logout()` wrappers that also call the API and invalidate queries.

**`frontend/src/hooks/useBookings.ts`**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookingsApi } from '../api/bookings'
import type { BookingCreate, BookingUpdate } from '../types'

export const PROVIDER_BOOKINGS_KEY = ['bookings', 'provider'] as const
export const CUSTOMER_BOOKINGS_KEY = ['bookings', 'customer'] as const

export function useProviderBookings(params?: { booking_date?: string; status?: string }) {
  return useQuery({
    queryKey: [...PROVIDER_BOOKINGS_KEY, params],
    queryFn:  () => bookingsApi.getProviderBookings(params),
  })
}

export function useCustomerBookings(params?: { service_id?: number }) {
  return useQuery({
    queryKey: [...CUSTOMER_BOOKINGS_KEY, params],
    queryFn:  () => bookingsApi.getCustomerBookings(params),
  })
}

export function useCreateBooking() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (p: BookingCreate) => bookingsApi.create(p),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] })
      qc.invalidateQueries({ queryKey: ['analytics'] })
    },
  })
}

export function useUpdateBooking() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: BookingUpdate }) =>
      bookingsApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] })
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useDeleteBooking() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => bookingsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
  })
}
```

Build `useServices`, `useServiceCategories`, `useUserServiceLinks`, `useNotifications`, `useOffers`, `useAnalytics` with the same TanStack Query pattern. Every mutation invalidates the relevant query keys.

### UI Components

Build every component completely. Key ones:

**`frontend/src/components/ui/Avatar.tsx`**
```tsx
import { getAvatarColor, getInitials } from '../../utils/avatar'
import type { User } from '../../types'

interface AvatarProps {
  user: User
  size?: number
  showHandle?: boolean
}

export function Avatar({ user, size = 36, showHandle = false }: AvatarProps) {
  const color = getAvatarColor(user.handle)
  const initials = getInitials(user.display_name)

  const circle = user.avatar_url ? (
    <img
      src={user.avatar_url}
      alt={user.display_name}
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }}
    />
  ) : (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `${color}20`, border: `2px solid ${color}40`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 600, color, flexShrink: 0,
    }}>
      {initials}
    </div>
  )

  if (!showHandle) return circle

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {circle}
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>
          {user.display_name}
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>@{user.handle}</div>
      </div>
    </div>
  )
}
```

**`frontend/src/components/ui/NotificationBadge.tsx`** — small red dot with count for topbar. Queries `useNotifications()` and shows unread count.

All other UI components from the first prompt apply unchanged. Build them all: `Button`, `Badge`, `Input`, `Select`, `Textarea`, `Modal`, `Drawer`, `Card`, `MetricCard`, `Spinner`, `EmptyState`.

The `Badge` component must handle all 6 booking statuses: `requested`, `confirmed`, `pending`, `cancelled`, `no_show`, `completed`.

### Layout

**`frontend/src/components/layout/Sidebar.tsx`** — Dual-context sidebar:

```
Structure:
┌─────────────────────┐
│  [B] Booknest logo  │
├─────────────────────┤
│  MY ACCOUNT         │
│  ◉ Dashboard        │
│  ○ My Services      │  ← linked services (customer view)
│  ○ Calendar         │
│  ○ Explore          │
│  ○ Latest      [3]  │  ← notification badge
├─────────────────────┤
│  MY SERVICE         │
│  ○ Dashboard        │  ← or "Onboard Service" CTA if none
│  ○ Manage Bookings  │
│  ○ Customers        │
│  ○ Calendar         │
│  ○ Analytics        │
│  ○ Offers & Posts   │
├─────────────────────┤
│  [Avatar] @handle   │
└─────────────────────┘
```

The two sections are separated by a divider with small uppercase labels. The "MY SERVICE" section:
- If `useMyService()` returns 404 → show a single CTA pill "Onboard your service →" instead of nav items
- If service exists → show the full provider nav items

Use `useLocation()` to derive the active route and apply active styles.

**`frontend/src/components/layout/Topbar.tsx`** — Shows:
- Current page title (derived from route)
- A search icon button
- Notification bell with unread count badge (links to `/latest`)
- User avatar (small, links to profile)

**`frontend/src/components/layout/AppLayout.tsx`** — Sidebar + Topbar + `<Outlet />` as the main scrollable area. Requires auth — redirect to `/login` if no token.

### Service Components

**`frontend/src/components/services/ServiceCard.tsx`** — Used in Explore grid. Shows:
- Cover image (or gradient placeholder using service color)
- Category badge
- Service name, provider name + avatar (small), location
- Base price, duration
- "Add to my services" button (disabled + "Added ✓" if already linked)

**`frontend/src/components/services/ServiceForm.tsx`** — React Hook Form + Zod for onboarding/editing. Fields: name, category (select), description, location, cover_image_url, base_price, duration_minutes, color (color input). Show validation errors inline.

**`frontend/src/components/services/ServiceDrawer.tsx`** — Framer Motion drawer. Shows full service info + list of recent offers + an "Add to my services" / "Already linked" button.

### Booking Components

**`frontend/src/components/bookings/BookingForm.tsx`** — Complete form with:

1. Customer search: A text input that searches users by name/handle (`/users/search?q=`). Results dropdown shows `Avatar` + display_name + @handle. Selecting a user fills `customer_user_id`, `customer_name`, `customer_handle` automatically. Provider can also type a walk-in name without selecting a user account.

2. Pre-populate `amount` from selected service's `base_price` when service_id changes.

3. All other fields: staff_name (text), booking_date (date), start_time (time), end_time (time), status (select), notes (textarea).

**`frontend/src/components/bookings/BookingDrawer.tsx`** — Full booking detail panel. Shows:
- Customer avatar + display_name + @handle (if linked user) OR just name (walk-in)
- Service info
- Date, time range, staff
- Status badge + inline status change buttons
- Amount, notes
- Edit and Delete actions

**`frontend/src/components/bookings/BookingCard.tsx`** — Compact card for day panels. Left border = service color. Shows time, customer name+handle, service name, status badge.

**`frontend/src/components/bookings/BookingTable.tsx`** — Full table for provider manage page. Columns: Customer (avatar+name+@handle), Service, Date & Time, Staff, Amount, Status, Actions.

### Calendar Component

**`frontend/src/components/calendar/CalendarGrid.tsx`** — Full month grid. Accept `bookings: Booking[]` prop. For each day: show booking count dot if any (colored by service). Today highlighted, selected day has blue border. Click → `onDaySelect(dateString)`. Prev/Next month navigation.

**`frontend/src/components/calendar/DayPanel.tsx`** — Shows selected day's bookings. For provider view: shows `BookingCard` items, "+ Add Booking" button. For customer view: shows bookings with service info, read-only.

---

### Pages

**`frontend/src/pages/auth/LoginPage.tsx`** — Full-screen split layout:
- Left: Brand panel with gradient (`linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)`), logo, tagline "Manage your bookings. Link your services. All in one place."
- Right: Login form (email, password). "New here? Create account" link.

On success → call `login(user, token)` from AuthContext → redirect to `/dashboard`.

**`frontend/src/pages/auth/RegisterPage.tsx`** — Same split layout. Fields: display_name, handle (with @prefix, auto-suggested from display_name as they type), email, password, phone (optional). Handle field: shows `@` prefix visually, validates uniqueness format. On success → auto-login → redirect to `/dashboard`.

**`frontend/src/pages/customer/DashboardPage.tsx`**

Layout: Page title "Good morning, [first_name] 👋" + today's date.

Sections:
1. **Quick stats** (3 cards): Total linked services, Upcoming bookings (next 7 days from customer bookings), Unread notifications
2. **Upcoming bookings** — list of next 5 customer bookings across all services. Each row shows service avatar (colored), service name, date, time, status badge
3. **My Services** — horizontal scroll cards showing linked service cards (compact). "+ Explore more" card at end
4. **Latest** — last 3 notifications inline

**`frontend/src/pages/customer/MyServicesPage.tsx`**

Shows a grid of linked service cards. Each card shows:
- Service cover/gradient
- Service name + category
- Provider: avatar + name
- Location
- "X bookings" count with the service
- Click → navigate to `/my-services/:linkId`

Plus "Explore & add services →" button.

**`frontend/src/pages/customer/ServiceDetailPage.tsx`** — `/my-services/:linkId`

Shows full detail of a specific linked service from the customer's perspective:

Left column:
- Service card (name, provider, category, location, color)
- Provider info
- Active offers from this service

Right column:
- Booking history with this service: `BookingTable` (read-only) filtered to this service's bookings for the current user
- Mini calendar showing booking dates

**`frontend/src/pages/customer/CalendarPage.tsx`**

Personal calendar. Fetches all `customer` bookings. Shows `CalendarGrid` with bookings from ALL linked services (different colored dots per service). `DayPanel` on the right shows that day's bookings (read-only with service info).

**`frontend/src/pages/customer/ExplorePage.tsx`**

Browse all services. Top: category filter chips (all categories as horizontal scroll pills). Grid of `ServiceCard` components. Clicking a card opens `ServiceDrawer`.

**`frontend/src/pages/customer/LatestPage.tsx`**

Notification feed. Header: "Latest" + "Mark all read" button.
Groups notifications by date (Today, Yesterday, Earlier). Each item: `NotificationItem` component (icon per type, title, body, time, read/unread state). Click → marks as read. Link to related service or booking if available.

**`frontend/src/pages/provider/OnboardServicePage.tsx`**

Full-page onboarding experience. Shows `ServiceForm`. Header: "Onboard your service" with description. On success → navigate to `/provider/dashboard`.

**`frontend/src/pages/provider/ProviderDashboardPage.tsx`**

Layout: service name + edit button in header.

Sections:
1. **Today's snapshot**: 4 metric cards (Today's bookings, This week, MTD revenue, Total customers)
2. **Today's schedule**: `DayPanel` for today's provider bookings
3. **Recent bookings**: last 5 as compact rows
4. **Active offers**: compact list with "Post new offer" button

Data: `useProviderBookings({ booking_date: today })` + `useAnalytics()`.

**`frontend/src/pages/provider/ManageBookingsPage.tsx`**

Full booking management:
- Header: title + booking count + "+ New Booking" button
- Filter bar: search (customer name/handle), status dropdown, date range
- `BookingTable` with all features
- `BookingDrawer` on row click
- `Modal` with `BookingForm` for add/edit

**`frontend/src/pages/provider/CustomersPage.tsx`**

Shows all users linked to the provider's service.
- Search bar
- Customer grid/list: each shows `Avatar` (with handle), name, @handle, linked date, total bookings with this service, last booking date
- Click → slide-in panel showing customer's booking history with this service

**`frontend/src/pages/provider/ProviderCalendarPage.tsx`**

Provider calendar. Fetches all `provider` bookings. `CalendarGrid` + `DayPanel`. "+ New Booking" pre-fills the selected date.

**`frontend/src/pages/provider/AnalyticsPage.tsx`**

Date range picker (this month default). 4 metric cards. Recharts `BarChart` for daily volume. Staff performance list with progress bars.

**`frontend/src/pages/provider/OffersPage.tsx`**

List of all offers for the service. "+ Post Offer" button opens modal with `OfferCreate` form. Each offer card shows title, body preview, valid_until, is_active toggle, delete button.

---

### `frontend/src/App.tsx`
```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import { AppLayout }     from './components/layout/AppLayout'

import { LoginPage }    from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'

import { DashboardPage }     from './pages/customer/DashboardPage'
import { MyServicesPage }    from './pages/customer/MyServicesPage'
import { ServiceDetailPage } from './pages/customer/ServiceDetailPage'
import { CalendarPage }      from './pages/customer/CalendarPage'
import { ExplorePage }       from './pages/customer/ExplorePage'
import { LatestPage }        from './pages/customer/LatestPage'

import { OnboardServicePage }      from './pages/provider/OnboardServicePage'
import { ProviderDashboardPage }   from './pages/provider/ProviderDashboardPage'
import { ManageBookingsPage }      from './pages/provider/ManageBookingsPage'
import { CustomersPage }           from './pages/provider/CustomersPage'
import { ProviderCalendarPage }    from './pages/provider/ProviderCalendarPage'
import { AnalyticsPage }           from './pages/provider/AnalyticsPage'
import { OffersPage }              from './pages/provider/OffersPage'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<AppLayout />}>
              {/* Customer routes */}
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard"              element={<DashboardPage />} />
              <Route path="my-services"            element={<MyServicesPage />} />
              <Route path="my-services/:linkId"    element={<ServiceDetailPage />} />
              <Route path="calendar"               element={<CalendarPage />} />
              <Route path="explore"                element={<ExplorePage />} />
              <Route path="latest"                 element={<LatestPage />} />
              {/* Provider routes */}
              <Route path="provider/onboard"       element={<OnboardServicePage />} />
              <Route path="provider/dashboard"     element={<ProviderDashboardPage />} />
              <Route path="provider/bookings"      element={<ManageBookingsPage />} />
              <Route path="provider/customers"     element={<CustomersPage />} />
              <Route path="provider/calendar"      element={<ProviderCalendarPage />} />
              <Route path="provider/analytics"     element={<AnalyticsPage />} />
              <Route path="provider/offers"        element={<OffersPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
```

### `frontend/src/App.tsx` auth guard
The `AppLayout` component must check `useAuthContext()`. If `isLoading` → show full-screen spinner. If no `user` → `<Navigate to="/login" replace />`. Otherwise render `<Outlet />`.

---

## DESIGN SYSTEM — `frontend/src/index.css`

Extend the previous design system with these additions:

```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --color-bg:            #f8f9fc;
  --color-surface:       #ffffff;
  --color-surface-2:     #f1f3f8;
  --color-surface-3:     #e8ecf4;
  --color-border:        rgba(0,0,0,0.07);
  --color-border-strong: rgba(0,0,0,0.14);

  --color-primary:       #2563eb;
  --color-primary-soft:  rgba(37,99,235,0.1);
  --color-primary-hover: #1d4ed8;
  --color-accent:        #06b6d4;
  --color-accent-soft:   rgba(6,182,212,0.1);

  --color-text-primary:   #0f172a;
  --color-text-secondary: #475569;
  --color-text-tertiary:  #94a3b8;
  --color-text-inverse:   #ffffff;

  --color-requested:       #7c3aed;
  --color-requested-soft:  rgba(124,58,237,0.1);
  --color-confirmed:       #059669;
  --color-confirmed-soft:  rgba(5,150,105,0.1);
  --color-pending:         #d97706;
  --color-pending-soft:    rgba(217,119,6,0.1);
  --color-cancelled:       #dc2626;
  --color-cancelled-soft:  rgba(220,38,38,0.1);
  --color-no-show:         #64748b;
  --color-no-show-soft:    rgba(100,116,139,0.1);
  --color-completed:       #0891b2;
  --color-completed-soft:  rgba(8,145,178,0.1);

  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px;
  --space-5:20px; --space-6:24px; --space-8:32px; --space-10:40px;

  --radius-sm:6px; --radius-md:10px; --radius-lg:14px;
  --radius-xl:20px; --radius-full:9999px;

  --shadow-sm:  0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md:  0 4px 12px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.04);
  --shadow-lg:  0 12px 32px rgba(0,0,0,0.09), 0 4px 8px rgba(0,0,0,0.05);
  --shadow-xl:  0 24px 64px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.06);

  --font-sans: 'Outfit', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --transition-fast: 120ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 350ms ease;

  --sidebar-width:  230px;
  --topbar-height:  60px;
}

html, body { height: 100%; }
body {
  font-family: var(--font-sans);
  background: var(--color-bg);
  color: var(--color-text-primary);
  font-size: 14px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
#root { height: 100%; }
button { font-family: inherit; cursor: pointer; }
input, select, textarea { font-family: inherit; }
a { color: inherit; text-decoration: none; }

::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--color-surface-3); border-radius: 10px; }

@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.page-enter {
  animation: fadeIn 0.3s ease forwards;
}
```

---

## DESIGN REQUIREMENTS — ENFORCE STRICTLY

### Auth Pages
- Split layout: 45% brand panel (blue→cyan gradient, white text) + 55% form panel (white)
- Brand panel: large "B" logo circle, app name, 3 bullet features list
- Form panel: "Welcome back" heading, clean inputs, primary submit button, link to other auth page
- Handle field on register: shows `@` as a gray prefix inside the input, auto-populates from display_name (space→underscore, lowercase, append last 2 digits of timestamp if collision-prone)
- Password field: show/hide toggle icon

### Sidebar
- Clean white background, 230px wide, full height
- Logo area: subtle blue-cyan gradient background, "B" geometric mark + "Booknest" in weight 700
- Section dividers: thin lines with uppercase 10px labels ("MY ACCOUNT", "MY SERVICE")
- Active nav pill: `background: var(--color-primary-soft)`, left border `3px solid var(--color-primary)`, text `var(--color-primary)`, font-weight 600
- Inactive: transparent, `var(--color-text-secondary)`
- Notification badge: small red pill with count
- User avatar at bottom: `Avatar` component + display_name + @handle truncated

### Service Cards (Explore)
- White card, rounded corners `var(--radius-lg)`, subtle shadow
- Top section: cover image or gradient placeholder (`linear-gradient(135deg, {color} 0%, {color}88 100%)`) — 120px height
- Category badge overlay on image (top-left): small white pill with category name
- Body: service name (weight 600), provider row (mini avatar + name), location (pin icon), price + duration
- Footer: "Add to my services" button — full width, primary style. If already linked: "Added ✓" (green, disabled)

### Explore Category Filter
- Horizontal scroll row of pills
- Active pill: `background: var(--color-primary)`, white text
- Inactive: `background: var(--color-surface-2)`, border, secondary text
- Each pill has the category icon (Lucide) + name

### Notification Items
- Unread: `background: var(--color-primary-soft)`, left border `3px solid var(--color-primary)`
- Read: plain white, no left border
- Icon per type: Bell (booking_created), RefreshCw (status_changed), Tag (offer_posted), UserPlus (new_customer_linked)
- Time: relative (e.g., "2 hours ago") using date-fns `formatDistanceToNow`

### Customer Service Detail Page (ServiceDetailPage)
- Two-column layout (40% left info, 60% right bookings)
- Left: Service cover banner (full width, 180px), info grid
- Offers section: each offer as a card with a tag icon, title, body, valid_until badge
- Right: Booking history table (read-only), mini calendar

### All other design rules from v1 apply unchanged:
- Font: Outfit
- Cards: white surface, `border: 1px solid var(--color-border)`, `box-shadow: var(--shadow-sm)`
- Inputs: surface-2 background, focus ring
- Buttons: primary blue, radius-md, weight 500
- Page transition: Framer Motion `initial={{ opacity:0, y:8 }}` → `animate={{ opacity:1, y:0 }}` on every page
- Modal: blurred backdrop, white card, radius-xl, shadow-xl
- Drawer: slides from right, 380px, shadow-xl
- Tables: surface-2 header, border-only rows
- Calendar cells: 40×40px min
- Metric cards: colored top border accent
- Micro-interactions: hover translateY(-1px) on cards, scale(0.98) on button active

---

## API ROUTES SUMMARY

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/auth/me

GET    /api/v1/users/search?q=
PATCH  /api/v1/users/me

GET    /api/v1/service-categories

GET    /api/v1/services?category_id=
GET    /api/v1/services/mine
POST   /api/v1/services
PATCH  /api/v1/services/mine

GET    /api/v1/user-service-links/my-linked-services
POST   /api/v1/user-service-links
DELETE /api/v1/user-service-links/:id
GET    /api/v1/user-service-links/service/:service_id/customers

GET    /api/v1/bookings/provider?booking_date=&status=
GET    /api/v1/bookings/customer?service_id=
POST   /api/v1/bookings
PATCH  /api/v1/bookings/:id
DELETE /api/v1/bookings/:id

GET    /api/v1/notifications
GET    /api/v1/notifications/unread-count
PATCH  /api/v1/notifications/mark-all-read
PATCH  /api/v1/notifications/:id/read

GET    /api/v1/offers/feed
GET    /api/v1/offers/my-service
POST   /api/v1/offers
PATCH  /api/v1/offers/:id

GET    /api/v1/analytics/summary?date_from=&date_to=

GET    /api/v1/health
```

---

## CRITICAL RULES — DO NOT VIOLATE

1. **Zero placeholder code.** Every file, route, and component must be complete and functional.
2. **No `any` types** in TypeScript. Strict typing throughout.
3. **No separate role system.** Every user is treated as both potential provider and customer. Context determines which view is shown.
4. **Auth is JWT-based.** Token stored in `localStorage`. Auto-attached via Axios interceptor. 401 → redirect to `/login`.
5. **User identity**: `handle` is globally unique. Always display `@handle` alongside display_name wherever a user is shown. Use `Avatar` component everywhere.
6. **Dual booking visibility**: When a booking is created for a user account (`customer_user_id` set), that user MUST see it in `/bookings/customer`. This is enforced via the `customer_user_id` FK on the bookings table.
7. **Notifications are created server-side** in the booking and linking routers — never on the frontend.
8. **No external UI libraries.** Pure CSS variables + inline styles.
9. **TanStack Query** for all server state. `useMutation` + `invalidateQueries` for writes.
10. **React Hook Form + Zod** for all forms.
11. **Framer Motion** for modals, drawers, and page entry animations.
12. **date-fns** for all date formatting. Store/transmit dates as `YYYY-MM-DD`, times as `HH:MM`.
13. **API naming**: snake_case for all API fields. Frontend types match exactly.
14. **Every data-fetching component** must handle: loading (Spinner), error (error message card), and empty states (EmptyState component).
15. **Handle display**: always prefix with `@` when showing to users. Strip `@` when storing/sending to API.
16. **One service per user** for now — the backend enforces this. The frontend shows "edit service" instead of "add service" once onboarded.
17. **Booking search for customer**: the `BookingForm` customer search input hits `GET /users/search?q=` and shows a dropdown. Selecting fills all customer fields atomically. Walk-in bookings (no user account) are allowed — leave `customer_user_id` null and just fill `customer_name`.

---

## EXECUTION ORDER

Build in this exact order:

1. Root: `.env.example`, `.gitignore`, `README.md`
2. Backend config: `config.py` → `database.py` → `utils/auth_helpers.py` → `dependencies.py`
3. Backend models (in order): `user` → `service_category` → `service` → `user_service_link` → `booking` → `notification` → `offer`
4. Backend `models/__init__.py`: import all models so Alembic sees them
5. Backend schemas: `auth` → `user` → `service_category` → `service` → `user_service_link` → `booking` → `notification` → `offer` → `analytics`
6. Backend routers: `auth` → `users` → `service_categories` → `services` → `user_service_links` → `bookings` → `notifications` → `offers` → `analytics`
7. `backend/main.py` → `backend/requirements.txt`
8. Alembic: `alembic.ini` → `alembic/env.py` → `alembic/versions/001_initial_schema.py`
9. Frontend: `package.json` → `vite.config.ts` → `tsconfig.json` → `tsconfig.node.json` → `index.html`
10. Frontend: `index.css` → `types/index.ts` → `utils/date.ts` → `utils/format.ts` → `utils/avatar.ts`
11. Frontend: `context/AuthContext.tsx`
12. Frontend API: `axios.ts` → `auth.ts` → `users.ts` → `serviceCategories.ts` → `services.ts` → `userServiceLinks.ts` → `bookings.ts` → `notifications.ts` → `offers.ts` → `analytics.ts`
13. Frontend hooks (all)
14. Frontend UI components: `Button` → `Badge` → `Input` → `Select` → `Textarea` → `Avatar` → `NotificationBadge` → `Spinner` → `EmptyState` → `Card` → `MetricCard` → `Modal` → `Drawer`
15. Frontend layout: `AppLayout` → `Sidebar` → `Topbar`
16. Frontend feature components: `ServiceCard` → `ServiceForm` → `ServiceDrawer` → `BookingCard` → `BookingForm` → `BookingDrawer` → `BookingTable` → `CalendarGrid` → `DayPanel` → `NotificationItem`
17. Frontend pages: `LoginPage` → `RegisterPage` → customer pages (in route order) → provider pages (in route order)
18. `App.tsx` → `main.tsx`

Now build the complete Booknest v2 application following every instruction above.
