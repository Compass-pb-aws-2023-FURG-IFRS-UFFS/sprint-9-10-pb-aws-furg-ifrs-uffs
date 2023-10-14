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


