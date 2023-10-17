resource "aws_dynamodb_table" "intents_data" {
  name         = var.db_table_intents_data_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
  attribute {
    name = "data"
    type = "S"
  }
  # Define a global secondary index (GSI) for data
  global_secondary_index {
    name            = "DataIndex"
    hash_key        = "data"
    projection_type = "ALL" # or "KEYS_ONLY" or "INCLUDE" as needed
  }
  tags = local.common_tags
}


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

  # Define a global secondary index (GSI) for titulo
  global_secondary_index {
    name            = "TituloIndex"
    hash_key        = "titulo"
    projection_type = "ALL" # or "KEYS_ONLY" or "INCLUDE" as needed
  }
  # Define a global secondary index (GSI) for tag
  global_secondary_index {
    name            = "TagIndex"
    hash_key        = "tag"
    projection_type = "ALL" # or "KEYS_ONLY" or "INCLUDE" as needed
  }
  # Define a global secondary index (GSI) for data
  global_secondary_index {
    name            = "DataIndex"
    hash_key        = "data"
    projection_type = "ALL" # or "KEYS_ONLY" or "INCLUDE" as needed
  }
  # Define a global secondary index (GSI) for texto
  global_secondary_index {
    name            = "TextoIndex"
    hash_key        = "texto"
    projection_type = "ALL" # or "KEYS_ONLY" or "INCLUDE" as needed
  }
  # Define a global secondary index (GSI) for link
  global_secondary_index {
    name            = "LinkIndex"
    hash_key        = "link"
    projection_type = "ALL" # or "KEYS_ONLY" or "INCLUDE" as needed
  }
  tags = local.common_tags
}

resource "aws_dynamodb_table" "lost_and_found" {
  name         = var.db_table_lost_and_found_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
  attribute {
    name = "descricao"
    type = "S"
  }
  attribute {
    name = "link_s3"
    type = "S"
  }
  attribute {
    name = "data"
    type = "S"
  }

  #  Define a global secondary index (GSI) for descricao
  global_secondary_index {
    name            = "DescricaoIndex"
    hash_key        = "descricao"
    projection_type = "ALL" # or "KEYS_ONLY" or "INCLUDE" as needed
  }
  # Define a global secondary index (GSI) for link_s3
  global_secondary_index {
    name            = "LinkS3Index"
    hash_key        = "link_s3"
    projection_type = "ALL" # or "KEYS_ONLY" or "INCLUDE" as needed
  }
  # Define a global secondary index (GSI) for data
  global_secondary_index {
    name            = "DataIndex"
    hash_key        = "data"
    projection_type = "ALL" # or "KEYS_ONLY" or "INCLUDE" as needed
  }
  tags = local.common_tags
}
