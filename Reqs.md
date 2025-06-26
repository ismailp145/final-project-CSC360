[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/qbAOVmAh)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=19437981)

# webdev_FinalProject

# Fill this out first

https://forms.office.com/r/2zyNMxJHd3

## Requirements

Choose a project that fulfills the following requirements:

	1. Front end must be a react application
 		a. We have not put a lot of time into CSS and Styling this quarter.  I do not expect your project to look perfect but I do expect effort to be put into the design.  Leverage Bootstrap as heavily as you can.
	2. Back end must be a dotnet mininimal api web application
		a. Must include GET, POST, PUT and DELETE api calls
	3. Must have data persistence to a database.  This can be a SQL lite database, MS SQL, MySQL, Mongo, etc.  You can use multiple databases if you'd like. 
	4. The Entity Framework must handle all communication between the dotnet application and the database
	5. Your application must have a login page with support of Oauth2.0 Authentication and handle multiple users.
		a. It should have a workflow for creating a new account
		b. Authenticating against that new account
		c. Being able to login with that new account
	6. Must have multiple pages and/or views
 		a. It must store state and context.  This can be implemented as user preferences or something like a shopping cart
	7. Project demo will be a video and submitted via D2L
		a. Submission will require a document or PowerPoint presentation describing your project
			i. Describe each of the above requirements and how your project meets them
			ii. Why did you choose this specific project
			iii. If you had more time, what would you do differently
		b. Project source code must be committed to GitHub.  If you submit a presentation but do not commit source code then you will receive a 0%.  


### Creating a Blogging / Social / Review site will require additional requirements for implementation in addition to the base requirements

- Landing Page [✅]
- Comments and Comment replies [✅]
- Topics or Categories [❌]
- Authenticated Protected Content [✅]
- User Preferences to track followed Topics / Categories [❌]
- Auth [✅]
	- Auth Signup [✅]
	- Auth Login [✅]
 	- Auth Signout [✅]
- Database [✅]
- User / Auth DB [✅]
- Posts DB [✅]

### After Finishing
- Demo [❌]
- Document / Powerpoint (In the github readme)[✅]

### TODO

1. End to End Signup and Login

2. Protected Content via Auth

3. End to End Posts

4. Follow Other Users

### Schema

User: Email, Username, Password, User ID, Friends, Posts

Posts: User, Content, Comments and Replies

- Post content : Text || Video || Image

- Comments : Text, and Replies to comments

Comments: User, Replies [Comments]

Friends: Userids
