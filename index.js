import express from "express"
import cors from "cors"
import multer from "multer"
import { v4 as uuidv4} from "uuid"
import path from "path"
import fs from "fs"
import {exec} from "child_process" // This dangerous and it is not how this is done.

const app = express()

// Multer middleware

const storage = multer.diskStorage({
    destination: function(req, file, cb){ // cb is callback
        cb(null, "./uploads")
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + "-" + uuidv4() + path.extname(file.originalname))
    }
})

// Multer Configuration
const upload = multer({storage:storage})

app.use(
    cors({
        origin: ["https://backend-3pou.onrender.com", "https://localhost:5173", "https://vis-b1z9.onrender.com"],
        credentials: true
    })
)

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next()
})

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("/uploads", express.static("uploads")) // Location to serve the static files


app.get('/', function(req,res){
    res.json({message: "Hello Anchal"})
})

app.post('/upload', upload.single("file"), function(req, res){
    const lessonId = uuidv4()
    const videoPath = req.file.path
    const outputPath = `./uploads/testVideo/${lessonId}`
    const hlsPath = `${outputPath}/index.m3u8`
    console.log("hlsPath", hlsPath)

    if(!fs.existsSync(outputPath)){
        fs.mkdirSync(outputPath, {recursive: true})
    }

    // FFMPEG command to convert video to HLS
    const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;


    // No queue used here
    exec(ffmpegCommand, (error, stdout, stderr) => {
        if(error) {
            console.log(`exec error: ${error}`)
        }
        console.log(`stdout: ${stdout}`)
        console.log(`stderr: ${stderr}`)

        const videoUrl = `https://backend-3pou.onrender.com/uploads/testVideo/${lessonId}/index.m3u8`;

        res.json({
            message: "Video Converted to HLS format",
            videoUrl: videoUrl,
            lessonId: lessonId
        })
    })
})

app.listen(8000, function() {
    console.log("App is listening at port 8000...")
})