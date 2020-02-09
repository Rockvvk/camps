var mongoose=require("mongoose");
var Campground=require("./models/campground");
var Comment=require("./models/comment");

var data=[
  {
    name:"Rainy winter",
    image:"https://images.unsplash.com/photo-1576605938586-8d485e3c8c3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
  },
  {
    name:"Moving ant",
    image:"https://images.unsplash.com/photo-1574781689744-c255032f79da?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    description:"this is really fantastic"
  },
  {
    name:"Oceans driving",
    image:"https://images.unsplash.com/photo-1574880790898-29d299ff284b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    description:"going to surf"
  }

]
function seedDb() {
  Campground.deleteMany({},function(err){
    if(err){
      console.log(err);
    }
    
    for(var i=0;i<data.length;i++){
      Campground.create(
        data[i],function(err,camp){
        if(err){
          console.log(err);
        }else{
          
          Comment.create({
            text:"this is good place",
            author:"homie"
          },function(err,comment){
            if(err)
            {
              console.log(err);
            }else{
              camp.comments.push(comment);
              camp.save();
              
            }
          });
        }
      });
    } 
  });
}
  
   
module.exports=seedDb;