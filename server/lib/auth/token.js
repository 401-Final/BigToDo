const jwt = require( 'jsonwebtoken' );
const sekrit = process.env.APP_SECRET || 'changemenow';

module.exports = {
  sign ( user ) {
    return new Promise( ( resolve, reject ) => {
            
      jwt.sign({ 
        id: user.id,
        roles: user.roles  
      }, sekrit, null, ( err, token ) => {
        if ( err ) return reject( err );
        resolve( token );
      });
        
    });
  },
    
  verify ( token ) {
    return new Promise( ( resolve, reject ) => {

      jwt.verify( token, sekrit, ( err, payload ) => {
        if ( err ) return reject( err );
        resolve( payload );
      });
            
    });
  }
};