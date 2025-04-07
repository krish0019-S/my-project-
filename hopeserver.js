var express=require("express");
var fileUploader=require("express-fileupload");
var cloudinary=require("cloudinary").v2;
var nodemailer = require('nodemailer');


var mysql2=require("mysql2");



var app=express();
const port = process.env.PORT || 4000;

app.listen(port,function(){
    console.log("Server Started");

})
 app.use(express.static("public"));
 app.use(express.urlencoded("true"))


 app.get("/",function(req,resp){
    let dirName=__dirname;
    let fullpath=dirName+"/public/index.html";
    resp.sendFile(fullpath);
 })

//----client Dash-----------------------------------------
 app.get("/cdash",function(req,resp){
   let dirName=__dirname;
   let fullpath=dirName+"/public/clientdash.html";
   resp.sendFile(fullpath);
 })

 //-----vol. dash----------------------------------------------
 app.get("/vdash",function(req,resp){
   let dirName=__dirname;
    let fullpath=dirName+"/public/volunteerdash.html";
    resp.sendFile(fullpath);
    
 })


 //-----vol. kyc--------------------------------------------------
app.get("/vkyc",function(req,resp){
   let dirName=__dirname;
   let fullpath=dirName+"/public/vol-kyc.html";
   resp.sendFile(fullpath);
})
//-------client profile----------------------------------------
app.get("/client",function(req,resp){
   let dirName=__dirname;
   let fullpath=dirName+"/public/client-profile.html";
   resp.sendFile(fullpath);
});

//-----post job---------------------------------------------------
app.get("/postjob",function(req,resp){
   let dirName=__dirname;
   let fullpath=dirName+"/public/post-job.html";
   resp.sendFile(fullpath);
});
//-----user control---------------------------------------------
app.get("/user",function(req,resp){
   let dirName=__dirname;
   let fullpath=dirName+"/public/user.html";
   resp.sendFile(fullpath);
});
//---------------admin---------------------------------------------
app.get("/admin",function(req,resp){
   let dirName=__dirname;
   let fullpath=dirName+"/public/admin-dash.html";
   resp.sendFile(fullpath);
});

//--------vol manager--------------------------------------------
app.get("/vmanger",function(req,resp){
   let dirName=__dirname;
   let fullpath=dirName+"/public/vol-manger.html";
   resp.sendFile(fullpath);
});

//---------client manager-------------------------------------------------
app.get("/cmanger",function(req,resp){
   let dirName=__dirname;
   let fullpath=dirName+"/public/client-manger.html";
   resp.sendFile(fullpath);
});


//-----------find work---------------------------------------------------
app.get("/find-work",function(req,resp){
   let dirName=__dirname;
   let fullpath=dirName+"/public/find-work.html";
   resp.sendFile(fullpath);
});
//---------------vol. job---------------------------------------------------------
app.get("/cjob",function(req,resp){
   let dirName=__dirname;
   let fullpath=dirName+"/public/client-job-manger.html";
   resp.sendFile(fullpath);
});




 let dbConfig="mysql://avnadmin:AVNS_rmjSbNmw_zYXuChqFNZ@mysql-bce-krishtanwar153-58bc.i.aivencloud.com:17677/nexthope";

let mySqlServer=mysql2.createConnection(dbConfig);

mySqlServer.connect(function(err){
    if(err!=null)
    {
        console.log(err.message);
    }
    else
        console.log("Connected to DB")

   }) 
//-------singup email----------------------------------------
   app.get("/do-signup-email",function(req,resp)
{
   var email=req.query.txtemail;
   var pwd=req.query.txtpwd;
   var utype=req.query.txttype;
    mySqlServer.query("insert into user values(?,?,current_date(),?,?)",[email,pwd,utype,1],function(err)
    {
       
        if(err==null)
       {
         resp.send("Successfully");
       }       
        else
       {
         resp.send(err.message);
       }
    })
})

//---------login----------------------------------------------------------
app.get("/do-login-email",function(req,resp){
   var email=req.query.tlemail;
   var pwd=req.query.tlpwd;

    mySqlServer.query("select * from user where email=? and pass=?",[email,pwd],function(err,jsonArray)
    {
      if(jsonArray.length==1)
      {
         resp.send(jsonArray[0]["utype"]);
      }
      else
      {
         resp.send("Invalid User");
      }
   })
});
app.use(express.urlencoded(true)); 
        app.use(fileUploader());

        cloudinary.config({ 
            cloud_name: 'ddheg3kkk', 
            api_key: '129812533926621', 
            api_secret: 'y0eWfsGGR8u6wjfjYHr7DOpSYns' 
        });


