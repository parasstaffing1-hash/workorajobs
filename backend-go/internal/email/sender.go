package email

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"html"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/workorajobs/backend-go/internal/config"
)

const resendEmailsEndpoint = "https://api.resend.com/emails"

type Sender interface {
	SendEmailVerification(ctx context.Context, to, token string) error
	SendPasswordReset(ctx context.Context, to, token string) error
}

type NoopSender struct{}

func (NoopSender) SendEmailVerification(context.Context, string, string) error {
	return nil
}

func (NoopSender) SendPasswordReset(context.Context, string, string) error {
	return nil
}

type ResendSender struct {
	apiKey  string
	from    string
	appURL  string
	client  *http.Client
	timeout time.Duration
}

func NewSender(cfg *config.Config) Sender {
	if cfg == nil || strings.TrimSpace(cfg.ResendAPIKey) == "" {
		return NoopSender{}
	}
	from := strings.TrimSpace(cfg.EmailFrom)
	if from == "" {
		from = "Workora Jobs <no-reply@workorajobs.com>"
	}
	appURL := strings.TrimRight(strings.TrimSpace(cfg.AppURL), "/")
	if appURL == "" {
		appURL = "http://localhost:3000"
	}
	return &ResendSender{
		apiKey: cfg.ResendAPIKey,
		from:   from,
		appURL: appURL,
		client: &http.Client{Timeout: 10 * time.Second},
	}
}

func (s *ResendSender) SendEmailVerification(ctx context.Context, to, token string) error {
	link, err := buildTokenURL(s.appURL, "/verify-email", to, token)
	if err != nil {
		return err
	}
	subject := "Verify your Workora Jobs email"
	text := "Verify your Workora Jobs email using this link: " + link
	htmlBody := `<p>Verify your Workora Jobs email using the secure link below.</p><p><a href="` + html.EscapeString(link) + `">Verify email</a></p>`
	return s.send(ctx, to, subject, text, htmlBody)
}

func (s *ResendSender) SendPasswordReset(ctx context.Context, to, token string) error {
	link, err := buildTokenURL(s.appURL, "/reset-password", to, token)
	if err != nil {
		return err
	}
	subject := "Reset your Workora Jobs password"
	text := "Reset your Workora Jobs password using this link: " + link
	htmlBody := `<p>Reset your Workora Jobs password using the secure link below.</p><p><a href="` + html.EscapeString(link) + `">Reset password</a></p><p>If you did not request this, you can ignore this email.</p>`
	return s.send(ctx, to, subject, text, htmlBody)
}

func (s *ResendSender) send(ctx context.Context, to, subject, text, htmlBody string) error {
	if s == nil || strings.TrimSpace(s.apiKey) == "" {
		return nil
	}
	if strings.TrimSpace(to) == "" {
		return errors.New("email recipient is required")
	}

	body := map[string]any{
		"from":    s.from,
		"to":      []string{to},
		"subject": subject,
		"text":    text,
		"html":    htmlBody,
	}
	payload, err := json.Marshal(body)
	if err != nil {
		return err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, resendEmailsEndpoint, bytes.NewReader(payload))
	if err != nil {
		return err
	}
	req.Header.Set("Authorization", "Bearer "+s.apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := s.client
	if client == nil {
		client = &http.Client{Timeout: 10 * time.Second}
	}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		return fmt.Errorf("resend email delivery failed with status %d", resp.StatusCode)
	}
	return nil
}

func buildTokenURL(appURL, path, emailAddress, token string) (string, error) {
	base, err := url.Parse(strings.TrimRight(appURL, "/"))
	if err != nil {
		return "", err
	}
	base.Path = path
	query := base.Query()
	query.Set("email", emailAddress)
	query.Set("token", token)
	base.RawQuery = query.Encode()
	return base.String(), nil
}
