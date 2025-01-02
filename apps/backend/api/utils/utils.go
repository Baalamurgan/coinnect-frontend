package utils

import (
	"fmt"
	"log"
	"regexp"
	"strconv"

	"github.com/Baalamurgan/coin-selling-backend/api/constants"
	"github.com/go-playground/validator/v10"
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

var (
	validate *validator.Validate
)

func InitValidators() {
	validate = validator.New()
	_ = validate.RegisterValidation("email", func(fl validator.FieldLevel) bool {
		compile := regexp.MustCompile("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
		return compile.MatchString(fl.Field().String())
	})
	_ = validate.RegisterValidation("username", func(fl validator.FieldLevel) bool {
		compile := regexp.MustCompile("^[a-z0-9-_.]+$")
		return compile.MatchString(fl.Field().String())
	})
}

type ErrorResponse struct {
	FailedField string
	Tag         string
	Value       string
}

func ValidateStruct(request interface{}) []ErrorResponse {
	var errors []ErrorResponse
	err := validate.Struct(request)
	if err != nil {
		for _, err := range err.(validator.ValidationErrors) {
			var element ErrorResponse
			element.FailedField = err.StructNamespace()
			element.Tag = err.Tag()
			element.Value = err.Param()
			errors = append(errors, element)
		}
	}
	return errors
}
