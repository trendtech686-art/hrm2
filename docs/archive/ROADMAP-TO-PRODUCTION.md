# Roadmap to Production - HRM2 System

> **Created:** November 11, 2025  
> **Target:** Deploy to VPS with PostgreSQL  
> **Current Status:** ✅ Code audit complete, features in development

---

## 🎯 MỤC TIÊU CUỐI CÙNG

**Deploy website lên VPS với:**
- Frontend: React + Vite
- Backend: Node.js/Express hoặc tương đương
- Database: PostgreSQL trên server
- Domain: Custom domain
- SSL: HTTPS certificate
- Backup: Automated database backup

---

## 📊 CURRENT STATUS (November 11, 2025)

### ✅ Completed
- [x] Dual ID System audit (100%)
- [x] TypeScript compile errors fixed (0 errors)
- [x] 47/47 features audited
- [x] Code structure standardized
- [x] Development guidelines documented

### 🚧 In Progress
- [ ] Backend API development
- [ ] Database schema finalization
- [ ] Authentication & Authorization
- [ ] Business logic completion
- [ ] Testing framework

### ⏳ Not Started
- [ ] Production build optimization
- [ ] VPS setup & configuration
- [ ] PostgreSQL migration
- [ ] CI/CD pipeline
- [ ] Monitoring & logging

---

## 🗓️ GIAI ĐOẠN 1: HOÀN THIỆN CHỨC NĂNG (1-2 tháng)

### Week 1-2: Backend Foundation

**Priority 1: API Architecture**
```
[ ] Chọn backend framework:
    - Option 1: Express.js + TypeScript (recommended)
    - Option 2: NestJS (enterprise grade)
    - Option 3: Fastify (high performance)

[ ] Database Design:
    - Finalize PostgreSQL schema
    - Design relationships & indexes
    - Migration strategy from current data
    - Backup & restore procedures

[ ] API Structure:
    /api/v1/
      /auth/          - Login, register, logout, refresh token
      /employees/     - CRUD + filters + pagination
      /customers/     - CRUD + filters + pagination
      /products/      - CRUD + inventory tracking
      /orders/        - CRUD + status workflow
      /vouchers/      - CRUD + payment/receipt logic
      /warranty/      - CRUD + tracking + SLA
      /complaints/    - CRUD + workflow + compensation
      ... (all 47 features)
```

**Priority 2: Authentication & Security**
```
[ ] JWT Authentication:
    - Access token (15 min)
    - Refresh token (7 days)
    - Token blacklist for logout
    
[ ] Authorization:
    - Role-based access control (RBAC)
    - Permission system
    - Employee roles: Admin, Manager, Staff, etc.
    
[ ] Security:
    - Password hashing (bcrypt)
    - Rate limiting
    - CORS configuration
    - Input validation & sanitization
    - SQL injection prevention
```

### Week 3-4: Core Business Logic

**Priority 1: Critical Features** (Must have for launch)
```
[ ] Employees Management:
    - CRUD operations
    - Department & branch assignment
    - Leave & attendance tracking
    - Salary calculation
    
[ ] Customer Management:
    - CRUD operations
    - Contact history
    - Debt tracking
    - Customer segmentation
    
[ ] Product & Inventory:
    - CRUD operations
    - Stock tracking (real-time)
    - Multiple units handling
    - Low stock alerts
    - Stock adjustment & reconciliation
    
[ ] Orders Management:
    - Order creation with multiple products
    - Status workflow (Pending → Processing → Completed/Cancelled)
    - Payment tracking
    - Shipping integration
    - Order history & search
    
[ ] Vouchers (Receipts & Payments):
    - Create PT (receipts) & PC (payments)
    - Link to orders/warranty/customers
    - Cash account tracking
    - Balance validation
    - Audit trail
```