//-------vol. register-------------------------------------------------        
app.post("/vol-register", async function(req,resp){


   let fileName;
   if(req.files!=null)
   {
       fileName=req.files.picform.name;
       let locationToSave=__dirname+"/public/upload/"+fileName;//full ile path
       req.files.picform.mv(locationToSave);//saving file in uploads folder

        //saving ur file/pic on cloudinary server
        await cloudinary.uploader.upload(locationToSave).then(function(picUrlResult){
           fileName=picUrlResult.url;   //will give u the url of ur pic on cloudinary server
           console.log(fileName);
     });
   }
   else
   fileName="nopic.jpg";

   req.body.picpath=fileName;

   

   let fileName1;
   if(req.files!=null)
   {
       fileName1=req.files.idform.name;
       let locationToSave=__dirname+"/public/upload/"+fileName1;//full ile path
       req.files.idform.mv(locationToSave);//saving file in uploads folder

        //saving ur file/pic on cloudinary server
        await cloudinary.uploader.upload(locationToSave).then(function(picUrlResult){
           fileName1=picUrlResult.url;   //will give u the url of ur pic on cloudinary server
           console.log(fileName1);
     });
   }
   else
   fileName1="nopic.jpg";

   req.body.idpath=fileName1;

  


   mySqlServer.query("insert into volkyc values(?,?,?,?,?,?,?,?,?,?,?,?)",[req.body.emailform,req.body.name,req.body.contactform,req.body.addressform,req.body.cityform,req.body.ganderform,req.body.dobform,req.body.qualiform,req.body.occuform,req.body.infoform,req.body.picpath,req.body.idpath],function(err,result)
   {
      if(err==null)
         {
           resp.send("Register Successfully");
         }
      else
      {
         resp.send(err.message);
      }
   })
});

//========= update Process =========================================//

// app.post("/update-register", async function(req,resp)
// {


//    let fileName;
//    if(req.files!=null)
//    {
//        fileName=req.files.picform.name;
//        let locationToSave=__dirname+"/public/upload/"+fileName;//full ile path
//        req.files.picform.mv(locationToSave);//saving file in uploads folder

//         //saving ur file/pic on cloudinary server
//         await cloudinary.uploader.upload(locationToSave).then(function(picUrlResult){
//            fileName=picUrlResult.url;   //will give u the url of ur pic on cloudinary server
//            console.log(fileName);
//      });
//    }
//    else
//    fileName="nopic.jpg";

//    req.body.picpath=fileName;

   

//    let fileName1;
//    if(req.files!=null)
//    {
//        fileName1=req.files.idform.name;
//        let locationToSave=__dirname+"/public/upload/"+fileName1;//full ile path
//        req.files.idform.mv(locationToSave);//saving file in uploads folder

//         //saving ur file/pic on cloudinary server
//         await cloudinary.uploader.upload(locationToSave).then(function(picUrlResult){
//            fileName1=picUrlResult.url;   //will give u the url of ur pic on cloudinary server
//            console.log(fileName1);
//      });
//    }
//    else
//    fileName1="nopic.jpg";

//    req.body.idpath=fileName1;
  


//    mySqlServer.query("update volkyc set name1=?,contact=?,address=?,city=?,gender=?,dob=?,quali=?,occu=?,info=?,picpath=?,idpath=?",[req.body.name,req.body.contactform,req.body.addressform,req.body.cityform,req.body.ganderform,req.body.dobform,req.body.qualiform,req.body.occuform,req.body.infoform,req.body.picpath,req.body.idpath,req.body.emailform],function(err,result)
//    {
//       if(err==null)
//          {
//            resp.send("Update Successfully");
//          }
//       else
//       {
//          resp.send(err.message);
//       }
//    })
// });

