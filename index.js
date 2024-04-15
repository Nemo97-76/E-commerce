import express from "express";
import path from 'path'
import { config } from "dotenv";
import { initiateApp } from './SRC/utils/InitiateApp.js'
config({ path: path.resolve('./Configration/.env') })
const app=express()
initiateApp(app, express)
