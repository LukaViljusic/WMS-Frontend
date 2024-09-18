import React, { useState, useEffect, SyntheticEvent } from "react";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemButton from "@mui/joy/ListItemButton";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import WorkIcon from '@mui/icons-material/Work';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from "@mui/icons-material/Logout";
import Divider from "@mui/material/Divider";
import { Link, useNavigate } from "react-router-dom";
import { CSSProperties } from "react";
import { Typography, TextField, Autocomplete } from "@mui/material";
import { Button, Modal, ModalClose, Sheet, Snackbar } from "@mui/joy";

const ListSidebar = (props: { spaceId?: string, email?: String }) => {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [userId, setUserId] = useState<number | undefined>();
  const [openSnackBar, setOpenSnackBar] = useState(false);

  useEffect(() => {
    const fetchData1 = async () => {
      try {
        const response = await fetch(
          `https://localhost:7054/api/User/Get`,
          {
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (response.ok) {
          const content = await response.json();
          console.log(content);
          setUsers(content);
        } else {
          console.error("Error fetching data:", response.status);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData1();
  }, [])  
  
  const linkStyle = {
    textDecoration: "none"
  }

  const iconStyle = {
    fontSize: "28px",
    marginRight: "16px",
    marginLeft: "10px",
    marginTop: "5px",
  };

  const textStyle = {
    fontSize: "22px",
    marginTop: "5px",
  };
  const fdivStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    minHeight: "89vh",
  };

  const divStyle: CSSProperties = {
    bottom: 0,
    position: "absolute",
    width: "240px"
  };

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
    navigate("/");
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    console.log(userId);
  };

  const handleCreate = async (e: SyntheticEvent) => {
    e.preventDefault();
    const workItemTypeData = {
      usersId: userId,
      spaceId: props.spaceId
    };
    const response = await fetch(
      "https://localhost:7054/api/UserSpace/Create",
      {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workItemTypeData),
      }
    );

    const result = await response.text();
    setOpen(false);
    if(!response.ok) {
      setOpenSnackBar(true);
    }
    console.log(result);
    
  };

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  }

  const itemOptions = users.map(item => props.email !== item.email ? { label: item.email, id: item.id } : null).filter(Boolean);


  return (
    <List sx={{ minWidth: 320 }}>
      <div style={fdivStyle}>
        <div>
          <Link to="/" style={linkStyle}>
            <ListItem>
              <ListItemButton>
                <ListItemDecorator>
                  <HomeIcon style={iconStyle} />
                </ListItemDecorator>
                <p style={textStyle}>Home</p>
              </ListItemButton>
            </ListItem>
          </Link>
          <Link to={`/workitemtype/${props.spaceId}`} style={linkStyle}>
            <ListItem>
              <ListItemButton>
                <ListItemDecorator>
                  <WorkIcon style={iconStyle} />
                </ListItemDecorator>
                <p style={textStyle}>WorkItemType</p>
              </ListItemButton>
            </ListItem>
          </Link>
          <Link to={`/workitemstate/${props.spaceId}`} style={linkStyle}>
            <ListItem>
              <ListItemButton>
                <ListItemDecorator>
                  <HourglassBottomIcon style={iconStyle} />
                </ListItemDecorator>
                <p style={textStyle}>WorkItemState</p>
              </ListItemButton>
            </ListItem>
          </Link>
          <Link to={`/workitemusers/${props.spaceId}`} style={linkStyle}>
            <ListItem>
              <ListItemButton>
                <ListItemDecorator>
                  <GroupIcon style={iconStyle} />
                </ListItemDecorator>
                <p style={textStyle}>Users</p>
              </ListItemButton>
            </ListItem>
          </Link>
          <ListItem onClick={handleClick}>
            <ListItemButton>
              <ListItemDecorator>
                <AddIcon style={iconStyle} />
              </ListItemDecorator>
              <p style={textStyle}>Add User</p>
            </ListItemButton>
          </ListItem>
        </div>
        <div style={divStyle}>
          <Divider orientation="horizontal" flexItem />
        <Link to={`/space`} style={linkStyle}>
        <ListItem>
          <ListItemButton>
            <ListItemDecorator>
              <EqualizerIcon style={iconStyle} />
            </ListItemDecorator>
            <p style={textStyle}>Space</p>
          </ListItemButton>
        </ListItem>
        </Link>
          <ListItem onClick={LogOut}>
            <ListItemButton>
              <ListItemDecorator>
                <LogoutIcon style={iconStyle} />
              </ListItemDecorator>
              <p style={textStyle}>LogOut</p>
            </ListItemButton>
          </ListItem>
        </div>
      </div>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="outlined"
          sx={{
            maxWidth: 500,
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Typography
          variant="body1"
          style={{margin: "10px", marginBottom: "20px"}}
          >Add new user to your space!</Typography>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={itemOptions}
            sx={{ width: 400, marginBottom: "20px" }}
            onChange={(event, value) => setUserId(value?.id)}
            renderInput={(params) => <TextField {...params} label="New User" />}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              sx={{ margin: "10px", marginBottom: "0px", ":hover": {transition: "0.5s"} }}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button disabled={!userId} sx={{ margin: "10px", marginBottom: "0px", backgroundColor: "#1F883D", ":hover": {bgcolor: "#006400", transition: "0.5s"}}} onClick={handleCreate}>
              Add User
            </Button>
          </div>
        </Sheet>
      </Modal>
      <Snackbar
        anchorOrigin={{vertical: "bottom", horizontal: "center"}}
        open={openSnackBar}
        onClose={handleCloseSnackBar}
        autoHideDuration={6000}
        color="danger"
        variant="solid"
        size="lg"
      >
        Error! User is already added to space!
      </Snackbar>
    </List>
  );
};


export default ListSidebar;
