import Sidebar from "../Sidebar/sidebar";
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Tab, TabList, TabPanel, Tabs } from "@mui/joy";
import { Link } from "react-router-dom";
import { tabClasses } from "@mui/base";
import "./WorkItem.css";

const WorkItem = (props: {
  firstName: string;
  email: string;
  userId: string;
}) => {
  const { spaceId } = useParams();

  const [workItems, setWorkItems] = useState<any[]>([]);
  const [workItemCount, setWorkItemCount] = useState(0);

  const linkStyle = {
    textDecoration: "none",
    color: "black"
  }

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `https://localhost:7054/api/WorkItem/BySpace/${spaceId}`,
        {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (response.ok) {
        const content = await response.json();
        console.log(content);
        setWorkItems(content);
      }
    })();
  }, [workItemCount]);


  

  return (
    <div>
      <Box sx={{ display: "flex" }}>
        <Sidebar name={props.firstName} email={props.email} spaceId={spaceId} />
        <Box component="main" sx={{ flexGrow: 1, margin: 5, marginTop: 10 }}>
          <Box sx={{ textAlign: "right", margin: "20px" }}>
            <Link to={`/workitemcreate/${spaceId}`}><Button sx={{backgroundColor: "#1F883D", ":hover": {bgcolor: "#006400", transition: "0.5s"}}}>Create item</Button></Link>
          </Box>
            <Tabs aria-label="tabs" defaultValue={0} sx={{ bgcolor: "transparent"}}>
            <Box style={{border: "1px solid #CDCDCD", borderRadius: "10px"}}>
              <Box style={{backgroundColor: "#F5F5F5", borderTopLeftRadius: "10px", borderTopRightRadius: "10px", borderBottom: "1px solid #CDCDCD"}}>
                <Box textAlign="left" style={{display: "flex", flexDirection:"row"}}>
                    <TabList
                      disableUnderline
                      sx={{
                        height: "52px",
                        p: 0.5,
                        gap: 0.5,
                        borderRadius: "xl",
                        bgcolor: "#F5F5F5",
                        [`& .${tabClasses.root}[aria-selected="true"]`]: {
                          boxShadow: "sm",
                          bgcolor: "background.surface"
                        }
                      }}
                    >
                      <Tab disableIndicator><Typography style={{margin: "20px"}}>Open</Typography></Tab>
                      <Tab disableIndicator><Typography style={{margin: "20px"}}>Closed</Typography></Tab>
                    </TabList>
                  
                </Box>
                <Box textAlign="right">

                </Box>
              </Box>
              <Box>
                <TabPanel value={0}>
                {workItems.every(workItem => workItem.finalStatus === "True") ? (
                          <Typography variant="h5" style={{ fontWeight: "550", margin: "250px"}}>There aren't any work item!</Typography>
                        ): (
                          workItems
                          .filter(workItem => workItem.finalStatus === "False")
                          .map((workItem, index) => (
                            <div key={index}>
                              <Link to={`/workitemdetails/${spaceId}/${workItem.id}`} style={linkStyle}>
                                <Box display="flex" justifyContent="space-between" borderBottom="1px solid #CDCDCD" padding="5px">
                                <Box textAlign="left" display="flex" flexDirection="row">
                                <svg style={{height: "16px", width: "16px", marginTop: "18px", marginLeft: "35px"}}>
                                  <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
                                  <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
                                </svg>
                                  <Typography
                                    variant="body1"
                                    margin="15px"
                                    marginLeft="10px"
                                    fontWeight="550"
                                  >
                                    {workItem.name}
                                  </Typography>
                                  <Box borderRadius="20px" style={{backgroundColor: `${workItem.workItemTypeColor}`, height: "50%", marginTop: "13px", paddingLeft: "10px", paddingRight: "10px", color: "white"}}>
                                    <Typography marginTop = "2px">
                                      {workItem.workItemTypeName}
                                    </Typography>
                                  </Box>
                                  </Box>
                                  <Box margin="15px">
                                  <strong>{workItem.userName}</strong>
                                  </Box>
                              </Box>
                            </Link>
                            </div>
                          ))
                        )}
                </TabPanel>
                <TabPanel value={1}>
                        {workItems.every(workItem => workItem.finalStatus === "False") ? (
                          <Typography variant="h5" style={{ fontWeight: "550", margin: "250px"}}>There aren't any work item!</Typography>
                        ): (
                          workItems
                          .filter(workItem => workItem.finalStatus === "True")
                          .map((workItem, index) => (
                            <div key={index}>
                              <Link to={`/workitemdetails/${spaceId}/${workItem.id}`} style={linkStyle}>
                              <Box display="flex" justifyContent="space-between" borderBottom="1px solid #CDCDCD" padding="5px">
                              <Box textAlign="left" display="flex" flexDirection="row">
                              <svg style={{height: "16px", width: "16px", marginTop: "18px", marginLeft: "35px"}}>
                                <path d="M11.28 6.78a.75.75 0 0 0-1.06-1.06L7.25 8.69 5.78 7.22a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l3.5-3.5Z"></path>
                                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
                              </svg>
                                <Typography
                                  variant="body1"
                                  margin="15px"
                                  marginLeft="10px"
                                  fontWeight="550"
                                >
                                  {workItem.name}
                                </Typography>
                                <Box borderRadius="20px" style={{backgroundColor: `${workItem.workItemTypeColor}`, height: "50%", marginTop: "13px", paddingLeft: "10px", paddingRight: "10px", color: "white"}}>
                                  <Typography marginTop = "2px">
                                    {workItem.workItemTypeName}
                                  </Typography>
                                </Box>
                                </Box>
                                <Box margin="15px">
                                  <strong>{workItem.userName}</strong>
                                </Box>
                            </Box>
                            </Link>
                            </div>
                          ))
                        )}
                </TabPanel>
                
                
              </Box>
            </Box>
            </Tabs>
        </Box>
      </Box>
    </div>
  );
};



export default WorkItem;
