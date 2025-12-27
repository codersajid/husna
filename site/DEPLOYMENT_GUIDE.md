# Husna Engineering Website - Deployment Guide

## Pre-Deployment Checklist

### ✅ Files Ready for Upload
All files in `f:\azad_web\site\` directory are ready for deployment.

### 📧 Email Configuration (CRITICAL)

**Before uploading, update the email address in `send_quote.php`:**

```php
// Line 6: Change this to your actual email
$toEmail = 'husnaengconst@outlook.com';
```

**Note:** The email in your files had `&` instead of `@`. Make sure to use the correct format:
- ❌ Wrong: `husnaeng&const@outlook.com`
- ✅ Correct: `husnaengconst@outlook.com` (or your actual email)

---

## Deployment Steps for GoDaddy

### Step 1: Upload Files via cPanel File Manager

1. **Login to GoDaddy cPanel**
   - Go to your GoDaddy hosting dashboard
   - Click on "cPanel" or "Web Hosting"

2. **Open File Manager**
   - Navigate to File Manager in cPanel
   - Go to `public_html` folder (this is your website root)

3. **Upload All Files**
   - Upload ALL files from `f:\azad_web\site\` to `public_html`
   - Maintain the folder structure:
     ```
     public_html/
     ├── index.html
     ├── about.html
     ├── contact.html
     ├── send_quote.php
     ├── assets/
     │   ├── gallery/
     │   ├── js/
     │   ├── logo.jpeg
     │   └── certificate.pdf
     └── (all other HTML files)
     ```

### Step 2: Set File Permissions

1. **PHP File Permissions**
   - Right-click on `send_quote.php`
   - Click "Change Permissions"
   - Set to `644` (Owner: Read+Write, Group: Read, Public: Read)

2. **Folder Permissions**
   - `assets/` folder: `755`
   - All subfolders: `755`

### Step 3: Test PHP Mail Function

1. **Create a test file** `test_mail.php` in `public_html`:
   ```php
   <?php
   $to = 'husnaengconst@outlook.com';
   $subject = 'Test Email from Husna Website';
   $message = 'This is a test email to verify mail() function works.';
   $headers = 'From: noreply@yourdomain.com';
   
   if(mail($to, $subject, $message, $headers)) {
       echo 'Email sent successfully!';
   } else {
       echo 'Email sending failed!';
   }
   ?>
   ```

2. **Visit** `https://yourdomain.com/test_mail.php` in browser
3. **Check your email** (including spam folder)
4. **Delete test file** after verification

### Step 4: Configure Domain (if needed)

1. **Point Domain to Hosting**
   - In GoDaddy domain settings
   - Update nameservers to your hosting nameservers
   - Wait 24-48 hours for DNS propagation

2. **SSL Certificate**
   - In cPanel, go to "SSL/TLS Status"
   - Enable "AutoSSL" for your domain
   - This provides HTTPS (free with most GoDaddy plans)

---

## Deployment Steps for Hostinger

### Step 1: Upload Files via File Manager

1. **Login to Hostinger hPanel**
   - Go to hostinger.com and login
   - Select your hosting plan

2. **Open File Manager**
   - Click "File Manager" in hPanel
   - Navigate to `public_html` folder

3. **Upload Files**
   - Click "Upload Files" button
   - Select all files from `f:\azad_web\site\`
   - Wait for upload to complete

### Step 2: PHP Configuration

Hostinger usually has PHP mail() enabled by default, but verify:

1. **Check PHP Version**
   - In hPanel, go to "Advanced" → "PHP Configuration"
   - Ensure PHP 7.4 or higher is selected

2. **Test Email Sending**
   - Use the same test file method as GoDaddy (above)

### Step 3: SSL & Domain Setup

1. **SSL Certificate**
   - In hPanel, go to "Security" → "SSL"
   - Install free Let's Encrypt SSL certificate
   - Force HTTPS redirect

2. **Domain Configuration**
   - If using custom domain, update nameservers in domain registrar
   - Point to Hostinger nameservers

---

## Post-Deployment Testing

### 1. Test All Pages
Visit each page and verify:
- ✅ `https://yourdomain.com/` (Homepage)
- ✅ `https://yourdomain.com/about.html`
- ✅ `https://yourdomain.com/services.html`
- ✅ `https://yourdomain.com/capabilities.html`
- ✅ `https://yourdomain.com/projects.html`
- ✅ `https://yourdomain.com/gallery.html`
- ✅ `https://yourdomain.com/why-us.html`
- ✅ `https://yourdomain.com/clients.html`
- ✅ `https://yourdomain.com/contact.html`

### 2. Test Contact Form
1. Go to `https://yourdomain.com/contact.html`
2. Fill out the form with test data
3. Submit the form
4. Check if you receive the email
5. Verify all form fields appear in the email

