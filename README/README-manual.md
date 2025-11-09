# Portfolio Website - Manual Setup Guide

## Prerequisites
- **AWS Account** with admin access
- **GitHub Account** 
- **Formspree Account** (free - sign up at https://formspree.io)
- **Text editor** (VS Code, Notepad++, or any editor)

## What You're Building
A professional portfolio website with this architecture:
- **Frontend**: HTML, CSS (Tailwind), JavaScript files
- **Hosting**: AWS S3 (static file storage) + CloudFront (fast global delivery)
- **CI/CD**: GitHub repository + GitHub Actions (automatic deployment)
- **Backend**: Formspree API (contact form email handling)

## Phase 1: Setup Formspree (5 minutes)

### Step 1: Create Your Contact Form Endpoint
1. Go to https://formspree.io and sign up (free)
2. Verify your email address
3. Click "New Form"
4. Give it a name (e.g., "Portfolio Contact Form")
5. Copy your form endpoint URL (looks like: `https://formspree.io/f/abc123xyz`)
6. Keep this URL handy - you'll need it in Phase 2

## Phase 2: Customize Your Files (10 minutes)

### Step 2: Update Your Portfolio Content
1. **Edit `script.js`** - Add your Formspree endpoint
   - Open `script.js` in your text editor
   - Find line 30: `const response = await fetch("https://formspree.io/f/mrbopjyq", {`
   - Replace `mrbopjyq` with your actual Formspree form ID from Phase 1
   - Save the file

2. **Edit `index.html`** - Personalize your information
   - Change your name (line 42): Replace "Mervyn Simons" with your name
   - Update your bio (line 43)
   - Modify your skills section (lines 54-60)
   - Update footer links (lines 103-105) with your GitHub, LinkedIn, Twitter
   - Save the file

3. **Edit `projects.js`** - Add your projects
   - Replace the sample projects with your actual projects
   - Update title, description, tags, and links
   - Save the file

4. **Test locally** (optional but recommended)
   - Open `index.html` in your web browser
   - Check that everything looks correct
   - Navigation should work smoothly

## Phase 3: Deploy to AWS (15 minutes)

### Step 3: Create S3 Bucket and CloudFront Distribution
1. **Create S3 Bucket**
   - Go to AWS Console → S3
   - Click "Create bucket"
   - Bucket name: `yourname-portfolio-2025` (must be globally unique)
   - Region: US East (N. Virginia) - us-east-1
   - **Uncheck** "Block all public access"
   - Check the acknowledgment box
   - Click "Create bucket"

2. **Enable Static Website Hosting**
   - Click on your new bucket
   - Go to "Properties" tab
   - Scroll to "Static website hosting" → Click "Edit"
   - Select "Enable"
   - Index document: `index.html`
   - Error document: `index.html`
   - Click "Save changes"

3. **Add Bucket Policy for Public Access**
   - Go to "Permissions" tab
   - Scroll to "Bucket policy" → Click "Edit"
   - Paste this policy (replace `YOUR-BUCKET-NAME` with your actual bucket name):
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

4. **Upload Your Files to S3**
   - Go to "Objects" tab
   - Click "Upload"
   - Drag and drop your 3 files: `index.html`, `script.js`, `projects.js`
   - Click "Upload"

5. **Create CloudFront Distribution**
   - Go to AWS Console → CloudFront
   - Click "Create distribution"
   - **Origin domain**: Select your S3 bucket from dropdown
   - **Origin access**: Select "Public"
   - **Viewer protocol policy**: "Redirect HTTP to HTTPS"
   - **Default root object**: `index.html`
   - Scroll down to "Settings" section
   - Click "Create distribution"
   - 📝 **Copy the Distribution ID** (you'll need this for GitHub)
   - 📝 **Copy the Distribution domain name** (this is your website URL)
   - ⏰ Wait 5-10 minutes for deployment status to change to "Enabled"

6. **Add Custom Error Response** (for proper navigation)
   - Click on your distribution ID
   - Go to "Error pages" tab
   - Click "Create custom error response"
   - HTTP error code: `404`
   - Response page path: `/index.html`
   - HTTP response code: `200`
   - Click "Create custom error response"

### Step 4: Create IAM User for GitHub Actions
1. **Create IAM Policy**
   - Go to AWS Console → IAM
   - Click "Policies" → "Create policy"
   - Click "JSON" tab
   - Paste this policy (replace `YOUR-BUCKET-NAME` with your bucket name):
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:DeleteObject",
           "s3:ListBucket"
         ],
         "Resource": [
           "arn:aws:s3:::YOUR-BUCKET-NAME",
           "arn:aws:s3:::YOUR-BUCKET-NAME/*"
         ]
       },
       {
         "Effect": "Allow",
         "Action": "cloudfront:CreateInvalidation",
         "Resource": "*"
       }
     ]
   }
   ```
   - Click "Next"
   - Policy name: `PortfolioGitHubDeployPolicy`
   - Click "Create policy"

2. **Create IAM User**
   - Go to "Users" → "Create user"
   - User name: `github-actions-deploy`
   - Click "Next"
   - Select "Attach policies directly"
   - Search for and select `PortfolioGitHubDeployPolicy`
   - Click "Next" → "Create user"

3. **Create Access Keys**
   - Click on your new user `github-actions-deploy`
   - Go to "Security credentials" tab
   - Click "Create access key"
   - Select "Application running outside AWS"
   - Click "Next" → "Create access key"
   - 📝 **IMPORTANT**: Copy both the Access Key ID and Secret Access Key
   - Keep these safe - you'll add them to GitHub in the next phase

## Phase 4: Setup GitHub Repository and CI/CD (15 minutes)

### Step 5: Create GitHub Repository
1. **Create New Repository**
   - Go to GitHub.com
   - Click "New repository" (green button)
   - Repository name: `portfolio-website`
   - Description: "My professional portfolio website"
   - Select "Public"
   - **Do NOT** initialize with README, .gitignore, or license
   - Click "Create repository"

2. **Upload Your Files**
   - On the repository page, click "uploading an existing file"
   - Drag and drop your 3 files: `index.html`, `script.js`, `projects.js`
   - Commit message: "Initial portfolio files"
   - Click "Commit changes"

### Step 6: Configure GitHub Secrets
1. **Add AWS Credentials to GitHub**
   - In your repository, go to "Settings" → "Secrets and variables" → "Actions"
   - Click "New repository secret" and add these 3 secrets one by one:
   
   **Secret 1:**
   - Name: `AWS_ACCESS_KEY_ID`
   - Value: Your Access Key ID from Phase 3, Step 4
   
   **Secret 2:**
   - Name: `AWS_SECRET_ACCESS_KEY`
   - Value: Your Secret Access Key from Phase 3, Step 4
   
   **Secret 3:**
   - Name: `S3_BUCKET_NAME`
   - Value: Your S3 bucket name (e.g., `yourname-portfolio-2025`)
   
   **Secret 4:**
   - Name: `CLOUDFRONT_DISTRIBUTION_ID`
   - Value: Your CloudFront Distribution ID from Phase 3, Step 5

### Step 7: Create GitHub Actions Workflow
1. **Create Workflow File**
   - In your repository, click "Add file" → "Create new file"
   - File name: `.github/workflows/deploy.yml`
   - Paste this workflow configuration:
   ```yaml
   name: Deploy to AWS
   
   on:
     push:
       branches: [main]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       
       steps:
         - name: Checkout code
           uses: actions/checkout@v3
         
         - name: Configure AWS credentials
           uses: aws-actions/configure-aws-credentials@v2
           with:
             aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
             aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
             aws-region: us-east-1
         
         - name: Sync files to S3
           run: |
             aws s3 sync . s3://${{ secrets.S3_BUCKET_NAME }} \
               --delete \
               --exclude ".git/*" \
               --exclude ".github/*"
         
         - name: Invalidate CloudFront cache
           run: |
             aws cloudfront create-invalidation \
               --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
               --paths "/*"
   ```
   - Commit message: "Add GitHub Actions deployment workflow"
   - Click "Commit changes"

2. **Verify Workflow Execution**
   - Go to "Actions" tab in your repository
   - You should see a workflow run starting automatically
   - Click on the workflow to see the progress
   - Wait for all steps to complete (should take 1-2 minutes)
   - ✅ All steps should show green checkmarks

## Phase 5: Test Your Website (5 minutes)

### Step 8: Test Website Functionality
1. **Visit Your Website**
   - Open your CloudFront URL (from Phase 3, Step 5)
   - The website should load with your customized content

2. **Test Navigation**
   - Click on each navigation link (Home, About, Projects, Contact)
   - Smooth scrolling should work
   - Test on mobile device or resize browser window

3. **Test Contact Form**
   - Fill out the contact form with test data
   - Click "Send Message"
   - You should see "Message sent successfully!"
   - Check your email (the one you used for Formspree) for the test message

4. **Test CI/CD Pipeline**
   - Go to your GitHub repository
   - Click on `index.html` → Click the pencil icon (Edit)
   - Make a small change (e.g., add "- Updated!" to your name)
   - Commit message: "Test automatic deployment"
   - Click "Commit changes"
   - Go to "Actions" tab → Watch the workflow run
   - Wait 2-3 minutes after completion
   - Refresh your CloudFront URL → Your change should appear!

### Verification Checklist
- ✅ Website loads on CloudFront URL
- ✅ All navigation links work
- ✅ Mobile responsive design works
- ✅ Contact form sends emails successfully
- ✅ GitHub Actions automatically deploys changes
- ✅ Changes appear on live site after deployment

🎉 **Congratulations!** Your portfolio website is live with automatic deployment!

## What You've Built
Your portfolio website now has:
- **Frontend**: Static HTML/CSS/JS files hosted on S3
- **CDN**: CloudFront distribution for fast global delivery
- **CI/CD**: Automatic deployment via GitHub Actions
- **Backend**: Formspree API handling contact form submissions
- **Security**: HTTPS enabled via CloudFront

## Next Steps
1. **Customize Further**
   - Add more projects to `projects.js`
   - Update your skills and bio in `index.html`
   - Add your social media links

2. **Optional Enhancements**
   - Purchase a custom domain (e.g., yourname.com)
   - Add Google Analytics for visitor tracking
   - Create a blog section
   - Add more interactive features

3. **Share Your Work**
   - Add your CloudFront URL to your resume
   - Share on LinkedIn
   - Include in job applications

## Troubleshooting

### S3 Issues
- **403 Forbidden Error**: Check that bucket policy is correctly applied and "Block all public access" is unchecked
- **Bucket name already exists**: S3 bucket names must be globally unique - add numbers or your name

### CloudFront Issues
- **Distribution taking too long**: Initial deployment can take 10-15 minutes - be patient
- **Old content showing**: Go to CloudFront → Your distribution → Invalidations → Create invalidation → Path: `/*`

### GitHub Actions Issues
- **Workflow fails**: Check that all 4 secrets are correctly set in repository settings
- **Permission denied**: Verify IAM policy has correct bucket name and permissions
- **Secrets not found**: Make sure secret names match exactly (case-sensitive)

### Contact Form Issues
- **Form not submitting**: Verify Formspree endpoint URL in `script.js` is correct
- **No email received**: Check spam folder and verify Formspree account is active

### How to Check
- **S3**: AWS Console → S3 → Your bucket should have 3 files
- **CloudFront**: AWS Console → CloudFront → Status should be "Enabled"
- **GitHub Actions**: Repository → Actions tab → Latest workflow should be green
- **IAM**: AWS Console → IAM → Users → Your user should have the policy attached

## Estimated AWS Costs
- **S3 Storage**: ~$0.50/month (for small portfolio)
- **CloudFront**: ~$1-2/month (with free tier)
- **Data Transfer**: Mostly covered by free tier
- **Total**: ~$1-3/month for typical usage

Note: AWS Free Tier includes 50 GB CloudFront data transfer and 5 GB S3 storage for 12 months.