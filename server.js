const http = require("http"); //importing the html libary?
const fs = require('fs'); //imports the file systems handing libaray
const port = 3000;  //this is our port number, its like the radio frequency you tune into to listien to a music station
const path = require('path');  //specify the directory location
const { parse } = require('querystring');
const fileName = 'saved_text.json';

//author Dyllin Wood

const server = http.createServer(function(req,res)
{
    //writehead pramas (status code, different headers you want to set)
    //status code 200 means that everything went well
    //'content-type': 'text/html' tells the head that we are trying to write an html file to it
    //'content-type refers to the content that the header is going to inturpt as the formating for the file on the server?

    //req = request
    //res = response

    if(req.method == "GET")
    {
        fs.access(fileName, fs.constants.F_OK, (err) => {
            if (err)
                throw err;
            else {
                fs.readFile(fileName, 'utf-8', (err, data) => {
                if (err) 
                    throw err;
                const savedData = JSON.parse(data);
                const text = savedData.text;
                const timestamp = savedData.timestamp;
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(`
                    <form onAction="localhost:3000" method="post">
                        <div>
                        <label for="tAreaValue" name="tAreaLabel" id="tAreaLabel">Type something in here</label>
                        </div>
                        <div>
                        <textarea name="text" placeholder="type things in here"></textarea>
                        </div>
                        <div>
                        <button type="submit">Save</button>
                        </div>
                    </form>
                    <div>
                        <label>Last saved at ${timestamp}</label>
                    </div>
                    <div>
                        <label>Last textArea = ${text}</label>
                    </div>
                    `);
                res.end();
                });
            }
        });



        //last step, fucking up chapter 2
        
        //console.log("fuck,if we are in here");
    }
    
    /*
    fs.readFile('index.html', function(error, data)
    {
        //data is a varible of all the data the is grabed from reading the file in question. in this case our index html file
        if(error) //checks if there was an error in the file reading
        {
            //status code 404 means the thing that you were trying to find could not be found
            res.writeHead(404);
            res.write("Error: File Not Found");
        }
        else
        {
            res.write(data);
        }
        res.end();
    });
    */

    if(req.method == "POST")
    {
        const chunks = [];
        req.on("data", (chunk) =>
        {
            chunks.push(chunk).toString();

        });
        req.on("end", () =>
        {
            //console.log("all parts/chuncks have arrived");
            const data = Buffer.concat(chunks); //where we are going to push data onto
            const christanData = data.toString();
            let splitThatShit = christanData.split("=");
            let text = splitThatShit[1];
            //console.log("data = " + data.toString());

            console.log(splitThatShit[1]);

            //the lines above gets us our post request's data in a querystring format. now we have convert the query string into an array of string pairs,
            //which represent the data we are posting through



            const timestamp = new Date().toISOString();
            const dataToSave = JSON.stringify({text, timestamp});
            //console.log(dataToSave);

            //now its time to save the data
            //i could make this into fs.appendFile so that we don't lose any data?
            fs.writeFile(fileName, dataToSave, (error) =>
            {
                if(error)
                {
                    res.writeHead(302, {'Location': '/'});  //dose this create the file?
                    res.end();    
                    throw error;
                }
            });
   



            /*
            let dataObj = [];

            for(var pair of parsedData.entries())
            {
                console.log(pair[0]);
                console.log(pair[2]);
                dataObj[pair[0]] = pair[1];
            }
            */
            //console.log(parsedData.entries());
            //console.log("DataObj: ", dataObj);
        });
        res.end();
        
    }
    

    //res.end();
});

server.listen(port, function(error) //this is an event that listiens for a request to connect to the server by the client
{
    if(error) //if request to the server is a failure then this is done
    {
        console.log("something went wrong", error);
    }
    else //if request to the sever is a sucess then this is done
    {
        console.log("server is listening on port " + port);
    }
})