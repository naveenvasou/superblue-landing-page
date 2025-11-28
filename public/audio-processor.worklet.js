// AudioWorklet processor for real-time audio capture and downsampling
// This runs on a separate audio thread for better performance

const SAMPLE_RATE = 16000; // Target sample rate
const CHUNK_SIZE = 512; // Chunk size for VAD

class AudioCaptureProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        // Pre-allocated buffer pool to avoid constant memory allocations
        this.bufferPool = new Float32Array(4096); // Pre-allocated
        this.bufferLength = 0;
        this.isMuted = false;

        // Listen for mute state changes from main thread
        this.port.onmessage = (event) => {
            if (event.data.type === 'mute') {
                this.isMuted = event.data.value;
            }
        };
    }

    // Downsample buffer
    downsampleBuffer(buffer, sampleRate, outSampleRate) {
        if (outSampleRate === sampleRate) {
            return buffer;
        }
        if (outSampleRate > sampleRate) {
            throw new Error("downsampling rate should be smaller than original sample rate");
        }
        const sampleRateRatio = sampleRate / outSampleRate;
        const newLength = Math.round(buffer.length / sampleRateRatio);
        const result = new Float32Array(newLength);
        let offsetResult = 0;
        let offsetBuffer = 0;
        while (offsetResult < result.length) {
            const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
            // Use average value of skipped samples
            let accum = 0, count = 0;
            for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
                accum += buffer[i];
                count++;
            }
            result[offsetResult] = accum / count;
            offsetResult++;
            offsetBuffer = nextOffsetBuffer;
        }
        return result;
    }

    // Convert Float32 to Int16
    convertFloat32ToInt16(buffer) {
        let l = buffer.length;
        const buf = new Int16Array(l);
        while (l--) {
            buf[l] = Math.min(1, Math.max(-1, buffer[l])) * 0x7FFF;
        }
        return buf;
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0];

        // If no input or muted, continue processing but don't send data
        if (!input || !input[0] || this.isMuted) {
            return true;
        }

        const inputData = input[0]; // First channel

        // Downsample to 16kHz
        const downsampled = this.downsampleBuffer(inputData, sampleRate, SAMPLE_RATE);

        // Check if buffer has enough space
        if (this.bufferLength + downsampled.length > this.bufferPool.length) {
            // Buffer overflow protection - expand pool
            const newPool = new Float32Array(this.bufferPool.length * 2);
            newPool.set(this.bufferPool.subarray(0, this.bufferLength));
            this.bufferPool = newPool;
        }

        // Copy downsampled data into pool
        this.bufferPool.set(downsampled, this.bufferLength);
        this.bufferLength += downsampled.length;

        // Process 512-sample chunks
        while (this.bufferLength >= CHUNK_SIZE) {
            const chunk = this.bufferPool.slice(0, CHUNK_SIZE);

            // Shift remaining data efficiently using copyWithin
            this.bufferPool.copyWithin(0, CHUNK_SIZE, this.bufferLength);
            this.bufferLength -= CHUNK_SIZE;

            const int16Data = this.convertFloat32ToInt16(chunk);

            // Send to main thread
            this.port.postMessage({
                type: 'audio',
                data: int16Data
            }, [int16Data.buffer]);
        }

        return true; // Keep processor alive
    }
}

registerProcessor('audio-capture-processor', AudioCaptureProcessor);
