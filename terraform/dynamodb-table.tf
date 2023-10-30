resource "aws_dynamodb_table" "news" {
  name         = var.db_table_news_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
  attribute {
    name = "titulo"
    type = "S"
  }
  attribute {
    name = "tag"
    type = "S"
  }
  attribute {
    name = "data"
    type = "S"
  }
  attribute {
    name = "texto"
    type = "S"
  }
  attribute {
    name = "link"
    type = "S"
  }

  attribute {
    name = "audio_link"
    type = "S"
  }
  global_secondary_index {
    name            = "TituloIndex"
    hash_key        = "titulo"
    projection_type = "ALL"
  }
  global_secondary_index {
    name            = "TagIndex"
    hash_key        = "tag"
    projection_type = "ALL"
  }
  global_secondary_index {
    name            = "DataIndex"
    hash_key        = "data"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "TextoIndex"
    hash_key        = "texto"
    projection_type = "ALL"
  }
  global_secondary_index {
    name            = "LinkIndex"
    hash_key        = "link"
    projection_type = "ALL"
  }
  global_secondary_index {
    name            = "AudioLinkIndex"
    hash_key        = "audio_link"
    projection_type = "ALL"
  }

  tags = local.common_tags
}

resource "aws_ssm_parameter" "news-table-name" {
  name  = "uffs-bot-news-table-name"
  type  = "String"
  value = aws_dynamodb_table.news.name
}

resource "aws_dynamodb_table" "bot-users-table" {
  name         = var.db_table_cc_bot_users
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_ssm_parameter" "bot-users-table-name" {
  name  = "uffs-bot-users-table-name"
  type  = "String"
  value = aws_dynamodb_table.bot-users-table.name
}
