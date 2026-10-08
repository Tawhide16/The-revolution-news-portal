# 📰 The Revolution | Modern Digital Broadsheet & Editorial Newsroom

<p align="center">
  <img src="./public/preview.png" alt="The Revolution News Portal Preview" width="100%" style="border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);" />
</p>

<p align="center">
  <strong>A high-impact, full-featured editorial news portal and publishing engine built with Next.js 14, TypeScript, Tailwind CSS, Prisma ORM, and PostgreSQL.</strong>
</p>

<p align="center">
  <a href="#-key-features">Key Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-environment-variables">Environment Variables</a> •
  <a href="#-roles--editorial-workflow">Editorial Workflow</a> •
  <a href="#-deployment">Deployment</a>
</p>

---

## 🌟 Highlights

- **Broadsheet Editorial Aesthetics**: Inspired by premier news institutions (BBC, The Guardian, NYT) with bold serif typography, high-contrast black/red/white palettes, and dynamic editorial grids.
- **Role-Based Access Control (RBAC)**: Complete separation of powers between **Admin**, **Editor**, and **Writer** roles.
- **Editorial Approval Pipeline**: Stories drafted by Writers are held in a `REVIEW` queue until approved and published live by an **Admin**.
- **Multi-Layout Publishing Engine**: Writers and Admins can choose between 4 bespoke layouts (`Standard`, `Hero Banner`, `Two-Column`, and `Minimalist`).
- **Device-Targeted Publishing**: Tailor articles for `Both (Mobile & Desktop)`, `Desktop Only`, or `Mobile Only`.
- **Live Device Preview Simulator**: Test responsiveness directly in the editor using the interactive **Desktop** view or **Mobile Phone (390px frame)** simulator.
- **Integrated Media Pipeline**: Fast cover photo uploads and inline rich-text photo inserters with captions.
- **Serverless PostgreSQL (Neon)**: Production-ready database schema powered by **Prisma ORM** with instant migrations and branching.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router, Server Components & Server Actions) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict type-safety) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) with `@tailwindcss/typography` |
| **Database** | [PostgreSQL](https://www.postgresql.org/) / [Neon Serverless Postgres](https://neon.tech/) |
| **ORM** | [Prisma ORM 5](https://www.prisma.io/) (`@prisma/client`) |
| **Authentication** | [NextAuth.js](https://next-auth.js.org/) (JWT session strategy & credentials provider) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Rich Text** | HTML formatting tools & inline media figure parser |
| **Validation** | [Zod](https://zod.dev/) Schema Validation |
| **Containerization** | [Docker](https://www.docker.com/) & Docker Compose |

---

## 🚀 Key Features

### 1. Broadsheet Public Front Page
- **Breaking News Ticker**: Real-time pulsing editorial alerts.
- **Hero Broadsheet Trio**: Featured lead article alongside two curated left stories and three wire updates.
- **Feature Grids**: High-impact editorial card layouts for World, Business, Tech, Culture, and Politics.
- **Multimedia & Spotlight**: Dark-mode multimedia showcases for video journalism and photo essays.
- **Live Search & Taxonomy**: Instant category filtering, tag pages, and full-text keyword search.

### 2. Editorial Desk & Admin Dashboard (`/admin`)
- **KPI Metrics**: Published stories counter, review queue counter, active drafts, and aggregated page views.
- **7-Day Traffic Analytics**: Visual bar graphs tracking daily reader impressions.
- **Real-Time Writer Activity Overview**:
  - **Pending Submissions Queue**: Highlights articles submitted by writers with instant 1-click **"Approve & Publish"** buttons.
  - **Live Draft Workspaces**: Shows all articles currently in progress across writers in the newsroom.
- **Audit Trail**: Real-time logging of user creations, edits, approvals, and deletions.

### 3. Article Compose & Layout Studio (`/admin/articles/new`)
- **Layout Selection**:
  - `Standard`: Classic broadsheet layout with editorial standfirst and photo figure.
  - `Hero Banner`: Full-bleed immersive photo header with floating typography.
  - `Two-Column`: Traditional newspaper print two-column editorial flow.
  - `Minimalist`: Clean, distraction-free typography for deep in-depth essays.
- **Device Display Target**:
  - `Both (Mobile & Desktop)`
  - `Desktop Optimized`
  - `Mobile First`
- **Device Preview Switcher**:
  - Toggle between full-screen **Desktop View** and **390px Mobile Phone simulator** right while writing.
- **Inline Photo Inserter**: Upload photographs and embed `<figure>` tags with photo attribution directly into article text.

---

## 👥 Roles & Editorial Workflow

```mermaid
graph TD
    A[Writer writes article] --> B[Chooses Layout & Device Target]
    B --> C[Uploads Images & Writes Content]
    C --> D[Submits for Admin Approval - Status: REVIEW]
    D --> E{Admin Dashboard}
    E -->|Reject / Request Changes| F[Status: DRAFT]
    F --> A
    E -->|1-Click Approve| G[Status: PUBLISHED]
    G --> H[Live on Public Portal]
```

### Role Permissions Matrix

| Feature / Action | 👑 ADMIN | 📝 EDITOR | ✍️ WRITER |
| :--- | :---: | :---: | :---: |
| Write & Edit Own Articles | ✅ | ✅ | ✅ |
| Upload Photographs & Media | ✅ | ✅ | ✅ |
| Choose Layout & Device Target | ✅ | ✅ | ✅ |
| Live Desktop / Mobile Preview | ✅ | ✅ | ✅ |
| Direct 1-Click Publishing | ✅ | ✅ | ❌ *(Submits for Approval)* |
| Approve Writer Submissions | ✅ | ✅ | ❌ |
| Edit Others' Articles | ✅ | ✅ | ❌ |
| Manage Categories & Tags | ✅ | ✅ | ❌ |
| Manage Staff Users & Roles | ✅ | ❌ | ❌ |
| Manage Site Settings | ✅ | ❌ | ❌ |
| View System Audit Logs | ✅ | ❌ | ❌ |

---

## 🔑 Default Credentials (Development)

| Role | Email | Default Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `admin123` | Full system control |
| **Writer** | `writer@example.com` | `writer123` | Story composition & approval submission |
| **Editor** | `editor@example.com` | `editor123` | Content approval & taxonomy management |

> **Security Note:** In production, change the default passwords from the **Users & Roles** panel (`/admin/users`) or set `ADMIN_PASSWORD` in your environment.

---

## 💻 Getting Started (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ or v20+
- [Git](https://git-scm.com/)
- A free PostgreSQL database (e.g. [Neon.tech](https://neon.tech)) or local PostgreSQL.

### 1. Clone the Repository
```bash
git clone https://github.com/Tawhide16/The-revolution-news-portal.git
cd The-revolution-news-portal
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root:
```bash
cp .env.example .env
```
Update your `.env` with your PostgreSQL database URL (e.g. from Neon):
```env
DATABASE_URL="postgresql://neondb_owner:<password>@<host>/neondb?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate_a_random_32_byte_secret_key"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="your_secure_password"
```

### 4. Push Schema to Database
Synchronize the Prisma schema with your PostgreSQL database:
```bash
npx prisma db push
```

### 5. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the public broadsheet.  
Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the editorial desk.

---

## ⚙️ Environment Variables

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string (Prisma datasource) | `postgresql://user:pwd@ep-xyz.neon.tech/neondb?sslmode=require` |
| `NEXTAUTH_URL` | Canonical URL of your app | `http://localhost:3000` (Local) / `https://your-domain.com` (Prod) |
| `NEXTAUTH_SECRET` | Secret key used to encrypt NextAuth JWT tokens | Run `openssl rand -base64 32` |
| `ADMIN_EMAIL` | Default administrator account email | `admin@example.com` |
| `ADMIN_PASSWORD` | Default administrator account password | `admin123` |
| `STORAGE_DRIVER` | File storage driver (`local` or `cloudinary`) | `local` |
| `UPLOAD_DIR` | Directory for uploaded media files | `./uploads` |
| `CLOUDINARY_*` | *(Optional)* Cloudinary cloud name, key & secret | Leave empty for local storage |

---

## 🚢 Deployment

### Deploy on Vercel (Recommended)
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository: `Tawhide16/The-revolution-news-portal`.
4. In the **Environment Variables** configuration, add:
   - `DATABASE_URL` (Your Neon Postgres connection URL)
   - `NEXTAUTH_URL` (`https://<your-project>.vercel.app`)
   - `NEXTAUTH_SECRET` (A strong random secret)
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
5. Click **"Deploy"**. Vercel will build the project and issue a free SSL certificate.

### Deploy with Docker
Run the application along with PostgreSQL in containers:
```bash
docker compose up -d --build
```
Access the application on port `3000` and pgAdmin on port `5050`.

---

## 📂 Project Structure

```text
├── prisma/
│   └── schema.prisma        # Database models (User, Article, Category, Tag, Media, etc.)
├── src/
│   ├── app/
│   │   ├── (public)/        # Public broadsheet pages (Home, Article details, Categories, Search)
│   │   ├── admin/           # Editorial Newsroom & Dashboard
│   │   │   ├── (dashboard)/ # Articles, Users, Categories, Settings, Audit logs
│   │   │   └── login/       # Staff Authentication portal
│   │   └── api/             # REST APIs (Articles, Users, Media Upload, Views, Settings)
│   ├── components/
│   │   ├── admin/           # ArticleEditorForm, WriterActivityOverview, SessionWrapper
│   │   ├── layout/          # Broadsheet Header, Footer, BreakingTicker
│   │   └── news/            # HeroSection, FeatureGrid, VideoMediaSection, CultureSpotlight
│   ├── lib/
│   │   ├── auth.ts          # NextAuth configuration & credentials provider
│   │   ├── prisma.ts        # Prisma Client singleton
│   │   ├── rbac.ts          # Role-Based Access Control logic (ADMIN, WRITER, EDITOR)
│   │   ├── store.ts         # Data persistence & audit logging
│   │   └── validators.ts    # Zod schemas for forms & APIs
│   └── middleware.ts        # Role-based route protection
└── Dockerfile               # Production container configuration
```

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

---

<p align="center">
  Crafted with ❤️ for fearless, independent public-interest journalism.
</p>
