package response

import (
	"testing"
)

func TestSanitizePagination(t *testing.T) {
	tests := []struct {
		inputPage  int
		inputLimit int
		wantPage   int
		wantLimit  int
		wantOffset int
	}{
		{inputPage: 0, inputLimit: 0, wantPage: 1, wantLimit: 20, wantOffset: 0},
		{inputPage: -5, inputLimit: -10, wantPage: 1, wantLimit: 20, wantOffset: 0},
		{inputPage: 2, inputLimit: 50, wantPage: 2, wantLimit: 50, wantOffset: 50},
		{inputPage: 3, inputLimit: 200, wantPage: 3, wantLimit: 100, wantOffset: 200},
	}

	for _, tt := range tests {
		page, limit, offset := SanitizePagination(tt.inputPage, tt.inputLimit)
		if page != tt.wantPage || limit != tt.wantLimit || offset != tt.wantOffset {
			t.Errorf("SanitizePagination(%d, %d) = (%d, %d, %d); want (%d, %d, %d)",
				tt.inputPage, tt.inputLimit, page, limit, offset, tt.wantPage, tt.wantLimit, tt.wantOffset)
		}
	}
}
