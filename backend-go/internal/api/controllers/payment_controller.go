package controllers

import (
	"errors"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/internal/api/middleware"
	"github.com/workorajobs/backend-go/internal/service"
	"github.com/workorajobs/backend-go/pkg/response"
)

type PaymentController struct {
	paymentService *service.PaymentService
}

func NewPaymentController(paymentService *service.PaymentService) *PaymentController {
	return &PaymentController{paymentService: paymentService}
}

func (ctrl *PaymentController) CreateRazorpayOrder(c *gin.Context) {
	var req service.CreateRazorpayOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid order payload", err.Error())
		return
	}

	order, err := ctrl.paymentService.CreateRazorpayOrder(c.Request.Context(), &req, c.GetString(middleware.CtxUserID))
	if err != nil {
		if errors.Is(err, service.ErrPaymentConfigMissing) {
			response.Error(c, http.StatusServiceUnavailable, "Payment gateway is not configured", nil)
			return
		}
		if errors.Is(err, service.ErrInvalidPaymentAmount) {
			response.BadRequest(c, err.Error(), nil)
			return
		}
		response.InternalServerError(c, "Failed to create Razorpay order", nil)
		return
	}

	response.Success(c, http.StatusCreated, "Razorpay order created", order)
}

func (ctrl *PaymentController) VerifyRazorpayPayment(c *gin.Context) {
	var req service.VerifyRazorpayPaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid payment verification payload", err.Error())
		return
	}

	if err := ctrl.paymentService.VerifyRazorpayPayment(&req); err != nil {
		if errors.Is(err, service.ErrPaymentConfigMissing) {
			response.Error(c, http.StatusServiceUnavailable, "Payment gateway is not configured", nil)
			return
		}
		response.BadRequest(c, "Payment verification failed", nil)
		return
	}

	response.Success(c, http.StatusOK, "Payment signature verified", gin.H{
		"orderId":   req.OrderID,
		"paymentId": req.PaymentID,
	})
}

func (ctrl *PaymentController) RazorpayWebhook(c *gin.Context) {
	payload, err := io.ReadAll(io.LimitReader(c.Request.Body, 2<<20))
	if err != nil {
		response.BadRequest(c, "Invalid webhook payload", nil)
		return
	}
	signature := c.GetHeader("X-Razorpay-Signature")
	if err := ctrl.paymentService.VerifyWebhookSignature(payload, signature); err != nil {
		response.Unauthorized(c, "Invalid webhook signature")
		return
	}

	response.Success(c, http.StatusOK, "Webhook accepted", nil)
}
