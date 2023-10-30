resource "aws_s3_bucket" "authentication_bucket" {
  bucket = var.auth_bucket
  tags   = local.common_tags
}

resource "aws_ssm_parameter" "auth-bucket-param" {
  name  = "uffs-bot-auth-bucket-name"
  type  = "String"
  value = aws_s3_bucket.authentication_bucket.bucket
}


resource "aws_s3_bucket" "news_bucket" {
  bucket = var.news_bucket
  tags   = local.common_tags
}

resource "aws_s3_bucket_ownership_controls" "news_bucket" {
  bucket = aws_s3_bucket.news_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "news_bucket" {
  bucket                  = aws_s3_bucket.news_bucket.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "news_bucket" {

  depends_on = [
    aws_s3_bucket_ownership_controls.news_bucket,
    aws_s3_bucket_public_access_block.news_bucket
  ]

  bucket = aws_s3_bucket.news_bucket.id
  acl    = "public-read"
}


resource "aws_s3_bucket_policy" "news_bucket" {
  bucket = aws_s3_bucket.news_bucket.id
  policy = data.aws_iam_policy_document.news_bucket.json
}

data "aws_iam_policy_document" "news_bucket" {
  statement {
    principals {
      type        = "AWS"
      identifiers = ["*"]
    }
    actions = [
      "s3:GetObject"
    ]

    resources = [
      aws_s3_bucket.news_bucket.arn,
      "${aws_s3_bucket.news_bucket.arn}/*"
    ]
  }

  statement {
    principals {
      type        = "AWS"
      identifiers = ["*"]
    }
    actions = [
      "s3:PutObject"
    ]
    resources = [
      aws_s3_bucket.news_bucket.arn,
      "${aws_s3_bucket.news_bucket.arn}/*",
    ]
  }
}

resource "aws_ssm_parameter" "news_bucket_param" {
  name  = "uffs-bot-news-bucket-name"
  type  = "String"
  value = aws_s3_bucket.news_bucket.bucket

}