// 
app.post("/update-register", async function (req, resp) {
   try {
       let txtmail = req.body.emailform;
       let txtname =req.body.name ;
       let txtcontact = req.body.contactform;
       let txtaddress =  req.body.addressform;
       let txtcity = req.body.cityform;
       let txtgender = req.body.ganderform;
       let txtdob = req.body.dobform;
       let txtquali = req.body.qualiform;
       let txtoccu = req.body.occuform;
       let txtinfo = req.body.infoform;
       
       let fileName = req.body.hdnpro || "no-pic.jpg";
       let fileName1 = req.body.hdnid || "no-pic.jpg";

       if (req.files && req.files.picform) {
           const picform = req.files.picform;
           const locationToSavepro = __dirname + "/public/uploads/" + picform.name;
           
           await picform.mv(locationToSavepro);
           const picUrlResult = await cloudinary.uploader.upload(locationToSavepro);
           fileName = picUrlResult.url;
           fs.unlinkSync(locationToSavepro);
       }

       if (req.files && req.files.idform) {
           const idform = req.files.idform;
           const locationToSavedoc = __dirname + "/public/uploads/" + idform.name;
           
           await idform.mv(locationToSavedoc);
           const picurldoc = await cloudinary.uploader.upload(locationToSavedoc);
           fileName1 = picurldoc.url;
         
           fs.unlinkSync(locationToSavedoc);
       }
       mySqlServer.query("UPDATE volkyc SET name1=?, contact=?, address=?, city=?, gender=?, dob=?, quali=?, occu=?, info=?, picpath=?, idpath=? WHERE emailid=?",[txtname, txtcontact, txtaddress, txtcity, txtgender, txtdob, txtquali, txtoccu, txtinfo, fileName, fileName1, txtmail],
           function(err, result) {
               if (err) {
                  resp.send(err.message);
               } else if (result.affectedRows === 1) {
                   resp.send("Record Updated Successfully");
               } else {
                   resp.send("Invalid Email Id");
               }
           }
       );
   } catch (err) {
       resp.send(err.message);
   }
});

//--------vol fatch user--------------------------------------------------
app.get("/fatch-user",function(req,resp){

   var email = req.query.txtemail;
   mySqlServer.query("select * from volkyc where emailid=?",[email],function(err,jsonArray){
      if(err==null)
      {
         resp.send(jsonArray);
      }
      else
      {
         resp.send(err.message);
      }
   })
})
// =====================================================================================



//-------client save------------------------------------------------------------------------

app.post("/client-save",function(req,resp){
   
   mySqlServer.query("insert into cprofile values(?,?,?,?,?,?,?,?,?,?)",[req.body.emailid,req.body.name1,req.body.bussi,req.body.bussiprof,req.body.adrs,req.body.city,req.body.contact,req.body.id,req.body.number,req.body.infoform],function(err,jsonArray){
    
      if(err==null)
      {
         resp.send("Save Successfully");
      }
      else
      {
         resp.send(err.message);
      }
   })
})

//------client update-------------------------------------------------------------------------------------
app.post("/client-update",function(req,resp){
   
   mySqlServer.query("update cprofile set cname=?,bussiness=?,bprofile=?,address=?,city=?,contact=?,idproof=?,idpnumber=?,info=? where email=?",[req.body.name1,req.body.bussi,req.body.bussiprof,req.body.adrs,req.body.city,req.body.contact,req.body.id,req.body.number,req.body.infoform,req.body.emailid],function(err,jsonArray){
    
      if(err==null)
      {
         resp.send(" Update Successfully.......");
      }
      else
      {
         resp.send(err.message);
      }
   })
})

//------search user--------------------------------------------------------------------------------------
app.get("/search-user",function(req,resp){

   var email = req.query.txtemail;
   mySqlServer.query("select * from cprofile where email=?",[email],function(err,jsonArray){
      if(err==null)
      {
         resp.send(jsonArray);
      }
      else
      {
         resp.send(err.message);
      }
   })
})

//--------publish job-----------------------------------------------------------------------------------
app.post("/publish-job",function(req,resp){
   
   mySqlServer.query("insert into jobs values(?,?,?,?,?,?,?,?)",[null,req.body.client,req.body.job,req.body.fchk,req.body.adrs,req.body.city,req.body.select,req.body.contact],function(err,jsonArray){
    
      if(err==null)
      {
         resp.send("Publish Successfully");
      }
      else
      {
         resp.send(err.message);
      }
   })
})



//==========================Anguler Ajax ==================================================


app.get("/all-records",function(req,resp)
{
    mySqlServer.query("select * from user",function(err,result)
    {
        if(err==null)
        {
         resp.send(result);
        }
        else
        resp.send(err.message);
    })
})


