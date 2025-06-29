import * as dotenv from 'dotenv'
dotenv.config()

export default {
    port:process.env.port,
    database_url:process.env.database_url,
   
    accessToken:process.env.accessToken,
    accessTokenExpire:process.env.accessTokenExpire,
    refreshToken:process.env.refreshToken,
    refreshTokenExpire:process.env.refreshTokenExpire,
    jwtToken:process.env.jwtToken,
    NODE_ENV:process.env.NODE_ENV,
    salt:process.env.salt,
    jwtTokenExpire:process.env.jwtTokenExpire,
    resetLink:process.env.resetLink,
    resetSecrect:process.env.resetSecrect,
    cloud_name:process.env.cloud_name,
    cloud_api:process.env.cloud_api,
    cloud_secrect:process.env.cloud_secrect,
    store_id:process.env.store_id,
    store_pass:process.env.store_password,
    store_url:process.env.store_url,
    success_url:process.env.success_url,
    ssl_store_id:process.env.ssl_store_id,
    ssl_store_pass:process.env.ssl_store_pass,
    ssl_store_url:process.env.ssl_store_url

}