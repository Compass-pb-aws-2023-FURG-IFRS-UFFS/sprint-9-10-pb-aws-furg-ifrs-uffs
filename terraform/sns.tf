resource "aws_sns_topic" "snsTopic" {
  name = var.sns_topic_name
}

resource "aws_sns_topic_subscription" "developers_subscription" {
  count       = length(var.subscriptions)
  topic_arn   = aws_sns_topic.snsTopic.arn
  protocol    = "email"
  endpoint    = element(var.subscriptions, count.index)
}

resource "aws_ssm_parameter" "developers-topic-arn"{
  name = "uffs-bot-developers-topic-arn"
  type = "String"
  value = aws_sns_topic.snsTopic.arn
}