# 10-finger
## Setup and run

First thing you will have to do is install node v14.15.5 and npm 6.14.4. Depending on your choices and operating system the process might be diferent for you, but you mainly have 2 options:

- install from the official source https://nodejs.org/en/download/
- use nvm to manage the node instalation

### Installing node via nvm

Depending on your os you can follow the guide here https://github.com/nvm-sh/nvm/blob/master/README.md#install--update-script

If you have osx/linux with bash, you can just run this command that downloads the installer and runs it.
`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.36.0/install.sh | bash`

After you have nvm installed you need to install the proper node version:
`nvm install 14.15.5`

In order to select what version you want to use (if you have the default one set to another version) run
`nvm use 14.15.5`

Also a good ideea is to add an alias to the version for this project and just use the alias (so you don't have to remember the exact version)
`nvm alias 10-finger 14.15.5`

Now you can use `nvm use 10-finger` instead of `nvm use 14.15.5`

**Notice**: You need to run the `nvm use` comand each time you open a new terminal/console (or you can add it to your startup script if it applies).

### Installing necessary libraries

After you have cloned the repo and install node, it is time to install all the software libraries and dependecies locally by running

`npm i`

This will install everything in the `package.json` file.

### Runing the app

You can now run the app by runing.
`ng serve`

### Runing tests

To run the tests you can use.

`ng test`

### Running lint

To run lint verification.

`ng lint`

### Environments

We have 4 environments: localhost, dev, test and production.

Localhost is simply local testing.

Developers environment which can be used for testing is https://10-finger-dev.com/ . Anything merged into develop branch will automatically be pushed here.

The test environment is primarily used for demonstrations and testing. It should not be used by developers unless first inquiring to do so. In order to build for https://10-finger-test.com/ a tag should be applied and pushed on any branch.

Production environment is for production and updating it is done manually through azure.

## Branch naming

Branch name should be: feature/[description]-[task-id].

**Example: Create local branch**:

```
git checkout -b feature/userLogin-4
```

## Review process

All code going into main will be submitted to a review process and will need to be approved before any merge. Following is expected of the code:

- Code style guidelines are followed.
- Project can build and run.
- Lint is passing without any issues.
- Alle new files contain tests (preferably also all new functions)
- All test are passing without any issues.

### Code style guidelines

We follow [Angular](https://angular.io/guide/styleguide) styleguide.

Especially focus on following:

- Do not use `any` unless it is VERY important.
- Avoid methods longer than 50 lines.

### Documentation guidelines

Documentation is expected to be used extensively. No methods or classes/components are to be left out without documentation. No complex part of the code are to be left without comments explaining what is done and why.

Documentation should be meaningful text in english explaining intent and purpose. All documentation should adhere to standard grammar rules and should be viewed as short sentences. First letter should be uppercased and sentences should end with periods.

**Example**:

```
/**
 * Gets the full name of the user.
 *
 * @param firstName First Name of the user.
 * @param lastName Last Name of the user.
 *
 * @return Fullname of the user.
 */
getFullName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`;
}
```
