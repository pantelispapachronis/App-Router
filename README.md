## SUMMARY

1. **Created a database** in the same region as our application code to reduce latency between our server and database.

2. **Fetched data on the server** with React Server Components. This allows us to keep expensive data fetches and logic on the server, reduces the client-side JavaScript bundle, and prevents our database secrets from being exposed to the client.

3. **Used SQL** to only fetch the data we needed, reducing the amount of data transferred for each request and the amount of JavaScript needed to transform the data in-memory.

4. **Parallelized data fetching** with JavaScript - where it made sense to do so.

5. **Implemented Streaming** to prevent slow data requests from blocking our whole page, and to allow the user to start interacting with the UI without waiting for everything to load.

6. **Moved data fetching** down to the components that need it, thus isolating which parts of your routes should be dynamic.