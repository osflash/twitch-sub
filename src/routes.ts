import express, { Router } from "express";
import client from "./sevices/discord.js";

const routes = Router();

routes.get("/", (_, res) => {
  console.log("Ready!");

  res.status(200).json({ status: client.isReady() });
});

routes.use("/", express.static("public"));

routes.get("*", (_, res) => res.redirect("/"));

export default routes;
