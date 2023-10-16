terraform {
  backend "s3" {
    bucket = "tofu-backend"              # Change this to your bucket name
    key    = "terraform.tfstate" # Change this to the path of the state file inside the bucket
    region = "us-east-1"                   # Change this to your region
  }
}

provider "aws" {
  region = var.region

  default_tags {
    tags = {
      owner      = "equipe1"
      managed_by = "terraform"
    }
  }
}
