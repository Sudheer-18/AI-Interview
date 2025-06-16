import React from 'react';
import { Camera, CameraOff, AlertTriangle } from 'lucide-react';
import { CameraStatus } from '../types';

interface CameraPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  cameraStatus: CameraStatus;
  onStartCamera: () => void;
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({
  videoRef,
  cameraStatus,
  onStartCamera,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-600" />
          Camera Preview
        </h3>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
          cameraStatus.isEnabled 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {cameraStatus.isEnabled ? (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Live
            </>
          ) : (
            <>
              <CameraOff className="w-3 h-3" />
              Off
            </>
          )}
        </div>
      </div>

      <div className="relative">
        {cameraStatus.isEnabled ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-48 bg-gray-900 rounded-lg object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
            <AlertTriangle className="w-8 h-8 text-yellow-500 mb-2" />
            <p className="text-sm text-gray-600 text-center mb-2">
              {cameraStatus.error || 'Camera access required for interview monitoring'}
            </p>
            {cameraStatus.error && (
              <p className="text-xs text-gray-500 text-center mb-3 px-2">
                Please check your browser permissions and ensure no other application is using the camera
              </p>
            )}
            <button
              onClick={onStartCamera}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              {cameraStatus.error ? 'Retry Camera Access' : 'Enable Camera'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};