import { Schema ,models , model, Types } from "mongoose";
import { title } from "process";

const BlogShema = new Schema (

{
title : { type: String ,required : true},
description : {type:String , reqired : true},
user : { type : Schema.Types.ObjectId , ref : 'User'},
category : { type : Schema.Types.ObjectId , ref : 'Category'},


}
, {
    timestamps : true
}


)

const Blog = models.Blog || model("Blog" ,BlogShema);

export default Blog;