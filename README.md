## Branch Creation

To create a new branch, use the following Git alias command instead of Git's built-in branch creation features:

```sh
git config --global alias.branch-create '!bash /path/react-structure/branch-create.sh'
git branch-create
```

This command uses a custom script to create branches and should be used for all branch creation tasks.

# React Structure

## Setup

After setting up the project, you can use Husky for managing Git hooks.

### Husky

Husky is already configured in the project. To install Husky hooks, run:

```sh
npm run prepare
```

This will set up the Git hooks defined in the `.husky` directory.

### Creating Commits

You can create commits using the CLI with Commitizen. To create a commit, run:

```sh
git commit
```

This will guide you through the commit creation process with a series of prompts.

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the project.
- `npm run lint`: Lints the project files.
- `npm run prepare`: Sets up Husky Git hooks.
- `npm run preview`: Previews the built project.

For more information, refer to the respective documentation of each tool.
