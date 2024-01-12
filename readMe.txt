		Thank you for giving me this opportunity,I have tried all the tasks you provided.

1. signup api 

 - Checks if a user with the provided email already exists.
 - Hashes the password using bcrypt.
 - Creates a new user with the hashed password.
 - Generates a JWT token containing the user's email and ID.
 - Responds with the user information and the generated token.

2. signin api

 - Finds the user based on the provided email.
 - Compares the provided password with the hashed password stored in the database using     	bcrypt.
 - If the passwords match, generates a JWT token for authentication.
 - Responds with a success message and the generated token.

3. forgot password api

 - Finds the user based on the provided email.
 - Generates a reset token using JWT with a short expiration time (1 hour).
 - Updates the user document with the reset token and expiration timestamp.
 - Responds with the generated reset token.

4. reset password api

 - Finds the user based on the provided reset token and checks if the token is still 	valid (not expired).
 - If the user is found and the reset token is valid, updates the user's password  	with the new hashed password.
 - Clears the reset token and expiration fields.
 - Responds with a success message.
 // i'm not able to do the last task