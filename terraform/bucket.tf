resource "aws_s3_bucket" "authentication_bucket" {
  bucket = var.auth_bucket
  tags = local.common_tags
}


resource "aws_ssm_parameter" "auth-bucket-param"{
  name = "uffs-bot-auth-bucket-name"
  type = "String"
  value = aws_s3_bucket.authentication_bucket.bucket
}