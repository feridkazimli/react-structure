#!/bin/bash

# JIRA API Ayarları
JIRA_DOMAIN="https://yourcompany.atlassian.net"
JIRA_USERNAME="your-email@example.com"
JIRA_API_TOKEN="your-api-token"
JIRA_PROJECT_KEY="PROJ"

# Kullanıcıdan branch ismi al
BRANCH_NAME="$1"

# Eğer branch adı boşsa hata ver
if [[ -z "$BRANCH_NAME" ]]; then
    echo "❌ Lütfen bir branch adı girin! Örnek: feature/JIRA-1234"
    exit 1
fi

# Branch ismi regex kontrolü
if [[ ! "$BRANCH_NAME" =~ ^(feature|bugfix|hotfix)/JIRA-[0-9]+$ ]]; then
    echo "❌ Geçersiz branch formatı! Doğru format: feature/JIRA-1234"
    exit 1
fi

# JIRA Task ID'yi al
TASK_ID=$(echo "$BRANCH_NAME" | grep -o "JIRA-[0-9]\+")

# JIRA'da task var mı?
RESPONSE=$(curl -s -u "$JIRA_USERNAME:$JIRA_API_TOKEN" \
    -X GET "$JIRA_DOMAIN/rest/api/3/issue/$TASK_ID")

if echo "$RESPONSE" | grep -q "errorMessages"; then
    echo "❌ JIRA task ID ($TASK_ID) bulunamadı! Bu branch oluşturulamaz."
    exit 1
fi

# Eğer her şey uygunsa branch oluştur
git checkout -b "$BRANCH_NAME"
echo "✅ Branch başarıyla oluşturuldu: $BRANCH_NAME"
