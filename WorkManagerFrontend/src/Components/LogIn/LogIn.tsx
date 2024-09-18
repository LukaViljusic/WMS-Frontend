import React, { SyntheticEvent, useState } from 'react';
import { Stack, TextField, Button, styled, ButtonProps, Typography, TypographyProps, Paper } from '@mui/material';
import { blue, red, grey } from '@mui/material/colors';
import { Link, useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/joy';
import './Login.css';

const linkStyle = {
  margin: "10px",
  textDecoration: "none",
  color: "#2196f3",
  fontSize: "16px"
};


const loaderStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

const LogIn = (props: { name: string, setName: (name: string) => void }) => {
  const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText(blue[600]),
    backgroundColor: blue[600],
    width: "350px",
    height: "50px",
    fontSize: "16px",
    fontWeight: "bold",
    '&:hover': {
      backgroundColor: blue[700],
    }
  }));

  const TypoError = styled(Typography)<TypographyProps>(({ theme }) => ({
    color: red[500],
    fontWeight: "bold",
  }));




  const [loader, setLoader] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordRequirements, setPasswordRequirements] = useState('');
  const [typoError, setTypoError] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError(validateEmail(newEmail) ? '' : 'Invalid email format');
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,}$/;
    return passwordRegex.test(password);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPasswordRequirements(generatePasswordRequirements(newPassword));
    setPassword(newPassword);
  };

  const generatePasswordRequirements = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters.';
    }

    if (!/[A-Za-z]/.test(password)) {
      return 'Password must contain at least 1 letter.';
    }

    if (!/\d/.test(password)) {
      return 'Password must contain at least 1 digit.';
    }

    return '';
  };

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoader(true);

    if (!validateEmail(email) || !validatePassword(password)) {
      setTypoError(false);
      setLoader(false);
      return;
    }

    const userData = {
      email: email,
      password: password,
    };
    const response = await fetch("https://localhost:7054/api/User/Login", {
      method: "POST",
      headers: {
        "accept": "*/*",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });

    const content = await response.text();
    console.log(content);

    if (content === '{"message":"success"}') {
      navigate('/');
      props.setName("");
    } else {
      console.log("Invalid email");
      setTypoError(false);
    }

    setLoader(false);
  };


  return (
    <div className='login-container'>
      <h1 className='login-title'>Log In to Work Manager System!</h1>
      <Stack className="stack" spacing={1} alignItems={"center"} direction={"column"}>
        <TextField
          name="email"
          className="textfield"
          id="outlined-basic"
          label="Email"
          variant="outlined"
          type='text'
          onChange={handleEmailChange}
          required
        />
        <Typography style={{ color: red[500], fontSize: '14px', marginTop: '5px' }}>
          {emailError}
        </Typography>
        
        
        {loader && <CircularProgress sx={loaderStyle} color="primary"/>}

        <TextField
          name="password"
          className="textfield"
          id="outlined-basic"
          label="Password"
          variant="outlined"
          type='password'
          onChange={handlePasswordChange}
          required
        />
        <Typography style={{ color: red[500], fontSize: '14px', marginTop: '5px' }}>
        {passwordRequirements}
        </Typography>
        <ColorButton
          variant='contained'
          onClick={submit}
          style={validateEmail(email) && validatePassword(password) ? { backgroundColor: blue[500] } : { backgroundColor: grey[300], cursor: 'pointer' }}
          disabled={!validateEmail(email) || !validatePassword(password)}
        >
          Log In
        </ColorButton>
        <TypoError hidden={typoError} >Incorrect email or password!</TypoError>
        <label>Don't have an account?</label>
        <Link to="/register" style={linkStyle}>Register</Link>
      </Stack>
    </div>
  );
};

export default LogIn;
