package models

import (
	"time"
)

type GovtSector string

const (
	GovtSectorCentral  GovtSector = "CENTRAL"
	GovtSectorState    GovtSector = "STATE"
	GovtSectorPSU      GovtSector = "PSU"
	GovtSectorBanking  GovtSector = "BANKING"
	GovtSectorRailways GovtSector = "RAILWAYS"
	GovtSectorDefence  GovtSector = "DEFENCE"
	GovtSectorUPSC     GovtSector = "UPSC"
	GovtSectorSSC      GovtSector = "SSC"
)

type GovtJobFilterDTO struct {
	Sector               string    `form:"sector"` // CENTRAL, STATE, PSU, BANKING, RAILWAYS, DEFENCE, UPSC, SSC
	Qualification        string    `form:"qualification"`
	MinVacancy           *int      `form:"minVacancy"`
	DeadlineBefore       *time.Time `form:"deadlineBefore"`
	State                string    `form:"state"`
	Page                 int       `form:"page,default=1"`
	Limit                int       `form:"limit,default=20"`
}

type GovtExamCalendarDTO struct {
	ID                     string     `json:"id"`
	ExamName               string     `json:"examName"`
	OrganizingBody         string     `json:"organizingBody"` // e.g. UPSC, SSC, IBPS, RRB
	Sector                 GovtSector `json:"sector"`
	VacancyCount           int        `json:"vacancyCount"`
	Qualification          string     `json:"qualification"`
	NotificationDate       time.Time  `json:"notificationDate"`
	ApplicationDeadline    time.Time  `json:"applicationDeadline"`
	ExamDate               *time.Time `json:"examDate,omitempty"`
	AdmitCardReleaseDate   *time.Time `json:"admitCardReleaseDate,omitempty"`
	ResultDate             *time.Time `json:"resultDate,omitempty"`
	OfficialNotificationURL string    `json:"officialNotificationUrl"`
	ApplyURL               string     `json:"applyUrl"`
}
