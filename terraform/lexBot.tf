resource "aws_cloudformation_stack" "finalSprintBotStackv1" {
  name = "finalSprintBotStackv1"

  template_body = jsonencode({
    Resources = {
        schoolAssistantBot = {
            Type = "AWS::Lex::Bot"
            Properties = {
                Name                    = "finalSprintBot"
                Description             = "Ajuda imigrantes fracófonos com informações úteis e orientações no Brasil."
                IdleSessionTTLInSeconds = 300
                RoleArn                 = aws_iam_role.finalSprintBotIamRoleStackv1.arn
                AutoBuildBotLocales     = true

                BotTags = [
                    {
                    Key   = "Terraform"
                    Value = "true"
                    }
                ]

                DataPrivacy = {
                    ChildDirected = false
                }

                BotLocales = [{
                    LocaleId               = "pt_BR"
                    NluConfidenceThreshold = 0.4

                    Intents = [
                    {
                        Name = "IntroductionIntent"
                        Description = "Intent de boas vindas ao bot."
                        FulfillmentCodeHook = {
                            Enabled = true
                        }
                        SampleUtterances = [
                            { Utterance = "ola" },
                            { Utterance = "salut" }
                        ]
                    },
                    {
                        Name = "HelpsIntent"
                        Description = "Intent que retorna as opções de ajuda para o usuário imigrante."
                        InitialResponseSetting = {
                            InitialResponse = {
                                MessageGroupsList = [{
                                Message = {
                                    # ImageResponseCard = {
                                    #     Title    = "Opções"
                                    #     Subtitle = "Escolha uma das opções abaixo para acionar a ajuda!"
                                    #     Buttons  = [{
                                    #         "Text": "Como fazer documentos",
                                    #         "Value": "HowToMakeDocs"
                                    #     },
                                    #     {
                                    #         "Text": "Contatos de emergência",
                                    #         "Value": "EmergencyContacts"
                                    #     },
                                    #     {
                                    #         "Text": "Dicas de localização",
                                    #         "Value": "CepToTip"
                                    #     },
                                    #     {
                                    #         "Text": "Tradutor de texto e áudio",
                                    #         "Value": "TextAudioTranslater"
                                    #     },
                                    #     {
                                    #         "Text": "Extrator de texto de imagem",
                                    #         "Value": "ImageTextExtraction"
                                    #     }]
                                    # }
                                    PlainTextMessage = {
                                        Value = "Escolha uma das opções abaixo para acionar a ajuda! (Digite o número da opção)\n\n 1. Como Fazer Documentos de Imigração\n 2. Contatos de Emergência\n 3. Locais de Interesse Conforme Região\n 4. Tradutor de Texto e Áudio\n 5. Extrator de Texto em Imagens"
                                    }
                                }
                                }]
                            }
                        }
                        SampleUtterances = [
                            { Utterance = "ajuda" },
                            { Utterance = "aide" }
                        ]
                    },
                    {
                        Name        = "ImageTextExtractionIntent"
                        Description = "Recebe uma imagem do usuário imigrante e realiza a extração de texto contido na imagem e retorna para o usuário."
                        FulfillmentCodeHook = {
                          Enabled = true
                        }
                        SampleUtterances = [
                            { Utterance = "ImageTextExtraction" },
                        ]
                        Slots = [
                            {
                                Name         = "textOrAudioConditional"
                                SlotTypeName = "AMAZON.AlphaNumeric" # Recognizes words made up of letters and numbers.
                                ValueElicitationSetting = {
                                    SlotConstraint = "Required"
                                    PromptSpecification = {
                                        MaxRetries = 1
                                        MessageGroupsList = [{
                                            Message = {
                                                # ImageResponseCard = {
                                                #     Title = "Você deseja receber o texto extraído da imagem ou um áudio com o texto extraído?"
                                                #     Buttons = [{
                                                #         "Text": "Texto em Francês",
                                                #         "Value": "text_fr"
                                                #     },
                                                #     {
                                                #         "Text": "Áudio em Francês",
                                                #         "Value": "audio_fr"
                                                #     },
                                                #     {
                                                #         "Text": "Texto em Português",
                                                #         "Value": "text_pt"
                                                #     },
                                                #     {
                                                #         "Text": "Áudio em Português",
                                                #         "Value": "audio_pt"
                                                #     }]
                                                # }
                                                PlainTextMessage = {
                                                    Value = "Você deseja receber o texto extraído da imagem ou um áudio com o texto extraído? (Digite o número da opção)\n\n 1. Texto em Francês\n 2. Áudio em Francês\n 3. Texto em Português\n 4. Áudio em Português"
                                                }
                                            }
                                        }]
                                    }
                                }
                            },
                            {
                                Name         = "imgFromUser"
                                SlotTypeName = "AMAZON.FreeFormInput" # Recognizes strings that consist of any words or characters.
                                ValueElicitationSetting = {
                                    SlotConstraint = "Required"
                                    PromptSpecification = {
                                        MaxRetries = 1
                                        MessageGroupsList = [{
                                            Message = {
                                                PlainTextMessage = {
                                                    Value = "Por favor, envie a imagem contendo o texto que deseja extrair."
                                                }
                                            }
                                        }]
                                    }
                                }
                            }
                        ]
                        SlotPriorities = [
                            { Priority = 1, SlotName = "textOrAudioConditional" },
                            { Priority = 2, SlotName = "imgFromUser" }
                        ]
                        IntentClosingSetting = {
                            ClosingResponse = {
                                MessageGroupsList = [{
                                    Message = {
                                        PlainTextMessage = {
                                            Value = "Obrigado por utilizar o nosso serviço!"
                                        }
                                    }
                                }]
                            }
                        }
                    },
                    {
                        Name = "TextAudioTranslaterIntent"
                        Description = "Recebe um texto ou um áudio do usuário imigrante retorna um texto traduzido para portugues ou áudio do texto traduzido."
                        FulfillmentCodeHook = {
                          Enabled = true
                        }
                        SampleUtterances = [
                            { Utterance = "TextAudioTranslater" },
                            { Utterance = "AudioTextTraducteur" }
                        ]
                        Slots = [
                            {
                                Name          = "textOrAudioUserInput"
                                SlotTypeName  = "AMAZON.AlphaNumeric" # Recognizes words made up of letters and numbers.
                                ValueElicitationSetting = {
                                    SlotConstraint = "Required"
                                    PromptSpecification = {
                                        MaxRetries = 1
                                        MessageGroupsList = [{
                                            Message = {
                                                # ImageResponseCard = {
                                                #     Title = "Você deseja traduzir um texto ou um áudio do português -> francês ou francês -> português?"
                                                #     Buttons = [{
                                                #         "Text": "Português para o francês",
                                                #         "Value": "ptToFr"
                                                #     },
                                                #     {
                                                #         "Text": "Francês para o português",
                                                #         "Value": "frToPt"
                                                #     }]
                                                # }
                                                PlainTextMessage = {
                                                    Value = "Você quer traduzir um áudio ou um texto? (Digite o número da opção)\n\n 1. Áudio\n 2. Texto"
                                                }
                                            }
                                        }]
                                    }
                                }
                            },
                            {
                                Name          = "languageConditional"
                                SlotTypeName  = "AMAZON.AlphaNumeric" # Recognizes words made up of letters and numbers.
                                ValueElicitationSetting = {
                                    SlotConstraint = "Required"
                                    PromptSpecification = {
                                        MaxRetries = 1
                                        MessageGroupsList = [{
                                            Message = {
                                                # ImageResponseCard = {
                                                #     Title = "Você deseja traduzir um texto ou um áudio do português -> francês ou francês -> português?"
                                                #     Buttons = [{
                                                #         "Text": "Português para o francês",
                                                #         "Value": "ptToFr"
                                                #     },
                                                #     {
                                                #         "Text": "Francês para o português",
                                                #         "Value": "frToPt"
                                                #     }]
                                                # }
                                                PlainTextMessage = {
                                                    Value = "Você deseja traduzir do português -> francês ou francês -> português? (Digite o número da opção)\n\n 1. Português para o francês\n 2. Francês para o português"
                                                }
                                            }
                                        }]
                                    }
                                }
                            },
                            {
                                Name         = "textOrAudioConditional"
                                SlotTypeName = "AMAZON.AlphaNumeric" # Recognizes words made up of letters and numbers.
                                ValueElicitationSetting = {
                                    SlotConstraint = "Required"
                                    PromptSpecification = {
                                        MaxRetries = 1
                                        MessageGroupsList = [{
                                            Message = {
                                                # ImageResponseCard = {
                                                #     Title = "Você deseja receber o texto ou áudio enviado como um áudio ou como texto?"
                                                #     Buttons = [{
                                                #         "Text": "Como texto",
                                                #         "Value": "text"
                                                #     },
                                                #     {
                                                #         "Text": "Como áudio",
                                                #         "Value": "audio"
                                                #     }]
                                                # }
                                                PlainTextMessage = {
                                                    Value = "Você deseja receber o texto ou áudio enviado como um áudio ou como texto? (Digite o número da opção)\n\n 1. Como texto\n 2. Como áudio"
                                                }
                                            }
                                        }]
                                    }
                                }
                            },
                            {
                                Name         = "textOrAudioReceiver"
                                SlotTypeName = "AMAZON.FreeFormInput" # Recognizes words made up of letters and numbers.
                                ValueElicitationSetting = {
                                    SlotConstraint = "Required"
                                    PromptSpecification = {
                                        MaxRetries = 1
                                        MessageGroupsList = [{
                                            Message = {
                                                PlainTextMessage = {
                                                    Value = "Envie o texto ou áudio que deseja traduzir."
                                                }
                                            }
                                        }]
                                    }
                                }
                            }
                        ]
                        SlotPriorities = [
                            { Priority = 1, SlotName = "textOrAudioUserInput" },
                            { Priority = 2, SlotName = "languageConditional" },
                            { Priority = 3, SlotName = "textOrAudioConditional" },
                            { Priority = 4, SlotName = "textOrAudioReceiver" }
                        ]
                    },
                    {
                        Name = "CepToTipIntent"
                        Description = "recebe um cep do usuário imigrante e retorna dicas de onde ficam hospitais, restaurates, etc."
                        FulfillmentCodeHook = {
                          Enabled = true
                        }
                        SampleUtterances = [
                            { Utterance = "CepToTip" },
                            { Utterance = "CepToTip" }
                        ]
                        Slots = [
                            {
                                Name         = "cepFromUser"
                                SlotTypeName = "AMAZON.AlphaNumeric" # Recognizes words made up of letters and numbers.
                                ValueElicitationSetting = {
                                    SlotConstraint = "Required"
                                    PromptSpecification = {
                                        MaxRetries = 1
                                        MessageGroupsList = [{
                                            Message = {
                                                PlainTextMessage = {
                                                    Value = "Por favor, envie o cep da sua localização (apenas números)."
                                                }
                                            },
                                            Message = {
                                                PlainTextMessage = {
                                                    Value = "Caso não saiba o seu cep, você pode consultá-lo em: https://buscacepinter.correios.com.br/app/endereco/index.php."
                                                }
                                            }
                                        }]
                                    }
                                }
                            },
                            {
                                Name         = "pointsOfInterest"
                                SlotTypeName = "AMAZON.AlphaNumeric" # Recognizes words made up of letters and numbers.
                                ValueElicitationSetting = {
                                    SlotConstraint = "Required"
                                    PromptSpecification = {
                                        MaxRetries = 1
                                        MessageGroupsList = [{
                                            Message = {
                                                # ImageResponseCard = {
                                                #     Title = "Qual ponto de interesse você deseja saber a localização mais próxima?"
                                                #     Buttons = [{
                                                #         "Text": "Hospital",
                                                #         "Value": "hospital"
                                                #     },
                                                #     {
                                                #         "Text": "Policia",
                                                #         "Value": "police"
                                                #     },
                                                #     {
                                                #         "Text": "Restaurante",
                                                #         "Value": "restaurant"
                                                #     }]
                                                # }
                                                PlainTextMessage = {
                                                    Value = "Qual ponto de interesse você deseja saber a localização mais próxima? (Digite o número da opção)\n\n 1. Hospital\n 2. Policia\n 3. Restaurante"
                                                }
                                            }
                                        }]
                                    }
                                }
                            }
                        ]
                        SlotPriorities = [
                            { Priority = 1, SlotName = "cepFromUser" },
                            { Priority = 2, SlotName = "pointsOfInterest" }
                        ]
                    },
                    {
                        Name = "EmergencyContactsIntent"
                        Description = "retorna contatos de emergência para o usuário imigrante, como ambulancias e policia."
                        FulfillmentCodeHook = {
                          Enabled = true
                        }
                        SampleUtterances = [
                            { Utterance = "EmergencyContacts" },
                            { Utterance = "ContactsUrgences" }
                        ]
                        Slots = [
                            {
                                Name         = "emergencyContact"
                                SlotTypeName = "AMAZON.AlphaNumeric" # Recognizes words made up of letters and numbers.
                                ValueElicitationSetting = {
                                    SlotConstraint = "Required"
                                    PromptSpecification = {
                                        MaxRetries = 1
                                        MessageGroupsList = [{
                                            Message = {
                                                # ImageResponseCard = {
                                                #     Title = "Qual contato de emergência você deseja?"
                                                #     Buttons = [{
                                                #         "Text": "Ambulância",
                                                #         "Value": "ambulancia"
                                                #     },
                                                #     {
                                                #         "Text": "Policia",
                                                #         "Value": "policia"
                                                #     },
                                                #     {
                                                #         "Text": "Bombeiros",
                                                #         "Value": "bombeiros"
                                                #     }]
                                                # }
                                                PlainTextMessage = {
                                                    Value = "Qual contato de emergência você deseja? (Digite o número da opção)\n\n 1. Ambulância\n 2. Policia\n 3. Bombeiros"
                                                }
                                            }
                                        }]
                                    }
                                }
                            }
                        ]
                        SlotPriorities = [
                            { Priority = 1, SlotName = "emergencyContact" }
                        ]
                    },
                    {
                        Name = "HowToMakeDocsIntent"
                        Description = "retorna informações sobre como fazer documentos para o usuário imigrante."
                        FulfillmentCodeHook = {
                          Enabled = true
                        }
                        SampleUtterances = [
                            { Utterance = "HowToMakeDocs" },
                            { Utterance = "CommentCreerDesDocuments" }
                        ]
                    },
                    {
                        Name                  = "FallbackIntent"
                        ParentIntentSignature = "AMAZON.FallbackIntent"
                        Description           = "Intent que é acionada quando o usuário digita algo que não é reconhecido"
                    }]
                }]
            }
        }
    }
    })
}