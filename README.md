To Launch Project:

Pull down the repo.
Open a terminal and run "npm install" to get the needed dependencies.
CD to app_admin and run "npm install" once more.
The Admin Angular portion of the project will be run by navigating to the app_admin folder and typing "npx ng serve" or "ng serve"
The other portion of the project can be run from the main directory in another terminal by running "npm start".
Both portions of the project need to be run for this to run smoothly as the Angular portion serves up some portions of the project.

The admin portal is available on localhost:4200
The customer facing project is available at localhost:3000

The JWT secret is not provided. You will need to make your own and submit it in the base folder of the project with the file name ".env"


***FROM ORIGINAL PROJECT***

In this project, I worked with two unique types of frontends. Express and Angular. The Express based frontend for the customer facing portion of the application followed a more traditional style approach to web development. Each route returned a complete HTML page that needed to be loaded in each time a view was switched. The Angular based administration SPA was used for a much more dynamic and fluid user experience. It enabled the application to swap between views more quickly and served as an interesting comparison piece to the more traditional Express approach. 

The backend used MongoDB because we did not necessarily need to adhere to a strict SQL data structure. This flexibility allows us to create different types of trips under the same umbrella with varying structures. This is especially useful when booking different types of trips where different modes of travel are needed and the structure might be all over the place.

JSON objects typically have stricter rules than your typical javascript object. While javascript objects can contain anonymous functions or undefined values, JSON must contain strictly data. MongoDB uses JSON to store things within the database and so this made the choice of MongoDB a safe choice when working within a largely javascript (really typescript but who is counting) oriented project.

I found an opportunity to refactor some code to include API calls to the backend to get all of the trips data. This included forming a component which can be reused on several pages with a different API call if it was deemed necessary to show that information in a similar way. Having components instead of static webpages is very handy not only in SPAs but in Express or more traditional types of web development. This helps to have most of the code in one place for easier maintenance and easier development in the future. 

In a full stack application, testing REST endpoints involves making sure that each route performs its intended action. Get for retrieving data, POST for creating new data, PUT for updating data, or DELETE for erasing some data. Tools like Postman are a godsend for testing API calls to differing endpoints with varying sets of data. With secured endpoints like /login a JWT token had to be attached in order for the call to be validated properly and do what it was supposed to. This token had to persist and validate certain user interactions throughout the entire application. Adding in this authorization step across the application introduced a new set of tests that had to be run. Using Postman, I was able to validate that my application was sending the correct codes for each successful or unsuccessful interaction.

Being a full-stack developer is always preferable overall to one that is more niche. Employers want their prospective employees to wear multiple hats over the course of their career. Having experience creating a full stack application is a great overall way to break into the field where getting your foot in the door can be notoriously hard. I've learned a great deal about how this particular stack operates and that will translate to other stacks very well. Learning the foundational knowledge of how on stack works enables you to see the overall bigger picture in a similar stack and from there you're able to understand it better and faster.
