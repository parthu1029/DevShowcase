# **DevShowcase — React + Supabase Web App**

A modern platform where developers can **share projects**, **explore community work**, **upvote**, **star**, and **manage their own submissions**.

Built for the **Zer01coded Web Challenge — React + Supabase Track**.

---

## 🚀 **Features**

### **🔐 Authentication (Supabase Auth)**

* Email/Password login & signup
* Google & GitHub OAuth
* Auth-protected routes (Home, Submit Project, Profile editing)

### **📌 Project Feed**

* View all community projects
* Project cards with title, description, tech stack, author
* Responsive layout (mobile → desktop)
* Skeleton loading states

### **📝 Create & Manage Projects**

* Submit new project
* Only logged-in users can submit
* Delete only your own projects (via Supabase RLS)

### **⭐ Interactions**

* Upvote projects
* Star / unstar projects
* Safe backend enforcement (no multiple votes/stars)

### **🔍 Explore Page**

* Search by title, description, author, tags
* Tag filtering
* Sort (Trending / Newest)

### **👤 Profile Pages**

* Public profile: `/profile/:username` 
* Shows user details, bio, project list
* Edit option only for logged-in profile owner

### **🌓 Theme Support**

* Dark and Light mode
* Global CSS variables used for dynamic theme switching

---

## 🏛️ **Tech Stack**

| Layer      | Technology                         |
| ---------- | ---------------------------------- |
| Frontend   | React + Vite                       |
| Styling    | TailwindCSS                        |
| Animations | Framer Motion                      |
| Backend    | Supabase (Auth + PostgreSQL + RLS) |
| Deployment | Vercel                             |

---

# 📦 **Database Schema (Supabase)**

### **1. `projects` Table**

```sql
create table projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  tech text[] default '{}',
  languages text[] default '{}',
  platform text,
  platform_url text,
  votes integer not null default 0,
  created_at timestamp with time zone default now()
);
```

---

### **2. `project_stars` Table**

```sql
create table project_stars (
  user_id uuid references auth.users(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  created_at timestamp with time zone default now(),
  primary key (user_id, project_id)
);
```

---

### **3. `project_upvotes` Table**

```sql
create table project_upvotes (
  user_id uuid references auth.users(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  created_at timestamp with time zone default now(),
  primary key (user_id, project_id)
);
```

---

### **4. `comments` Table** *(optional but supported by UI)*

```sql
create table comments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now()
);
```

---

# 🔒 **Row Level Security (RLS)**

Enable RLS:

```sql
alter table projects enable row level security;
alter table project_stars enable row level security;
alter table project_upvotes enable row level security;
alter table comments enable row level security;
```

### **Policies**

#### Only owner can delete/update their project:

```sql
create policy "owners can manage their projects"
on projects
for all
using (auth.uid() = user_id);
```

#### Anyone can read projects:

```sql
create policy "public read"
on projects
for select
using (true);
```

Similar policies for stars, upvotes, and comments.

---

# 🔌 **API Functions (Frontend → Supabase)**

Located in:

```
src/lib/api/
    projects.js
    stars.js
    upvotes.js
    comments.js
```

Examples:

### Fetch all projects:

```js
const { data, error } = await supabase
  .from("projects")
  .select(`
    *,
    author: user_id(email)
  `)
  .order("created_at", { ascending: false });
```

### Add a project:

```js
await supabase.from("projects").insert({
  title,
  description,
  tech,
  languages,
  platform,
  platform_url,
  user_id: user.id
});
```

---

# 🧭 **Routes**

| Route                | Description                             |
| -------------------- | --------------------------------------- |
| `/`                  | Home (user feed: My Projects / Starred) |
| `/explore`           | Public project discovery page           |
| `/submit`            | Submit new project                      |
| `/projects/:id`      | Project detail modal                    |
| `/profile/:username` | Public user profile                     |
| `/login`             | Auth                                    |
| `/signup`            | Auth                                    |
| `/about`             | About page                              |

---

# 🎨 **Theme System**

CSS variables defined in `index.css`:

```css
:root[data-theme='dark'] {
  --background: #000000;
  --text-primary: #ffffff;
  --shadow-color: rgba(255, 255, 255, 0.06);
}

:root[data-theme='light'] {
  --background: #ffffff;
  --text-primary: #111111;
  --shadow-color: rgba(0, 0, 0, 0.2);
}
```

Switched using:

```js
const { theme, toggleTheme } = useTheme();
```

---

# ⚙️ **Setup Instructions**

### 1. Clone repository

```sh
git clone https://github.com/yourname/devshowcase.git
cd devshowcase
```

### 2. Install dependencies

```sh
npm install
```

### 3. Configure Supabase

Create `.env`:

```
VITE_SUPABASE_URL=https://xyzcompany.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run locally

```sh
npm run dev
```

### 5. Deploy to Vercel

* Connect GitHub repo
* Add env variables in Vercel dashboard
* Deploy 🎉

---

# 🧪 Testing the API

Use browser console or VSCode REST client:

```js
import { getProjects } from "./src/lib/api/projects";

getProjects().then(console.log);
```

Check Supabase logs if anything fails.

---

# 📄 **License**

MIT License

---

# ✨ **Made by Partha — Zer01coded Challenge Submission**
