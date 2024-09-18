import "./Home.css";
import { styled } from "@mui/system";
import { Tabs } from "@mui/base/Tabs";
import { TabsList as BaseTabsList } from "@mui/base/TabsList";
import { TabPanel as BaseTabPanel } from "@mui/base/TabPanel";
import { buttonClasses } from "@mui/base/Button";
import { Tab as BaseTab, tabClasses } from "@mui/base/Tab";
import Divider from "@mui/material/Divider";
import Footer from "../Footer/Footer";
import WMS1 from "../Images/WMS3.jpg"
import WMS2 from "../Images/WMS2.jpg"
import WMS3 from "../Images/WMS4.jpg"
import { Chip } from "@mui/joy";

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

const Tab = styled(BaseTab)`
  font-family: "IBM Plex Sans", sans-serif;
  color: #fff;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  background-color: transparent;
  width: 100%;
  padding: 10px 12px;
  margin: 6px;
  border: none;
  border-radius: 7px;
  display: flex;
  justify-content: center;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: ${blue[400]};
  }

  &:focus {
    color: #fff;
    outline: 3px solid ${blue[200]};
  }

  &.${tabClasses.selected} {
    background-color: #fff;
    color: ${blue[600]};
  }

  &.${buttonClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TabPanel = styled(BaseTabPanel)(
  ({ theme }) => `
    width: 98,5%;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    padding: 20px 12px;
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    border-radius: 12px;
    opacity: 0.6;
    `
);

const TabsList = styled(BaseTabsList)(
  ({ theme }) => `
    min-width: 400px;
    background-color: ${blue[500]};
    border-radius: 12px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    align-content: space-between;
    box-shadow: 0px 4px 30px ${
      theme.palette.mode === "dark" ? grey[900] : grey[200]
    };
    `
);

const TabStyle = {
  width: "70%",
};

const homeDiv = {
  fontFamily: "Segoe UI",
  margin: 0,
};

const welcomeDiv = {
  backgroundColor: "#007FFF",
  color: "#ffffff",
  padding: "2rem",
  borderRadius: 0,
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
  height: "500px",
  clipPath: "polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)",
  marginBottom: "50px",
};



const Home = (props: { name: string }) => {
  return (
    <div style={homeDiv}>
      <div style={welcomeDiv}>
        <h1 className="h1-title">Welcome to Work Manager System</h1>
        <br/>
        {props.name ? (
          <h2 className="user-welcome">Hi {props.name}</h2>
        ) : (
          <h2 className="user-welcome">You are not logged in</h2>
        )}
        <br/>
        <p className="lead">
          Streamline your tasks, projects, and team collaboration with ease.
        </p>
        <br/>
        <Divider orientation="horizontal" style={{fontSize: "20px"}}>
          <Chip variant="soft" sx={{ backgroundColor: `${blue[400]}`, color: "white", fontSize: "18px"}}>
          Get organized, boost productivity, and achieve your goals efficiently.
          </Chip>
          </Divider> 
      </div>

      <div className="tab-container">
        <Tabs defaultValue={0} style={TabStyle}>
          <TabsList>
            <Tab value={0}>Task Tracking</Tab>
            <Tab value={1}>Project Management</Tab>
            <Tab value={2}>Team Collaboration</Tab>
          </TabsList>
          <div className="tab-container">
            <TabPanel value={0} style={{backgroundColor: "#FCFCFC", width: "60%"}}>
              <p className="p-tabs">
                Effortlessly manage and track your tasks in one place.
                <br/>
                <br/>
                <img src={WMS1} style={{width: "500px"}}/>
              </p>
            </TabPanel>
          </div>
          <div className="tab-container">
            <TabPanel value={1} style={{backgroundColor: "#FCFCFC", width: "60%"}}>
              <p className="p-tabs">
                Coordinate projects and monitor progress seamlessly.
                <br/>
                <br/>
                <img src={WMS2} style={{width: "500px"}}/>
              </p>
            </TabPanel>
          </div>
          <div className="tab-container">
            <TabPanel value={2} style={{backgroundColor: "#FCFCFC", width: "60%"}}>
              <p className="p-tabs">
                Collaborate efficiently with your team members.
                <br/>
                <br/>
                <img src={WMS3} style={{width: "500px"}}/>
              </p>
            </TabPanel>
          </div>
        </Tabs>
      </div>
      <div className="footer-container">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
