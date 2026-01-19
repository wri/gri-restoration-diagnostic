# Backend configuration for QA environment
bucket         = "rd-app-terraform-state-shared"
key            = "qa/terraform.tfstate"
region         = "us-east-1"
dynamodb_table = "rd-app-terraform-locks-shared"
encrypt        = true
