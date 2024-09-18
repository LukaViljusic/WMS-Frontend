import { useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";
import { styled } from "@mui/system";
import { SyntheticEvent, useEffect, useState } from "react";
import { Avatar, Button } from "@mui/joy";
import { Typography, Card, CardContent, CardActionArea } from "@mui/material";
import { Modal, ModalClose, Sheet } from "@mui/joy";

const GetUsers = (props: { email: String }) => {
  const { spaceId } = useParams();
  const [userCount, setUserCount] = useState(0);
  const [users, setUsers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(0);

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
      console.log(users.length)
    })();
  }, [userCount]);

  const cardClicked = (id: number) => {
    console.log(id);
    setIdToDelete(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteUser = async (e: SyntheticEvent) => {
    e.preventDefault();

    const response = await fetch(
      `https://localhost:7054/api/UserSpace/${idToDelete}`,
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
    setOpen(false);
    setUserCount(userCount+1);
  };

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
          <Button sx={{":hover": {transition: "0.5s"} }}>
            <ArrowBackIcon />
          </Button>
        </Link>
      </div>
      <div>
      <div>
        <h1>Users</h1>
      </div>
      </div>
      <div>
        {users.length === 1 ? 
        (<div>
          <Typography
            variant="body1" fontSize="22px" style={{ fontWeight: "550", margin: "250px"}}
          >
            There are no Users!
          </Typography>
        </div>) : 
        (<div className="space-container">
        {users.map((user, index) => (
          <div key={index}>
            {props.email !== user.email && (
              <Card sx={{ minWidth: 345, margin: 5, borderRadius: "10px" }}>
                <CardActionArea onClick={() => cardClicked(user.id)}>
                  <CardContent>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        margin: "20px",
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          backgroundColor: "#007FFF",
                          color: "white",
                        }}
                      >
                        {user.firstName.charAt(0)}
                      </Avatar>
                    </div>
                    <Typography
                      gutterBottom
                      variant="h4"
                      component="div"
                      style={{ fontWeight: "bold" }}
                    >
                      {user.firstName}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {user.email}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            )}
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
          <Typography variant="h5" sx={{ margin: 4 }}>
            Are you sure you want to delete this user?
          </Typography>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              sx={{ margin: "10px", marginBottom: "0px", ":hover": {transition: "0.5s"} }}
              onClick={handleClose}
            >
              No
            </Button>
            <Button
              sx={{ margin: "10px", marginBottom: "0px", backgroundColor: "red", ":hover": {bgcolor: "#D1242F", transition: "0.5s"}}}
              onClick={deleteUser}
            >
              Yes
            </Button>
          </div>
        </Sheet>
      </Modal>
    </div>
  );
};

export default GetUsers;
