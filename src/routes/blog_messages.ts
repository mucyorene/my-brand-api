import express from "express";
import {saveMessages} from "../controllers/blog_messages";

const sendMessage = (router: express.Router) => {
    router.post("/saveMessage", saveMessages)
}