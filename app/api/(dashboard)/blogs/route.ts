import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/models/users";
import { request } from "http";
import mongoose from "mongoose";
import { Types } from "mongoose";
import Category from "@/lib/models/category";
import Blog from "@/lib/models/blog";



export const GET = async (request :Request) =>{

 try{

    const {searchParams} = new URL(request.url);
    const userId = searchParams.get('userId');
    const categoryId = searchParams.get('categoryId'); 
    const searchKeyword = searchParams.get('keyword') as string;
    const startDate  = searchParams.get('startDate') ;
    const endDate = searchParams.get('endDate');
    const  page : any = parseInt(searchParams.get('page') || "1");
     const  limit : any = parseInt(searchParams.get('limit') || "10");

if(!userId || !Types.ObjectId.isValid(userId)){
     return new NextResponse(
        JSON.stringify({message : "Invalid or missing user Id"  } ) , {status:400}
    )
}



if(!categoryId || !Types.ObjectId.isValid(categoryId)){
     return new NextResponse(
        JSON.stringify({message : "Invalid or missing category id"  } ) , {status:400}
    )
}


await connect();    


const user = await User.findById(userId);

if(!user){
     return new NextResponse(
        JSON.stringify({message : "User not found"  } ) , {status:400}
    )
}

const category = await Category.findOne({_id : categoryId , user : userId});

if(!category){
     return new NextResponse(
        JSON.stringify({message : "Category not found"  } ) , {status:400}
    )
}


const filter : any = {

    user : new Types.ObjectId(userId),
    category : new Types.ObjectId(categoryId),
}

if(searchKeyword){

filter.$or = [
{
    title : {$regex : searchKeyword, $options : "i" }
},
{
    description : {$regex : searchKeyword, $options : "i" }
}

];


}

if(startDate && endDate) {
    filter.createdAt = {
        $gte : new Date(startDate),
         $lte : new Date(endDate),
    }
}else if(startDate){
 filter.createdAt = {
        $gte : new Date(startDate),
         
    }

}else if(endDate){
 filter.createdAt = {
       
         $lte : new Date(endDate),
    }

}


const  skip = (page - 1) * limit;

const blogs = await Blog.find(filter).skip(skip).limit(limit);


return new NextResponse(JSON.stringify(blogs) , {status : 200})

}catch(e : any){
 return new NextResponse ("Error in fetching blogs ig" + e.message ,{status:500})

}


}


export const POST = async (request : Request) => {

try{


    const {searchParams} = new URL(request.url);
    const userId = searchParams.get('userId');
    const categoryId = searchParams.get('categoryId'); 

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



if(!categoryId || !Types.ObjectId.isValid(categoryId)){
     return new NextResponse(
        JSON.stringify({message : "Invalid or missing category id"  } ) , {status:400}
    )
}


await connect();    


const user = await User.findById(userId);

if(!user){
     return new NextResponse(
        JSON.stringify({message : "User not found"  } ) , {status:400}
    )
}

const category = await Category.findOne({_id : categoryId , user : userId});

if(!category){
     return new NextResponse(
        JSON.stringify({message : "Category not found"  } ) , {status:400}
    )
}


const blogObj : any = {

     title,
     description ,
    user : userId , 
    category : categoryId

}

const blog =  new Blog(blogObj);

await blog.save();

return new NextResponse(JSON.stringify(blog) , {status : 200})

}catch(e : any){
 return new NextResponse ("Error in posting blogs ig" + e.message ,{status:500})

}

}