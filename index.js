const http = require('http');
const fs = require('fs');
const url = require('url');
const { json } = require('stream/consumers');



http.createServer((req,res)=>{

    const parsedUrl = url.parse(req.url,true)

let products=fs.readFileSync('products.json','utf-8');

    if(parsedUrl.pathname=='/products'&& req.method=="GET" && parsedUrl.query.id==undefined){
        res.end(products)
        }
    else if(parsedUrl.pathname=='/products'&& req.method=="GET" && parsedUrl.query.id !=undefined){
        let productArray=JSON.parse(products)

        let product = productArray.find((product)=>{
            return product.id==parsedUrl.query.id})
        if(product!=undefined){
            res.end(JSON.stringify(product))
        }
        else{
            res.end(JSON.stringify({"Message":"Product not found"}))
        }
    }
    else if(parsedUrl.path=='/products'&& req.method=='POST'){
        let product = ""
       req.on("data",(chunk)=>{
        product=product+chunk
       })
        req.on("end",()=>{
            let productArray = JSON.parse(products)
            let newProduct =JSON.parse(product)
            
            productArray.push(newProduct)

            fs.writeFile('./products.json',JSON.stringify(productArray),(err)=>{
                if(err==null){
                    res.end(JSON.stringify({"Message":"Product is posted Successfully"}))
                }
            })
        })
    }
}).listen(8000)