app.get("/doBlock",function(req,resp)
{
    let userMail=req.query.emailKuch;
    //col name Same as  table col name
    mySqlServer.query("update user set status=0 where email=?",[userMail],function(err,result)
    {
        if(err==null)
        {
            if(result.affectedRows==1)
            resp.send("Status block Successfulllyyyy");
            else
            resp.send("Inavlid User Id");
        }
        else
        resp.send(err.message);
    })
})

app.get("/Resume",function(req,resp)
{
    let userMail=req.query.emailKuch;
                                                  //col name Same as  table col name
    mySqlServer.query("update user set status=1 where email=?",[userMail],function(err,result)
    {
        if(err==null)
        {
            if(result.affectedRows==1)
            resp.send("Status Resume Successfulllyyyy");
            else
            resp.send("Inavlid User Id");
        }
        else
        resp.send(err.message);
    })
})

//====================================================================================================


//-----all fatch volkyc-----------------------------------------------------------------------------------
app.get("/all-Fatch",function(req,resp)
{
    mySqlServer.query("select * from volkyc",function(err,result)
    {
        if(err==null)
        {
         resp.send(result);
        }
        else
        resp.send(err.message);
    })
})

//------fatch client profile--------------------------------------------------------
app.get("/Fatch-cprof",function(req,resp)
{
    mySqlServer.query("select * from cprofile",function(err,result)
    {
        if(err==null)
        {
         resp.send(result);
        }
        else
        resp.send(err.message);
    })
})

//-----find work---------------------------------------------------------------------------------------
app.get("/search",function(req,resp)
{
   
    mySqlServer.query("select * from jobs where city=? and jobtitle=?  ",[req.query.city,req.query.jobtitle],function(err,result)
    
    {
        if(err==null)
        {
         resp.send(result);
        }
        else
        resp.send(err.message);
    })
})


app.get("/fatchcity1",function(req,resp)
{
    mySqlServer.query("select  distinct city from jobs",function(err,result)
    {
        if(err==null)
        {
         resp.send(result);
        }
        else
        resp.send(err.message);
    })
})


app.get("/fatchjob1",function(req,resp)
{
    mySqlServer.query("select  distinct jobtitle from jobs",function(err,result)
    {
        if(err==null)
        {
         resp.send(result);
        }
        else
        resp.send(err.message);
    })
})
//-----------------Job Manager--------------------------------------------------------------------------------

// app.get("/fatchAllJob",function(req,resp){

   
//    mySqlServer.query("select * from jobs",[],function(err,jsonArray){
//       if(err==null)
//       {
//          resp.send(jsonArray);
//       }
//       else
//       {
//          resp.send(err.message);
//       }
//    })
// })

app.get("/fatchjob",function(req,resp){

   
   mySqlServer.query("select * from jobs where cid=?",[req.query.emailKuch],function(err,jsonArray){
      if(err==null)
      {
         resp.send(jsonArray);
      }
      else
      {
         resp.send(err.message);
      }
   })
})

app.get("/doDel",function(req,resp)
{
    let userMail=req.query.emailKuch;
                                                  //col name Same as  table col name
    mySqlServer.query("delete from jobs where jobid=?",[userMail],function(err,jsonArray)
    {
        if(err==null)
        {
         resp.send(jsonArray);
        }
        else
        resp.send(err.message);
    })
})



app.get("/jobdetail",function(req,resp)
{
    let userMail=req.query.emailKuch;
                                                  //col name Same as  table col name
    mySqlServer.query("select * from jobs where jobid=?",[userMail],function(err,jsonArray)
    {
        if(err==null)
        {
         resp.send(jsonArray);
        }
        else
        resp.send(err.message);
    })
})


//------NodeMailer---------------------------------------------

app.get("/nodemailer", function(req, resp){
   var comm = req.body.message;
   var na = req.body.name;
   var transpoter = nodemailer.createTransport({
       service: 'gmail',
       auth: {
           user: 'krishtanwar153@gmail.com',
           pass:'oaqboxeqfiqyhsqr'
       }
   })
   var mailOptions ={
       from: 'nexthope.com',
       to: req.body.email,
       cc:'krish@gmail.com',
       subject:'Thanks You',
       text: comm

   };
   transpoter.sendMail(mailOptions, function(error,info){
       if(error){
            console.log(error);
       }else{
           res.send("mail submit");
           console.log("email sent + info.resp");

       }
   })
   resp.send("Mail sent Successfully!!");
}) 

 

