variable "region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "sns_topic_name" {
  description = "Name of the SNS topic to send messages to developers"
}
variable "subscriptions" {
  description = "List of SNS subscriptions"
}

variable "bucket_lost_and_found_name" {
  description = "Name of the S3 bucket to store the images"
}

variable "db_table_lost_and_found_name" {
  description = "Name of the DynamoDB table to store the lost and found items"
}

variable "db_table_news_name" {
  description = "Name of the DynamoDB table to store the news"
}

variable "db_table_intents_data_name" {
  description = "Name of the DynamoDB table to store the intents data"
}

