import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/models/users";
import { request } from "http";
import mongoose from "mongoose";
import { Types } from "mongoose";
import Category from "@/lib/models/category";
import Blog from "@/lib/models/blog";


export const PATCH = async (request : Request, context : {params :any} ) =>{

const blogId = context.params.blog;

try{


    const {searchParams} = new URL(request.url);
    const userId = searchParams.get('userId');


    const body = await request.json();
    const {title , description } = body;


if(!title){
  return new NextResponse(
        JSON.stringify({message : "Title is missing"  } ) , {status:400}
    )  
}

if(!description){
  return new NextResponse(
        JSON.stringify({message : "Description is missing"  } ) , {status:400}
    )  
}

if(!userId || !Types.ObjectId.isValid(userId)){
     return new NextResponse(
        JSON.stringify({message : "Invalid or missing user Id"  } ) , {status:400}
    )
}





await connect();    


const user = await User.findById(userId);

if(!user){
     return new NextResponse(
        JSON.stringify({message : "User not found"  } ) , {status:400}
    )
}

const blog = await Blog.findOne({_id : blogId , user : userId});

if(!blog){
     return new NextResponse(
        JSON.stringify({message : "Blog not found"  } ) , {status:400}
    )
}


const newblog = await Blog.findByIdAndUpdate(
    blogId,
    {title , description } ,
    {new : true}
)

return new NextResponse("Blog updated !" , {status : 200})

}catch(e : any){
 return new NextResponse ("Error in posting blogs ig" + e.message ,{status:500})

}


}



export const DELETE = async (request : Request, context : {params :any} ) =>{

const blogId = context.params.blog;

try{


    const {searchParams} = new URL(request.url);
    const userId = searchParams.get('userId');




if(!userId || !Types.ObjectId.isValid(userId)){
     return new NextResponse(
        JSON.stringify({message : "Invalid or missing user Id"  } ) , {status:400}
    )
}





await connect();    


const user = await User.findById(userId);

if(!user){
     return new NextResponse(
        JSON.stringify({message : "User not found"  } ) , {status:400}
    )
}

const blog = await Blog.findOne({_id : blogId , user : userId});

if(!blog){
     return new NextResponse(
        JSON.stringify({message : "Blog not found"  } ) , {status:400}
    )
}


await Blog.findByIdAndDelete(blogId);

return new NextResponse("Blog Deleted !" , {status : 200})

}catch(e : any){
 return new NextResponse ("Error in posting blogs ig" + e.message ,{status:500})

}


}