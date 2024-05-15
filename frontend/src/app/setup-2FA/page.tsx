// pages/setup-2fa.tsx
'use client'

import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';

interface Setup2FAProps {}

const Setup2FA: React.FC<Setup2FAProps> = () => {
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
    const [secret, setSecret] = useState<string>('');
    const [otp, setOTP] = useState<string>('');

    useEffect(() => {
        // Fetch QR code data and secret key from backend
        fetch('http://localhost:5000/api/2fa/setup')
            .then(response => response.json())
            .then(data => {
                setSecret(data.secret);
                setQrCodeDataUrl(data.qrCodeDataUrl);
            })
            .catch(error => console.error('Error fetching QR code data:', error));
    }, []);

    

    return (
        <div>
            <h2>Setup Two-Factor Authentication</h2>
            {qrCodeDataUrl && <QRCode value={qrCodeDataUrl} />}
            <p>Scan the QR code with your authenticator app and enter the OTP below.</p>
            
        </div>
    );
};

export default Setup2FA;
