import { JwtPayload } from './../../../../node_modules/@types/jsonwebtoken/index.d';
import  httpStatus  from 'http-status';
import AppError from "../../errors/AppError"
import { User } from "../user/user.model"
import { IUser, IUserMethods } from '../user/user.interface';
import { HydratedDocument } from 'mongoose';
import { createToken, verifyToken } from './auth.utils';
import config from '../../config';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';


const userLoginDB = async(email:string,password:string)=>{
    const user= await User.findOne({ email }).select('+password');
    
    if (!user ) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }

    
    
    
    const JwtPayload = {
        userId:user.email,
        role:user.role
    }
    const accessToken = createToken(
        JwtPayload,
        config.accessToken as string,
        config.accessTokenExpire as string);
   
   
        const refreshToken =createToken(JwtPayload,
            config.refreshToken as string,
            config.refreshTokenExpire as string) 

        return {accessToken,refreshToken}
}


const forgetPasswordDB = async(email:string)=>{
    const user = await User.findOne({
      email
    })
    
    if(!user){
      throw new AppError(httpStatus.NOT_FOUND,"This email have no accounts")
    }
   
    console.log(user.email);
    const JwtPayload = {
      userId:user.email,
      role:user?.role
    }

    const resetTokon = createToken(
      JwtPayload,
      config.jwtToken as string,
      config.jwtTokenExpire as string
    )
    console.log(`${config.resetLink}`);
    const resetLink = `${config.resetLink}?userId=${user._id}&token=${resetTokon}`
    console.log(resetLink);
}

const resetPasswordIntoDB= async(password:string,token:string)=>{
  let decoded;
  try {
    decoded = verifyToken(token,config.jwtToken as string)
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token');
  }
   
  
  const user = await User.findOne({
    email:decoded.userId
  })
  
  if(!user){
    throw new AppError(httpStatus.NOT_FOUND,"This email have no accounts")
  }
  


  if(decoded.userId !== user.email){
    throw new AppError(httpStatus.UNAUTHORIZED,"You are Forbidden")
  }

  const newPassword = await bcrypt.hash(password,Number(config.salt))

  await User.findOneAndUpdate({_id:user._id},{
    password:newPassword
  })
 
  return user;

 

    

}

const refreshTokenDB = async(token:string)=>{
  const decoded =  verifyToken(token,config.refreshToken as string)
  const {userId} = decoded;

  const user = await User.findOne({
    email:userId
  })
  if(!user){
    throw new AppError(httpStatus.NOT_FOUND,'User Not Found')
  }
 

 const jwtPayload = {
  userId:user.email,
  role:user.role
 }
 const accessToken = createToken(
  jwtPayload,
  config.accessToken as string,
  config.accessTokenExpire as string
 )
 return {accessToken};
}

export const AuthService={
    userLoginDB,
    forgetPasswordDB,
    resetPasswordIntoDB,
    refreshTokenDB
}