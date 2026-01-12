# Propal - B2B Manufacturing Platform

A comprehensive B2B (Business-to-Business) manufacturing marketplace platform that connects verified manufacturers with businesses seeking raw materials and manufacturing resources.

## Overview

Propal provides a bridge between manufacturers and consumers, facilitating:
- **Manufacturer Discovery** - Search for manufacturers by category or material
- **Detailed Profiles** - View comprehensive manufacturer profiles with ratings and reviews
- **Review System** - Rate and review manufacturers after business interactions
- **Premium Subscription** - Upgrade to premium for enhanced features
- **Meeting Scheduling** - Schedule onsite meetings with manufacturers

### Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (Running in Docker)
- **ORM:** Prisma
- **Frontend:** EJS, Bootstrap, jQuery

## Project Structure

```
Propal/
├── controller.js           # Main Express server & route handlers
├── db.js                   # Legacy JSON database logic (replaced by Prisma)
├── docker-compose.yml      # Docker configuration for PostgreSQL
├── prisma/
│   └── schema.prisma       # Database schema definition
├── views/                  # EJS Templates
│   ├── index.ejs           # Homepage
│   ├── login.ejs           # Login page
│   ├── signup.ejs          # Registration page
│   ├── about.ejs           # About page
│   ├── ProfileManu1.ejs    # Manufacturer profile
│   └── ProfileCon1.ejs     # Consumer profile
├── assets/                 # CSS, Images, JS
└── vendor/                 # Frontend libraries
```

## Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd Propal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the database (Docker)**
   Make sure Docker Desktop is running, then execute:
   ```bash
   docker-compose up -d
   ```

4. **Initialize the database**
   Run the Prisma migrations to create the tables in PostgreSQL:
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start the server**
   ```bash
   node controller.js
   ```

6. **Access the application**
   - Open your browser and navigate to `http://localhost:5000`

## API Routes

### Authentication
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/login` | Login page |
| POST | `/login` | Handle login |
| GET | `/signup` | Registration page |
| POST | `/signup` | Create user account |
| GET | `/logout` | Destroy session |

### Marketplace
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/explore` | Explore manufacturers |
| POST | `/searchexplore` | Search manufacturers |
| GET | `/manufacturer/:id` | View manufacturer profile |
| POST | `/review` | Submit manufacturer review |
| POST | `/meeting` | Schedule meeting |
| POST | `/cevent` | Create partnership/event |
| GET | `/event` | View partnerships |

## Premium Tier System

Manufacturers are automatically promoted to premium tiers based on their ratings:

| Rating | Tier |
|--------|------|
| 2+ | Basic |
| 3+ | Standard |
| 4+ | Premium |

## Future Development
- [x] Migrate to PostgreSQL with Prisma
- [x] Dockerize database environment
- [ ] Create separate route modules (MVC architecture)
- [ ] Add unit and integration tests
- [ ] Implement real-time notifications
- [ ] Add messaging system between manufacturers and consumers

**Propal** - Connecting Manufacturers with Businesses
