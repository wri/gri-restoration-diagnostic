# =============================================================================
# Production Environment Configuration
# =============================================================================

project_name = "rd-app"
environment  = "production"
aws_region   = "us-east-1"

# VPC Configuration - shares the QA VPC
# Set vpc_id to the QA VPC ID (from: cd infrastructure && terraform output -raw vpc_id  using QA backend)
# When vpc_id is set, vpc_cidr and availability_zones_count are ignored
vpc_id                   = "vpc-004a837db9c08ba78"
availability_zones_count = 2

# ECS Configuration - Higher resources for production
container_port   = 3000
container_cpu    = 512   # 0.5 vCPU
container_memory = 1024  # 1 GB
desired_count    = 2     # Higher for production
min_capacity     = 2
max_capacity     = 10

# Health Check
health_check_path = "/api/health"

# Application Environment Variables
app_environment_variables = {
  "LOG_LEVEL" = "info"
  "DATABASE_SSL_REJECT_UNAUTHORIZED" = "false"
  "SESSION_SECRET" = "Pnl3OtiP9l59AROw-pending-production-pwd"
}

certificate_arn = "arn:aws:acm:us-east-1:590183828939:certificate/4f5dc7d7-9b37-4795-8bb9-5415edeb7e79"