**Priority 2: Important Features** (Should have)
```
[ ] Warranty System:
    - Warranty creation & tracking
    - SLA monitoring & alerts
    - Status workflow
    - Product replacement/repair
    - Linked vouchers handling
    - Customer notifications
    
[ ] Complaints Management:
    - Complaint registration
    - Priority & category assignment
    - Workflow tracking
    - Compensation handling
    - Resolution tracking
    
[ ] Purchase Orders:
    - PO creation to suppliers
    - Receiving goods
    - Payment to suppliers
    - Stock updates
    
[ ] Reports & Analytics:
    - Sales reports (daily/monthly/yearly)
    - Inventory reports
    - Employee performance
    - Financial reports
    - Dashboard widgets
```

**Priority 3: Nice to Have** (Can wait)
```
[ ] Advanced Features:
    - Shipment tracking (GHTK integration)
    - SMS/Email notifications
    - Barcode scanning
    - Print templates customization
    - Wiki documentation
    - Task management
    - Advanced pricing rules
```

### Week 5-6: Integration & Data Flow

**Frontend ↔ Backend Integration**
```
[ ] Replace Zustand local stores with API calls:
    
    Before (Local):
    const { data } = useCustomerStore();
    
    After (API):
    const { data, isLoading } = useQuery({
      queryKey: ['customers'],
      queryFn: () => api.customers.list()
    });

[ ] Setup API Client:
    - Axios instance with interceptors
    - React Query for data fetching
    - Optimistic updates
    - Error handling
    - Loading states
    - Retry logic

[ ] State Management Strategy:
    - Server state: React Query (API data)
    - Client state: Zustand (UI state, filters, preferences)
    - Form state: React Hook Form
    - Auth state: Context + localStorage
```

**Database Migration**
```
[ ] Create migration scripts:
    - Convert initial-data.ts to SQL INSERT statements
    - Maintain relationships (systemId → foreign keys)
    - Preserve data integrity
    - Test migration locally

[ ] Seed Data:
    - Demo data for testing
    - Production initial data (admin user, basic settings)
```

### Week 7-8: Testing & Bug Fixes

**Testing Strategy**
```
[ ] Unit Tests:
    - Backend API endpoints
    - Business logic functions
    - Utility functions
    - Validation schemas
    
[ ] Integration Tests:
    - API workflow tests
    - Database transaction tests
    - Authentication flow
    - Complex business scenarios
    
[ ] E2E Tests (Optional):
    - Critical user flows
    - Order creation flow
    - Payment flow
    - Warranty workflow
    
[ ] Manual Testing:
    - Full feature testing
    - Cross-browser testing
    - Mobile responsive testing
    - Performance testing
```

**Bug Tracking**
```
[ ] Setup issue tracking:
    - GitHub Issues or
    - Trello board or
    - Notion database
    
[ ] Categorize bugs:
    - Critical (blocks usage)
    - High (major feature broken)
    - Medium (minor issues)
    - Low (cosmetic)
```

---

## 🗓️ GIAI ĐOẠN 2: CHUẨN BỊ PRODUCTION (2-3 tuần)

### Week 9: Production Build & Optimization

**Frontend Optimization**
```
[ ] Build Configuration:
    - Vite production build
    - Code splitting
    - Tree shaking
    - Image optimization
    - Font optimization
    
[ ] Performance:
    - Lazy loading components
    - Memoization (React.memo, useMemo)
    - Virtual scrolling for large lists
    - Debounce search inputs
    - Compress images
    
[ ] SEO & Meta Tags:
    - Page titles
    - Meta descriptions
    - Open Graph tags
    - Favicon
    
[ ] Error Handling:
    - Error boundaries
    - 404 page
    - Network error handling
    - User-friendly error messages
```

**Backend Optimization**
```
[ ] Database Optimization:
    - Add indexes on frequently queried fields
    - Optimize N+1 queries
    - Connection pooling
    - Query performance analysis
    
[ ] API Optimization:
    - Response caching
    - Compression (gzip)
    - Pagination for large datasets
    - Rate limiting
    
[ ] Logging:
    - Request/response logging
    - Error logging
    - Performance monitoring
    - Audit trail logging
```

### Week 10: VPS Setup & Configuration

