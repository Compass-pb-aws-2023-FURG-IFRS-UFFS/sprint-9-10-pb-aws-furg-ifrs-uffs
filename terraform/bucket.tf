resource "aws_s3_bucket" "bucket" {
  bucket = var.bucket_lost_and_found_name
  tags = local.common_tags
}
