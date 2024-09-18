import "./WorkItemType.css";
import { SyntheticEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { styled } from "@mui/system";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";
import { Typography, Card, CardContent } from "@mui/material";
import { Box, Button, Modal, ModalClose, Sheet, Snackbar, Textarea } from "@mui/joy";
import { MuiColorInput } from "mui-color-input";

const WorkItemType = () => {
  const { spaceId } = useParams();
  const [workItemTypes, setWorkItemTypes] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [value, setValue] = useState("blue");
  const [workItemTypeCount, setWorkItemTypeCount] = useState(0);
  const [idToDelete, setIdToDelete] = useState(0);
  const [openDelete, setOpenDelete] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [editEnabled, setEditEnable] = useState(false);
  const [typeEdit, setTypeEdit] = useState(0);
  const [updateName, setUpdateName] = useState("");
  const [updateColor, setUpdateColor] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://localhost:7054/api/WorkItemType/BySpace/${spaceId}`,
          {
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (response.ok) {
          const content = await response.json();
          console.log(content);
          setWorkItemTypes(content);
        } else {
          console.error("Error fetching data:", response.status);
          setWorkItemTypes([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [workItemTypeCount]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleOpenDelete = (id: number) => {
    setOpenDelete(true);
    setIdToDelete(id);
  }

  const handleCreate = async (e: SyntheticEvent) => {
    e.preventDefault();
    const workItemTypeData = {
      name: name,
      color: value,
      spaceId: spaceId,
    };
    const response = await fetch(
      "https://localhost:7054/api/WorkItemType/Create",
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
    console.log(result);
    setOpen(false);

    setWorkItemTypeCount(workItemTypeCount + 1);
  };

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  const deleteItemType = async (e: SyntheticEvent) => {
    e.preventDefault();

    const response = await fetch(
      `https://localhost:7054/api/WorkItemType/${idToDelete}`,
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
    if(response.ok){
      setWorkItemTypeCount(workItemTypeCount + 1);
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
      `https://localhost:7054/api/WorkItemType/UpdateName`,
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
    setWorkItemTypeCount(workItemTypeCount + 1);

    editModeOff();
  }

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  }

  const editModeOn = (index: number, name: string, color: string) => {
    setEditEnable(true);
    setTypeEdit(index);
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
        <Button onClick={handleClickOpen} sx={{backgroundColor: "#1F883D", ":hover": {bgcolor: "#006400", transition: "0.5s"}}}>Create</Button>
      </div>
      <div>
        <h1>WorkItemType</h1>
      </div>
      <div>
      {workItemTypes.length === 0 ? (
        <div>
          <Typography
            variant="body1" fontSize="22px" style={{ fontWeight: "550", margin: "250px"}}
          >
            There are no WorkItemType! Create a new work type!
          </Typography>
        </div>) :
      (<div>
        {workItemTypes.map((itemType, index) => (
          <div key={index}>
            <Card
              sx={{
                minWidth: 345,
                margin: 5,
                borderRadius: "10px",
                color: "white",
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between">
                  
                    <Typography
                      gutterBottom
                      fontSize="16px"
                      component="div"
                      style={{ fontWeight: "bold",  marginTop: "5px", backgroundColor: `${itemType.color}`, borderRadius: "10px", padding: "5px"}}
                    >
                      {itemType.name}
                    </Typography>
                  
                  {editEnabled && index == typeEdit ? 
                    <></>
                  : 
                    <div style={{textAlign:"left"}}>
                      <Button sx={{":hover": { transition: "0.5s"}}} onClick={() => editModeOn(index, itemType.name, itemType.color)}>Edit</Button>
                      <Button sx={{marginLeft:"10px", marginTop: "5px",backgroundColor: "red", ":hover": {bgcolor: "#D1242F", transition: "0.5s"}}} onClick={() => handleOpenDelete(itemType.id)}>Delete</Button>
                    </div>
                  }
                </Box>

 
                {editEnabled && index == typeEdit ? 
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
                      <Button onClick={(e) => changeName(e ,itemType.id)} sx={{backgroundColor: "#1F883D", ":hover": {bgcolor: "#006400", transition: "0.5s"}}}>Save Changes</Button>
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
            Create Item Type!
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
            Color:
          </Typography>
          <MuiColorInput
            value={value}
            onChange={handleChange}
            style={{ width: "400px" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              sx={{ margin: "10px", marginBottom: "0px", ":hover": {transition: "0.5s"} }}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              sx={{margin: "10px", marginBottom: "0px", backgroundColor: "#1F883D", ":hover": {bgcolor: "#006400", transition: "0.5s"}}}
              onClick={handleCreate}
              disabled={!name}
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
            Are you sure you want to delete this work item type?
          </Typography>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              sx={{ margin: "10px", marginBottom: "0px", ":hover": {transition: "0.5s"} }}
              onClick={handleCloseDelete}
            >
              No
            </Button>
            <Button
              style={{ margin: "10px", marginBottom: "0px" }}
              onClick={deleteItemType}
              sx={{backgroundColor: "red", ":hover": {bgcolor: "#D1242F", transition: "0.5s"}}}
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
        Error! You are using this Item Type!
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

export default WorkItemType;
