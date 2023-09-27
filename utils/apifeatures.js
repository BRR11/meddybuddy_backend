class Apifeatures{
    constructor(query,queryStr)
    {
        this.query = query;
        this.queryStr = queryStr;
    
    }


    search(){
        const keyword = this.queryStr.keyword?{
            name:{
                //regex == regular expression
                $regex: this.queryStr.keyword,
                //caseinsensitive
                $options: "i"
            }
        }:{}
        
        
        this.query = this.query.find(keyword);
        return this;
    }


    filter(){
        //Creating A Copy Of querystr object
        const queryCopy = {...this.queryStr};
        const removefields = ["keyword","page","limit"];
        
       

        removefields.forEach((key) => delete queryCopy[key]);
   

    // Filter For Price and Rating

     let queryStr = JSON.stringify(queryCopy);
     queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;

    }

    pagination(resultPerPage){
        
        const currPage = Number(this.queryStr.page)||1;
        const skip = resultPerPage*(currPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);


        return this;
    }
}

module.exports = Apifeatures