# AirDoc - Hostinger VPS Deployment Guide

This guide details how to deploy **AirDoc** (`airdochealth.com`) to your Hostinger Linux VPS (Ubuntu 22.04 or 24.04).

---

## 1. Initial VPS Setup (One-Time)

Connect to your Hostinger VPS via SSH:
```bash
ssh root@YOUR_SERVER_IP
```

### Install Node.js (Node 20 or Node 22)
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js via NodeSource (Node 22 Recommended or Node 20 LTS)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs git build-essential nginx certbot python3-certbot-nginx

# Install PM2 Process Manager globally
sudo npm install -g pm2
```

---

## 2. Clone & Configure AirDoc

Navigate to your web directory (e.g. `/var/www/airdoc`):
```bash
sudo mkdir -p /var/www/airdoc
sudo chown -R $USER:$USER /var/www/airdoc
cd /var/www/airdoc

# Clone your repository
git clone <YOUR_GIT_REPO_URL> .
```

### Configure Environment Variables
Create your production `.env.production` or `.env.local`:
```bash
cp .env.example .env.production
nano .env.production
```

Set your production values:
```ini
# Port and runtime
PORT=3000
NODE_ENV=production

# Administrative Portal Authentication (Required)
# Accessible only at /admin - No public navigation links exist
ADMIN_PASSWORD=your_strong_secret_password_here
SESSION_SECRET=a_very_long_random_secret_string_here_12345

# Founder Notifications
ADMIN_NOTIFICATION_EMAIL=founders@airdochealth.com
EMAIL_FROM="AirDoc Network" <notifications@airdochealth.com>

# Hostinger SMTP Configuration
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=notifications@airdochealth.com
SMTP_PASS=your_mailbox_password_created_in_hpanel
SMTP_SECURE=true
```

---

## 3. Deploy & Start with PM2

Run the automated deployment script:
```bash
chmod +x deploy.sh
bash deploy.sh
```

Or execute manually:
```bash
npm install
npm run build
mkdir -p data
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Verify the app is running:
```bash
pm2 status
curl http://127.0.0.1:3000/api/health
```

---

## 4. Configure Nginx Reverse Proxy & Free SSL

Copy the provided Nginx configuration:
```bash
sudo cp nginx.conf.example /etc/nginx/sites-available/airdochealth.com
sudo nano /etc/nginx/sites-available/airdochealth.com
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/airdochealth.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### Issue Free SSL with Let's Encrypt (Certbot)
Ensure your domain's DNS `A` records point to your Hostinger VPS IP:
- `airdochealth.com` &rarr; `YOUR_SERVER_IP`
- `www.airdochealth.com` &rarr; `YOUR_SERVER_IP`

Then run Certbot:
```bash
sudo certbot --nginx -d airdochealth.com -d www.airdochealth.com
```
Certbot will configure SSL renewal automatically.

---

## 5. Ongoing Updates & Maintenance

Whenever you push new code to Git:
```bash
cd /var/www/airdoc
bash deploy.sh
```

### Data Persistence & Backups
All pilot submissions and shift requisitions are safely stored in:
`/var/www/airdoc/data/`

To backup data:
```bash
cp /var/www/airdoc/data/airdoc.sqlite /var/www/airdoc/data/airdoc.backup.sqlite
```

### Accessing the Secret Admin Portal
Visit `https://airdochealth.com/admin` in your browser and log in with your `ADMIN_PASSWORD`. You can inspect all submissions, update applicant statuses, write internal researcher notes, and click **Export CSV** to download leads at any time.

---

## 6. Hostinger Email Setup for notifications@airdochealth.com

To allow your website to dispatch official discovery receipts and founder notifications using `notifications@airdochealth.com`, complete these quick steps in your **Hostinger hPanel**:

### Step 1: Create the Email Account
1. Log into your **Hostinger Control Panel (hPanel)**.
2. Go to **Emails** &rarr; Select domain `airdochealth.com`.
3. Click **Create Email Account**:
   - **Email Address:** `notifications` (`notifications@airdochealth.com`)
   - **Password:** Choose a secure password (save this for your `.env.production`).

### Step 2: Note Your Hostinger SMTP Details
Hostinger provides two types of email hosting depending on your plan:

**Standard Hostinger Webmail:**
- **SMTP Host:** `smtp.hostinger.com`
- **Port:** `465` (SSL)
- **Username:** `notifications@airdochealth.com`
- **Password:** The password created in Step 1

*(If your Hostinger plan uses **Titan Email**, the SMTP host is `smtp.titan.email` instead).*

### Step 3: Verify DNS Records for High Deliverability (SPF, DKIM, DMARC)
In Hostinger hPanel &rarr; **Domains** &rarr; **airdochealth.com** &rarr; **DNS / Nameservers**:
1. **SPF Record (TXT)**: Hostinger automatically adds:
   `v=spf1 include:_spf.mail.hostinger.com ~all`
2. **DKIM Record (TXT)**: Hostinger automatically generates a DKIM key under `mail._domainkey`. Ensure it is active.
3. **DMARC Record (TXT)**: If not present, add a TXT record:
   - **Name / Host:** `_dmarc`
   - **Value:** `v=DMARC1; p=none; sp=none; rua=mailto:founders@airdochealth.com`

*Note: Having SPF, DKIM, and DMARC properly configured ensures your automated pilot receipts land directly in institutional hospital inboxes and do not get flagged by spam filters.*

### Step 4: Add SMTP Credentials to Your VPS
In your `/var/www/airdoc/.env.production` file:
```ini
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=notifications@airdochealth.com
SMTP_PASS=your_mailbox_password
SMTP_SECURE=true
```

Then reload the app:
```bash
pm2 restart airdoc-app
```
