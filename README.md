# Finnplay test task for front-end developer

## Task

You need to develop an application that allows users to filter games by multiple criteria.

## Description

The application consists of a server and a client. The server implements an API to communicate with the client (authenticate users, transfer data, ...).
The client has two different views depending on a user role. If a user logs in as `player` they will see an interface with a list of games and a game filter. If a user logs in as `admin` they will see an interface with three different lists: games, game providers and game groups. This interface also allows administrators to manage groups.

## Pages

#### Login

Two users are allowed:

-   `admin:admin`
-   `player:player`

#### Admin page

The page displays all the entities in the application: games, game groups and game providers.

##### Possible actions

1. Add a new game group
1. Update an existing game group: change name, change list of games
1. Delete a game group. It's possible to transfer all the games of the group to another.

#### Player page

The page displays the list of games and the game filter. If a filter is configured, only games that match the filter criteria should be displayed, otherwise all games should be displayed. `Games that don't belong to any group shouldn't be displayed at all, even if the filter is not configured`

##### Possible actions

1. Set filter
1. Set sorting
1. Set number of columns in the game list (hidden on mobile, always 2 columns)
1. Reset filter

##### Filter criteria

-   the name of a game (input field)
-   game provider (multiple checkbox)
-   game groups (multiple checkbox)

## Requirements

1. Client-side should be written using React. You can use any starter kit if you want, like [Create React App](https://create-react-app.dev/) or [Vite](https://vitejs.dev/)
2. You can use CSS or SCSS for styles
3. Interface should be responsive. Mobile breakpoint is `428px`
4. Filtration should be implemented on the client
5. Please, do not use any UI libraries for React, except [react-select](https://react-select.com/)
6. Server-side should be written on Node.js using any frimework you like.
7. User sessions should be stored on the server (in memory)
8. All updates of game groups should be stored until the server is restarted
9. No database is required. Keep all data in memory
10. Using TypeScript will be considered a plus
11. Post your code to github or bitbucket. Add readme how to run the application

**Initial data is in `data.json` file**

## Info

There are two projects (backend and frontend). Backend project is Node.js server based on Express (finplay-backend). Frontend project is React-client project (finplay-frontend). Follow to Readme files in this projects.
