import { Box, Button, Divider, Typography } from "@mui/joy";
import Sidebar from "../Sidebar/sidebar";
import { useNavigate, useParams } from "react-router-dom";
import { SyntheticEvent, useEffect, useState } from "react";

const WorkItemsDetails = (props: {
    firstName: string;
    email: string;
    userId: string; }) => {

        const { spaceId, workItemId } = useParams();
        const [workItems, setWorkItems] = useState<any>([]);
        const [open, setOpen] = useState(false);
        const [changeStatus, setChangeStatus] = useState(0);
        const navigate = useNavigate();

        console.log(spaceId + " " + workItemId)

        useEffect(() => {
            (async () => {
              const response = await fetch(
                `https://localhost:7054/api/WorkItem/WorkItems/${workItemId}`,
                {
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                }
              );
        
              if (response.ok) {
                const content = await response.json();
                console.log(content);
                setWorkItems(content);
                setOpen(true)
              }
            })();
          }, [changeStatus]);

            const dateTime = new Date(workItems.createdAt);
            const formatedDate = dateTime.toLocaleString();
            let timeEstimate;
            if(open) {
                const today = new Date();
                let [day, month, year] = workItems.deadline.split("/");
                let formatedDeadline = `${year}-${month}-${day}`;
                let deadlineDate = new Date(formatedDeadline)
                timeEstimate = Math.round((deadlineDate.getTime()-today.getTime()) / (24 * 60 * 60 * 1000)) + 1;
            }


            const closeStatus = async(e: SyntheticEvent) => {
                e.preventDefault();

                const closeStatusData = {
                    id: workItems.workItemStateId,
                    finalStatus: "True"
                  };

                const response = await fetch(
                    `https://localhost:7054/api/WorkItemState/UpdateFinalStatus`,
                    {
                      method: "PUT",
                      headers: {
                        accept: "*/*",
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(closeStatusData)
                    }
                  );

                  const result = await response.text();
                  console.log(result);
                  setChangeStatus(changeStatus + 1);
            }

            const deleteItem = async (e: SyntheticEvent) => {
                e.preventDefault();
            
                const response = await fetch(
                  `https://localhost:7054/api/WorkItem/${workItems.id}`,
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

                navigate(`/workitem/${spaceId}`)
              };

    return(
        <div>
        <Box sx={{ display: "flex" }}>
          <Sidebar name={props.firstName} email={props.email} spaceId={spaceId} />
            <Box component="main" sx={{ flexGrow: 1, margin: 5, marginTop: 10 }}>
                <Box textAlign="left">
                    <h1 style={{margin: "20px", marginLeft:"0px"}}>{workItems.name}</h1>
                    {workItems.finalStatus === "False" ? (
                        <Box borderRadius="20px" marginLeft="25px" padding="10px" style={{backgroundColor: "lightblue", color: "white"}} display="flex" flexDirection="row" width="3.5%">
                            <svg style={{height: "16px", width: "16px", margin: "5px", marginLeft: "0px"}}>
                                <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
                                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
                            </svg>
                            <Typography>Open</Typography>
                        </Box>
                    ) : 
                    (
                        <Box borderRadius="20px" marginLeft="25px" padding="10px" style={{backgroundColor: "lightblue"}} display="flex" flexDirection="row" width="4%">
                            <svg style={{height: "16px", width: "16px", margin: "4px"}}>
                                <path d="M11.28 6.78a.75.75 0 0 0-1.06-1.06L7.25 8.69 5.78 7.22a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l3.5-3.5Z"></path>
                                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
                            </svg>
                            <Typography>Closed</Typography>
                        </Box>
                    )}
                    <Divider style={{margin: "15px"}}/>
                    <Box>
                        <Box style={{backgroundColor: "#ddf4ff", borderTopLeftRadius: "10px", borderTopRightRadius: "10px"}} textAlign="left" border="1px solid #54aeff66">
                            <Typography padding="15px"><strong>{workItems.userName}</strong> <span style={{color: "#666666"}}>created on {formatedDate}</span></Typography>
                        </Box>
                        <Box style={{borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px"}} textAlign="left" border="1px solid #54aeff66">
                            <Typography padding="15px" paddingBottom="35px">{workItems.description}</Typography>
                        </Box>
                        <Box sx={{ borderLeft: "2px #D2DAE4 solid", marginLeft: "15px", paddingBottom: "10px"}}>
                            <Box sx={{ display: "flex", flexDirection: "row", marginLeft: "-20px"}}>
                                <svg style={{width: "35px", height: "35px", marginTop: "35px"}}>
                                    <path fill="#EAEEF2" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2z" transform="scale(1.5)"></path>
                                    <path fill="#636C76" d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15-5-2.18L7 18V5h10v13z" transform="translate(6 5)"></path>
                                </svg>
                                <Typography sx={{marginTop: "40px", marginLeft: "10px",}}><strong>Item type</strong></Typography>
                                <Box sx={{backgroundColor: `${workItems.workItemTypeColor}`, marginTop: "35px", marginLeft: "10px", borderRadius: "20px"}}>   
                                    <Typography sx={{padding: "5px"}}>{workItems.workItemTypeName}</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: "flex", flexDirection: "row", marginLeft: "-20px"}}>
                                <svg style={{width: "35px", height: "35px", marginTop: "35px"}}>
                                    <path fill="#EAEEF2" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2z" transform="scale(1.5)"></path>
                                    <path fill="#636C76" d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" transform="translate(6 5)"></path>
                                </svg>
                                <Typography sx={{marginTop: "40px", marginLeft: "10px",}}><strong>Item State</strong></Typography>
                                <Box sx={{backgroundColor: `${workItems.workItemStateColor}`, marginTop: "35px", marginLeft: "10px", borderRadius: "20px"}}>   
                                    <Typography sx={{padding: "5px"}}>{workItems.workItemStateName}</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: "flex", flexDirection: "row", marginLeft: "-20px"}}>
                                <svg style={{width: "35px", height: "35px", marginTop: "35px"}}>
                                    <path fill="#EAEEF2" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2z" transform="scale(1.5)"></path>
                                    <path fill="#636C76" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" transform="translate(6 5)"></path>
                                    <path fill="#636C76" d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" transform="translate(6 5)"></path>
                                </svg>
                                
                                <Typography sx={{marginTop: "40px", marginLeft: "10px",}}><strong>Deadline</strong></Typography> 
                                <Box sx={{marginTop: "35px", marginLeft: "10px", borderRadius: "20px"}}>      
                                    <Typography sx={{padding: "5px"}}>{workItems.deadline}</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: "flex", flexDirection: "row", marginLeft: "-20px"}}>
                                <svg style={{width: "35px", height: "35px", marginTop: "35px"}}>
                                    <path fill="#EAEEF2" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2z" transform="scale(1.5)"></path>
                                    <path fill="#636C76" d="m22 5.72-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM7.88 3.39 6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM12.5 8H11v6l4.75 2.85.75-1.23-4-2.37V8zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" transform="translate(6 5)"></path>
                                </svg>
                                <Typography sx={{marginTop: "40px", marginLeft: "10px",}}><strong>Time Estimate</strong></Typography> 
                                <Box sx={{marginTop: "35px", marginLeft: "10px", borderRadius: "20px"}}>      
                                    { workItems.finalStatus === "True" ? <Typography sx={{padding: "5px"}}>Over</Typography> : <Typography sx={{padding: "5px"}}>{typeof timeEstimate !== "undefined" && (timeEstimate < 0 ? "Late" : timeEstimate + " days")}</Typography>}
                                </Box>
                            </Box>
                        </Box>
                        <Divider />
                        <Box textAlign="right">
                            { workItems.finalStatus === "False" ? <Button sx={{margin: "20px", ":hover": {transition: "0.5s"}}} onClick={closeStatus}>Close State</Button> : <Button sx={{margin: "20px"}} disabled>State closed</Button> }
                            <Button sx={{backgroundColor: "red", ":hover": {bgcolor: "#FF3632", transition: "0.5s"}}} onClick={deleteItem}>Delete Item</Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>

    </div>
    )
}

export default WorkItemsDetails;