const http = require('http');
const fs = require('fs');
const url = require('url');

http.createServer((req,res)=>{

    const parsedUrl = url.parse(req.url,true)
    

let products=fs.readFileSync('products.json','utf-8');

res.setHeader("Access-Control-Allow-Origin","*")
    res.setHeader("Access-Control-Allow-Headers","*")
    res.setHeader("Access-Control-Allow-Methods","GET,PUT,POST,PATCH,DELETE,OPTIONS")

    if(req.method=="OPTIONS"){
        res.end();
    }
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
                else{
                    res.end(JSON.stringify({"Message":"ohh! Product not posted"}))
                }
            })
        })
    }

    else if(parsedUrl.pathname=="/products" && req.method=="PUT"){
        let product = ""
        req.on("data",(chunk)=>{
            product = product + chunk
        })
        req.on("end",()=>{
            let productArray = JSON.parse(products)
            let newProduct = JSON.parse(product)

        let index=productArray.findIndex((product)=>{
            return product.id==parsedUrl.query.id
        })
        if(index !==-1){
            productArray[index]=newProduct
            fs.writeFile("products.json",JSON.stringify(productArray),(err)=>{
                if(err==null){
                    res.end(JSON.stringify({'message':"Product Successfully updated"}))
                }
                else{
                    res.end(JSON.stringify({"Message":"Some Problem"}))
                }
            })
        }
        else{
            res.end(JSON.stringify({"Message":"Product for given id is not found"}))
        }
        })  
    }
    else if(parsedUrl.pathname=="/products" && req.method=="DELETE"){
        let productArray=JSON.parse(products)
        let index = productArray.findIndex((product)=>{
            return product.id==parsedUrl.query.id
        })
        if(index!=-1){
            productArray.splice(index,1)
            fs.writeFile("./products.json",JSON.stringify(productArray),(err)=>{
                if(err==null)(
                    res.end(JSON.stringify({"Message":"Product Deleted successfully"}))
                )
                else{
                    res.end(JSON.stringify({"Message":"Facing issue"}))
                }
            })
        }
        else 
        {
            res.end(JSON.stringify({"message":"The element with given id is not there"}))
        }

    }
    
}).listen(8000)