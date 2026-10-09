const defaultConfig = {
  input: {
    name: '',
    type: 1,
    key: '',
    base_url: '',
    other: '',
    model_mapping: '',
    models: [],
    groups: ['default'],
    config: {}
  },
  inputLabel: {
    name: 'Channel Name',
    type: 'Channel Type',
    base_url: 'Channel API URL',
    key: 'Key',
    other: 'Other Parameters',
    models: 'Models',
    model_mapping: 'Model Mapping',
    system_prompt: 'System Prompt',
    groups: 'User Groups',
    config: null
  },
  prompt: {
    type: 'Please select channel type',
    name: 'Please name the channel',
    base_url: 'Optional, enter the relay API URL, e.g., relayed via Cloudflare',
    key: 'Please enter the authentication key for the channel',
    other: '',
    models: 'Please select the models supported by this channel',
    model_mapping:
      'Enter the model mapping to modify, format: api request model ID: actual model ID forwarded to the channel, expressed as a JSON object, e.g.: {"gpt-3.5": "gpt-35"}',
    system_prompt:
      'Optional, used to force a given system prompt. Use together with custom models & model redirection. First create a unique custom model name and fill it in above, then map that custom model to a natively supported model of this channel. Optional, used to force a given system prompt. Use together with custom models & model redirection. First create a unique custom model name and fill it in above, then map that custom model to a natively supported model of this channel.',
    groups: 'Please select the user groups supported by this channel',
    config: null
  },
  modelGroup: 'openai'
};

const typeConfig = {
  3: {
    inputLabel: {
      base_url: 'AZURE_OPENAI_ENDPOINT',
      other: 'Default API Version'
    },
    prompt: {
      base_url: 'Please fill in AZURE_OPENAI_ENDPOINT',
      other: 'Enter the default API version, e.g., 2024-03-01-preview'
    }
  },
  11: {
    input: {
      models: ['PaLM-2']
    },
    modelGroup: 'google palm'
  },
  14: {
    input: {
      models: ['claude-instant-1', 'claude-2', 'claude-2.0', 'claude-2.1']
    },
    modelGroup: 'anthropic'
  },
  15: {
    input: {
      models: ['ERNIE-Bot', 'ERNIE-Bot-turbo', 'ERNIE-Bot-4', 'Embedding-V1']
    },
    prompt: {
      key: 'Enter in the following format: APIKey|SecretKey'
    },
    modelGroup: 'baidu'
  },
  16: {
    input: {
      models: ['glm-4', 'glm-4v', 'glm-3-turbo', 'chatglm_turbo', 'chatglm_pro', 'chatglm_std', 'chatglm_lite']
    },
    modelGroup: 'zhipu'
  },
  17: {
    inputLabel: {
      other: 'Plugin Parameters'
    },
    input: {
      models: ['qwen-turbo', 'qwen-plus', 'qwen-max', 'qwen-max-longcontext', 'text-embedding-v1']
    },
    prompt: {
      other: 'Enter the plugin parameters, i.e., the value of the X-DashScope-Plugin request header'
    },
    modelGroup: 'ali'
  },
  18: {
    inputLabel: {
      other: 'Version'
    },
    input: {
      models: ['SparkDesk', 'SparkDesk-v1.1', 'SparkDesk-v2.1', 'SparkDesk-v3.1', 'SparkDesk-v3.1-128K', 'SparkDesk-v3.5', 'SparkDesk-v3.5-32K', 'SparkDesk-v4.0']
    },
    prompt: {
      key: 'Enter in the following format: APPID|APISecret|APIKey',
      other: 'Enter the version number, e.g., v3.1'
    },
    modelGroup: 'xunfei'
  },
  19: {
    input: {
      models: ['360GPT_S2_V9', 'embedding-bert-512-v1', 'embedding_s1_v1', 'semantic_similarity_s1_v1']
    },
    modelGroup: '360'
  },
  22: {
    prompt: {
      key: 'Enter in the following format: APIKey-AppId, e.g., fastgpt-0sp2gtvfdgyi4k30jwlgwf1i-64f335d84283f05518e9e041'
    }
  },
  23: {
    input: {
      models: ['hunyuan']
    },
    prompt: {
      key: 'Enter in the following format: AppId|SecretId|SecretKey'
    },
    modelGroup: 'tencent'
  },
  24: {
    inputLabel: {
      other: 'Version'
    },
    input: {
      models: ['gemini-pro']
    },
    prompt: {
      other: 'Enter the version number, e.g., v1'
    },
    modelGroup: 'google gemini'
  },
  25: {
    input: {
      models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k']
    },
    modelGroup: 'moonshot'
  },
  26: {
    input: {
      models: ['Baichuan2-Turbo', 'Baichuan2-Turbo-192k', 'Baichuan-Text-Embedding']
    },
    modelGroup: 'baichuan'
  },
  27: {
    input: {
      models: ['abab5.5s-chat', 'abab5.5-chat', 'abab6-chat']
    },
    modelGroup: 'minimax'
  },
  29: {
    modelGroup: 'groq'
  },
  30: {
    modelGroup: 'ollama'
  },
  31: {
    modelGroup: 'lingyiwanwu'
  },
  33: {
    inputLabel: {
      key: '',
      config: {
        region: 'Region',
        ak: 'Access Key',
        sk: 'Secret Key'
      }
    },
    prompt: {
      key: '',
      config: {
        region: 'region, e.g. us-west-2',
        ak: 'AWS IAM Access Key',
        sk: 'AWS IAM Secret Key'
      }
    },
    modelGroup: 'anthropic'
  },
  37: {
    inputLabel: {
      config: {
        user_id: 'Account ID'
      }
    },
    prompt: {
      config: {
        user_id: 'Enter the Account ID, e.g., d8d7c61dbc334c32d3ced580e4bf42b4'
      }
    },
    modelGroup: 'Cloudflare'
  },
  34: {
    inputLabel: {
      config: {
        user_id: 'User ID'
      }
    },
    prompt: {
      models: 'For Coze, the model name is the Bot ID, you can add a prefix `bot-`, e.g., `bot-123456`',
      config: {
        user_id: 'The user ID that generated this key'
      }
    },
    modelGroup: 'Coze'
  },
  42: {
    inputLabel: {
      key: '',
      config: {
        region: 'Vertex AI Region',
        vertex_ai_project_id: 'Vertex AI Project ID',
        vertex_ai_adc: 'Google Cloud Application Default Credentials JSON'
      }
    },
    prompt: {
      key: '',
      config: {
        region: 'Vertex AI Region.g. us-east5',
        vertex_ai_project_id: 'Vertex AI Project ID',
        vertex_ai_adc: 'Google Cloud Application Default Credentials JSON: https://cloud.google.com/docs/authentication/application-default-credentials'
      }
    },
    modelGroup: 'anthropic'
  },
  45: {
    modelGroup: 'xai'
  },
};

export { defaultConfig, typeConfig };
