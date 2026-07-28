package pool

import (
	"bytes"
	"sync"
)

var bufferPool = sync.Pool{
	New: func() interface{} {
		return new(bytes.Buffer)
	},
}

func GetBuffer() *bytes.Buffer {
	buf := bufferPool.Get().(*bytes.Buffer)
	buf.Reset()
	return buf
}

func PutBuffer(buf *bytes.Buffer) {
	if buf.Cap() > 64*1024 {
		return // Don't keep oversized buffers to prevent memory leaks
	}
	buf.Reset()
	bufferPool.Put(buf)
}
