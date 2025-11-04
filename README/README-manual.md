# Portfolio Website - Manual Setup

## Architecture Overview
- **Frontend**: S3 + CloudFront
- **Backend**: Formspree API
- **CI/CD**: GitHub Actions → S3
- **Email**: Formspree handles email delivery

## Prerequisites
- AWS Account with admin access
- GitHub Account
- AWS CLI installed and configured
- Git installed locally
- Text editor (VS Code recommended)
- FormsSpree Account

## User Journey - Complete Manual Setup

### Phase 1: Environment Setup (5 minutes)

1. **Verify prerequisites**
   ```bash
   aws --version
   git --version
   aws sts get-caller-identity
   ```
 
2. **Clone and prepare project**
   ```bash
   git clone <your-repo-url>
   cd portfolio-website
   ```

### Phase 2: AWS Infrastructure Setup (15 minutes)

3. **Create S3 Bucket with unique name**
   ```bash
   # Replace 'yourname' with your actual name
   BUCKET_NAME="yourname-portfolio-$(date +%s)"
   echo "Using bucket name: $BUCKET_NAME"
   # Create bucket
   aws s3 mb s3://$BUCKET_NAME
   
   # Enable static website hosting
   aws s3 website s3://$BUCKET_NAME \
     --index-document index.html \
     --error-document index.html
   ```
   Bucket created successfully!

4. **Create and apply bucket policy**
   ```bash
   # Create bucket policy file
   cat > bucket-policy.json << EOF
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
       }
     ]
   }
   EOF
   
   # Apply bucket policy
   aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json
   ```

5. **Create CloudFront distribution**
   ```bash
   # Create CloudFront config
   cat > cloudfront-config.json << EOF
   {
     "CallerReference": "portfolio-$(date +%s)",
     "Origins": {
       "Quantity": 1,
       "Items": [
         {
           "Id": "S3-$BUCKET_NAME",
           "DomainName": "$BUCKET_NAME.s3.amazonaws.com",
           "S3OriginConfig": {
             "OriginAccessIdentity": ""
           }
         }
       ]
     },
     "DefaultCacheBehavior": {
       "TargetOriginId": "S3-$BUCKET_NAME",
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
   EOF
   
   # Create distribution
   aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
   ```
   📝 Note down the Distribution ID from output

### Phase 3: Formspree Setup (5 minutes)

6. **Setup Formspree account**
   - Visit https://formspree.io
   - Sign up with your email
   - Verify email address
   - Create new form project
   - Copy the form endpoint URL

7. **Update contact form endpoint**
   ```bash
   # Edit script.js and replace the Formspree URL
   # Find line: const response = await fetch("https://formspree.io/f/YOUR_FORM_ID"
   # Replace YOUR_FORM_ID with your actual form ID
   ```

### Phase 4: GitHub Actions Setup (10 minutes)

8. **Create GitHub repository**
   ```bash
   # If not already done
   git remote add origin https://github.com/yourusername/portfolio-website.git
   ```

9. **Setup GitHub Actions workflow**
   ```bash
   mkdir -p .github/workflows
   cat > .github/workflows/deploy.yml << 'EOF'
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
   EOF
   ```

10. **Configure GitHub repository secrets**
    - Go to GitHub repository
    - Click Settings → Secrets and variables → Actions
    - Click "New repository secret" for each:
      - `AWS_ACCESS_KEY_ID`: Your AWS access key
      - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key  
      - `S3_BUCKET_NAME`: Your bucket name from step 3
      - `CLOUDFRONT_ID`: Distribution ID from step 5

### Phase 5: Customization and Testing (10 minutes)

11. **Personalize your portfolio**
    ```bash
    # Edit index.html - update name, bio, skills
    # Edit projects.js - add your real projects
    # Test locally by opening index.html in browser
    ```

12. **Initial deployment test**
    ```bash
    # Manual upload to test
    aws s3 sync . s3://$BUCKET_NAME --exclude ".git/*" --exclude "*.json"
    
    # Get CloudFront URL
    aws cloudfront list-distributions --query 'DistributionList.Items[0].DomainName'
    ```
    ✅ Visit the CloudFront URL to verify site works

13. **Deploy via GitHub Actions**
    ```bash
    git add .
    git commit -m "Initial portfolio deployment"
    git push origin main
    ```
    
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

### Verification Commands
```bash
# Check bucket exists
aws s3 ls | grep $BUCKET_NAME

# Check CloudFront distributions
aws cloudfront list-distributions --query 'DistributionList.Items[*].{Id:Id,Status:Status}'

# Test website
curl -I https://your-cloudfront-url.cloudfront.net
```

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