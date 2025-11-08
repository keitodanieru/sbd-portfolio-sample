# Portfolio Website - Manual Setup

## Architecture Overview
- **Frontend**: S3 + CloudFront
- **Backend**: Formspree API
- **CI/CD**: GitHub Actions → S3
- **Email**: Formspree handles email delivery

## Prerequisites
- AWS Account with admin access
- GitHub Account
- Git installed locally
- Text editor (VS Code recommended)
- FormsSpree Account

## User Journey - Complete Manual Setup

### Phase 1: Environment Setup (5 minutes)

1. **Download project files**
   - Download or clone the portfolio-website repository
   - Extract to your local machine
   - Open the folder in your text editor

### Phase 2: AWS Infrastructure Setup (15 minutes)

2. **Create S3 Bucket**
   - Go to AWS Console → S3
   - Click "Create bucket"
   - Bucket name: `yourname-portfolio-2025` (replace yourname)
   - Region: US East (N. Virginia)
   - Uncheck "Block all public access"
   - Check "I acknowledge that the current settings might result in this bucket and the objects within becoming public"
   - Click "Create bucket"

3. **Enable static website hosting**
   - Click on your bucket name
   - Go to Properties tab
   - Scroll to "Static website hosting"
   - Click "Edit"
   - Select "Enable"
   - Index document: `index.html`
   - Error document: `index.html`
   - Click "Save changes"
   - 📝 Note the website endpoint URL

4. **Configure bucket policy**
   - Go to Permissions tab
   - Scroll to "Bucket policy"
   - Click "Edit"
   - Paste this policy (replace YOUR-BUCKET-NAME):
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
       }
     ]
   }
   ```
   - Click "Save changes"

5. **Create CloudFront distribution**
   - Go to AWS Console → CloudFront
   - Click "Create distribution"
   - Origin domain: Select your S3 bucket from dropdown
   - Origin access: "Public"
   - Viewer protocol policy: "Redirect HTTP to HTTPS"
   - Default root object: `index.html`
   - Custom error pages:
     - Click "Create custom error response"
     - HTTP error code: 404
     - Response page path: `/index.html`
     - HTTP response code: 200
   - Click "Create distribution"
   - 📝 Note the Distribution ID and Domain name

### Phase 3: Formspree Setup (5 minutes)

6. **Setup Formspree account**
   - Visit https://formspree.io
   - Sign up with your email
   - Verify email address
   - Create new form project
   - Copy the form endpoint URL

7. **Update contact form endpoint**
   - Open `script.js` in your text editor
   - Find line: `const response = await fetch("https://formspree.io/f/YOUR_FORM_ID"`
   - Replace `YOUR_FORM_ID` with your actual form ID from Formspree
   - Save the file

### Phase 4: GitHub Actions Setup (10 minutes)

8. **Create GitHub repository**
   - Go to GitHub.com
   - Click "New repository"
   - Repository name: `portfolio-website`
   - Make it public
   - Click "Create repository"
   - Upload your project files or use Git commands

9. **Setup GitHub Actions workflow**
   - In your project folder, create `.github/workflows/` directory
   - Create file `deploy.yml` with this content:
   ```yaml
   name: Deploy to S3
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Configure AWS
           uses: aws-actions/configure-aws-credentials@v2
           with:
             aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
             aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
             aws-region: us-east-1
         - name: Deploy to S3
           run: |
             aws s3 sync . s3://${{ secrets.S3_BUCKET_NAME }} --delete --exclude ".git/*" --exclude ".github/*"
             aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_ID }} --paths "/*"
   ```

10. **Configure GitHub repository secrets**
    - Go to your GitHub repository
    - Click Settings → Secrets and variables → Actions
    - Click "New repository secret" for each:
      - `AWS_ACCESS_KEY_ID`: Your AWS access key
      - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key  
      - `S3_BUCKET_NAME`: Your bucket name from step 2
      - `CLOUDFRONT_ID`: Distribution ID from step 5

### Phase 5: Customization and Testing (10 minutes)

11. **Personalize your portfolio**
    - Edit `index.html` - update name, bio, skills
    - Edit `projects.js` - add your real projects
    - Test locally by opening `index.html` in browser

12. **Initial deployment test**
    - Go to AWS Console → S3 → Your bucket
    - Click "Upload"
    - Drag and drop your project files (index.html, script.js, projects.js)
    - Click "Upload"
    - Visit your CloudFront URL to verify site works
    ✅ Website should load correctly

13. **Deploy via GitHub Actions**
    - Commit and push your files to GitHub
    - Go to GitHub → Actions tab
    - Watch the deployment process
    - ✅ Should complete successfully

### Phase 6: Final Testing (5 minutes)

14. **Complete functionality test**
    - ✅ Website loads on CloudFront URL
    - ✅ Navigation works smoothly
    - ✅ Mobile responsive design
    - ✅ Contact form submits successfully
    - ✅ Check email for form submission

**Total Time: ~50 minutes**

## Required Configuration Files

### bucket-policy.json
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-portfolio-bucket-name/*"
    }
  ]
}
```

### cloudfront-config.json
```json
{
  "CallerReference": "portfolio-website-2025",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-your-portfolio-bucket-name",
        "DomainName": "your-portfolio-bucket-name.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-your-portfolio-bucket-name",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    }
  },
  "Comment": "Portfolio Website Distribution",
  "Enabled": true
}
```

## Testing
1. Upload files to S3: `aws s3 sync . s3://your-bucket-name`
2. Visit CloudFront URL
3. Test contact form

## Troubleshooting Guide

### Common Issues and Solutions

**S3 Bucket Issues:**
- **403 Forbidden**: Check bucket policy is applied correctly
- **Bucket name taken**: Use timestamp in bucket name for uniqueness

**CloudFront Issues:**
- **Distribution not working**: Wait 10-15 minutes for propagation
- **Old content showing**: Create cache invalidation

**GitHub Actions Issues:**
- **Deployment fails**: Verify all 4 secrets are set correctly
- **Permission denied**: Check AWS IAM user has S3 and CloudFront permissions

**Contact Form Issues:**
- **Form not submitting**: Check Formspree endpoint URL
- **No email received**: Verify Formspree account and form setup

### Verification Steps
- **S3 Bucket**: Go to S3 Console → Check your bucket exists and has files
- **CloudFront**: Go to CloudFront Console → Check distribution status is "Deployed"
- **Website**: Visit your CloudFront URL in browser

## Cost Estimate
- S3 Storage: $1-3/month
- CloudFront: $1-8/month  
- Data Transfer: $0-2/month
- **Total: $2-13/month**

## Next Steps
- Purchase custom domain
- Add SSL certificate
- Implement analytics
- Add more interactive features