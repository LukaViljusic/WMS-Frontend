import "./WorkItemState.css";
import { SetStateAction, SyntheticEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MuiColorInput } from "mui-color-input";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { styled } from "@mui/system";
import { Typography, Card, CardContent } from "@mui/material";
import { Box, Button, Modal, ModalClose, Sheet, Snackbar, Textarea } from "@mui/joy";

const WorkItemState = () => {
  const { spaceId } = useParams();
  const [workItemState, setWorkItemState] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [value, setValue] = useState("blue");
  const [open, setOpen] = useState(false);
  const [countWorkItemState, setCountWorkItemState] = useState(0);
  const [idToDelete, setIdToDelete] = useState(0);
  const [openDelete, setOpenDelete] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [editEnabled, setEditEnable] = useState(false);
  const [stateEdit, setStateEdit] = useState(0);
  const [updateName, setUpdateName] = useState("");
  const [updateColor, setUpdateColor] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://localhost:7054/api/WorkItemState/BySpaceId/${spaceId}`,
          {
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (response.ok) {
          const content = await response.json();
          console.log(content);
          setWorkItemState(content);
        } else {
          console.error("Error fetching data:", response.status);
          setWorkItemState([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [countWorkItemState]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseDelete = () => {
    setOpen(false);
  };

  const handleCreateDialog = async (e: SyntheticEvent) => {
    e.preventDefault();
    const workItemStateData = {
      name: name,
      color: value,
      spaceId: spaceId,
    };
    const response = await fetch(
      "https://localhost:7054/api/WorkItemState/Create",
      {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workItemStateData),
      }
    );

    const result = await response.text();
    console.log(result);
    setOpen(false);
    setCountWorkItemState(countWorkItemState+1);
  };

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  const handleOpenDelete = (id: number) => {
    setOpenDelete(true);
    setIdToDelete(id);
  }

  const deleteItemState = async (e: SyntheticEvent) => {
    e.preventDefault();

    const response = await fetch(
      `https://localhost:7054/api/WorkItemState/${idToDelete}`,
      {
        method: "DELETE",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.text();
    console.log(result);
    setOpenDelete(false);
    if(response.ok) {
      setCountWorkItemState(countWorkItemState + 1);
    } else {
      setOpenSnackBar(true);
    }
  };

  const changeName = async(e: SyntheticEvent, typeId: number) => {
    e.preventDefault();

    const changeNameData = {
      id: typeId,
      name: updateName,
      color: updateColor, 
    };

    const response = await fetch(
      `https://localhost:7054/api/WorkItemState/UpdateName`,
      {
        method: "PUT",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(changeNameData)
      }
    );

    const result = await response.text();
    console.log(result);
    setCountWorkItemState(countWorkItemState + 1);

    editModeOff();
  }

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  }

  const editModeOn = (index: number, name: string, color: string) => {
    setEditEnable(true);
    setStateEdit(index);
    setUpdateName(name);
    setUpdateColor(color);
  }

  const editModeOff = () => {
    setEditEnable(false);
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          margin: "20px",
          justifyContent: "space-between",
        }}
      >
        <Link to={`/workitem/${spaceId}`}>
          <Button>
            <ArrowBackIcon />
          </Button>
        </Link>
        <Button sx={{backgroundColor: "#1F883D", ":hover": {bgcolor: "#006400", transition: "0.5s"}}} onClick={handleClickOpen}>Create</Button>
      </div>
      <div>
        <h1>WorkItemState</h1>
      </div>
      <div>
        {workItemState.length === 0 ? (
        <div>
          <Typography
            variant="body1" fontSize="22px" style={{ fontWeight: "550", margin: "250px"}}
          >
            There are no WorkItemState! Create a new work state!
          </Typography>
        </div>) : 
        (<div>
          {workItemState.map((itemState, index) => (
            <div key={index}>
              <Card sx={{
                  minWidth: 345,
                  margin: 5,
                  borderRadius: "10px",
                  color: "white",
                }}>
              
                <CardContent>
                  <Box display="flex" justifyContent="space-between">
                    
                    <Typography
                      gutterBottom
                      fontSize="16px"
                      component="div"
                      style={{ fontWeight: "bold",  marginTop: "5px", backgroundColor: `${itemState.color}`, borderRadius: "10px", padding: "5px"}}
                    >
                      {itemState.name}
                    </Typography>
                  
                  {editEnabled && index === stateEdit ? 
                    <></>
                  : 
                    <div style={{textAlign:"left"}}>
                      <Button onClick={() => editModeOn(index, itemState.name, itemState.color)}>Edit</Button>
                      <Button style={{marginLeft:"10px", marginTop: "5px"}} sx={{backgroundColor: "red", ":hover": {bgcolor: "#D1242F", transition: "0.5s"}}} onClick={() => handleOpenDelete(itemState.id)}>Delete</Button>
                    </div>
                  }
                </Box>


                {editEnabled && index === stateEdit ? 
                <Box textAlign="left">
                  <Box display="flex">
                  <Typography sx={{color: "black", fontWeight: "550", marginTop: "10px", marginBottom: "8px"}}>
                    Type Name
                  </Typography>
                  <Typography sx={{color: "black", fontWeight: "550", marginTop: "10px", marginBottom: "8px", marginLeft: "110px"}}>
                    Color
                  </Typography>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between">
                    <Box display="flex">
                    <Textarea
                      value={updateName}
                      sx={{marginBottom: "10px"}}
                      onChange={e => setUpdateName(e.target.value)}
                    />
                    <Textarea
                      value={updateColor}
                      sx={{marginBottom: "10px", marginLeft: "25px"}}
                      onChange={e => setUpdateColor(e.target.value)}
                    />
                    </Box>
                    <Box>
                      <Button onClick={editModeOff} sx={{marginRight: "10px", border: "0.5px solid #D0D7DE", color: "black", backgroundColor: "#F6F8FA", ":hover": {bgcolor: "#D0D7DE", transition: "0.5s"}}}>Cancel</Button>
                      <Button onClick={(e) => changeName(e ,itemState.id)} sx={{backgroundColor: "#1F883D", ":hover": {bgcolor: "#006400", transition: "0.5s"}}}>Save Changes</Button>
                    </Box>
                  </Box>
                </Box>
                
                : 
                <></>}
              
                </CardContent>
              </Card>
            </div>
          ))}
        </div>)}
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
          <Typography variant="h5" style={{ marginBottom: "10px" }}>
            Create Item State!
          </Typography>

          <Typography style={{ margin: "10px", marginTop: "15px" }}>
            Name:
          </Typography>
          <StyledInputElement
            type="text"
            placeholder="Enter name!"
            onChange={(e: { target: { value: SetStateAction<string>; }; }) => setName(e.target.value)}
          />

          <Typography style={{ margin: "10px", marginTop: "15px" }}>
            Color:
          </Typography>
          <MuiColorInput
            value={value}
            onChange={handleChange}
            style={{ width: "400px" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              sx ={{ margin: "10px", marginBottom: "0px", ":hover": { transition: "0.5s"}}}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button 
              disabled={!name} 
              sx={{ margin: "10px", marginBottom: "0px", backgroundColor: "#1F883D", ":hover": {bgcolor: "#006400", transition: "0.5s"}}}
              onClick={handleCreateDialog}>
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
              sx={{ margin: "10px", marginBottom: "0px", ":hover": { transition: "0.5s"} }}
              onClick={handleCloseDelete}
            >
              No
            </Button>
            <Button
              sx={{margin: "10px", marginBottom: "0px", backgroundColor: "red", ":hover": {bgcolor: "#D1242F", transition: "0.5s"}}}
              onClick={deleteItemState}
            >
              Yes
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
        Error! You are using this Item State!
      </Snackbar>
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

  

export default WorkItemState;