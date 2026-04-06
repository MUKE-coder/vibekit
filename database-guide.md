# Database Guide — Neon + Prisma

> Everything you need to understand, set up, and manage your app's database — explained for complete beginners.

---

## Table of Contents
1. [What Is a Database and Why Neon?](#what-is-a-database)
2. [Setting Up Neon](#setting-up-neon)
3. [Understanding Prisma](#understanding-prisma)
4. [Writing Your First Schema](#writing-your-first-schema)
5. [Common Schema Patterns](#common-schema-patterns)
6. [Migrations — What They Are and How to Run Them](#migrations)
7. [Querying Data (What to Tell Lovable)](#querying-data)
8. [Neon Branching — Dev vs Production](#neon-branching)
9. [Troubleshooting Common Database Errors](#troubleshooting)

---

## What Is a Database and Why Neon?

A database is where your app permanently stores all its data — users, posts, orders, settings, messages. Without a database, every time a user refreshes the page, all their data is gone.

**Why Neon:**
- **Free tier** — generous free plan with 0.5GB storage and unlimited API calls
- **Serverless** — scales automatically, no server to manage
- **Postgres** — the world's most reliable open-source database
- **Branches** — create dev/staging/production copies instantly, like Git branches for your data
- **Works with Lovable** — Lovable knows how to connect Next.js apps to Neon

---

## Setting Up Neon

### Create Your Account and Database

1. Go to [neon.tech](https://neon.tech) and sign up with GitHub
2. Click **"Create Project"**
3. Name: your app name
4. Postgres version: 16 (latest)
5. Region: choose closest to your users
6. Click **"Create Project"**

### Get Your Connection String

After creation, on the Neon dashboard:
1. Click **"Connection Details"** or look for the connection string section
2. Select **"Prisma"** from the connection type dropdown
3. Copy the connection string — it looks like:
   ```
   postgresql://user:password@ep-example.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. Add it to your `.env.local` as `DATABASE_URL`

---

## Understanding Prisma

Prisma is the layer between your Next.js app and the database. It lets you define your data structure in a readable format and generates code that makes database operations easy and type-safe.

Think of Prisma as a translator: you write simple JavaScript to say "get all users" and Prisma translates it into the complex SQL that the database understands.

### The Three Prisma Files

| File | What It Does |
|---|---|
| `prisma/schema.prisma` | Defines your data structure (tables and fields) |
| `prisma/migrations/` | History of all database changes |
| `node_modules/.prisma/` | Generated code Prisma creates automatically |

---

## Writing Your First Schema

The `schema.prisma` file is where you define every piece of data your app stores.

### Basic Example

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  image     String?
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  posts     Post[]
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
}

enum Role {
  USER
  ADMIN
}
```

### Field Types Reference

| Prisma Type | What It Stores | Example |
|---|---|---|
| `String` | Text of any length | name, email, description |
| `Int` | Whole numbers | age, quantity, count |
| `Float` | Decimal numbers | price, rating |
| `Boolean` | True or false | isPublished, isActive |
| `DateTime` | Date and time | createdAt, dueDate |
| `Json` | Flexible data structure | settings, metadata |

### Common Field Decorators

```prisma
@id              // Primary key — every model needs one
@default(cuid()) // Auto-generate a unique ID
@default(now())  // Auto-set to current time
@default(false)  // Default boolean value
@unique          // No two records can have the same value
@updatedAt       // Auto-update to current time on every save
?                // Makes the field optional (can be null)
```

---

## Common Schema Patterns

Use these as starting points for your own schemas. Tell Lovable to use or modify these patterns.

### SaaS App with Subscriptions

```prisma
model User {
  id             String    @id @default(cuid())
  email          String    @unique
  name           String?
  image          String?
  role           Role      @default(USER)
  
  // Subscription fields
  stripeCustomerId    String?  @unique
  subscriptionId      String?  @unique
  subscriptionStatus  String?  // "active", "canceled", "past_due"
  plan                Plan     @default(FREE)
  
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}

enum Role { USER ADMIN }
enum Plan { FREE PRO ENTERPRISE }
```

### E-Commerce

```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  description String?
  price       Float
  image       String?
  stock       Int      @default(0)
  category    String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  orderItems  OrderItem[]
}

model Order {
  id         String      @id @default(cuid())
  userId     String
  user       User        @relation(fields: [userId], references: [id])
  total      Float
  status     OrderStatus @default(PENDING)
  createdAt  DateTime    @default(now())
  items      OrderItem[]
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  price     Float
}

enum OrderStatus { PENDING PROCESSING SHIPPED DELIVERED CANCELLED }
```

### Project Management / Tasks

```prisma
model Project {
  id          String   @id @default(cuid())
  name        String
  description String?
  ownerId     String
  owner       User     @relation(fields: [ownerId], references: [id])
  createdAt   DateTime @default(now())
  tasks       Task[]
  members     ProjectMember[]
}

model Task {
  id          String     @id @default(cuid())
  title       String
  description String?
  status      TaskStatus @default(TODO)
  priority    Priority   @default(MEDIUM)
  dueDate     DateTime?
  projectId   String
  project     Project    @relation(fields: [projectId], references: [id])
  assigneeId  String?
  assignee    User?      @relation(fields: [assigneeId], references: [id])
  createdAt   DateTime   @default(now())
}

enum TaskStatus { TODO IN_PROGRESS REVIEW DONE }
enum Priority  { LOW MEDIUM HIGH URGENT }
```

### School Management

```prisma
model Student {
  id          String    @id @default(cuid())
  firstName   String
  lastName    String
  email       String?   @unique
  studentId   String    @unique
  dateOfBirth DateTime?
  parentId    String?
  parent      User?     @relation(fields: [parentId], references: [id])
  classId     String?
  class       Class?    @relation(fields: [classId], references: [id])
  enrollments Enrollment[]
  attendance  Attendance[]
}

model Class {
  id          String    @id @default(cuid())
  name        String
  teacherId   String
  teacher     User      @relation(fields: [teacherId], references: [id])
  students    Student[]
  subjects    Subject[]
}
```

---

## Migrations

A migration is a record of a change to your database structure. Every time you update `schema.prisma`, you need to run a migration to apply those changes to the actual database.

### How to Tell Lovable to Run Migrations

In Lovable, after changing the schema, say:

```
The Prisma schema has been updated. Now run:
npx prisma migrate dev --name [describe-what-changed]

If that is not available in this environment, generate the SQL migration and show me what it contains.
```

### Migration Commands Reference

```bash
# Create a new migration and apply it (development)
npx prisma migrate dev --name add-user-role

# Apply existing migrations (production — use this in Vercel build command)
npx prisma migrate deploy

# Regenerate the Prisma client after schema changes
npx prisma generate

# View your database in a visual browser
npx prisma studio

# Reset database and reapply all migrations (WARNING: deletes all data)
npx prisma migrate reset
```

### The Migration Workflow

1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name [description]`
3. Prisma creates a migration file in `prisma/migrations/`
4. The migration is applied to your database
5. The Prisma client is regenerated automatically

In production (Vercel), add this to your build command:
```
prisma generate && prisma migrate deploy && next build
```

---

## Querying Data

When telling Lovable to fetch or write data, use these patterns as reference. Lovable will write the actual code — you just need to know what to ask for.

### What to Say to Lovable

**Get all records:**
```
Fetch all [model]s from the database and return them as JSON.
Use Prisma: prisma.[model].findMany()
```

**Get one record by ID:**
```
Fetch a single [model] by ID from the URL params.
Use Prisma: prisma.[model].findUnique({ where: { id: params.id } })
Return 404 if not found.
```

**Get records with filtering:**
```
Fetch all [model]s where [field] equals [value].
Include related [related model] data.
Use Prisma: prisma.[model].findMany({ where: { ... }, include: { ... } })
```

**Create a record:**
```
Create a new [model] with the data from the request body.
Use Prisma: prisma.[model].create({ data: { ... } })
Return the created record.
```

**Update a record:**
```
Update [model] with the given ID using the data from the request body.
Use Prisma: prisma.[model].update({ where: { id }, data: { ... } })
```

**Delete a record:**
```
Delete [model] with the given ID.
Use Prisma: prisma.[model].delete({ where: { id } })
```

---

## Neon Branching — Dev vs Production

Neon lets you create database branches — exact copies of your database structure (and optionally data) — in seconds.

### Why You Need Two Branches

| Branch | Used For | Connect To |
|---|---|---|
| `main` | Your live production database with real user data | Vercel production environment |
| `dev` | Your development and testing database | Your `.env.local` |

Never test migrations on your production database. Always test on `dev` first.

### Creating a Dev Branch

1. In your Neon project, click **"Branches"** in the left sidebar
2. Click **"New Branch"**
3. Name: `dev`
4. Branch from: `main`
5. Click **"Create Branch"**
6. Copy the dev branch's connection string
7. Use this in your `.env.local`

---

## Troubleshooting Common Database Errors

### `Error: Can't reach database server`
- Check `DATABASE_URL` is correctly set in your environment variables
- Ensure the Neon project is not paused (free tier auto-pauses after inactivity)
- Go to your Neon dashboard and click **"Resume"** if paused

### `Error: The table 'X' does not exist`
- A migration has not been run
- Run `npx prisma migrate dev` or `npx prisma db push` to apply schema changes

### `Error: Invalid prisma.X.Y() invocation`
- The Prisma client is out of date after a schema change
- Run `npx prisma generate` to regenerate the client

### `Error: Unique constraint failed on field 'email'`
- You are trying to create a record with a value that already exists in a `@unique` field
- Handle this in your API route with a try/catch and return a helpful error message

### `Error: Foreign key constraint failed`
- You are trying to create a record that references an ID that does not exist
- Example: creating a `Task` with a `projectId` that does not exist in the `Project` table
- Validate that referenced records exist before creating dependent records

---

*Part of the [VibeKit Framework](../README.md) — github.com/MUKE-coder/vibekit*
