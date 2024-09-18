import { Box, Divider, Textarea, Typography, styled } from "@mui/joy";
import Sidebar from "../Sidebar/sidebar";
import { useNavigate, useParams } from "react-router-dom";
import { SyntheticEvent, useEffect, useState } from "react";
import { Button as BaseButton, buttonClasses } from "@mui/base/Button";
import { Autocomplete, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

const CreateWorkItem = (props: {
    firstName: string;
    email: string;
    userId: string; }) => {

    const { spaceId } = useParams();
    const navigate = useNavigate()
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [users, setUsers] = useState<any[]>([]);
    const [userId, setUserId] = useState<number | undefined>();
    const [workItemTypeId, setWorkItemTypeId] = useState<number | undefined>();
    const [workitemtype, setWorkItemType] = useState<any[]>([]);
    const [workItemStateId, setWorkItemStateId] = useState<number | undefined>();
    const [workitemstate, setWorkItemState] = useState<any[]>([]);
    const [deadline, setDeadline] = useState<string | null>(null);

    useEffect(() => {
      (async () => {
        const response = await fetch(
          `https://localhost:7054/api/UserSpace/GetBySpaceId/${spaceId}`,
          {
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
  
        if (response.ok) {
          const content = await response.json();
          console.log(content);
          const updatedSpaces = content.map((item: any) => ({
            id: item.id,
            userId: item.user.id,
            firstName: item.user.firstName,
            email: item.user.email,
          }));
          setUsers(updatedSpaces);
        }
      })();
    }, []);

    useEffect(() => {
      const fetchData1 = async () => {
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
            setWorkItemType(content);
          } else {
            console.error("Error fetching data:", response.status);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchData1();
    }, []);

    useEffect(() => {
      const fetchData2 = async () => {
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
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchData2();
    }, []);

    const handleCreate = async (e: SyntheticEvent) => {
      e.preventDefault();
      const workItemTypeData = {
        name: name,
        description: description,
        deadline: dayjs(deadline).format("DD/MM/YYYY"),
        usersId: userId,
        spaceId: spaceId,
        workItemTypeId: workItemTypeId,
        workItemStateId: workItemStateId,
      };

      const response = await fetch(
        "https://localhost:7054/api/WorkItem/Create",
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
      navigate(`/workitem/${spaceId}`)
    };
    

    const itemOptionsUser = users.map(item => ({ label: item.firstName, id: item.userId }));
    const itemOptionsType = workitemtype.map((item) => ({
      label: item.name,
      id: item.id,
    }));
    const itemOptionsState = workitemstate.map((item) => ({
      label: item.name,
      id: item.id,
    }));
  

    return(
        <div>
        <Box sx={{ display: "flex" }}>
          <Sidebar name={props.firstName} email={props.email} spaceId={spaceId} />
          <Box component="main" sx={{ flexGrow: 1, margin: 5, marginTop: 10 }}>
            <Box display="flex">
              <Box style={{width: "75%" , textAlign: "left"}}>
                  <Typography
                    style={{fontWeight: "550", fontSize: "22px", margin: "20px"}}
                  >Add a title</Typography>
                  <Textarea
                    placeholder="Title"
                    style={{marginLeft: "20px"}}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Typography
                    style={{fontWeight: "550", fontSize: "22px", margin: "20px"}}
                  >Add a description</Typography>
                  <Textarea
                   style={{marginLeft: "20px"}}
                   placeholder="Add your description..."
                   minRows={5}
                   onChange={(e) => setDescription(e.target.value)}
                  />
                  <Box textAlign="right">
                      <Button disabled={!(name && description && deadline && userId && workItemTypeId && workItemStateId)} onClick={handleCreate}>Submit new item</Button>
                  </Box>
              </Box>
              <Box textAlign="left" style={{width: "25%"}}>
              <Typography
                style={{fontWeight: "550",fontSize: "17px", margin: "20px", marginLeft: "24px", marginTop: "26px",color: "#6D6D6D"}}
              >Assignes</Typography>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={itemOptionsUser}
                sx={{ margin: "20px", width: "60%" }}
                size="small"
                onChange={(event, value) => setUserId(value?.id)}
                renderInput={(params) => <TextField {...params} label="No one" />}
              />
              <Divider style={{marginLeft: "20px", width: "65%"}} />

              <Typography
                style={{fontWeight: "550",fontSize: "17px", margin: "20px", marginLeft: "24px", marginTop: "26px",color: "#6D6D6D"}}
              >Work Item</Typography>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={itemOptionsType}
                sx={{ margin: "20px", width: "60%" }}
                size="small"
                onChange={(event, value) => setWorkItemTypeId(value?.id)}
                renderInput={(params) => <TextField {...params} label="None yet" />}
              />
              <Divider style={{marginLeft: "20px", width: "65%"}} />

              <Typography
                style={{fontWeight: "550",fontSize: "17px", margin: "20px", marginLeft: "24px", marginTop: "26px",color: "#6D6D6D"}}
              >Work State</Typography>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={itemOptionsState}
                sx={{ margin: "20px", width: "60%" }}
                size="small"
                onChange={(event, value) => setWorkItemStateId(value?.id)}
                renderInput={(params) => <TextField {...params} label="None yet" />}
              />
              <Divider style={{marginLeft: "20px", width: "65%"}} />
              
              <Typography
                style={{fontWeight: "550",fontSize: "17px", margin: "20px", marginLeft: "24px", marginTop: "26px",color: "#6D6D6D"}}
              >Deadline</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  slotProps={{ textField: { size: "small", style: {marginLeft: "24px",marginBottom: "20px", width: "60%"} } }} 
                  value={deadline}
                  format="MM/DD/YYYY"
                  onChange={(date)=>setDeadline(date)}
                />
              </LocalizationProvider>
              <Divider style={{marginLeft: "20px", width: "65%"}} />
              </Box>
            </Box>
          </Box>
        </Box>

    </div>
    )
}

const green = {
  200: "#ABEBC6",
  300: "#82E0AA",
  400: "#58D68D",
  500: "#2ECC71", 
  600: "#28B463",
  700: "#239B56",
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

const Button = styled(BaseButton)(
  ({ theme }) => `
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-top: 20px;
  background-color: ${green[500]};
  padding: 8px 16px;
  border-radius: 8px;
  color: white;
  transition: all 150ms ease;
  cursor: pointer;
  border: 1px solid ${green[500]};
  box-shadow: 0 2px 1px ${
    theme.palette.mode === "dark"
      ? "rgba(0, 0, 0, 0.5)"
      : "rgba(45, 45, 60, 0.2)"
  }, inset 0 1.5px 1px ${green[400]}, inset 0 -2px 1px ${green[600]};

  &:hover {
    background-color: ${green[600]};
  }

  &.${buttonClasses.active} {
    background-color: ${green[700]};
    box-shadow: none;
    transform: scale(0.99);
  }

  &.${buttonClasses.focusVisible} {
    box-shadow: 0 0 0 4px ${
      theme.palette.mode === "dark" ? green[300] : green[200]
    };
    outline: none;
  }

  &.${buttonClasses.disabled} {
    background-color: ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    color: ${theme.palette.mode === "dark" ? grey[200] : grey[700]};
    border: 0;
    cursor: default;
    box-shadow: none;
    transform: scale(1);
  }
  `
);


export default CreateWorkItem;