**1. Chọn VPS Provider** (Recommended cho Vietnam)
```
Option 1: VNETWORK (Vietnam)
- Price: ~200k-500k VND/month
- Good Vietnam network
- Support Vietnamese

Option 2: DigitalOcean (International)
- Price: $6-12 USD/month (Droplet)
- Excellent docs
- Easy to use
- Global network

Option 3: Vultr (International)
- Price: $6-12 USD/month
- Good Asia network
- Similar to DigitalOcean

Option 4: AWS Lightsail (Enterprise)
- Price: $5-20 USD/month
- Amazon infrastructure
- Scalable

Recommendation: Start with DigitalOcean or VNETWORK
```

**2. VPS Specifications** (Minimum)
```
CPU: 2 cores
RAM: 2GB (minimum) - 4GB (recommended)
Storage: 50GB SSD
OS: Ubuntu 22.04 LTS
Location: Singapore or Vietnam data center
```

**3. Server Setup Checklist**
```
[ ] Initial Setup:
    - Create non-root user
    - Setup SSH key authentication
    - Disable root login
    - Configure firewall (UFW)
    - Update system packages
    
[ ] Install Software:
    - Node.js (v20 LTS)
    - PostgreSQL 15
    - Nginx (reverse proxy)
    - PM2 (process manager)
    - Certbot (SSL certificates)
    - Git
    
[ ] Security Hardening:
    - Change SSH port
    - Install Fail2Ban
    - Configure automatic updates
    - Setup firewall rules
    - Regular security patches
```

### Week 11: Database Migration to PostgreSQL

**Setup PostgreSQL on VPS**
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database & user
sudo -u postgres psql
CREATE DATABASE hrm2_production;
CREATE USER hrm2_user WITH PASSWORD 'strong_password_here';
GRANT ALL PRIVILEGES ON DATABASE hrm2_production TO hrm2_user;

# Configure remote access (if needed)
# Edit /etc/postgresql/15/main/postgresql.conf
listen_addresses = 'localhost'  # Keep localhost for security

# Edit /etc/postgresql/15/main/pg_hba.conf
# Add connection rules
```

**Database Schema Migration**
```
[ ] Create migration files:
    - Use Prisma ORM (recommended) or
    - Sequelize or
    - TypeORM or
    - Raw SQL migrations
    
[ ] Schema Structure:
    employees, customers, products, orders,
    vouchers, warranty, complaints, suppliers,
    purchase_orders, sales_returns, etc.
    
[ ] Relationships:
    - Foreign keys with proper constraints
    - Indexes on systemId fields
    - Unique constraints on business IDs
    
[ ] Data Migration:
    - Export data from current system
    - Transform to match schema
    - Import into PostgreSQL
    - Verify data integrity
```

**Backup Strategy**
```bash
# Daily automated backup
[ ] Setup cron job for pg_dump:
    0 2 * * * pg_dump -U hrm2_user hrm2_production > /backup/hrm2_$(date +\%Y\%m\%d).sql

[ ] Backup retention:
    - Keep daily backups for 7 days
    - Keep weekly backups for 1 month
    - Keep monthly backups for 1 year
    
[ ] Offsite backup:
    - Sync to cloud storage (AWS S3, Google Cloud Storage)
    - Or separate backup server
```

### Week 12: Deployment & Testing

**Deploy Backend**
```bash
# Clone repository
git clone https://github.com/yourusername/hrm2-backend.git
cd hrm2-backend

# Install dependencies
npm install --production

# Setup environment variables
cp .env.example .env
nano .env
# Edit: DATABASE_URL, JWT_SECRET, etc.

# Run database migrations
npm run migrate

# Start with PM2
pm2 start npm --name "hrm2-api" -- start
pm2 save
pm2 startup
```

**Deploy Frontend**
```bash
# Build locally
npm run build
# Output: dist/

