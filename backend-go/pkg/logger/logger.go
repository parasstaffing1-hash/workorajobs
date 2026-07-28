package logger

import (
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var Log *zap.Logger

func InitLogger(env string) {
	var config zapcore.EncoderConfig

	if env == "production" {
		config = zap.NewProductionEncoderConfig()
		config.EncodeTime = zapcore.ISO8601TimeEncoder
		core := zapcore.NewCore(
			zapcore.NewJSONEncoder(config),
			zapcore.AddSync(os.Stdout),
			zap.InfoLevel,
		)
		Log = zap.New(core, zap.AddCaller(), zap.AddStacktrace(zap.ErrorLevel))
	} else {
		config = zap.NewDevelopmentEncoderConfig()
		config.EncodeLevel = zapcore.CapitalColorLevelEncoder
		config.EncodeTime = zapcore.ISO8601TimeEncoder
		core := zapcore.NewCore(
			zapcore.NewConsoleEncoder(config),
			zapcore.AddSync(os.Stdout),
			zap.DebugLevel,
		)
		Log = zap.New(core, zap.AddCaller())
	}
}

func Sync() {
	if Log != nil {
		_ = Log.Sync()
	}
}
