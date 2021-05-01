# Smoothie Book

> A simple online smoothie recipe book - [smoothie-book.vercel.app](https://smoothie-book.vercel.app/)

**Table of Contents**

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Overview](#overview)
  - [Libraries](#libraries)
  - [CI/CD](#cicd)
- [Getting Started](#getting-started)
  - [Install Dependencies](#install-dependencies)
  - [Set Up MongoDB](#set-up-mongodb)
  - [Set Up Auth0](#set-up-auth0)
  - [Set Up Your Environment](#set-up-your-environment)
  - [Run the Application](#run-the-application)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Overview

This is a [Next.js](https://nextjs.org/) application deployed to [Vercel](https://vercel.com/), utilizing Next.js' API routes to interface with [MongoDB](https://www.mongodb.com/) for creating, reading, updating, and deleting smoothie recipes. User authentication is powered by [NextAuth.js](https://next-auth.js.org/) so that users may sign in and create their own recipes and access them across multiple browsers.

### Libraries

In addition to these technologies, the following libraries are also used in this project:

- [TypeScript](https://www.typescriptlang.org/) - Having static types and a compiler when working with JavaScript is very helpful in my opinion.
- [Chakra UI](https://chakra-ui.com/) - The React component library that makes this UI look nice.
- [react-query](https://react-query.tanstack.com/) - A powerful React hook library for data fetching and data synchronization that makes client-side fetching and handling the loading/success/error states much easier.
- [axios](https://github.com/axios/axios) - Chosen instead of the built-in [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) because I'm more familiar with axios and also more interested in making network requests to power the application instead of building a wrapper around `fetch()`. :smile:
- [react-hook-form](https://react-hook-form.com/) - A performant form library that handles validation and various other form states (and also one that I have been using a lot recently).
- [zod](https://github.com/colinhacks/zod/tree/v3) - Used throughout the app, this library is really handy for validating and casting unknown data types (e.g. stringly-typed form values, request bodies) with a great TypeScript developer experience.

### CI/CD

Upon a push or pull request to the `main` branch, a CI script powered by [GitHub Actions](https://github.com/features/actions) is run that ensures the TypeScript code compiles without errors. In addition, Vercel separately builds the app, and, when successfully built, deploys an application preview (on pull requests) or the production application (when code is pushed to the `main` branch).

## Getting Started

### Install Dependencies

In order to run this project locally, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/)
- [Yarn v1](https://classic.yarnpkg.com/lang/en/)
- [MongoDB](https://www.mongodb.com/)

### Set Up MongoDB

Ensure MongoDB is running by running `mongo` in a terminal, which should connect you to the default MongoDB shell at `mongodb://127.0.0.1:27017`. If this isn't working and you have a Mac like I do, try following [these steps to install MongoDB on macOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/).

### Set Up Auth0

Create an [Auth0 application](https://manage.auth0.com/dashboard) following some of the instructions on the [NextAuth.js Auth0 page](https://next-auth.js.org/providers/auth0).

When creating an application, make sure your **Allowed Callback URLs** includes http://localhost:3000/api/auth/callback/auth0 and the **Allowed Logout URLs** includes http://localhost:3000 for sign in and sign out to work as expected.

### Set Up Your Environment

At the root of this repository, create a `.env.local` file with the following environment variables:

```sh
# Your Auth0 Client ID
AUTH0_CLIENT_ID=""

# Your Auth0 Client Secret
AUTH0_CLIENT_SECRET=""

# Your Auth0 tenant domain
# example: smoothies.us.auth0.com
AUTH0_DOMAIN=""

# Your MongoDB connection string URI
# example: mongodb://localhost:27017/smoothies
DATABASE_URL=""

# The canoncial URL of your site
# Example for local development: http://localhost:3000
# Example for production: https://my-smoothie-site.com
# See https://next-auth.js.org/configuration/options#nextauth_url
NEXTAUTH_URL="http://localhost:3000"
```

### Run the Application

Run `yarn` to install all Node.js dependencies.

Run `yarn dev` to start the Next.js dev server, and visit http://localhost:3000 to view the application in your browser.
