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

 const user = await User.findById(userId);

 if(!user){

  return new NextResponse(
        JSON.stringify({message : "User not found!"  } ) , {status:400}
    )
 
 
    

 }

 const categories = await Category.find(
  {  user : new Types.ObjectId(userId) ,}
  )


  return new NextResponse(JSON.stringify(categories) , {status : 200})



}catch(e:any){

return new NextResponse ("Error in fetching categories" + e.message ,{status:500})

}


}

export const POST = async (request : Request) => {
try{

const { searchParams } = new URL(request.url);
const {title} = await request.json();
const userId = searchParams.get("userId");

if(!userId || !Types.ObjectId.isValid(userId)){
     return new NextResponse(
        JSON.stringify({message : "Invalid or missing user Id"  } ) , {status:400}
    )
}

await connect();

const user = await User.findById(userId);

if(!user) {
    return new NextResponse(
        JSON.stringify({message : "User not found"  } ) , {status:400}
    ) 
}



const category = new Category(
    {
        title,
        user : new Types.ObjectId(userId),

    }
);

await category.save();

return new NextResponse(JSON.stringify({message : 'category created succesfully ' , Category: category} ) ,{status : 200})

}catch(e:any){

    return new NextResponse ("Error in creating category" + e.message ,{status:500})


}
}

export const PATCH = async (request : Request, context : {params :any} ) => {

const categoryId = context.params.category;

try{


    const body = await request.json();
    const {title} = body;
    const {searchParams} = new URL(request.url);
    const userId  = searchParams.get("userId");


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


const updatedCategory = await Category.findByIdAndUpdate(
   categoryId,
   {title},
   {new : true}
)

 return new NextResponse(
        JSON.stringify({message : "Category updated !" , category: updatedCategory  } ) , {status:200}
    )

}catch(e:any){

    return new NextResponse ("Error in updating category" + e.message ,{status:500})
}




}