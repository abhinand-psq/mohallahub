export const checkmiddleware = (req,res,next) =>{
try{
let a = 10
if(a < 4){
    throw new Error('df')
}
next()
}catch(e){
    throw new Error(e)
}
}