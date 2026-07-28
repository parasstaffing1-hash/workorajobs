package service

import (
	"testing"

	"github.com/workorajobs/backend-go/internal/domain/models"
)

func TestInternshipFilterStruct(t *testing.T) {
	stipend := 25000
	hasPPO := true
	filter := models.InternshipSearchFilterDTO{
		Type:       "PAID",
		HasPPO:     &hasPPO,
		MinStipend: &stipend,
		Location:   "Remote",
	}

	if filter.Type != "PAID" || *filter.HasPPO != true || *filter.MinStipend != 25000 {
		t.Errorf("Unexpected filter values: %+v", filter)
	}
}
