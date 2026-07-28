package service

import (
	"bytes"
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/workorajobs/backend-go/internal/config"
)

const razorpayOrdersEndpoint = "https://api.razorpay.com/v1/orders"

var (
	ErrPaymentConfigMissing = errors.New("payment gateway is not configured")
	ErrInvalidPaymentAmount = errors.New("invalid payment amount")
	ErrInvalidPaymentFields = errors.New("missing required payment verification fields")
	ErrInvalidPaymentSig    = errors.New("invalid payment signature")
)

type PaymentService struct {
	cfg        *config.Config
	httpClient *http.Client
}

func NewPaymentService(cfg *config.Config) *PaymentService {
	return &PaymentService{
		cfg:        cfg,
		httpClient: &http.Client{Timeout: 10 * time.Second},
	}
}

type CreateRazorpayOrderRequest struct {
	Amount   int               `json:"amount" binding:"required"`
	Currency string            `json:"currency"`
	Receipt  string            `json:"receipt"`
	Notes    map[string]string `json:"notes"`
}

type RazorpayOrderResponse struct {
	ID       string `json:"id"`
	Amount   int    `json:"amount"`
	Currency string `json:"currency"`
	Receipt  string `json:"receipt"`
	Status   string `json:"status"`
}

func (s *PaymentService) CreateRazorpayOrder(ctx context.Context, req *CreateRazorpayOrderRequest, userID string) (*RazorpayOrderResponse, error) {
	if s == nil || s.cfg == nil || strings.TrimSpace(s.cfg.RazorpayKeyID) == "" || strings.TrimSpace(s.cfg.RazorpayKeySecret) == "" {
		return nil, ErrPaymentConfigMissing
	}
	if req == nil || req.Amount < 100 {
		return nil, ErrInvalidPaymentAmount
	}
	currency := strings.ToUpper(strings.TrimSpace(req.Currency))
	if currency == "" {
		currency = "INR"
	}
	receipt := strings.TrimSpace(req.Receipt)
	if receipt == "" {
		receipt = fmt.Sprintf("rcpt_%d", time.Now().UnixNano())
	}
	notes := req.Notes
	if notes == nil {
		notes = map[string]string{}
	}
	notes["user_id"] = userID

	payload, err := json.Marshal(map[string]any{
		"amount":   req.Amount,
		"currency": currency,
		"receipt":  receipt,
		"notes":    notes,
	})
	if err != nil {
		return nil, err
	}

	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, razorpayOrdersEndpoint, bytes.NewReader(payload))
	if err != nil {
		return nil, err
	}
	httpReq.SetBasicAuth(s.cfg.RazorpayKeyID, s.cfg.RazorpayKeySecret)
	httpReq.Header.Set("Content-Type", "application/json")

	resp, err := s.httpClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		return nil, fmt.Errorf("razorpay order creation failed with status %d", resp.StatusCode)
	}

	var order RazorpayOrderResponse
	if err := json.NewDecoder(io.LimitReader(resp.Body, 1<<20)).Decode(&order); err != nil {
		return nil, err
	}
	return &order, nil
}

type VerifyRazorpayPaymentRequest struct {
	OrderID   string `json:"razorpay_order_id" binding:"required"`
	PaymentID string `json:"razorpay_payment_id" binding:"required"`
	Signature string `json:"razorpay_signature" binding:"required"`
}

func (s *PaymentService) VerifyRazorpayPayment(req *VerifyRazorpayPaymentRequest) error {
	if s == nil || s.cfg == nil || strings.TrimSpace(s.cfg.RazorpayKeySecret) == "" {
		return ErrPaymentConfigMissing
	}
	if req == nil || strings.TrimSpace(req.OrderID) == "" || strings.TrimSpace(req.PaymentID) == "" || strings.TrimSpace(req.Signature) == "" {
		return ErrInvalidPaymentFields
	}

	body := strings.TrimSpace(req.OrderID) + "|" + strings.TrimSpace(req.PaymentID)
	mac := hmac.New(sha256.New, []byte(s.cfg.RazorpayKeySecret))
	mac.Write([]byte(body))
	expected := hex.EncodeToString(mac.Sum(nil))

	if len(expected) != len(req.Signature) {
		return ErrInvalidPaymentSig
	}
	if subtle.ConstantTimeCompare([]byte(expected), []byte(req.Signature)) != 1 {
		return ErrInvalidPaymentSig
	}
	return nil
}

func (s *PaymentService) VerifyWebhookSignature(payload []byte, signature string) error {
	if s == nil || s.cfg == nil || strings.TrimSpace(s.cfg.RazorpayWebhookSecret) == "" {
		return ErrPaymentConfigMissing
	}
	if len(payload) == 0 || strings.TrimSpace(signature) == "" {
		return ErrInvalidPaymentFields
	}
	mac := hmac.New(sha256.New, []byte(s.cfg.RazorpayWebhookSecret))
	mac.Write(payload)
	expected := hex.EncodeToString(mac.Sum(nil))
	if len(expected) != len(signature) || subtle.ConstantTimeCompare([]byte(expected), []byte(signature)) != 1 {
		return ErrInvalidPaymentSig
	}
	return nil
}
