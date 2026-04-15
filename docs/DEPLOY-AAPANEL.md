# Deploy HRM2 lên VPS với Docker + aaPanel

## Yêu cầu VPS tối thiểu

| Thông số | Tối thiểu | Khuyến nghị |
|----------|-----------|-------------|
| RAM | 2 GB | 4 GB |
| CPU | 2 vCPU | 4 vCPU |
| Disk | 20 GB SSD | 40 GB SSD |
| OS | Ubuntu 22.04 / 24.04 | Ubuntu 24.04 |

---

## Bước 1: Cài aaPanel + Docker

### 1.1 Cài aaPanel

```bash
# SSH vào VPS
ssh root@<IP_VPS>

# Cài aaPanel (Ubuntu/Debian)
wget -O install.sh https://www.aapanel.com/script/install_7.0_en.sh && bash install.sh aapanel
```

Sau khi cài xong, aaPanel sẽ hiện:
```
aaPanel Internet Address: http://<IP>:7800/<random>
username: xxxxxxxx
password: xxxxxxxx
```

**Lưu lại thông tin này!**

### 1.2 Cài Docker qua aaPanel

1. Đăng nhập aaPanel Web UI
2. Vào **Docker** menu (sidebar trái)
3. Nếu chưa cài → Click **Install Docker**
4. Đợi cài xong

Hoặc cài bằng SSH:
```bash
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

# Cài docker compose plugin
apt install docker-compose-plugin -y

# Verify
docker --version
docker compose version
```

---

## Bước 2: Đưa code lên VPS

### Cách 1: Git clone (khuyến nghị)

```bash
# Trên VPS
mkdir -p /www/wwwroot
cd /www/wwwroot
git clone <REPO_URL> hrm2
cd hrm2
```

### Cách 2: Upload qua aaPanel File Manager

1. Vào aaPanel → **Files**
2. Navigate tới `/www/wwwroot/`
3. Upload file zip, rồi giải nén

### Cách 3: SCP từ máy local

```bash
# Từ máy Windows (PowerShell)
scp -r D:\hrm2 root@<IP_VPS>:/www/wwwroot/hrm2
```

---

## Bước 3: Cấu hình Environment

```bash
cd /www/wwwroot/hrm2

# Copy template
cp .env.production.example .env.production

# Sửa file — điền giá trị thật
nano .env.production
```

**Các giá trị BẮT BUỘC phải thay:**

```bash
# Generate secrets tự động
echo "AUTH_SECRET=$(openssl rand -base64 32)"
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)"
echo "MEILISEARCH_MASTER_KEY=$(openssl rand -base64 32)"
echo "CRON_SECRET=$(openssl rand -hex 32)"
echo "DB_PASSWORD=$(openssl rand -base64 24)"
```

Copy output trên vào `.env.production`, đồng thời sửa:
- `NEXTAUTH_URL=https://your-domain.com` → domain thật
- `NEXT_PUBLIC_BASE_URL=https://your-domain.com` → domain thật
- `DATABASE_URL` → đổi password cho khớp với `DB_PASSWORD`

---

## Bước 4: Build & Chạy Docker

```bash
cd /www/wwwroot/hrm2

# Build và start tất cả services
docker compose -f docker-compose.prod.yml up -d --build

# Lần đầu build mất ~5-10 phút
# Xem logs build
docker compose -f docker-compose.prod.yml logs -f app
```

### Chạy Database Migration (lần đầu)

```bash
# Chờ postgres healthy
docker compose -f docker-compose.prod.yml exec app sh

# Trong container:
npx prisma migrate deploy
npx tsx prisma/seed.ts   # (optional) seed dữ liệu mẫu
exit
```

Hoặc chạy 1 lệnh từ ngoài:
```bash
docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

### Kiểm tra

```bash
# Xem tất cả containers
docker compose -f docker-compose.prod.yml ps

# Kỳ vọng 3 services đều "Up (healthy)":
# hrm2-postgres   - Up (healthy)
# hrm2-meilisearch - Up (healthy)  
# hrm2-app         - Up

