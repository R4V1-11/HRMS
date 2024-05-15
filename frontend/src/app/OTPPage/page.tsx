// pages/verify-otp.tsx
'use client'
import React, { useState } from 'react';

interface VerifyOTPProps {}

const VerifyOTP: React.FC<VerifyOTPProps> = () => {
    const [otp, setOTP] = useState<string>('');

    const handleOTPVerification = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        fetch('http://localhost:5000/api/2fa/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ otp })
        })
            .then(response => {
                if (response.ok) {
                    console.log('OTP verification successful');
                    // Redirect user to dashboard or protected resource
                } else {
                    console.error('OTP verification failed');
                    // Handle failure, e.g., display error message
                }
            })
            .catch(error => console.error('Error verifying OTP:', error));
    };

    return (
        <div>
            <h2>Verify OTP</h2>
            <form onSubmit={handleOTPVerification}>
                <input type="text" value={otp} onChange={(e) => setOTP(e.target.value)} />
                <button type="submit">Verify OTP</button>
            </form>
        </div>
    );
};

export default VerifyOTP;
