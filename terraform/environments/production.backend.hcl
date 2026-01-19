# Backend configuration for Production environment
bucket         = "rd-app-terraform-state-shared"
key            = "production/terraform.tfstate"
region         = "us-east-1"
dynamodb_table = "rd-app-terraform-locks-shared"
encrypt        = true
