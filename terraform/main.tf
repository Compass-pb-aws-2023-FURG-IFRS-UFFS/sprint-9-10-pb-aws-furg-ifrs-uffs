provider "aws" {
  region = var.region

  default_tags {
    tags = {
      owner      = "equipe1"
      managed_by = "terraform"
    }
  }
}