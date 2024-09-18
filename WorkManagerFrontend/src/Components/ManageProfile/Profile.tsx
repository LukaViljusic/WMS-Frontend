import { styled } from "@mui/system";
import { Tabs as BaseTabs } from "@mui/base/Tabs";
import { TabsList as BaseTabsList } from "@mui/base/TabsList";
import { TabPanel as BaseTabPanel } from "@mui/base/TabPanel";
import { Tab as BaseTab, tabClasses } from "@mui/base/Tab";
import { Divider } from "@mui/material";
import { useState } from "react";
import "./ManageProfile.css";
import { Modal, ModalClose, Typography, Sheet } from "@mui/joy";

import { Button as BaseButton, buttonClasses } from "@mui/base/Button";
import { useNavigate } from "react-router-dom";

const Profile = (props: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  setName: (name: string) => void;
}) => {
  const iStyle = {
    marginTop: "6px",
  };

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState(props.firstName);
  const [lastName, setLastName] = useState(props.lastName);
  const [email, setEmail] = useState(props.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [isNameChanged, setIsNameChanged] = useState(false);
  const [isChangeFailed, setIsChangeFailed] = useState(false);

  const [isEmailChanged, setIsEmailChanged] = useState(false);
  const [isChangeEmailFailed, setIsChangeEmailFailed] = useState(false);

  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const [isChangePasswordFailed, setIsChangePasswordFailed] = useState(false);

  const [isDeleteChanged, setIsDeleteChanged] = useState(false);
  const [isChangeDeleteFailed, setIsChangeDeleteFailed] = useState(false);

  const [deletePassword, setDeletePassword] = useState("");

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeName = async () => {
    const response = await fetch("https://localhost:7054/api/User/UpdateName", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props.id,
        firstName: firstName,
        lastName: lastName,
      }),
    });

    if (response.ok) {
      // Uspješno ažuriranje
      console.log("Name changed successfully");
      setIsNameChanged(true);
      setIsChangeFailed(false);
    } else {
      // Neuspješno ažuriranje
      console.error("Failed to change name");
      setIsNameChanged(false);
      setIsChangeFailed(true);
    }
  };

  const handleChangeEmail = async () => {
    const response = await fetch(
      "https://localhost:7054/api/User/UpdateEmail",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: props.id,
          email: email,
        }),
      }
    );

    if (response.ok) {
      // Uspješno ažuriranje
      console.log("Name changed successfully");
      setIsEmailChanged(true);
      setIsChangeEmailFailed(false);
    } else {
      // Neuspješno ažuriranje
      console.error("Failed to change name");
      setIsEmailChanged(false);
      setIsChangeEmailFailed(true);
    }
  };

  const handleChangePassword = async () => {
    const response = await fetch(
      "https://localhost:7054/api/User/UpdatePassword",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: props.id,
          currentPassword: currentPassword,
          newPassword: newPassword,
        }),
      }
    );

    console.log(response);

    if (response.ok) {
      // Uspješno ažuriranje
      console.log("Password changed successfully");
      setIsPasswordChanged(true);
      setIsChangePasswordFailed(false);
    } else {
      // Neuspješno ažuriranje
      console.error("Failed to change password");
      setIsPasswordChanged(false);
      setIsChangePasswordFailed(true);
    }
  };

  const LogOut = async () => {
    const response = await fetch("https://localhost:7054/api/User/Logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    });

    const content = await response.text();
    console.log(content);
    props.setName("");
  }


  const handleDelete = async () => {
    const response = await fetch("https://localhost:7054/api/User/DeleteUserByPassword", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: props.id,
        password: deletePassword
      }),
    });

    console.log(response)

    if (response.ok) {
      // Uspješno ažuriranje
      console.log("User deleted successfully");
      setIsDeleteChanged(true);
      setIsChangeDeleteFailed(false);
      LogOut();
      navigate("/");
    } else {
      // Neuspješno ažuriranje
      console.error("Failed to delete account");
      setIsDeleteChanged(false);
      setIsChangeDeleteFailed(true);
      setOpen(false);
    }
  };

  return (
    <div>
      <div style={{ textAlign: "left", margin: "20px" }}>
        <h1 style={{ fontSize: "28px", marginLeft: "125px" }}>
          Manage Profile
        </h1>
        <p
          style={{
            fontSize: "22px",
            marginLeft: "65px",
            marginTop: "20px",
            color: "#707070",
          }}
        >
          Change your account settings
        </p>
      </div>
      <Tabs defaultValue={0} orientation="vertical">
        <TabsList>
          <Tab>
            <i className="bx bx-user" style={iStyle}></i>Profile
          </Tab>
          <Tab>
            <i className="bx bx-envelope" style={iStyle}></i>Email
          </Tab>
          <Tab>
            <i className="bx bxs-lock" style={iStyle}></i>Password
          </Tab>
          <Tab>
            <i className="bx bxs-cog" style={iStyle}></i>Settings
          </Tab>
        </TabsList>
        <Divider orientation="vertical" />
        <TabPanel value={0}>
          <div style={{ textAlign: "left", marginLeft: "20px" }}>
            <h3>Profile</h3>
            <p
              style={{
                fontSize: "22px",
                marginBottom: "10px",
                color: "#707070",
              }}
            >
              Change your name!
            </p>
            <Divider />
            <p style={{ fontSize: "20px", margin: "10px" }}>First Name</p>
            <StyledInputElement
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <p style={{ fontSize: "20px", margin: "10px" }}>Last Name</p>
            <StyledInputElement
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <br />
            <Button onClick={handleChangeName}>Save</Button>
            <h2 className="success" hidden={!isNameChanged}>
              Name changed successfully!
            </h2>
            <h2 className="failed" hidden={!isChangeFailed}>
              Name not changed!
            </h2>
          </div>
        </TabPanel>
        <TabPanel value={1}>
          <div style={{ textAlign: "left", marginLeft: "20px" }}>
            <h3>Email</h3>
            <p
              style={{
                fontSize: "22px",
                marginBottom: "10px",
                color: "#707070",
              }}
            >
              Change your email!
            </p>
            <Divider />
            <p style={{ fontSize: "20px", margin: "10px" }}>Email</p>
            <StyledInputElement
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <Button onClick={handleChangeEmail}>Save</Button>
            <h2 className="success" hidden={!isEmailChanged}>
              Email changed successfully!
            </h2>
            <h2 className="failed" hidden={!isChangeEmailFailed}>
              Email not changed!
            </h2>
          </div>
        </TabPanel>
        <TabPanel value={2}>
          <div style={{ textAlign: "left", marginLeft: "20px" }}>
            <h3>Password</h3>
            <p
              style={{
                fontSize: "22px",
                marginBottom: "10px",
                color: "#707070",
              }}
            >
              Change your password!
            </p>
            <Divider />
            <p style={{ fontSize: "20px", margin: "10px" }}>Current Password</p>
            <StyledInputElement
              onChange={(e) => setCurrentPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
            />
            <p style={{ fontSize: "20px", margin: "10px" }}>New Password</p>
            <StyledInputElement
              onChange={(e) => setNewPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
            />
            <br />
            <Button onClick={handleChangePassword}>Save</Button>
            <h2 className="success" hidden={!isPasswordChanged}>
              Password changed successfully!
            </h2>
            <h2 className="failed" hidden={!isChangePasswordFailed}>
              Password not changed!
            </h2>
          </div>
        </TabPanel>
        <TabPanel value={3}>
          <div style={{ textAlign: "left", marginLeft: "20px" }}>
            <h3>Delete Account!</h3>
            <p
              style={{
                fontSize: "22px",
                marginBottom: "10px",
                color: "#707070",
              }}
            >
              Delete your account!
            </p>
            <Divider />
            <DeleteButton onClick={handleClickOpen}>Delete Account!</DeleteButton>
            <h2 className="success" hidden={!isDeleteChanged}>
              Account deleted successfully!
            </h2>
            <h2 className="failed" hidden={!isChangeDeleteFailed}>
              Account not deleted!
            </h2>
          </div>
        </TabPanel>
      </Tabs>

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Sheet
          variant="outlined"
          sx={{
            maxWidth: 500,
            borderRadius: 'md',
            p: 3,
            boxShadow: 'lg',
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Typography
            component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
            mb={1}
          >
            Delete Account!
          </Typography>
          <p style={{ fontSize: "16px", margin: "10px" }}>Enter Password</p>
          <StyledInputElement
              onChange={(e) => setDeletePassword(e.target.value)}
              type={showPassword ? "text" : "password"}
            />
            <DeleteButton onClick={handleDelete} style={{marginLeft: "110px"}}>Delete Account!</DeleteButton>
        </Sheet>
      </Modal>
    </div>
  );
};

const blue = {
  50: "#F0F7FF",
  100: "#C2E0FF",
  200: "#80BFFF",
  300: "#66B2FF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0059B2",
  800: "#004C99",
  900: "#003A75",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const red = {
  50: "#FFEBEE",
  100: "#FFCDD2",
  200: "#EF9A9A",
  300: "#E57373",
  400: "#EF5350",
  500: "#F44336",
  600: "#E53935",
  700: "#D32F2F",
  800: "#C62828",
  900: "#B71C1C",
};

const Tab = styled(BaseTab)`
  color: ${blue[600]};
  cursor: pointer;
  font-size: 22px;
  font-weight: bold;
  background-color: transparent;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 7px;
  display: flex;
  justify-content: center;

  &:hover {
    background-color: ${blue[100]};
  }

  &:focus {
    color: #fff;
    outline: 3px solid ${blue[200]};
  }

  &.${buttonClasses.focusVisible} {
    background-color: ${blue[600]};
    color: #fff;
  }

  &.${tabClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.${tabClasses.selected} {
    background-color: ${blue[600]};
    color: #fff;
  }
`;

const TabPanel = styled(BaseTabPanel)`
  width: 100%;
  font-size: 28px;
  margin-top: -80px;
`;

const Tabs = styled(BaseTabs)`
  margin: 20px;
  margin-top: 20px;
  margin-left: 70px;
  display: flex;
  gap: 16px;
  width: 90%;
  height: 70vh;
`;

const TabsList = styled(BaseTabsList)(
  ({ theme }) => `
  min-width: 350px;
  max-height: 295px;
  background-color: white;
  border-radius: 12px;
  margin-bottom: 16px;
  display: flex;
  padding: 6px;
  gap: 12px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-content: space-between;
  
  box-shadow: 0px 8px 16px ${
    theme.palette.mode === "dark" ? grey[900] : grey[400]
  };
  `
);

const StyledInputElement = styled("input")(
  ({ theme }) => `
    width: 320px;
    margin-left: 25px;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0px 2px 4px ${
      theme.palette.mode === "dark" ? "rgba(0,0,0, 0.5)" : "rgba(0,0,0, 0.05)"
    };
  
    &:hover {
      border-color: ${blue[400]};
    }
  
    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${
        theme.palette.mode === "dark" ? blue[600] : blue[200]
      };
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);

const Button = styled(BaseButton)(
  ({ theme }) => `
    margin-left: 25px;
    margin-top: 20px;
    width: 320px;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
    background-color: ${blue[500]};
    padding: 8px 16px;
    border-radius: 8px;
    color: white;
    transition: all 150ms ease;
    cursor: pointer;
    border: 1px solid ${blue[500]};
    box-shadow: 0 2px 1px ${
      theme.palette.mode === "dark"
        ? "rgba(0, 0, 0, 0.5)"
        : "rgba(45, 45, 60, 0.2)"
    }, inset 0 1.5px 1px ${blue[400]}, inset 0 -2px 1px ${blue[600]};
  
    &:hover {
      background-color: ${blue[600]};
    }
  
    &.${buttonClasses.active} {
      background-color: ${blue[700]};
      box-shadow: none;
      transform: scale(0.99);
    }
  
    &.${buttonClasses.focusVisible} {
      box-shadow: 0 0 0 4px ${
        theme.palette.mode === "dark" ? blue[300] : blue[200]
      };
      outline: none;
    }
  
    &.${buttonClasses.disabled} {
      background-color: ${
        theme.palette.mode === "dark" ? grey[700] : grey[200]
      };
      color: ${theme.palette.mode === "dark" ? grey[200] : grey[700]};
      border: 0;
      cursor: default;
      box-shadow: none;
      transform: scale(1);
    }
    `
);

const DeleteButton = styled(BaseButton)(
  ({ theme }) => `
    margin-left: 25px;
    margin-top: 20px;
    width: 350px;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
    background-color: ${red[500]};
    padding: 8px 16px;
    border-radius: 8px;
    color: white;
    transition: all 150ms ease;
    cursor: pointer;
    border: 1px solid ${red[500]};
    box-shadow: 0 2px 1px ${
      theme.palette.mode === "dark"
        ? "rgba(0, 0, 0, 0.5)"
        : "rgba(45, 45, 60, 0.2)"
    }, inset 0 1.5px 1px ${red[400]}, inset 0 -2px 1px ${red[600]};
  
    &:hover {
      background-color: ${red[600]};
    }
  
    &.${buttonClasses.active} {
      background-color: ${red[700]};
      box-shadow: none;
      transform: scale(0.99);
    }
  
    &.${buttonClasses.focusVisible} {
      box-shadow: 0 0 0 4px ${
        theme.palette.mode === "dark" ? red[300] : red[200]
      };
      outline: none;
    }
  
    &.${buttonClasses.disabled} {
      background-color: ${
        theme.palette.mode === "dark" ? grey[700] : grey[200]
      };
      color: ${theme.palette.mode === "dark" ? grey[200] : grey[700]};
      border: 0;
      cursor: default;
      box-shadow: none;
      transform: scale(1);
    }
    `
);

export default Profile;
