import React, { useState, useEffect, memo } from "react";
import "./EditProfile.css";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Button,
  Grid,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: { backgroundColor: "grey" },
  card: { textAlign: "justified", maxWidth: 700, margin: "auto" },
  edited: { color: "red" },
}));

const fetchMyUser = async () => {
  const res = await fetch(
    `https://colesroomapp.herokuapp.com/teacher/${sessionStorage.getItem(
      "user"
    )}`
  );
  return res.json();
};

const EditProfile = memo(() => {
  const [edited, setEdited] = useState(false);
  const [able, setAble] = useState(false);
  const [scape, setScape] = useState(false);
  const [alert, setAlert] = useState(false);
  const [user, setUser] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  useEffect(() => {
    if (able === false) {
      const getUser = async () => {
        await fetchMyUser().then((a) => {
          setUser(a);
          setName(a.name);
          setSurname(a.surname);
          setEmail(a.email);
          setPhone(a.phone);
        });
      };
      getUser();
    }
  }, [able]);

  const classes = useStyles();
  const nameChangeHandler = (e) => {
    setName(e.target.value);
    setEdited(false);
    setAble(true);
  };
  const surnameChangeHandler = (e) => {
    setSurname(e.target.value);
    setEdited(false);
    setAble(true);
  };
  const emailChangeHandler = (e) => {
    setEmail(e.target.value);
    setEdited(false);
    setAble(true);
  };
  const phoneChangeHandler = (e) => {
    setPhone(e.target.value);
    setEdited(false);
    setAble(true);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    const regName = /^[a-zA-Z ]{2,30}$/;
    if (!regName.test(name)) {
      setAlert("Nombre inválido");
      return;
    }
    if (!regName.test(surname)) {
      setAlert("Apellido inválido");
      return;
    }
    const regPhone = /^\d{9}$/;
    if (!regPhone.test(phone) || phone[0] !== "9") {
      setAlert("Teléfono inválido");
      return;
    }
    fetch(`/user/updateuser/${sessionStorage.getItem("user")}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        surname: surname,
        email: email,
        phone: phone,
      }),
    })
      .then((response) => {
        setEdited(true);
        setAble(false);
        return response.json();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const scapeHandler = () => {
    setScape(true);
  };
  return (
    <main className={classes.root}>
      {scape && <Redirect to="/profile" />}
      <Card className={classes.card}>
        <form onSubmit={submitHandler}>
          <CardHeader
            avatar={<Avatar src="/broken-image.jpg" />}
            title={`${user.name} ${user.surname}`}
          />
          <CardContent>
            <Grid container spacing={3} alignItems="flex-end">
              <Grid item>
                <aside>
                  <span>Nombre</span>
                </aside>
              </Grid>
              <Grid item>
                <TextField
                  id="name"
                  type="text"
                  value={name}
                  onChange={nameChangeHandler}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3} alignItems="flex-end">
              <Grid item>
                <aside>
                  <span>Apellido</span>
                </aside>
              </Grid>
              <Grid item>
                <TextField
                  id="surname"
                  type="text"
                  value={surname}
                  onChange={surnameChangeHandler}
                />
              </Grid>
            </Grid>
            <Grid container spacing={5} alignItems="flex-end">
              <Grid item>
                <aside>
                  <span>E-mail</span>
                </aside>
              </Grid>
              <Grid item>
                <TextField
                  required
                  id="email"
                  type="email"
                  value={email}
                  onChange={emailChangeHandler}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3} alignItems="flex-end">
              <Grid item>
                <aside>
                  <span>Teléfono</span>
                </aside>
              </Grid>
              <Grid item>
                <TextField
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={phoneChangeHandler}
                />
              </Grid>
            </Grid>
            <br />
            {alert && (
              <p>
                <strong>{alert}</strong>
              </p>
            )}
            {edited && (
              <p className={classes.edited}>
                <strong>Datos actualizados!</strong>
              </p>
            )}
          </CardContent>
          <CardActions>
            {able ? (
              <Button variant="outlined" color="primary" type="submit">
                Confirmar
              </Button>
            ) : (
              <Button variant="outlined" color="primary" type="submit" disabled>
                Confirmar
              </Button>
            )}
            <Button
              variant="contained"
              color="secondary"
              onClick={scapeHandler}
            >
              Volver
            </Button>
          </CardActions>
        </form>
      </Card>
    </main>
  );
});

export default EditProfile;
