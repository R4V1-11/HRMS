// pages/login.tsx
'use client'

import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import {faLock} from '@fortawesome/free-solid-svg-icons'


const LoginPage: React.FC = () => {
  const [empid, setEmpid] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role,setRole] = useState<number>(0);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ empid, password }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data.message);
        router.push('/setup-2FA');
      } else {
        const data = await response.json();
        console.error('Login failed:', data.error);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  // The rest of your component remains unchanged
  return (
    <div>
      <Head>
        <title>Adrenaline Pro Max | Log in</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/icheck-bootstrap/3.0.1/icheck-bootstrap.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/3.1.0/css/adminlte.min.css" />
      </Head>
      <div className="d-flex justify-content-center mt-5">
        <div>
          <div className="login-logo">
            <a>Adrenaline Pro Max</a>
          </div> 
          <div className="card">
            <div className="card-body login-card-body">
              <p className="login-box-msg">Sign in to start your session</p>
              <form method='POST' onSubmit={(e)=>{handleSubmit(e)}}>
               <div className="input-group mb-3">
                 <input type="text" name="empid" className="form-control" placeholder="EmpId" value={empid} onChange={(e) => setEmpid(e.target.value)} />
                 <div className="input-group-append">
                   <div className="input-group-text">
                     <FontAwesomeIcon icon={faUser} />
                   </div>
                 </div>
               </div>
               <div className="input-group mb-3">
                 <input type="password" name="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                 <div className="input-group-append">
                   <div className="input-group-text">
                     <FontAwesomeIcon icon={faLock} />
                   </div>
                 </div>
               </div>
               <div className="row">
                 <div className='col-3'></div>
                 <div className="col-6">
                   <button type="submit" className="btn btn-primary btn-block">Sign In</button>
                 </div>
               </div>
             </form>

              <p className="mb-1 mt-1 text-center">
                <a href="forgot-password.html">I forgot my password</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