# Upload to VPS
scp -r dist/* user@your-vps-ip:/var/www/hrm2/

# Configure Nginx
sudo nano /etc/nginx/sites-available/hrm2

server {
    listen 80;
    server_name your-domain.com;
    root /var/www/hrm2;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/hrm2 /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**Setup SSL (HTTPS)**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal (already setup by certbot)
sudo certbot renew --dry-run
```

**Testing on Production**
```
[ ] Functional Testing:
    - All features work correctly
    - Data persists properly
    - Performance is acceptable
    
[ ] Security Testing:
    - HTTPS working
    - Authentication required
    - Authorization working
    - No exposed secrets
    
[ ] Performance Testing:
    - Load time < 3 seconds
    - API response < 500ms
    - Database queries optimized
    
[ ] Monitoring:
    - Setup uptime monitoring
    - Error tracking (Sentry)
    - Performance monitoring
```

---

## 🗓️ GIAI ĐOẠN 3: LAUNCH & MAINTENANCE (Ongoing)

### Launch Preparation

**Pre-Launch Checklist**
```
[ ] Technical:
    - All features tested
    - Backup system working
    - Monitoring setup
    - SSL certificate valid
    - DNS configured
    - Error logging working
    
[ ] Content:
    - User documentation
    - Admin guide
    - API documentation
    - FAQ
    
[ ] Business:
    - User accounts created
    - Initial data loaded
    - Training completed
    - Support plan ready
```

**Launch Day**
```
[ ] Go Live:
    - Switch DNS to VPS IP
    - Monitor for issues
    - Be ready for hotfixes
    - Communicate with users
    
[ ] First Week:
    - Daily monitoring
    - Quick bug fixes
    - User feedback collection
    - Performance tuning
```

### Ongoing Maintenance

**Daily Tasks**
```
- Monitor error logs
- Check system health
- Review performance metrics
- Respond to user issues
```

**Weekly Tasks**
```
- Review backup logs
- Security updates
- Performance optimization
- Bug fixes
- Feature requests review
```

**Monthly Tasks**
```
- Full system audit
- Database optimization
- Security audit
- Backup restore test
- Update dependencies
```

---

## 📚 TECHNOLOGY STACK RECOMMENDATION

### Backend
```javascript
Framework: Express.js + TypeScript
Database: PostgreSQL 15
ORM: Prisma (recommended) or TypeORM
Authentication: JWT (jsonwebtoken)
Validation: Zod or Joi
Testing: Jest + Supertest
Documentation: Swagger/OpenAPI
```

### Frontend (Current)
```javascript
Framework: React + TypeScript
Build: Vite
State: React Query + Zustand
Forms: React Hook Form
UI: Shadcn/ui + Tailwind CSS
Routing: React Router
Icons: Lucide React
```

### DevOps
```bash
Server: Ubuntu 22.04 LTS
Web Server: Nginx
Process Manager: PM2
Database: PostgreSQL
SSL: Let's Encrypt (Certbot)
Monitoring: PM2 + Sentry (optional)
Backup: Automated pg_dump + Cloud storage
```

---

## 💰 COST ESTIMATION

### Development Phase (1-2 months)
```
Developer time: Your time
Tools: Free (VS Code, Git, etc.)
Testing: Free (local)
Total: $0 (your time only)
```

### Production Phase (Monthly)
```
VPS Hosting: $6-12 USD (~150k-300k VND)
Domain Name: $10-15 USD/year (~250k-400k VND/năm)
SSL Certificate: Free (Let's Encrypt)
Backup Storage: $5 USD (~120k VND) - optional
Monitoring: Free (basic) or $5-20 (advanced)

Total: ~$11-32 USD/month (~280k-800k VND/tháng)
```

### Scalability Costs (Future)
```
If users grow:
- Upgrade VPS: $20-50 USD/month
- CDN: $5-20 USD/month
- Better monitoring: $20-50 USD/month
- Backup service: $10-20 USD/month
```

---

## 🎯 MILESTONES & TIMELINE

### Phase 1: Development (Week 1-8)
```
Week 1-2: ✅ Backend API foundation
Week 3-4: ✅ Core business logic
Week 5-6: ✅ Frontend integration
Week 7-8: ✅ Testing & bug fixes
```

### Phase 2: Production Prep (Week 9-12)
```
Week 9:  ✅ Build optimization
Week 10: ✅ VPS setup
Week 11: ✅ Database migration
Week 12: ✅ Deployment & testing
```

### Phase 3: Launch (Week 13+)
```
Week 13: 🚀 Soft launch (internal users)
Week 14: 📊 Monitoring & fixes
Week 15: 🎉 Public launch
Week 16+: 🔄 Ongoing maintenance
```

---

## 📖 LEARNING RESOURCES

### Backend Development
```
- Express.js: https://expressjs.com/
- PostgreSQL: https://www.postgresql.org/docs/
- Prisma: https://www.prisma.io/docs
- JWT: https://jwt.io/introduction
- REST API: https://restfulapi.net/
```

### DevOps & Deployment
```
- DigitalOcean Tutorials: https://www.digitalocean.com/community/tutorials
- Ubuntu Server Guide: https://ubuntu.com/server/docs
- Nginx: https://nginx.org/en/docs/
- PM2: https://pm2.keymetrics.io/docs/
- PostgreSQL on Ubuntu: https://www.postgresql.org/download/linux/ubuntu/
```

### Security
```
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Security Best Practices: https://cheatsheetseries.owasp.org/
- Let's Encrypt: https://letsencrypt.org/getting-started/
```

---

## 🆘 TROUBLESHOOTING GUIDE

### Common Issues & Solutions

**Issue: Database connection failed**
```
Solution:
1. Check PostgreSQL is running: sudo systemctl status postgresql
2. Verify credentials in .env
3. Check pg_hba.conf for connection rules
4. Test connection: psql -U hrm2_user -d hrm2_production
```

**Issue: Frontend can't connect to API**
```
Solution:
1. Check API is running: pm2 list
2. Verify Nginx proxy config
3. Check CORS settings in backend
4. Test API directly: curl http://localhost:3000/api/health
```

**Issue: SSL certificate not working**
```
Solution:
1. Check certbot logs: sudo certbot certificates
2. Verify DNS points to VPS IP
3. Re-run certbot: sudo certbot --nginx -d your-domain.com
4. Check Nginx config: sudo nginx -t
```

**Issue: Out of memory**
```
Solution:
1. Add swap space: sudo fallocate -l 2G /swapfile
2. Upgrade VPS RAM
3. Optimize database queries
4. Enable caching
```

**Issue: Slow performance**
```
Solution:
1. Add database indexes
2. Enable API response caching
3. Optimize images (compress, lazy load)
4. Use CDN for static assets
5. Enable gzip compression in Nginx
```

---

## ✅ CHECKLIST - QUICK REFERENCE

### Before Starting Development
- [ ] Choose backend framework
- [ ] Design database schema
- [ ] Setup local PostgreSQL
- [ ] Create API documentation structure

### Before Deployment
- [ ] All features tested
- [ ] Production build working
- [ ] Environment variables configured
- [ ] Database backup strategy ready
- [ ] Domain name purchased
- [ ] VPS account created

### After Deployment
- [ ] SSL working
- [ ] All features accessible
- [ ] Database backup running
- [ ] Monitoring setup
- [ ] Error tracking working
- [ ] Documentation updated

---

## 📞 NEXT ACTIONS

### This Week
```
1. Decide on backend framework (Express.js recommended)
2. Design PostgreSQL schema for critical features
3. Setup local backend project
4. Create first API endpoint
5. Test frontend → backend connection
```

### This Month
```
1. Complete core feature APIs
2. Migrate from Zustand to API calls
3. Setup PostgreSQL locally
4. Test data migration
5. Complete authentication system
```

### Next Month
```
1. Complete all feature development
2. Full testing
3. Purchase VPS & domain
4. Deploy to production
5. Launch! 🚀
```

---

**Created by:** GitHub Copilot AI Assistant  
**Date:** November 11, 2025  
**Status:** Living document - update as progress is made  
**Next Review:** Weekly during development

---

# 🎯 YOUR IMMEDIATE NEXT STEPS

1. **Choose Backend Framework** (Today)
   - Recommended: Express.js + TypeScript
   
2. **Design Database Schema** (This Week)
   - Start with core tables: employees, customers, products, orders
   
3. **Setup Local Backend** (This Week)
   - Create project structure
   - Configure PostgreSQL locally
   - Create first API endpoint
   
4. **Start Development** (Next Week)
   - Begin with authentication
   - Then tackle core features one by one

**Good luck anh! Cần support gì thì hỏi em nhé! 💪**
