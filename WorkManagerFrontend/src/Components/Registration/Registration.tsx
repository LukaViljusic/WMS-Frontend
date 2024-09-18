import "./Registration.css";
import { SyntheticEvent, useState } from "react";
import {
  Stack,
  ButtonProps,
  styled,
  Button,
  TextField,
  Typography,
  TypographyProps,
} from "@mui/material";
import { blue, red, grey } from "@mui/material/colors";
import { Link, useNavigate } from "react-router-dom";
import { CircularProgress } from '@mui/joy';

const linkStyle = {
  margin: "10px",
  textDecoration: "none",
  color: "#2196f3",
  fontSize: "16px",
};

const loaderStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

const Registartion = (props: { name: string, setName: (name: string) => void }) => {
  const RegisterButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText(blue[600]),
    backgroundColor: blue[600],
    width: "350px",
    height: "50px",
    fontSize: "16px",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: blue[700],
    },
  }));

  const TypoError = styled(Typography)<TypographyProps>(({ theme }) => ({
    color: red[500],
    fontWeight: "bold",
  }));

  const [loader, setLoader] = useState(false);
  const [firstNameError, setFirstNameError] =useState("");
  const [lastNameError, setLastNameError] =useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordRequirements, setPasswordRequirements] = useState("");
  const [typoError, setTypoError] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const validateName = (name: string) => {
    const nameRegex = /.{4,}/;
    return nameRegex.test(name);
  }

  const handleFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFirstName = e.target.value;
    setFirstName(newFirstName);
    setFirstNameError(validateName(newFirstName) ? "" : "Invalid First Name");
  }

  const handleLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLastName = e.target.value;
    setLastName(newLastName);
    setLastNameError(validateName(newLastName) ? "" : "Invalid Last Name");
  }

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
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,}$/;
    return passwordRegex.test(password);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPasswordRequirements(generatePasswordRequirements(newPassword));
    setPassword(newPassword);
  };

  const generatePasswordRequirements = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters.";
    }

    if (!/[A-Za-z]/.test(password)) {
      return "Password must contain at least 1 letter.";
    }

    if (!/\d/.test(password)) {
      return "Password must contain at least 1 digit.";
    }

    return ""; // Password meets all requirements
  };

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!validateEmail(email) || !validatePassword(password) || !validateName(firstName)) {
      setTypoError(false);
      return;
    }

    const userData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    };
    const response = await fetch("https://localhost:7054/api/User/Register", {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });

    const result = await response.text();
    console.log(result);

    if (result === '{"message":"User Created Successfully"}') {
      navigate("/");
      props.setName("");
    } else {
      console.log("Invalid email");
      setTypoError(false);
    }
  };
  return (
    <div className="stack-container">
      <h1 className="registration-title">Register to Work Manager!</h1>
      <Stack
        className="stack"
        spacing={1}
        alignItems={"center"}
        direction={"column"}
      >
        <TextField
          className="textfield"
          id="outlined-basic"
          label="First Name"
          variant="outlined"
          type="text"
          onChange={handleFirstName}
          required
        />
        <Typography style={{ color: red[500], fontSize: '14px', marginTop: '5px' }}>
        {firstNameError}
        </Typography>
        <TextField
          className="textfield"
          id="outlined-basic"
          label="Last Name"
          variant="outlined"
          type="text"
          onChange={handleLastName}
          required
        />
        <Typography style={{ color: red[500], fontSize: '14px', marginTop: '5px' }}>
        {lastNameError}
        </Typography>
        <TextField
          className="textfield"
          id="outlined-basic"
          label="Email"
          variant="outlined"
          type="text"
          onChange={handleEmailChange}
          required
        />
        <Typography style={{ color: red[500], fontSize: '14px', marginTop: '5px' }}>
        {emailError}
        </Typography>
        {loader && <CircularProgress sx={loaderStyle} color="primary"/>}
        <TextField
          className="textfield"
          id="outlined-basic"
          label="Password"
          variant="outlined"
          type="password"
          onChange={handlePasswordChange}
          required
        />
        <Typography
          style={{ color: red[500], fontSize: "14px", marginTop: "5px" }}
        >
          {passwordRequirements}
        </Typography>
        <RegisterButton
          variant="contained"
          onClick={submit}
          style={
            validateEmail(email) && validatePassword(password) && validateName(firstName) && validateName(lastName)
              ? { backgroundColor: blue[500] }
              : { backgroundColor: grey[300], cursor: "pointer" }
          }
          disabled={!validateEmail(email) || !validatePassword(password) || !validateName(firstName) || !validateName(lastName)}
        >
          Register
        </RegisterButton>
        <TypoError hidden={typoError}>Email already in use!</TypoError>
        <label>Have an account?</label>
        <Link to="/login" style={linkStyle}>
          Log In
        </Link>
      </Stack>
    </div>
  );
};

export default Registartion;
