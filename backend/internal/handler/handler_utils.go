package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func GetUserIdentifiers(c *gin.Context) (ip string, session string) {
	ip = c.ClientIP()
	session, err := c.Cookie("session_id")
	if err != nil {
		session = uuid.New().String()
		c.SetCookie("session_id", session, 3600*24*30, "/", "", false, true)
	}
	return
}
