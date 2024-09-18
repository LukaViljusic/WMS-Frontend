import "./NavBar.css";
import { AppBar, Toolbar, Typography, Avatar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import styled from "@mui/system/styled";
import { Dropdown } from "@mui/base/Dropdown";
import { MenuButton } from "@mui/base/MenuButton";
import { Menu } from "@mui/base/Menu";
import { MenuItem } from "@mui/base/MenuItem";
import { grey, blue } from "@mui/material/colors";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

const linkStyle = {
  margin: "10px",
  marginRight: "15px",
  textDecoration: "none",
  color: "white",
  fontSize: "20px",
};

const appBarStyle = {
  backgroundColor: grey[900],
  marginBottom: "0px",
};

const powerStyle = {
  marginTop: "8px",
};

const avatarStyle = {
  color: "white",
  backgroundColor: blue[500],
};

const NavBar = (props: { name: string; setName: (name: string) => void }) => {
  const navigate = useNavigate();
  const LogOut = async () => {
    const response = await fetch("https://localhost:7054/api/User/Logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const content = await response.text();
    console.log(content);
    props.setName("");
    navigate("/");
  };

  let menu;

  if (props.name === "" || props.name === undefined) {
    menu = (
      <div>
        <Link to="/login" style={linkStyle}>
          Log In
        </Link>
        <Link to="/register" style={linkStyle}>
          Register
        </Link>
      </div>
    );
  } else {
    menu = (
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/space" style={linkStyle}>
          Space
        </Link>
       {/* <Link to="/profile" style={linkStyle}>
          <Avatar style={avatarStyle}>
            {props.name.charAt(0).toUpperCase()}
          </Avatar>
        </Link>
        <Link to="/login" style={linkStyle} onClick={LogOut}>
          <PowerSettingsNewIcon style={powerStyle} />
        </Link> */}
        <Dropdown>
            <MenuButton slots={{ root: StyledMenuButton }}>
            <Avatar style={avatarStyle}>
            {props.name.charAt(0).toUpperCase()}
          </Avatar>
            </MenuButton>
          <Menu
            slots={{
              listbox: StyledListbox,
            }}
          >
            <Link to="/profile" style={linkStyle}>
            <MenuItem slots={{ root: StyledMenuItem }}>Profile</MenuItem>
            </Link>
            <Link to="" style={linkStyle}>
            <MenuItem slots={{ root: StyledMenuItem }} onClick={LogOut}>Log out</MenuItem>
            </Link>
          </Menu>
        </Dropdown>
      </div>
    );
  }

  return (
    <AppBar position="static" style={appBarStyle}>
      <Toolbar className="toolbar-container">
        <Typography variant="h6" className="title">
          <Link to="/" style={linkStyle}>
            Work Manager System
          </Link>
        </Typography>
        <div>{menu}</div>
      </Toolbar>
    </AppBar>
  );
};

const StyledMenuButton = styled('button')`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-sizing: border-box;
  border-radius: 8px;
  padding: 8px 12px 8px 6px;
  line-height: 1.5;
  background: ${grey[900]};
  box-shadow: var(--outlined-btn-shadow);
  border: none;
  color: white;
  transition: all 120ms ease;
  outline-color: transparent;
  user-select: none;

  & svg {
    color: var(--primary);
  }

  &:hover {
    background: var(--muidocs-palette-grey-50);
    border-color: var(--muidocs-palette-grey-300);
    box-shadow: none;
  }

  &:focus-visible {
    outline: 4px solid var(--focus-ring);
    border-color: var(--primary);
  }

  :where([data-mui-color-scheme='dark']) & {
    border-color: var(--muidocs-palette-primaryDark-700);

    &:hover {
      background: var(--muidocs-palette-primaryDark-800);
      border-color: var(--muidocs-palette-primaryDark-500);
    }
  }
`;

const StyledMenuItem = styled('li')`
  display: flex;
  align-items: center;
  padding: 4px 20px;
  min-height: 24px;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 6px;
  border: 1px solid transparent;
  
  &:hover,
  &.base--focusVisible {
    cursor: default;
    outline: none;
    color: var(--muidocs-palette-text-primary);
    background: var(--muidocs-palette-grey-50);
    border-color: var(--muidocs-palette-grey-100);
  }

  :where([data-mui-color-scheme='dark']) & {
    color: var(--muidocs-palette-grey-300);
    &:hover,
    &.base--focusVisible {
      color: var(--muidocs-palette-text-primary);
      background: var(--muidocs-palette-primaryDark-700);
      border-color: var(--muidocs-palette-primaryDark-500);
    }
  }
`;

const StyledListbox = styled('ul')`
  margin: 2px 0;
  margin-right: 6px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  color: white;
  border-radius: 12px;
  border: 1px solid;
  border-color: var(--muidocs-palette-grey-200);
  background: ${grey[900]};
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.2);

  :where([data-mui-color-scheme='dark']) & {
    border-color: var(--muidocs-palette-primaryDark-700);
    box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.8);
  }
`;

export default NavBar;
