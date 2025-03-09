#!/bin/bash

# JIRA API Settings
JIRA_DOMAIN="https://yourcompany.atlassian.net"
JIRA_USERNAME="your-email@example.com"
JIRA_API_TOKEN="your-api-token"
JIRA_PROJECT_KEY="PROJ"

BRANCH_TYPES=("feat" "bugfix" "hotfix" "refactor" "test" "docs" "ci")

# Ask the user to select the branch type
echo "Please select the branch type:"
for type in "${BRANCH_TYPES[@]}"; do
    echo "- $type"
done

while true; do
    read -p "Enter the branch type: " BRANCH_TYPE
    # Validate the entered value
    if [[ " ${BRANCH_TYPES[*]} " == *" $BRANCH_TYPE "* ]]; then
        break
    else
        echo "Invalid option. Please enter a value from the list."
    fi
done

# Ask the user to enter the JIRA task ID
read -p "Please enter the JIRA task ID (e.g., 1234): " TASK_NUMBER

# If the task number is empty, throw an error
if [[ -z "$TASK_NUMBER" ]]; then
    echo "❌ Please enter a valid JIRA task ID!"
    exit 1
fi

# Create the branch name
BRANCH_NAME="${BRANCH_TYPE}/JIRA-${TASK_NUMBER}"

# Check if the JIRA task exists
RESPONSE=$(curl -s -u "$JIRA_USERNAME:$JIRA_API_TOKEN" \
    -X GET "$JIRA_DOMAIN/rest/api/3/issue/JIRA-${TASK_NUMBER}")

if echo "$RESPONSE" | grep -q "errorMessages"; then
    echo "❌ JIRA task ID (JIRA-${TASK_NUMBER}) not found! This branch cannot be created."
    exit 1
fi

# If everything is okay, create the branch
git checkout -b "$BRANCH_NAME"
echo "✅ Branch successfully created: $BRANCH_NAME"
