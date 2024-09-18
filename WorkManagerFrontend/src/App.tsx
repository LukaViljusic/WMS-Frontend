import './App.css';
import { useState, useEffect, lazy, Suspense } from 'react';

import Registartion from './Components/Registration/Registration';
import NavBar from './Components/NavBar/NavBar';
import { Routes, Route, useLocation } from 'react-router-dom';
import Space from './Components/Space/Space';
import WorkItemType from './Components/WorkItemType/WorkItemType';
import Loader from './Components/Loader/Loader';
import WorkItemState from './Components/WorkItemState/WorkItemState';
import WorkItem from './Components/WorkItem/WorkItem';
import Profile from './Components/ManageProfile/Profile';
import GetUsers from './Components/GetUsers/GetUsers';
import CreateWorkItem from './Components/WorkItem/CreateWorkItem';
import WorkItemsDetails from './Components/WorkItem/WorkItemsDetails';

const Home = lazy(()=> import('./Components/Home/Home'));
const LogIn = lazy(()=> import('./Components/LogIn/LogIn'));

function App() {
  
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();

    useEffect(()=>{
        (
            async () => {
                const response = await fetch("https://localhost:7054/api/User/GetByJwt", {
                    headers: { "Content-Type": "application/json"},
                    credentials: "include"
                });

                const content = await response.json();
                setName(content.firstName);
                setLastName(content.lastName);
                setEmail(content.email);
                setId(content.id);
            }
        )();
    });

    useEffect(() => {
      // Provjeri je li trenutna putanja WorkItem putanja
      const isWorkItemPath = location.pathname.includes('/workitem');
  
      // Ako nije, postavi showSidebar na false
      if (!isWorkItemPath) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true)
      }
    }, [location.pathname]);
    

  return (
    <div className="App">
        {!showSidebar && <NavBar name={name} setName={setName}/>}
      
        
        <main>
          <Suspense fallback={<Loader/>}>
            <Routes>
              <Route path='/' Component={() => <Home name={name}/>}/>
              <Route path="/login" Component={() => <LogIn name={name} setName={setName}/>}/>
              <Route path="/register" Component={() => <Registartion name={name} setName={setName}/>}/>
              <Route path='/space' Component={() => <Space id={id}/>}/>
              <Route path='/workitemtype/:spaceId' Component={WorkItemType} />
              <Route path='/workitemstate/:spaceId' Component={WorkItemState} />
              <Route path='/workitem/:spaceId' Component={() => <WorkItem firstName={name} email={email} userId={id}/> } />
              <Route path='/workitemusers/:spaceId' Component={() => <GetUsers email={email}/>}/>
              <Route path="/profile" Component={() => <Profile id={id} firstName={name} lastName={lastName} email={email} setName={setName}/>} />
              <Route path="/workitemcreate/:spaceId" Component={() => <CreateWorkItem firstName={name} email={email} userId={id}/>} />
              <Route path="/workitemdetails/:spaceId/:workItemId" Component={() => <WorkItemsDetails firstName={name} email={email} userId={id}/>} />
            </Routes>
          </Suspense>
        </main>
    </div>
  );
}

export default App;
