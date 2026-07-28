package jobs

import (
	"context"
	"fmt"
	"math"
	"sync"
	"time"

	"github.com/workorajobs/backend-go/pkg/logger"
	"go.uber.org/zap"
)

type Task struct {
	ID         string
	Payload    interface{}
	Handler    func(ctx context.Context, payload interface{}) error
	MaxRetries int
	Attempts   int
}

type WorkerPool struct {
	concurrency int
	taskQueue   chan Task
	dlqQueue    chan Task
	wg          sync.WaitGroup
	quit        chan struct{}
}

func NewWorkerPool(concurrency int, queueSize int) *WorkerPool {
	return &WorkerPool{
		concurrency: concurrency,
		taskQueue:   make(chan Task, queueSize),
		dlqQueue:    make(chan Task, queueSize),
		quit:        make(chan struct{}),
	}
}

func (wp *WorkerPool) Start(ctx context.Context) {
	for i := 0; i < wp.concurrency; i++ {
		wp.wg.Add(1)
		go wp.worker(ctx, i)
	}
	logger.Log.Info("Background Worker Pool started", zap.Int("concurrency", wp.concurrency))
}

func (wp *WorkerPool) worker(ctx context.Context, id int) {
	defer wp.wg.Done()

	for {
		select {
		case <-wp.quit:
			return
		case <-ctx.Done():
			return
		case task, ok := <-wp.taskQueue:
			if !ok {
				return
			}
			wp.processTask(ctx, task)
		}
	}
}

func (wp *WorkerPool) processTask(ctx context.Context, task Task) {
	task.Attempts++
	err := task.Handler(ctx, task.Payload)
	if err == nil {
		return
	}

	if task.Attempts < task.MaxRetries {
		backoff := time.Duration(math.Pow(2, float64(task.Attempts))) * time.Second
		logger.Log.Warn("Task failed, scheduling exponential backoff retry",
			zap.String("taskId", task.ID),
			zap.Int("attempt", task.Attempts),
			zap.Duration("backoff", backoff),
			zap.Error(err),
		)

		time.AfterFunc(backoff, func() {
			wp.taskQueue <- task
		})
	} else {
		logger.Log.Error("Task exceeded max retries, moving to Dead Letter Queue (DLQ)",
			zap.String("taskId", task.ID),
			zap.Error(err),
		)
		wp.dlqQueue <- task
	}
}

func (wp *WorkerPool) Submit(task Task) error {
	select {
	case wp.taskQueue <- task:
		return nil
	default:
		return fmt.Errorf("worker pool task queue full")
	}
}

func (wp *WorkerPool) Stop() {
	close(wp.quit)
	close(wp.taskQueue)
	wp.wg.Wait()
	logger.Log.Info("Worker Pool stopped cleanly")
}
