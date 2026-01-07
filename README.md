# Propal - B2B Manufacturing Platform

A comprehensive B2B (Business-to-Business) manufacturing marketplace platform that connects verified manufacturers with businesses seeking raw materials and manufacturing resources.

## Overview

Propal streamlines the trade of raw materials between manufacturers and consumers (businesses). The platform enables manufacturers to showcase their products, manage their business profiles, and connect directly with potential business clients through a secure, feature-rich marketplace.

## Features

### For Manufacturers
- **Company Profile Management** - Create and manage detailed business profiles with company information, contact details, and product listings
- **Raw Materials Showcase** - List and describe available raw materials for potential buyers
- **Meeting Location Management** - Register multiple onsite meeting locations for business meetings
- **Partnership & Events** - Create partnership opportunities and business events
- **Premium Tiers** - Automatic promotion to premium tiers based on ratings (Basic → Standard → Premium)
- **Rating System** - Build reputation through consumer reviews and ratings

### For Consumers (Businesses)
- **Manufacturer Discovery** - Browse and search manufacturers by company name or raw materials
- **Detailed Profiles** - View comprehensive manufacturer profiles with ratings and reviews
- **Review System** - Rate and review manufacturers after business interactions
- **Premium Subscription** - Upgrade to premium for enhanced features
- **Meeting Scheduling** - Schedule onsite meetings with manufacturers

### General Features
- **User Authentication** - Secure login and registration system
- **Role-Based Access** - Separate dashboards and features for manufacturers and consumers
- **Profile Pictures** - Upload and manage profile images
- **Contact & Support** - Built-in helpline and contact form system
- **Responsive Design** - Mobile-friendly interface

## Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | - | Runtime Environment |
| Express.js | 4.18.2 | Web Framework |
| MSSQL | 9.1.1 | SQL Server Database Driver |
| EJS | 3.1.9 | Template Engine |
| Express-Session | 1.17.3 | Session Management |
| Multer | 1.4.5 | File Upload Handling |
| Body-Parser | 1.20.2 | Request Body Parsing |

### Frontend
| Technology | Purpose |
|------------|---------|
| Bootstrap 4 | CSS Framework & Responsive Grid |
| jQuery | DOM Manipulation |
| Font Awesome | Icon Library |
| Owl Carousel | Image Carousels |
| Swiper | Image Sliders |
| Animate.css | CSS Animations |

### Database
- **SQL Server Express** with ODBC Driver 17
- Database Name: `Pro_Pal_temp`

## Project Structure

```
Propal/
├── controller.js           # Main Express server & route handlers
├── package.json            # Project dependencies
├── queries.txt             # SQL database schema & seed data
│
├── views/                  # EJS Templates
│   ├── index.ejs           # Homepage
│   ├── login.ejs           # Login page
│   ├── signup.ejs          # Registration page
│   ├── about.ejs           # About page
│   ├── contact.ejs         # Contact form
│   ├── explore.ejs         # Browse manufacturers
│   ├── events.ejs          # Partnerships & events
│   ├── EditProfile.ejs     # Profile editor & premium upgrade
│   ├── ProfileCon1.ejs     # Consumer dashboard
│   ├── ProfileManu1.ejs    # Manufacturer dashboard
│   ├── 404.ejs             # Error page
│   │
│   ├── assets/             # Frontend assets
│   │   ├── css/            # Stylesheets
│   │   ├── js/             # JavaScript files
│   │   ├── images/         # Static images
│   │   └── webfonts/       # Font files
│   │
│   ├── uploads/            # User-uploaded images
│   └── vendor/             # Third-party libraries
│
└── node_modules/           # Dependencies
```

## Database Schema

### Core Tables

| Table | Description |
|-------|-------------|
| `User1` | Base user authentication (user_id, username, email, password_hash, user_type) |
| `Manufacturer` | Manufacturer profiles (company_name, contact_name, rating, raw_materials, etc.) |
| `Consumer` | Consumer/business profiles |
| `Review` | Ratings and reviews from consumers to manufacturers |
| `OnsiteMeetingLocation` | Meeting locations for manufacturers |
| `PremiumManufacturer` | Premium subscription data for manufacturers |
| `PremiumConsumer` | Premium subscription data for consumers |
| `partnerships` | Partnership and event data |
| `HelpLine` | Support/help requests |

### User Types
- `M` - Manufacturer
- `C` - Consumer
- `A` - Admin

## Installation

### Prerequisites
- Node.js (v14 or higher)
- SQL Server Express
- ODBC Driver 17 for SQL Server

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Propal.git
   cd Propal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   - Create a new database named `Pro_Pal_temp` in SQL Server
   - Run the SQL queries from `queries.txt` to create tables and seed data

4. **Configure database connection**
   - Ensure SQL Server Express is running
   - The default connection uses Windows Authentication (Trusted Connection)
   - Modify the connection string in `controller.js` if needed:
     ```javascript
     connectionString: "Driver={ODBC Driver 17 for SQL Server};Server=localhost\\SQLEXPRESS;Database=Pro_Pal_temp;Trusted_Connection=yes;"
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
| POST | `/signupcon` | Register as consumer |
| POST | `/signupman` | Register as manufacturer |
| GET | `/logout` | Logout user |

### Navigation
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` or `/home` | Homepage |
| GET | `/about` | About page |
| GET | `/contact` | Contact form |
| POST | `/contact` | Submit contact form |

### Profiles
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/editprofile` | Edit profile page |
| POST | `/update` | Update profile |
| GET | `/consumer` | Consumer dashboard |
| GET | `/manufuacturerp` | Manufacturer dashboard |
| GET | `/manufacturer/:id` | View manufacturer detail |

### Marketplace
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/explore` | Browse manufacturers |
| POST | `/searchexplore` | Search manufacturers |
| POST | `/review` | Submit review |

### Premium & Meetings
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/setpremconsum` | Upgrade to premium |
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

Consumers can manually upgrade to premium tiers for enhanced platform features.

## Screenshots

### Homepage
The landing page showcases top-rated manufacturers and platform features.

### Manufacturer Dashboard
Full-featured dashboard for managing products, meetings, and partnerships.

### Consumer Dashboard
Browse manufacturers, view profiles, and manage reviews.


## Future Improvements

- [ ] Implement password hashing for security
- [ ] Add input validation and sanitization
- [ ] Implement parameterized SQL queries
- [ ] Add environment variables for configuration
- [ ] Implement CSRF protection
- [ ] Add comprehensive error handling
- [ ] Create separate route modules (MVC architecture)
- [ ] Add unit and integration tests
- [ ] Implement real-time notifications
- [ ] Add messaging system between manufacturers and consumers


**Propal** - Connecting Manufacturers with Businesses
