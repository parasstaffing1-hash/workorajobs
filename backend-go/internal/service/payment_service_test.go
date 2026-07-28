package service

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"testing"

	"github.com/workorajobs/backend-go/internal/config"
)

func TestVerifyRazorpayPaymentSignature(t *testing.T) {
	svc := NewPaymentService(&config.Config{RazorpayKeySecret: "test_razorpay_secret"})
	orderID := "order_123"
	paymentID := "pay_456"
	body := orderID + "|" + paymentID
	mac := hmac.New(sha256.New, []byte("test_razorpay_secret"))
	mac.Write([]byte(body))
	signature := hex.EncodeToString(mac.Sum(nil))

	err := svc.VerifyRazorpayPayment(&VerifyRazorpayPaymentRequest{
		OrderID:   orderID,
		PaymentID: paymentID,
		Signature: signature,
	})
	if err != nil {
		t.Fatalf("Expected valid Razorpay signature: %v", err)
	}
}

func TestVerifyRazorpayPaymentRejectsInvalidSignature(t *testing.T) {
	svc := NewPaymentService(&config.Config{RazorpayKeySecret: "test_razorpay_secret"})
	err := svc.VerifyRazorpayPayment(&VerifyRazorpayPaymentRequest{
		OrderID:   "order_123",
		PaymentID: "pay_456",
		Signature: "bad_signature",
	})
	if err != ErrInvalidPaymentSig {
		t.Fatalf("Expected invalid signature error, got %v", err)
	}
}

func TestVerifyRazorpayWebhookSignature(t *testing.T) {
	svc := NewPaymentService(&config.Config{RazorpayWebhookSecret: "test_webhook_secret"})
	payload := []byte(`{"event":"payment.captured"}`)
	mac := hmac.New(sha256.New, []byte("test_webhook_secret"))
	mac.Write(payload)
	signature := hex.EncodeToString(mac.Sum(nil))

	if err := svc.VerifyWebhookSignature(payload, signature); err != nil {
		t.Fatalf("Expected webhook signature to verify: %v", err)
	}
}