### 3. Test Certificate PDF
1. Go to About page
2. Click "View Certificate" button
3. Verify PDF opens in new tab
4. Click "Download PDF" button
5. Verify PDF downloads

### 4. Test Mobile Responsiveness
- Open website on mobile device
- Test navigation menu
- Test contact form submission
- Test floating action buttons (Call, WhatsApp, Quote)

---

## Troubleshooting

### Issue: Form Submits but No Email Received

**Solution 1: Check Spam Folder**
- Check your spam/junk folder
- Mark email as "Not Spam"

**Solution 2: Verify Email Address**
- Double-check email in `send_quote.php` line 6
- Ensure no typos (especially `@` symbol)

**Solution 3: Use SMTP Instead of mail()**
If PHP mail() doesn't work, use PHPMailer with SMTP:

1. Download PHPMailer: https://github.com/PHPMailer/PHPMailer
2. Upload to `public_html/phpmailer/`
3. Update `send_quote.php` to use SMTP (Gmail, Outlook, etc.)

**Solution 4: Contact Hosting Support**
- Ask them to enable PHP mail() function
- Request SMTP credentials if mail() is blocked

### Issue: 500 Internal Server Error

**Possible Causes:**
1. Wrong file permissions on `send_quote.php`
   - Set to `644`
2. PHP syntax error
   - Check PHP error logs in cPanel
3. Missing PHP extensions
   - Contact hosting support

### Issue: Form Shows "Method Not Allowed"

**Solution:**
- Verify form action in `contact.html` is `send_quote.php`
- Ensure method is `POST`
- Check file uploaded correctly

### Issue: Images Not Loading

**Solution:**
1. Verify folder structure maintained during upload
2. Check image paths are relative (not absolute)
3. Ensure `assets/` folder uploaded completely
4. Check file permissions on images (644)

---

## Security Recommendations

### 1. Protect PHP Files
Add to `.htaccess` in `public_html`:
```apache
# Prevent direct access to PHP files (except send_quote.php)
<FilesMatch "\.php$">
    Order Allow,Deny
    Allow from all
</FilesMatch>
```

### 2. Limit Upload Size
In `send_quote.php`, file uploads limited to 5MB (already configured)

### 3. Honeypot Protection
Spam protection via hidden field (already configured in form)

### 4. Regular Backups
- Use cPanel backup feature weekly
- Download backups to local computer

---

## Performance Optimization (Optional)

### 1. Enable Gzip Compression
Add to `.htaccess`:
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

### 2. Browser Caching
Add to `.htaccess`:
```apache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### 3. Image Optimization
- Images already optimized in `assets/gallery/`
- Consider WebP format for future images

---

## Contact Information Display

Your website displays:
- **Phone:** +91-9113311263
- **Email:** husnaengconst@outlook.com (verify this is correct!)
- **Address:** AL-Jamal Campus, Bhuidhra Chowk Jail Road, Samastipur, Bihar - 848101
- **Location:** Google Maps embedded

---

## Support & Maintenance

### Regular Updates
- Update team information in `about.html` as needed
- Add new projects to `projects.html` and `gallery.html`
- Update certificates in `assets/` folder

### Monitoring
- Check email inbox regularly for quote requests
- Monitor website uptime
- Review form submissions weekly

### Backup Schedule
- **Weekly:** Full website backup
- **Monthly:** Database backup (if you add one later)
- **Before Updates:** Always backup before making changes

---

## Quick Reference

| Item | Value |
|------|-------|
| **Website Root** | `public_html/` |
| **Contact Form Handler** | `send_quote.php` |
| **Email Recipient** | Update in `send_quote.php` line 6 |
| **Certificate PDF** | `assets/certificate.pdf` |
| **Logo** | `assets/logo.jpeg` |
| **Gallery Images** | `assets/gallery/` |

---

## Final Checklist Before Going Live

- [ ] Updated email address in `send_quote.php`
- [ ] Uploaded all files to `public_html`
- [ ] Set correct file permissions (644 for PHP, 755 for folders)
- [ ] Tested PHP mail function
- [ ] Installed SSL certificate (HTTPS)
- [ ] Tested contact form submission
- [ ] Verified email received
- [ ] Tested all page links
- [ ] Tested on mobile device
- [ ] Checked certificate PDF opens
- [ ] Verified Google Maps loads
- [ ] Tested WhatsApp and call buttons
- [ ] Checked all images load correctly

---

## Need Help?

**Hosting Support:**
- **GoDaddy:** 1-480-505-8877 or support.godaddy.com
- **Hostinger:** Live chat at hostinger.com/contact

**Website Issues:**
- Check PHP error logs in cPanel
- Review browser console for JavaScript errors
- Test form with different browsers

---

**Good luck with your deployment! 🚀**

Your website is professional, comprehensive, and ready for production hosting.
