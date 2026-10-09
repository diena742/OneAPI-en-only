package middleware

import (
	"github.com/gin-gonic/gin"

	"github.com/songquanpeng/one-api/common/i18n"
)

func Language() gin.HandlerFunc {
	return func(c *gin.Context) {
		// en-only: always use English regardless of the client's Accept-Language
		c.Set(i18n.ContextKey, "en")
		c.Next()
	}
}