# Test app chạy
curl http://localhost:3000
```

---

## Bước 5: Cấu hình Reverse Proxy qua aaPanel

### 5.1 Tạo Website trong aaPanel

1. Vào **Website** → **Add site**
2. Domain: `erp.your-domain.com`
3. Chọn **Static** (không cần PHP/Java)
4. Click **Submit**

### 5.2 Cấu hình Reverse Proxy

1. Click vào site vừa tạo → **Reverse Proxy**
2. Click **Add Reverse Proxy**
3. Điền:
   - **Name**: `hrm2`
   - **Target URL**: `http://127.0.0.1:3000`
   - **Send Domain**: `$host`
4. Click **Submit**

### 5.3 Cài SSL (HTTPS)

1. Click vào site → **SSL**
2. Chọn **Let's Encrypt**
3. Tick domain → Click **Apply**
4. Bật **Force HTTPS**

### 5.4 Tối ưu Nginx (quan trọng cho WebSocket/SSE)

Click vào site → **Config** → sửa Nginx config, thêm vào block `location /`:

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # Tăng timeout cho API chậm
    proxy_read_timeout 120s;
    proxy_send_timeout 120s;
    
    # Tăng body size cho upload file
    client_max_body_size 20M;
}
```

---

## Bước 6: Cấu hình Firewall

### Qua aaPanel:
1. Vào **Security** → **Firewall**
2. Mở port: **80** (HTTP), **443** (HTTPS)
3. **KHÔNG** mở port 3000, 5433, 7700 ra ngoài (chỉ dùng internal)

### Qua SSH:
```bash
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 7800/tcp   # aaPanel (nên đổi port sau)
ufw enable
```

---

## Quản lý thường ngày

### Xem logs

```bash
# Logs app
docker compose -f docker-compose.prod.yml logs -f app

# Logs database
docker compose -f docker-compose.prod.yml logs -f postgres

# Logs meilisearch
docker compose -f docker-compose.prod.yml logs -f meilisearch
```

### Cập nhật code mới

```bash
cd /www/wwwroot/hrm2

# Pull code mới
git pull origin main

# Rebuild + restart (không downtime cho DB)
docker compose -f docker-compose.prod.yml up -d --build app

# Chạy migration nếu có schema mới
docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

### Restart services

```bash
# Restart app only
docker compose -f docker-compose.prod.yml restart app

# Restart tất cả
docker compose -f docker-compose.prod.yml restart

# Stop tất cả
docker compose -f docker-compose.prod.yml down

# Stop + xóa data (NGUY HIỂM)
docker compose -f docker-compose.prod.yml down -v
```

### Backup Database

```bash
# Backup
docker compose -f docker-compose.prod.yml exec postgres pg_dump -U erp_user erp_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore
cat backup_20260416.sql | docker compose -f docker-compose.prod.yml exec -T postgres psql -U erp_user erp_db
```

### Kiểm tra tài nguyên

```bash
# RAM/CPU usage
docker stats

# Disk usage
docker system df
```

---

## Troubleshooting

| Vấn đề | Giải pháp |
|--------|-----------|
| App không start | `docker compose -f docker-compose.prod.yml logs app` — kiểm tra lỗi |
| DB connection refused | Kiểm tra postgres healthy: `docker compose -f docker-compose.prod.yml ps` |
| 502 Bad Gateway | App chưa start xong hoặc crash — check logs |
| Build lỗi OOM | Tăng RAM VPS hoặc thêm swap: `fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile` |
| Permission denied uploads | `docker compose -f docker-compose.prod.yml exec app chown -R nextjs:nodejs /app/uploads` |
| Prisma migration lỗi | Kiểm tra DATABASE_URL đúng chưa, postgres đã healthy chưa |
| SSL không được | Đảm bảo DNS A record trỏ đúng IP VPS |

---

## Cấu trúc Services

```
VPS (aaPanel)
├── Nginx (aaPanel) ─── :443 (SSL) ──→ reverse proxy
│                                          │
│                                          ▼
├── Docker
│   ├── hrm2-app ────────── :3000 (Next.js)
│   ├── hrm2-postgres ───── :5432 (internal only)
│   └── hrm2-meilisearch ── :7700 (internal only)
│
└── Volumes
    ├── postgres_data (DB persistent)
    ├── meilisearch_data (search index)
    └── app_uploads (uploaded files)
```
