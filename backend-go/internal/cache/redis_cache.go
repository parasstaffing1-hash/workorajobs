package cache

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
	"golang.org/x/sync/singleflight"
)

type RedisCache struct {
	client *redis.Client
	group  singleflight.Group
}

func NewRedisCache(redisURL string) (*RedisCache, error) {
	opts, err := redis.ParseURL(redisURL)
	if err != nil {
		opts = &redis.Options{
			Addr:     "localhost:6379",
			Password: "",
			DB:       0,
		}
	}

	client := redis.NewClient(opts)
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	if err := client.Ping(ctx).Err(); err != nil {
		return nil, fmt.Errorf("redis connection failed: %w", err)
	}

	return &RedisCache{client: client}, nil
}

func (c *RedisCache) GetOrFetch(ctx context.Context, key string, ttl time.Duration, dest interface{}, fetchFunc func() (interface{}, error)) error {
	val, err := c.client.Get(ctx, key).Result()
	if err == nil {
		return json.Unmarshal([]byte(val), dest)
	}

	// Singleflight Stampede Protection
	result, err, _ := c.group.Do(key, func() (interface{}, error) {
		data, fetchErr := fetchFunc()
		if fetchErr != nil {
			return nil, fetchErr
		}

		encoded, encErr := json.Marshal(data)
		if encErr == nil {
			_ = c.client.Set(ctx, key, string(encoded), ttl).Err()
		}

		return data, nil
	})

	if err != nil {
		return err
	}

	encoded, _ := json.Marshal(result)
	return json.Unmarshal(encoded, dest)
}

func (c *RedisCache) Invalidate(ctx context.Context, key string) error {
	return c.client.Del(ctx, key).Err()
}

func (c *RedisCache) InvalidatePattern(ctx context.Context, pattern string) error {
	iter := c.client.Scan(ctx, 0, pattern, 0).Iterator()
	for iter.Next(ctx) {
		_ = c.client.Del(ctx, iter.Val()).Err()
	}
	return iter.Err()
}
