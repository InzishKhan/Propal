# Propal - B2B Manufacturing Platform

A professional B2B (Business-to-Business) manufacturing marketplace platform that connects verified manufacturers with businesses seeking raw materials and manufacturing resources.

## Overview

Propal provides a bridge between manufacturers and consumers, facilitating:
- **Manufacturer Discovery** - Search for manufacturers by category or material
- **Detailed Profiles** - View comprehensive manufacturer profiles with ratings and reviews
- **Review System** - Rate and review manufacturers after business interactions
- **Premium Subscription** - Upgrade to premium for enhanced features
- **Meeting Scheduling** - Schedule onsite meetings with manufacturers

### Tech Stack
- **Backend:** Node.js, Express.js (MVC Architecture)
- **Database:** PostgreSQL (Running in Docker)
- **ORM:** Prisma
- **Frontend:** EJS, Bootstrap, jQuery

## Project Structure

The project follows a modular **Model-View-Controller (MVC)** pattern for better maintainability:

```
Propal/
├── app.js                 # Entry point - server configuration
├── config/                # Configuration (Database client, utils)
├── controllers/           # Business logic (split by feature)
│   ├── authController.js
│   ├── mainController.js
│   ├── profileController.js
│   └── featureController.js
├── routes/                # Route definitions
├── prisma/                # Database schema & migrations
├── views/                 # EJS Templates (Frontend)
├── docker-compose.yml     # Docker configuration for PostgreSQL
└── package.json           # Scripts and dependencies
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
   Ensure Docker Desktop is running, then execute:
   ```bash
   docker-compose up -d
   ```

4. **Initialize the database**
   Run the Prisma migrations to create the tables in PostgreSQL:
   ```bash
   npm run db:migrate -- --name init
   ```

5. **Start the server**
   ```bash
   npm start
   ```

6. **Access the application**
   - Application: `http://localhost:5000`
   - Database Browser (GUI): `npm run db:studio`

## Database Management

| Command | Description |
|---------|-------------|
| `npm start` | Starts the production server |
| `npm run db:studio` | Opens Prisma Studio to view/edit data in the browser |
| `npm run db:migrate` | Synchronizes schema changes with the database |

## Future Development
- [x] Refactor to MVC Architecture
- [x] Migrate to PostgreSQL with Prisma
- [x] Dockerize database environment
- [ ] Add unit and integration tests
- [ ] Implement real-time notifications
- [ ] Add messaging system between manufacturers and consumers

**Propal** - Connecting Manufacturers with Businesses
