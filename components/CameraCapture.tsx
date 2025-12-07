'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { X, Camera, SwitchCamera, Check, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CameraCaptureProps {
    onCapture: (file: File) => void;
    onClose: () => void;
}

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    // Time-Lapse refs
    const timelapseIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const isPausedRef = useRef(false);

    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [capturedVideo, setCapturedVideo] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
    const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

    // Mode State
    const [mode, setMode] = useState<'photo' | 'video' | 'timelapse'>('photo');
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Check for multiple cameras
    useEffect(() => {
        async function checkCameras() {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                setHasMultipleCameras(videoDevices.length > 1);
            } catch (err) {
                console.error('Error checking cameras:', err);
            }
        }
        checkCameras();
    }, []);

    const startCamera = useCallback(async () => {
        try {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            // Optimize: Use 720p for video/timelapse to save space, 1080p for photo
            const width = mode === 'photo' ? 1920 : 1280;
            const height = mode === 'photo' ? 1080 : 720;

            const constraints = {
                video: {
                    facingMode: facingMode,
                    width: { ideal: width },
                    height: { ideal: height }
                },
                audio: mode === 'video' // No audio for timelapse or photo
            };

            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.muted = true;
            }
            setError(null);
        } catch (err) {
            console.error('Error accessing camera:', err);
            setError('Unable to access camera/microphone. Please ensure you have granted permission.');
        }
    }, [facingMode, mode]);

    useEffect(() => {
        startCamera();

        return () => {
            // Cleanup on unmount or mode/facing change will be handled by the specialized cleanup effect below
        };
    }, [startCamera]);

    // Cleanup stream when component unmounts or stream changes
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            stopRecordingCleanup();
        };
    }, [stream]);

    // Re-attach stream when switching back to video mode
    useEffect(() => {
        if (stream && videoRef.current && !capturedImage && !capturedVideo) {
            videoRef.current.srcObject = stream;
        }
    }, [capturedImage, capturedVideo, stream]);

    const stopRecordingCleanup = () => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        if (timelapseIntervalRef.current) clearInterval(timelapseIntervalRef.current);
    };

    const takePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageUrl = canvas.toDataURL('image/jpeg', 0.8);
                setCapturedImage(imageUrl);
            }
        }
    };

    const startRecording = () => {
        if (!stream) return;

        chunksRef.current = [];
        // Optimize: Limit bitrate to 1 Mbps for space saving
        const options: MediaRecorderOptions = {
            mimeType: 'video/webm;codecs=vp8',
            videoBitsPerSecond: 1000000 // 1 Mbps
        };

        // Fallback if codec not supported
        let mediaRecorder: MediaRecorder;
        try {
            mediaRecorder = new MediaRecorder(stream, options);
        } catch (e) {
            mediaRecorder = new MediaRecorder(stream); // Default settings fallback
        }

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunksRef.current.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
            setCapturedVideo(blob);
            chunksRef.current = [];
        };

        mediaRecorder.start();
        mediaRecorderRef.current = mediaRecorder;
        setIsRecording(true);
        setRecordingTime(0);

        // Timer for UI
        timerIntervalRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);

        // Time-Lapse Logic: 5x Speed
        // Record 100ms, Pause 400ms. Cycle = 500ms.
        // Result: 100ms video per 500ms real time = 5x speed
        if (mode === 'timelapse') {
            isPausedRef.current = false;
            timelapseIntervalRef.current = setInterval(() => {
                if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') return;

                if (isPausedRef.current) {
                    // Currently paused, resume recording
                    mediaRecorderRef.current.resume();
                    isPausedRef.current = false;
                    // Run for 100ms then pause
                    setTimeout(() => {
                        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                            mediaRecorderRef.current.pause();
                            isPausedRef.current = true;
                        }
                    }, 100);
                }
            }, 500); // Trigger every 500ms

            // Initial pause after first 100ms
            setTimeout(() => {
                if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                    mediaRecorderRef.current.pause();
                    isPausedRef.current = true;
                }
            }, 100);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            stopRecordingCleanup();
        }
    };

    const confirmMedia = useCallback(async () => {
        if (capturedImage) {
            try {
                const res = await fetch(capturedImage);
                const blob = await res.blob();
                const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
                onCapture(file);
                onClose();
            } catch (err) {
                console.error('Error converting image to file:', err);
                setError('Failed to process image');
            }
        } else if (capturedVideo) {
            const file = new File([capturedVideo], `video-${Date.now()}.webm`, { type: 'video/webm' });
            onCapture(file);
            onClose();
        }
    }, [capturedImage, capturedVideo, onCapture, onClose]);

    const retake = () => {
        setCapturedImage(null);
        setCapturedVideo(null);
    };

    const switchCamera = () => {
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    };

    // Format seconds to mm:ss
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
            <div className="relative w-full h-full flex flex-col">
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent text-white safe-top">
                    <button onClick={onClose} className="p-3 rounded-full bg-black/20 backdrop-blur-md active:bg-black/40 transition-colors">
                        <X size={28} />
                    </button>

                    {isRecording && (
                        <div className="flex flex-col items-center">
                            <div className="px-4 py-1 bg-red-600/80 rounded-full text-white font-mono text-sm animate-pulse">
                                {formatTime(recordingTime)}
                            </div>
                            {mode === 'timelapse' && <span className="text-xs text-red-400 font-bold mt-1">5x SPEED</span>}
                        </div>
                    )}

                    {!isRecording && !capturedImage && !capturedVideo ? (
                        <div className="flex bg-black/30 backdrop-blur-md rounded-full p-1 border border-white/10 overflow-hidden">
                            {(['photo', 'video', 'timelapse'] as const).map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setMode(m)}
                                    className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${mode === m ? 'bg-white text-black shadow-md' : 'text-white/70 hover:text-white'}`}
                                >
                                    {m === 'timelapse' ? 'Time-Lapse' : m.charAt(0).toUpperCase() + m.slice(1)}
                                </button>
                            ))}
                        </div>
                    ) : (<div></div>)}

                    <div className="flex items-center gap-4">
                        {!isRecording && !capturedImage && !capturedVideo && hasMultipleCameras && (
                            <button onClick={switchCamera} className="p-3 rounded-full bg-black/20 backdrop-blur-md active:bg-black/40 transition-colors">
                                <SwitchCamera size={28} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
                    <AnimatePresence mode="wait">
                        {!capturedImage && !capturedVideo ? (
                            <motion.div
                                key="video"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        ) : capturedImage ? (
                            <motion.div
                                key="image"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <img
                                    src={capturedImage}
                                    alt="Captured"
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="video-preview"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <video
                                    src={capturedVideo ? URL.createObjectURL(capturedVideo) : ''}
                                    controls
                                    className="w-full h-full object-contain bg-black"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {error && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white p-6 text-center z-20">
                            <p className="text-lg font-medium">{error}</p>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-8 pb-10 bg-gradient-to-t from-black/80 to-transparent flex justify-center items-center z-10 safe-bottom">
                    <canvas ref={canvasRef} className="hidden" />

                    <div className="flex justify-center items-center gap-12">
                        {!capturedImage && !capturedVideo ? (
                            mode === 'photo' ? (
                                <button
                                    onClick={takePhoto}
                                    className="h-20 w-20 rounded-full border-4 border-white flex items-center justify-center p-1.5 shadow-lg shadow-black/20 transition-transform active:scale-95"
                                >
                                    <div className="h-full w-full bg-white rounded-full" />
                                </button>
                            ) : (
                                <button
                                    onClick={isRecording ? stopRecording : startRecording}
                                    className={`h-20 w-20 rounded-full border-4 flex items-center justify-center p-1.5 shadow-lg shadow-black/20 transition-transform active:scale-95 ${isRecording ? 'border-red-500' : 'border-white'}`}
                                >
                                    {isRecording ? (
                                        <div className="h-8 w-8 bg-red-500 rounded-sm" />
                                    ) : (
                                        <div className="h-full w-full bg-red-600 rounded-full" />
                                    )}
                                </button>
                            )
                        ) : (
                            <>
                                <button
                                    onClick={retake}
                                    className="flex flex-col items-center gap-2 text-white/90 hover:text-white transition-colors"
                                >
                                    <div className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                                        <RefreshCw size={28} />
                                    </div>
                                    <span className="text-sm font-medium shadow-black/50 drop-shadow-md">Retake</span>
                                </button>

                                <button
                                    onClick={confirmMedia}
                                    className="flex flex-col items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
                                >
                                    <div className="p-4 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-900/30">
                                        <Check size={28} />
                                    </div>
                                    <span className="text-sm font-medium text-white shadow-black/50 drop-shadow-md">Use {capturedVideo ? 'Video' : 'Photo'}</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
