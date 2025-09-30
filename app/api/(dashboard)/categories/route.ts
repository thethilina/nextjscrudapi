import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/models/users";
import { request } from "http";
import mongoose from "mongoose";
import { Types } from "mongoose";
import Category from "@/lib/models/category";

export const GET = async  (request : Request) =>{

try{

 const {searchParams}  = new URL(request.url);
 const userId  = searchParams.get("userId");
 
 if(!userId || !Types.ObjectId.isValid(userId) ){
    return new NextResponse(
        JSON.stringify({message : "Invalid or missing user Id"  } ) , {status:400}
    )
 }

 await connect();

 const user = User.findById(userId);

 if(!user){

  return new NextResponse(
        JSON.stringify({message : "User not found!"  } ) , {status:400}
    )
 
 
    

 }

 const categories = Category.find(
  {  user : new Types.ObjectId(userId) ,}
  )


  return new NextResponse(JSON.stringify(categories) , {status : 200})



}catch(e:any){

return new NextResponse ("Error in fetching categories" + e.message ,{status:500})

}


}

