const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const UserModel = require("./model/UserModel");
const PostModel = require("./model/PostModel");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/blog");
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json("Token is missing");
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.json("token is Wrong");
      } else {
        req.email = decoded.email;
        req.name = decoded.name;
        next();
      }
    });
  }
};
app.get("/", verifyUser, (req, res) => {
  return res.json({ email: req.email, name: req.name });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json("Success");
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      UserModel.create({ name, email, password: hash })
        .then((user) => res.json(user))
        .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));
});
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  UserModel.findOne({ email: email }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, resp) => {
        if (resp) {
          const token = jwt.sign(
            { email: user.email, name: user.name },
            "jwt-secret-key",
            { expiresIn: "1d" }
          );
          res.cookie("token", token);
          return res.json("Success");
        } else {
          return res.json("Password is incorrect");
        }
      });
    } else {
      return res.json("User not exist");
    }
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/Images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

app.post("/create", verifyUser, upload.single("file"), (req, res) => {
  PostModel.create({
    title: req.body.title,
    description: req.body.description,
    email: req.body.email,
    file: req.file.filename,
  })
    .then((result) => res.json("Success"))
    .catch((err) => res.json(err));
});

app.get("/getPosts", (req, res) => {
  PostModel.find()
    .then((post) => res.json(post))
    .catch((err) => res.json(err));
});

app.put("/postEdit/:id", (req, res) => {
  const id = req.params.id;
  PostModel.findByIdAndUpdate(
    {
      _id: id,
    },
    {
      title: req.body.title,
      description: req.body.description,
    }
  )
    .then((post) => res.json("Success"))
    .catch((err) => res.json(err));
});

app.get("/getPostById/:id", (req, res) => {
  const id = req.params.id;
  PostModel.findById({ _id: id })
    .then((post) => res.json(post))
    .catch((err) => res.json(err));
});
app.delete("/deletePost/:id", (req, res) => {
  PostModel.findByIdAndDelete({ _id: req.params.id })
    .then((result) => res.json("Success"))
    .catch((err) => res.json(err));
});
app.listen(3001, () => {
  console.log("Server is Running");
});
