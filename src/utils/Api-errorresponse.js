class errorresponse extends Error{
    constructor(message,stack,code){
        super()
        this.message=message
         this.stack = []
          this.code = code
          
    }
}

export {errorresponse}