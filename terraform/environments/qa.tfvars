# =============================================================================
# QA Environment Configuration
# =============================================================================

project_name = "rd-app"
environment  = "qa"
aws_region   = "us-east-1"

# VPC Configuration
vpc_cidr                 = "10.0.0.0/16"
availability_zones_count = 2

# ECS Configuration
container_port   = 3000
container_cpu    = 256   # 0.25 vCPU
container_memory = 512   # 512 MB
desired_count    = 1     # Lower for QA
min_capacity     = 1
max_capacity     = 2

# Health Check
health_check_path = "/api/health"

# Application Environment Variables
# some of these should be secret and will be changed shortly
app_environment_variables = {
  "LOG_LEVEL" = "debug"
  "DB_HOST" = "rd-app-db2.c9o0i0gg61en.us-east-1.rds.amazonaws.com"
  "DB_PORT" = "5432"
  "DB_USER" = "postgres"
  "DB_PASSWORD" = "ePim6ipwl8OTKLxTZbPa"
  "DB_NAME" = "qa"
  "SESSION_SECRET" = "Pnl3OtiP9l59AROw-qa-pwd"
  "DATABASE_SSL_REJECT_UNAUTHORIZED" = "false"

certificate_arn = "arn:aws:acm:us-east-1:590183828939:certificate/4f5dc7d7-9b37-4795-8bb9-5415edeb7e79"
domain_name     = "qa.restorationdiagnostic.org"
