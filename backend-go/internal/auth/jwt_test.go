package auth

import (
	"testing"
	"time"
)

func TestHashAndVerifyPassword(t *testing.T) {
	password := "SecurePassword123!"

	hash, err := HashPassword(password)
	if err != nil {
		t.Fatalf("Failed to hash password: %v", err)
	}

	match, err := VerifyPassword(password, hash)
	if err != nil || !match {
		t.Fatalf("Password verification failed for correct password")
	}

	wrongMatch, _ := VerifyPassword("WrongPassword!", hash)
	if wrongMatch {
		t.Fatalf("Password verification succeeded for incorrect password")
	}
}

func TestGenerateAndValidateJWT(t *testing.T) {
	secret := "test-jwt-secret-key-12345"
	userID := "usr_12345"
	email := "test@workorajobs.com"
	role := "EMPLOYER"

	tokenStr, err := GenerateAccessToken(userID, email, role, secret, 5*time.Minute)
	if err != nil {
		t.Fatalf("Failed to generate token: %v", err)
	}

	claims, err := ValidateToken(tokenStr, secret)
	if err != nil {
		t.Fatalf("Failed to validate token: %v", err)
	}

	if claims.UserID != userID || claims.Email != email || claims.Role != role {
		t.Errorf("Mismatch in token claims: got %+v", claims)
	}
}
