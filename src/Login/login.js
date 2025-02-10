import React, { useEffect, useState } from 'react';
import './login.css'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Login = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorId, setErrorId] = useState(false);
  const [errorNumber, setErrorNumber] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedUserId = Cookies.get('userId');
    const savedPhoneNumber = Cookies.get('phoneNumber');

    if (savedUserId && savedPhoneNumber) {
      setUserId(savedUserId);
      setPhoneNumber(savedPhoneNumber);
      setRememberMe(true);
      setErrorId(false);
      setErrorNumber(false);
    }
  }, []);

  const handleUserIdChange = (event) => {
    setUserId(event.target.value);
    validateUserId(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
    validatePhoneNumber(event.target.value);
  };

  const validateUserId = (value) => {
    const trimmedValue = value.trim();
    if (trimmedValue === '') {
        setErrorId('UserId cannot be empty.');
    } else if (!/^\d{5}$/.test(trimmedValue)) {
        setErrorId('UserId must contain exactly 5 digits.');
    } else {
        setErrorId(false);
    }
  };

  const validatePhoneNumber = (value) => {
    const trimmedValue = value.trim();
    if (trimmedValue === '') {
        setErrorNumber('PhoneNumber cannot be empty.');
    } else if (!/^[6-9]\d{9}$/.test(trimmedValue)) {
        setErrorNumber('PhoneNumber must contain exactly 10 digits and start with 6, 7, 8, or 9.');
    } else {
        setErrorNumber(false);
    }
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  const login = async (userId,phoneNumber) => {
    let requestData ={
        userId: userId,
        phoneNumber: phoneNumber
    }
    try {
        const response = await fetch('https://fitness-booking-backend-production.up.railway.app/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
        const result = await response.json();
        console.log(result)
        if (result.status) {
            if (rememberMe) {
                Cookies.set('userId', userId, { expires: 7 });
                Cookies.set('phoneNumber', phoneNumber, { expires: 7 });
            } else {
                Cookies.remove('userId');
                Cookies.remove('phoneNumber');
            }
            navigate(`/home/${userId}`);
        } else {
           if(result.message === "UserId already taken"){
                setErrorId(result.message)
           }
           else if (result.message === "User already exists with this phoneNumber"){
                setErrorNumber(result.message)
           }
        }
      }
      catch (error) {
        console.error('Error while login:', error);
      }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(userId === ""){
        setErrorId("userId is required")
    }
    else if(phoneNumber === ""){
        setErrorNumber("phoneNumber is required")
    }
    else if (!errorId && !errorNumber) {
       console.log('userId:', userId , 'phoneNumber:' , phoneNumber);
       login(userId,phoneNumber);
    }
  };

  return (
    <div className="login-container">
      <label className='label'>Login</label>
        <input
          type="text"
          value={userId}
          onChange={handleUserIdChange}
          placeholder="userId"
          className='field'
        />
        {errorId && <p className="error-message">{errorId}</p>}
        <input
          type="text"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder="phoneNumber"
          className='field'
        />
         {errorNumber && <p className="error-message">{errorNumber}</p>}
        <div className='rememberMeContainer'>
          <input
          type="checkbox"
          checked={rememberMe}
          onChange={handleRememberMeChange}
          className='checkbox'
          />
          <label className='rememberMeWord'>
             Remember Me
          </label>
        </div>
        <button onClick={(errorId === false && errorNumber === false)? handleSubmit : null} className={(errorId === false && errorNumber === false) ? 'enabledButton' : 'disabledButton'}>
          Login
        </button>
    </div>
  );
};

export default Login;
