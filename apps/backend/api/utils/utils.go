package utils

import (
	"fmt"
	"log"
	"strconv"

	"github.com/Baalamurgan/coin-selling-backend/api/constants"
	"github.com/spf13/viper"
)

func ImportEnv() {
	viper.SetConfigName(".env")
	viper.SetConfigType("env")
	viper.AddConfigPath(".")
	viper.SetDefault("ENVIRONMENT", "development")
	viper.SetDefault("PORT", 8080)
	viper.SetDefault("MIGRATE", false)

	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			// Config file not found; ignore error if desired
			log.Println("No .env file found")
		} else {
			log.Panicln(fmt.Errorf("fatal error config file: %s", err))
		}
	}

	for _, element := range constants.ENV {
		if viper.GetString(element) == "" {
			log.Panicln(fmt.Errorf("env variables not present: %s", element))
		}
	}
}

func GetPort() string {
	return strconv.Itoa(viper.GetInt(("PORT")))
}
