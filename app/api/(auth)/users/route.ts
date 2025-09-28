import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/models/users";
import { request } from "http";
import mongoose from "mongoose";
import { Types } from "mongoose";




const ObjectId = require("mongoose").Types.ObjectId;


export const GET = async ()=>{
    

  try{
    await connect();
     const users = await User.find();
     return new NextResponse(JSON.stringify(users) , {status : 200})
  }catch(e:any){
    return new NextResponse ("Error in fetching users" + e.message ,{status:500})
  }

  };

export const POST  = async ( request : Request) =>{

    try{

    const body = await request.json();
    await connect();
    const newUser = new User(body);
    await newUser.save();
    return new NextResponse(JSON.stringify({message : 'User created succesfully ' , user: newUser} ) ,{status : 200})


    }catch(e:any){
    return new NextResponse ("Error in creating users" + e.message ,{status:500})
  }
}

export const PATCH = async ( request : Request) =>{

try{


const body = await request.json();
const { userId , newUsername } = body;
await connect();

if(!userId || !newUsername){

   return new NextResponse ("User id or new user name not found" ,{status:400})
}

if(!userId || !newUsername){

   return new NextResponse ("User id or new user name not found" ,{status:400})
}



}catch(e : any){
 return new NextResponse ("Error deleting user" + e.message ,{status:500})
}



}