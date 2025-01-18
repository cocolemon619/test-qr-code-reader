'use client'; // クライアントコンポーネントとして指定

import React from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useState } from 'react';
import Select from 'react-select';

const qrcodeRegionId = 'html5qr-code-full-region';

export default function QrcodeReader({
    onScanSuccess,
    onScanFailure,
}: {
    onScanSuccess: (scanData: string) => void;
    onScanFailure: (errorMessage: string) => void;
}) {
    const config = { fps: 1, qrbox: { width: 100, height: 100 } };

    const [cameraPermission, setCameraPermission] = useState(false);
    const [selectedCameraId, setSelectedCameraId] = useState<string>('');
    const [cameras, setCameras] = useState<{ value: string; label: string }[]>([]);
    const [html5QrcodeScanner, setHtml5QrcodeScanner] = useState<Html5Qrcode | null>(null);

    const getCameras = async () => {
        await Html5Qrcode.getCameras()
            .then((cameras) => {
                if (cameras && cameras.length) {
                    const formattedCameras = cameras.map((camera) => ({
                        value: camera.id,
                        label: camera.label || `Camera ${camera.id}`,
                    }));
                    setCameras(formattedCameras);
                    setSelectedCameraId(formattedCameras[0].value);
                    setCameraPermission(true);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const startScan = async () => {
        if (html5QrcodeScanner) {
            try {
                await html5QrcodeScanner.start(
                    selectedCameraId,
                    config,
                    onScanSuccess,
                    onScanFailure,
                );
                setHtml5QrcodeScanner(html5QrcodeScanner);
            } catch (error) {
                console.error('Error starting the scanner: ', error);
            }
        } else {
            console.error('Scanner is not initialized');
        }
    };

    const stopScan = async () => {
        if (html5QrcodeScanner) {
            console.log('stop scan');
            try {
                await html5QrcodeScanner.stop();
                setHtml5QrcodeScanner(html5QrcodeScanner);
            } catch (error) {
                console.error('Error stopping the scanner: ', error);
            }
        } else {
            console.error('Scanner is not initialized');
        }
    };

    const switchCamera = (targetId: string) => {
        setSelectedCameraId(targetId);
    };

    useEffect(() => {
        if (!onScanSuccess || !onScanFailure) {
            throw 'required callback.';
        }

        const scanner = new Html5Qrcode(qrcodeRegionId);
        setHtml5QrcodeScanner(scanner);

        return () => {
            scanner.clear();
        };
    }, [onScanSuccess, onScanFailure]);

    return (
        <div className="container mx-auto">
            <div className="max-w-screen-lg" id={qrcodeRegionId} />
            <div>
                {cameras.length > 0 ? (
                    <Select
                        name="camera"
                        options={cameras}
                        value={cameras.find(
                            (camera) => camera.value === selectedCameraId
                        )}
                        placeholder="カメラを選択"
                        onChange={async (camera) => await switchCamera(camera?.value ?? '')}
                    />
                ) : (
                    <p>カメラがありません</p>
                )}
            </div>
            <div>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-1 px-2 rounded mr-2"
                    onClick={() => getCameras()}
                >
                    カメラ取得
                </button>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-1 px-2 rounded mr-2"
                    onClick={async () => await startScan()}
                    disabled={!cameraPermission && selectedCameraId === ''}
                >
                    スキャン開始
                </button>
                <button
                    className="bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-1 px-2 rounded"
                    onClick={async () => await stopScan()}
                >
                    スキャン停止
                </button>
            </div>
        </div>
    );
}
