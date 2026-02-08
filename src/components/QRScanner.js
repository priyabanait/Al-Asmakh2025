"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

const QRScanner = ({ onScan, onError, autoStart = true }) => {
  const videoRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const [cameraError, setCameraError] = useState('');
  const [permissionStatus, setPermissionStatus] = useState('prompt');
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const codeReaderRef = useRef(null);
  const streamRef = useRef(null);
  const scanningRef = useRef(false);

  // Vibration feedback on successful scan
  const vibrate = () => {
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  };

  // Get available cameras
  const getCameras = async () => {
    try {
      const codeReader = new BrowserMultiFormatReader();
      const videoInputDevices = await codeReader.listVideoInputDevices();
      return videoInputDevices;
    } catch (error) {
      console.error('Error getting cameras:', error);
      return [];
    }
  };

  // Stop scanning
  const stopScanner = useCallback(async () => {
    try {
      scanningRef.current = false;
      setIsScanning(false);
      
      // Stop scanning
      if (codeReaderRef.current) {
        try {
          codeReaderRef.current.reset();
        } catch (e) {
          // Ignore reset errors
        }
      }
      
      // Stop video stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
        });
        streamRef.current = null;
      }
      
      // Clear video element
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.pause();
      }
    } catch (error) {
      console.error("Error stopping scanner:", error);
    }
  }, []);

  // Start scanning
  const startScanner = useCallback(async () => {
    if (scanningRef.current) return;
    
    try {
      scanningRef.current = true;
      setIsScanning(true);
      setCameraError('');

      // Get available cameras
      const cameras = await getCameras();
      if (cameras.length === 0) {
        throw new Error('No camera found on your device');
      }

      // Prefer back camera (environment facing) if available
      const backCamera = cameras.find(cam => 
        cam.label.toLowerCase().includes('back') || 
        cam.label.toLowerCase().includes('rear') ||
        cam.label.toLowerCase().includes('environment')
      );

      const deviceId = selectedDeviceId || backCamera?.deviceId || cameras[0].deviceId;
      setSelectedDeviceId(deviceId);

      // Create code reader instance
      if (!codeReaderRef.current) {
        codeReaderRef.current = new BrowserMultiFormatReader();
      }

      const codeReader = codeReaderRef.current;

      // Get video element
      if (!videoRef.current) {
        throw new Error('Video element not found');
      }

      // Get user media
      const constraints = {
        video: {
          deviceId: { exact: deviceId },
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      videoRef.current.setAttribute('playsinline', 'true');
      videoRef.current.setAttribute('autoplay', 'true');
      videoRef.current.setAttribute('muted', 'true');
      
      await videoRef.current.play();

      setPermissionStatus('granted');
      setHasCamera(true);

      // Start decoding loop
      const decodeFromVideo = async () => {
        if (!scanningRef.current || !videoRef.current) return;

        try {
          const result = await codeReader.decodeFromVideoDevice(
            deviceId,
            videoRef.current,
            (result, error) => {
              if (result && scanningRef.current) {
                const text = result.getText();
                console.log('QR Code scanned:', text);
                
                // Vibrate on success
                vibrate();
                
                // Stop scanning
                stopScanner();
                
                // Call onScan callback
                if (onScan) {
                  onScan({
                    data: text,
                    timestamp: new Date().toISOString()
                  });
                }
              }
              
              if (error) {
                // Only log actual errors, not NotFoundException (which is normal during scanning)
                if (error.name !== 'NotFoundException' && error.name !== 'NoQRCodeFound') {
                  console.log('Scan error:', error.message);
                }
              }
            }
          );
        } catch (error) {
          if (error.name !== 'NotFoundException' && scanningRef.current) {
            console.error('Decode error:', error);
          }
          // Continue scanning on error
          if (scanningRef.current) {
            setTimeout(decodeFromVideo, 100);
          }
        }
      };

      // Start decoding after video is ready
      setTimeout(decodeFromVideo, 500);

    } catch (error) {
      console.error("Error accessing camera:", error);
      scanningRef.current = false;
      setIsScanning(false);
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setCameraError('Camera permission denied. Please enable camera access in your browser settings.');
        setPermissionStatus('denied');
        setHasCamera(false);
        if (onError) onError(error);
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setCameraError('No camera found on your device.');
        setHasCamera(false);
        setPermissionStatus('denied');
        if (onError) onError(error);
      } else {
        setCameraError(error.message || 'Could not access camera. Please check your browser settings.');
        setHasCamera(false);
        setPermissionStatus('denied');
        if (onError) onError(error);
      }
    }
  }, [selectedDeviceId, onScan, onError, stopScanner]);

  // Auto-start on mount
  useEffect(() => {
    if (autoStart) {
      startScanner();
    }
    
    return () => {
      stopScanner();
    };
  }, [autoStart, startScanner, stopScanner]);

  return (
    <div className="qr-scanner">
      <div className="relative w-full">
        {/* Video Element */}
        <video
          ref={videoRef}
          className={`w-full ${isScanning ? 'min-h-[400px]' : 'h-64'} rounded-lg object-cover bg-black`}
          playsInline
          autoPlay
          muted
        />
        
        {/* Scanning overlay */}
        {isScanning && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 border-4 border-green-500 rounded-lg opacity-80 shadow-lg"></div>
              {/* Corner indicators */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500"></div>
            </div>
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-70 px-4 py-2 rounded">
              Align QR code within the frame
            </div>
          </div>
        )}
        
        {/* Camera permission denied message */}
        {!hasCamera && permissionStatus === 'denied' && (
          <div className="absolute inset-0 w-full h-full bg-gray-200 rounded-lg flex flex-col items-center justify-center p-4">
            <div className="text-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <p className="text-gray-700 font-medium mb-2">Camera Permission Required</p>
              <p className="text-gray-600 text-sm mb-4">{cameraError || 'Please enable camera access to scan QR codes'}</p>
              <button
                onClick={startScanner}
                className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-[#17395e] transition-colors"
              >
                Enable Camera
              </button>
              <p className="text-xs text-gray-500 mt-2">Go to browser settings if the button doesn't work</p>
            </div>
          </div>
        )}
        
        {/* Camera not available message */}
        {!hasCamera && permissionStatus !== 'denied' && !isScanning && (
          <div className="absolute inset-0 w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-600 text-center p-4">{cameraError || 'Camera not available'}</p>
          </div>
        )}
        
        {/* Scanner button - show when camera is available but not scanning */}
        {!isScanning && hasCamera && permissionStatus !== 'denied' && (
          <div 
            className="absolute inset-0 w-full h-full bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={startScanner}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-blue-600 font-medium">Tap to scan QR code</p>
            </div>
          </div>
        )}
        
        {/* Stop scanning button */}
        {isScanning && (
          <button 
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-2 rounded-full shadow-lg z-10 hover:bg-red-600 transition-colors"
            onClick={stopScanner}
          >
            Cancel Scan
          </button>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
