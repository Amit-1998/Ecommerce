class ApiFeatures{
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr
    }

    // this.query => is our Product(model)
    // api ka search feature
    search(){
        const keyword = this.queryStr.keyword
        ?{
            name: {
                $regex: this.queryStr.keyword,
                $options: "i",
            },
          }
        :{};

        // console.log(keyword);

        this.query = this.query.find({ ...keyword }); // jo keyword hamne uper se bnaya 
        return this; // search function will return this means yhi class vapas se return kar denge
    }
    
    // we are building filter for category
    filter(){
        const queryCopy = { ...this.queryStr };
        // Removing some fields for category
        
        const removeFields = ["keyword", "page", "limit"];
        
        removeFields.forEach((key) => delete queryCopy[key]);
        
        // filter for price & rating 
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
        
        // this.query = this.query.find(queryCopy);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage-1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }    
}

module.exports = ApiFeatures;