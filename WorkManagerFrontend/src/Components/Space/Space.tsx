// Space.jsx
import { SyntheticEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  styled,
  Typography,
  Card,
  CardContent,
  Box
} from "@mui/material";
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import { Button, Modal, ModalClose, Sheet } from "@mui/joy";
import "./Space.css";


const Space = (props: { id: string }) => {
  const [spaces, setSpaces] = useState<any[]>([]);
  const [hidden, setHidden] = useState(true);
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [spaceCount, setSpaceCount] = useState(0);
  const [spaceToDelete, setSpaceToDelete] = useState(0);
  const [openDelete, setOpenDelete] = useState(false);

  const linkStyle = {
    textDecoration: "none",
    color: "black"
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://localhost:7054/api/UserSpace/GetByUserId/${props.id}`,
        {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

    

      if (response.status === 200) {
        const content = await response.json();
        const updatedSpaces = content.map((item: any) => ({
          id: item.id,
          name: item.space.name,
          description: item.space.description,
          spaceId: item.space.id,
        }));
        setSpaces(updatedSpaces);
        setHidden(true);
      } else {
        setHidden(false);
      }
    };

    fetchData();
  }, [spaceCount]);


  const createSpace = async (spaceId: String) => {
    const data = {
      usersId: props.id,
      spaceId: spaceId
    }

    const response = await fetch("https://localhost:7054/api/UserSpace/Create", {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.text();
    console.log(result);
  }

  const handleCreateDialog = async (e: SyntheticEvent) => {
    e.preventDefault();
    const spaceData = {
      name: name,
      description: description,
      usersId: props.id,
    };
    const response = await fetch("https://localhost:7054/api/Space/Create", {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(spaceData),
    });

    const result = await response.text();
    console.log(result);

    createSpace(result);
    setOpen(false);
    console.log(name);
    console.log(description);

    setSpaceCount(spaceCount + 1);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  

  const setDeleteSpace = (spaceId: number) => {
    setSpaceToDelete(spaceId);
    setOpenDelete(true)
  }

  const deleteSpace = async (e: SyntheticEvent) => {
    e.preventDefault();

    const responseUserSpace = await fetch(
      `https://localhost:7054/api/UserSpace/deleteUserSpaceBySpaceId/${spaceToDelete}`,
      {
        method: "DELETE",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
      }
    );

    const resultUserSpace = await responseUserSpace.text();
    console.log("UserSpace" + resultUserSpace)

    const responseSpace = await fetch(
      `https://localhost:7054/api/Space/${spaceToDelete}`,
      {
        method: "DELETE",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
      }
    );

    const resultSpace = await responseSpace.text();
    console.log("Space" + resultSpace);

    handleCloseDelete();
    setSpaceCount(spaceCount+1);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  return (
    <div>
      <div className="create-button-space">
        <Button sx={{margin: "20px", backgroundColor: "#1F883D", ":hover": {bgcolor: "#006400", transition: "0.5s"}}} onClick={handleClickOpen}>
          Create Space
        </Button>
      </div>
      <div className="space-container">
      {spaces.map((space, index) => (
        <div key={index}>
            
          <Card sx={{ minWidth: 345, margin: 5, borderRadius: "10px", ":hover": {bgcolor: "#D0D7DE", transition: "0.5s"}}}>
            <Link to={`/workitem/${space.spaceId}`} style={linkStyle}>  
              <CardContent>
              <SpaceDashboardIcon fontSize="large" style={{color: "#2196f3"}}/>
                <Typography gutterBottom variant="h4" component="div" style={{fontWeight: "bold"}}>
                  {space.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                 {space.description}
                </Typography>
                
              </CardContent>
              </Link>
            <Box sx={{marginBottom: "20px"}}>
                  <Button>Edit</Button>
                  <Button sx={{marginLeft: "10px", marginTop: "5px",backgroundColor: "red", ":hover": {bgcolor: "#D1242F", transition: "0.5s"}}} onClick={() => setDeleteSpace(space.spaceId)}>Delete</Button>
            </Box>
          </Card>
         
        </div>
      ))}
      </div>
      
      <Box my={20}>
        <Typography variant="h3" hidden={hidden}>
          You don't have any spaces, create new spaces
        </Typography>
      </Box>
      
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
            width: 600,
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Typography variant="h5" style={{ marginBottom: "10px" }}>
            <b>Create Space!</b>
          </Typography>
          <Typography style={{ margin: "10px", marginTop: "15px" }}>
            Name:
          </Typography>
          <StyledInputElement
            type="text"
            placeholder="Enter name!"
            onChange={(e) => setName(e.target.value)}
          />
          <Typography style={{ margin: "10px", marginTop: "15px" }}>
            Description:
          </Typography>
          <StyledInputElement
            type="text"
            placeholder="Enter description!"
            onChange={(e) => setDescription(e.target.value)}
          />
         
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              sx={{ margin: "10px", marginBottom: "0px", marginTop: "20px", ":hover": { transition: "0.5s"}}}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              disabled={!name}
              sx={{ margin: "10px", marginBottom: "0px", marginTop: "20px", backgroundColor: "#1F883D", ":hover": {bgcolor: "#006400", transition: "0.5s"} }}
              onClick={handleCreateDialog}
            >
              Create
            </Button>
          </div>
        </Sheet>
      </Modal>

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={openDelete}
        onClose={() => setOpenDelete(false)}
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
          <Typography variant="h5" sx={{ margin: 4 }}>
            Are you sure you want to delete this work item state?
          </Typography>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              sx={{ margin: "10px", marginBottom: "0px", ":hover": {transition: "0.5s"}}}
              onClick={handleCloseDelete}
            >
              No
            </Button>
            <Button
              sx={{ margin: "10px", background: "red", marginBottom: "0px", ":hover": {bgcolor: "#D1242F", transition: "0.5s"}}}
              onClick={deleteSpace}
            >
              Yes
            </Button>
          </div>
        </Sheet>
      </Modal>
    </div>
  );
};

const blue = {
  200: "#99CCFF",
  300: "#66B2FF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0066CC",
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


const StyledInputElement = styled("input")(
  ({ theme }) => `
    width: 400px;
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

export default Space;
