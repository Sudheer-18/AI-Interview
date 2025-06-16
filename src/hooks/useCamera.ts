import { useState, useEffect, useRef } from 'react';
import { CameraStatus } from '../types';

export const useCamera = () => {
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>({
    isEnabled: false,
    hasPermission: false,
  });
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false 
      });
      
      setCameraStatus({
        isEnabled: true,
        hasPermission: true,
        stream,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera access error:', error);
      
      // Handle different types of camera errors
      let errorMessage = 'Camera access denied';
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Camera permission denied by user';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No camera device found';
        } else if (error.name === 'NotReadableError') {
          errorMessage = 'Camera is already in use by another application';
        } else if (error.name === 'OverconstrainedError') {
          errorMessage = 'Camera constraints cannot be satisfied';
        }
      }
      
      setCameraStatus({
        isEnabled: false,
        hasPermission: false,
        error: errorMessage,
      });
    }
  };

  const stopCamera = () => {
    if (cameraStatus.stream) {
      cameraStatus.stream.getTracks().forEach(track => track.stop());
    }
    setCameraStatus({
      isEnabled: false,
      hasPermission: false,
    });
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return {
    cameraStatus,
    videoRef,
    startCamera,
    stopCamera,
  };
};