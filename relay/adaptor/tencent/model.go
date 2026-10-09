package tencent

type Message struct {
	Role    string `json:"Role"`
	Content string `json:"Content"`
}

type ChatRequest struct {
	// Model name. Valid values include hunyuan-lite, hunyuan-standard, hunyuan-standard-256K, and hunyuan-pro.
	// For an introduction to each model, see [Product Overview](https://cloud.tencent.com/document/product/1729/104753).
	//
	// Note:
	// Different models are billed differently. Please call them as needed according to the [Purchase Guide](https://cloud.tencent.com/document/product/1729/97731).
	Model *string `json:"Model"`
	// Chat context information.
	// Notes:
	// 1. The maximum length is 40, arranged in the array from the oldest to the newest conversation.
	// 2. Valid values of Message.Role: system, user, assistant.
	// Among them, the system role is optional; if present, it must be at the very beginning of the list. user and assistant must appear alternately (one question, one answer), starting and ending with a user question, and Content cannot be empty. Example order of Roles: [system (optional) user assistant user assistant user ...].
	// 3. The total length of Content in Messages cannot exceed the model input length limit (refer to the [Product Overview](https://cloud.tencent.com/document/product/1729/104753) documentation); if exceeded, the leading content will be truncated and only the tail content will be kept.
	Messages []*Message `json:"Messages"`
	// Streaming call switch.
	// Notes:
	// 1. When not provided, the default is a non-streaming call (false).
	// 2. When streaming, results are returned incrementally via the SSE protocol (take the value of Choices[n].Delta in the response; you need to concatenate the incremental data to obtain the complete result).
	// 3. When non-streaming:
	// The call method is the same as an ordinary HTTP request.
	// The API response takes longer; **if you need lower latency, it is recommended to set this to true**.
	// The final result is returned only once (take the value of Choices[n].Message in the response).
	//
	// Note:
	// When calling via the SDK, streaming and non-streaming calls must obtain the return value in **different ways**. Refer to the comments or examples in the SDK (in the examples/hunyuan/v20230901/ directory of the SDK code repository for each language).
	Stream *bool `json:"Stream"`
	// Notes:
	// 1. Affects the diversity of the output text. The larger the value, the stronger the diversity of the generated text.
	// 2. The value range is [0.0, 1.0]. When not provided, the recommended value for each model is used.
	// 3. It is not recommended to use unless necessary; unreasonable values will affect the results.
	TopP *float64 `json:"TopP,omitempty"`
	// Notes:
	// 1. Higher values make the output more random, while lower values make it more focused and deterministic.
	// 2. The value range is [0.0, 2.0]. When not provided, the recommended value for each model is used.
	// 3. It is not recommended to use unless necessary; unreasonable values will affect the results.
	Temperature *float64 `json:"Temperature,omitempty"`
}

type Error struct {
	Code    string `json:"Code"`
	Message string `json:"Message"`
}

type Usage struct {
	PromptTokens     int `json:"PromptTokens"`
	CompletionTokens int `json:"CompletionTokens"`
	TotalTokens      int `json:"TotalTokens"`
}

type ResponseChoices struct {
	FinishReason string  `json:"FinishReason,omitempty"` // Streaming end flag; stop indicates the final packet
	Messages     Message `json:"Message,omitempty"`      // Content returned in synchronous mode; null in streaming mode. The total content output supports up to 1024 tokens.
	Delta        Message `json:"Delta,omitempty"`        // Content returned in streaming mode; null in synchronous mode. The total content output supports up to 1024 tokens.
}

type ChatResponse struct {
	Choices []ResponseChoices `json:"Choices,omitempty"`   // Results
	Created int64             `json:"Created,omitempty"`   // String of the unix timestamp
	Id      string            `json:"Id,omitempty"`        // Session id
	Usage   Usage             `json:"Usage,omitempty"`     // Token count
	Error   Error             `json:"Error,omitempty"`     // Error message. Note: this field may return null, indicating that no valid value can be obtained
	Note    string            `json:"Note,omitempty"`      // Notes
	ReqID   string            `json:"RequestId,omitempty"` // Unique request Id, returned with every request. Used to report the API input parameters
}

type ChatResponseP struct {
	Response ChatResponse `json:"Response,omitempty"`
}

type EmbeddingRequest struct {
	InputList []string `json:"InputList"`
}

type EmbeddingData struct {
	Embedding []float64 `json:"Embedding"`
	Index     int       `json:"Index"`
	Object    string    `json:"Object"`
}

type EmbeddingUsage struct {
	PromptTokens int `json:"PromptTokens"`
	TotalTokens  int `json:"TotalTokens"`
}

type EmbeddingResponse struct {
	Data           []EmbeddingData `json:"Data"`
	EmbeddingUsage EmbeddingUsage  `json:"Usage,omitempty"`
	RequestId      string          `json:"RequestId,omitempty"`
	Error          Error           `json:"Error,omitempty"`
}

type EmbeddingResponseP struct {
	Response EmbeddingResponse `json:"Response,omitempty"`
}
