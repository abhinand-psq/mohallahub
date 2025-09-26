import mongoose, {Schema,model} from "mongoose";

const testschema = new Schema({
name:{
    type:String,
    lowercase:true,
    required:true,
    default:'no_name'
},
email:{
    type:String,
    required:[true,'email must be provided']
}
})

testschema.methods.sample = function(){

}

export const testmodel = mongoose.model('testschema',testschema)
