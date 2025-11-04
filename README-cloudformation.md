# Portfolio Website - CloudFormation Deployment

## Architecture Overview
- **Frontend**: S3 + CloudFront
- **Backend**: Formspree API
- **CI/CD**: GitHub Actions → S3
- **Email**: Formspree handles email delivery

## Prerequisites
- AWS Account with admin access
- AWS CLI configured with credentials
- GitHub account
- Git installed locally
- Text editor (VS Code recommended)

## User Journey - Step by Step

### Phase 1: Setup Local Environment (5 minutes)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd portfolio-website
   ```

2. **Verify AWS credentials are configured**
   ```bash
   aws sts get-caller-identity
   ```
   ✅ Should return your AWS account details

### Phase 2: Deploy AWS Infrastructure (10 minutes)

3. **Create CloudFormation stack**
   ```bash
   aws cloudformation create-stack \
     --stack-name portfolio-website \
     --template-body file://cloudformation.yaml \
     --parameters ParameterKey=DomainName,ParameterValue=yourname-portfolio
   ```

4. **Wait for stack creation (5-8 minutes)**
   ```bash
   aws cloudformation wait stack-create-complete --stack-name portfolio-website
   ```

5. **Get stack outputs**
   ```bash
   aws cloudformation describe-stacks --stack-name portfolio-website --query 'Stacks[0].Outputs'
   ```
   📝 Note down: S3BucketName and CloudFrontDistributionId

### Phase 3: Setup Formspree Backend (3 minutes)

6. **Create Formspree account**
   - Go to https://formspree.io
   - Sign up with email
   - Create new form
   - Copy the form endpoint URL

7. **Update contact form**
   - Open `script.js`
   - Replace line 18: `"https://formspree.io/f/YOUR_FORM_ID"`
   - Save file

### Phase 4: Configure GitHub Actions (5 minutes)

8. **Create GitHub repository secrets**
   - Go to GitHub repo → Settings → Secrets and variables → Actions
   - Add these secrets:
     - `AWS_ACCESS_KEY_ID`: Your AWS access key
     - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
     - `S3_BUCKET_NAME`: From CloudFormation output
     - `CLOUDFRONT_DISTRIBUTION_ID`: From CloudFormation output

9. **Create workflow directory and file**
   ```bash
   mkdir -p .github/workflows
   # Copy the deploy.yml content from below into .github/workflows/deploy.yml
   ```

### Phase 5: Customize and Deploy (10 minutes)

10. **Personalize your portfolio**
    - Edit `index.html`: Update name, bio, skills
    - Edit `projects.js`: Add your actual projects
    - Test locally by opening `index.html` in browser

11. **Deploy to production**
    ```bash
    git add .
    git commit -m "Initial portfolio deployment"
    git push origin main
    ```

12. **Verify deployment**
    - Check GitHub Actions tab for successful deployment
    - Visit your CloudFront URL (from step 5)
    - Test contact form

### Phase 6: Testing and Validation (5 minutes)

13. **Test website functionality**
    - ✅ Navigation works
    - ✅ Mobile responsive
    - ✅ Contact form sends email
    - ✅ Projects display correctly

14. **Performance check**
    - Test loading speed
    - Verify HTTPS is working
    - Check on mobile device

**Total Time: ~40 minutes**

## Troubleshooting Common Issues

- **CloudFormation fails**: Check AWS permissions
- **GitHub Actions fails**: Verify all secrets are set
- **Contact form not working**: Check Formspree endpoint
- **Website not loading**: Wait for CloudFront propagation (up to 15 minutes)

## Files Structure
```
portfolio-website/
├── .github/workflows/deploy.yml
├── cloudformation.yaml
├── index.html
├── script.js
├── projects.js
└── README-cloudformation.md
```

## CloudFormation Template
Create `cloudformation.yaml`:
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Portfolio Website Infrastructure'

Parameters:
  DomainName:
    Type: String
    Description: Domain name for the website
    Default: portfolio.example.com

Resources:
  # S3 Bucket for static website
  WebsiteBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub '${DomainName}-portfolio'
      WebsiteConfiguration:
        IndexDocument: index.html
        ErrorDocument: index.html
      PublicAccessBlockConfiguration:
        BlockPublicAcls: false
        BlockPublicPolicy: false
        IgnorePublicAcls: false
        RestrictPublicBuckets: false

  # Bucket Policy
  WebsiteBucketPolicy:
    Type: AWS::S3::BucketPolicy
    Properties:
      Bucket: !Ref WebsiteBucket
      PolicyDocument:
        Statement:
          - Sid: PublicReadGetObject
            Effect: Allow
            Principal: '*'
            Action: 's3:GetObject'
            Resource: !Sub '${WebsiteBucket}/*'

  # CloudFront Distribution
  CloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Origins:
          - DomainName: !GetAtt WebsiteBucket.RegionalDomainName
            Id: S3Origin
            S3OriginConfig:
              OriginAccessIdentity: ''
        Enabled: true
        DefaultRootObject: index.html
        DefaultCacheBehavior:
          TargetOriginId: S3Origin
          ViewerProtocolPolicy: redirect-to-https
          AllowedMethods:
            - GET
            - HEAD
          CachedMethods:
            - GET
            - HEAD
          ForwardedValues:
            QueryString: false
            Cookies:
              Forward: none
        PriceClass: PriceClass_100
        CustomErrorResponses:
          - ErrorCode: 404
            ResponseCode: 200
            ResponsePagePath: /index.html

Outputs:
  WebsiteURL:
    Description: URL of the website
    Value: !GetAtt CloudFrontDistribution.DomainName
  
  S3BucketName:
    Description: Name of the S3 bucket
    Value: !Ref WebsiteBucket
    Export:
      Name: !Sub '${AWS::StackName}-S3Bucket'
  
  CloudFrontDistributionId:
    Description: CloudFront Distribution ID
    Value: !Ref CloudFrontDistribution
    Export:
      Name: !Sub '${AWS::StackName}-CloudFrontId'
```

## GitHub Actions Workflow
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy Portfolio Website

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
      
      - name: Deploy to S3
        run: |
          aws s3 sync . s3://${{ secrets.S3_BUCKET_NAME }} \
            --delete \
            --exclude ".git/*" \
            --exclude ".github/*" \
            --exclude "*.md" \
            --exclude "cloudformation.yaml"
      
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"
```

## Cost Estimate
- S3: ~$1-5/month
- CloudFront: ~$1-10/month
- Route53: $0.50/month per hosted zone
- ACM: Free

## Next Steps After Workshop

### Immediate Customizations
- Add your real projects to `projects.js`
- Update social media links in footer
- Add your professional photo
- Customize color scheme in Tailwind classes

### Advanced Features
- Add Google Analytics
- Implement dark/light mode toggle
- Add blog section
- Integrate with CMS (Contentful/Strapi)

### Domain Setup (Optional)
- Purchase domain from Route53 or external provider
- Update CloudFormation with custom domain
- Configure SSL certificate