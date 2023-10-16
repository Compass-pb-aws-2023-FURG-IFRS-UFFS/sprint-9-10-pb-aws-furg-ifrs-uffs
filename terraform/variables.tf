variable "region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "sns_topic_name" {
  description = "Name of the SNS topic to send messages to developers"
}
variable "subscriptions"{
    description = "List of SNS subscriptions"
}

variable "bucket_name" {
  description = "Name of the S3 bucket to store the images"
  default = "teste-terraform-2021-04-27"
}

