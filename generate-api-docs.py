#!/usr/bin/env python3
"""
Generate beautiful API documentation for GitHub from swagger.json
This script creates a comprehensive markdown documentation with collapsible sections
"""
import json
from collections import defaultdict
from datetime import datetime

# Read swagger.json
with open('swagger.json', 'r') as f:
    swagger = json.load(f)

# Extract info
info = swagger.get('info', {})
title = info.get('title', 'API')
version = info.get('version', '0.0.0')

# Group endpoints by tags
endpoints_by_tag = defaultdict(list)
total_public = 0
total_protected = 0

for path, methods in swagger['paths'].items():
    for method, details in methods.items():
        tags = details.get('tags', ['Other'])
        tag = tags[0] if tags else 'Other'
        
        # Determine if authentication is required
        security = details.get('security', [])
        auth_required = security is not None and len(security) > 0
        
        if auth_required:
            total_protected += 1
        else:
            total_public += 1
        
        # Get summary and responses
        summary = details.get('summary', '')
        
        endpoints_by_tag[tag].append({
            'method': method.upper(),
            'path': path,
            'summary': summary,
            'auth': '🔒 **Protected**' if auth_required else '🌐 **Public**',
            'auth_icon': '🔒' if auth_required else '🌐'
        })

# Generate markdown
tag_names = {
    'auth': ('🔐 Authentication', '/api/auth'),
    'users': ('👥 Users', '/api/user'),
    'lesson': ('📚 Lessons', '/api/lesson'),
    'learning-module': ('📖 Learning Modules', '/api/learning-module'),
    'subscription': ('💳 Subscriptions', '/api/subscription'),
    'lesson-progress': ('📊 Lesson Progress', '/api/lesson-progress'),
    'video': ('🎥 Videos', '/api/video')
}

output = []

# Header
output.append('<div align="center">\n')
output.append('# 📚 Pivovarov Academy API\n')
output.append('### Complete API Reference & Documentation\n')
output.append('[![Version](https://img.shields.io/badge/version-' + version + '-blue.svg)](./package.json)')
output.append('[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-6BA539?logo=openapiinitiative)](./swagger.json)')
output.append('[![Endpoints](https://img.shields.io/badge/endpoints-' + str(total_public + total_protected) + '-green.svg)](#api-endpoints)\n')
output.append('</div>\n')
output.append('---\n')

# Overview
total_endpoints = sum(len(v) for v in endpoints_by_tag.values())
output.append('## 📊 Overview\n')
output.append('<table>')
output.append('  <tr>')
output.append('    <td align="center" width="25%">')
output.append(f'      <h3>{total_endpoints}</h3>')
output.append('      <sub>Total Endpoints</sub>')
output.append('    </td>')
output.append('    <td align="center" width="25%">')
output.append(f'      <h3>{total_public} 🌐</h3>')
output.append('      <sub>Public</sub>')
output.append('    </td>')
output.append('    <td align="center" width="25%">')
output.append(f'      <h3>{total_protected} 🔒</h3>')
output.append('      <sub>Protected</sub>')
output.append('    </td>')
output.append('    <td align="center" width="25%">')
output.append(f'      <h3>{len(endpoints_by_tag)}</h3>')
output.append('      <sub>Modules</sub>')
output.append('    </td>')
output.append('  </tr>')
output.append('</table>\n')

# Quick Navigation
output.append('## 🔗 Quick Navigation\n')
output.append('| Resource | Description | Link |')
output.append('|----------|-------------|------|')
output.append('| 🎨 **Interactive Editor** | Test API in browser | [Open Swagger Editor →](https://editor.swagger.io/?url=https://raw.githubusercontent.com/ArtyomPivovarov/pivovarov.academy.back/main/swagger.json) |')
output.append('| 🚀 **Local Swagger UI** | When app is running | [http://localhost:4200/api →](http://localhost:4200/api) |')
output.append('| 📋 **OpenAPI Spec** | Download JSON | [swagger.json →](./swagger.json) |')
output.append('| 📖 **Main README** | Project overview | [README.md →](./README.md) |\n')
output.append('---\n')

# Table of Contents
output.append('## 📑 Table of Contents\n')
for tag in ['auth', 'users', 'lesson', 'learning-module', 'subscription', 'lesson-progress', 'video']:
    if tag not in endpoints_by_tag:
        continue
    tag_name, _ = tag_names.get(tag, (tag.title(), ''))
    tag_link = tag_name.lower().replace(' ', '-')
    endpoint_count = len(endpoints_by_tag[tag])
    output.append(f'- [{tag_name}](#{tag_link}) `{endpoint_count} endpoints`')
output.append('\n---\n')

# Endpoints
for tag in ['auth', 'users', 'lesson', 'learning-module', 'subscription', 'lesson-progress', 'video']:
    if tag not in endpoints_by_tag:
        continue
    
    endpoints = endpoints_by_tag[tag]
    tag_name, base_path = tag_names.get(tag, (tag.title(), ''))
    
    # Count public/protected
    public_count = sum(1 for e in endpoints if '🌐' in e['auth'])
    protected_count = sum(1 for e in endpoints if '🔒' in e['auth'])
    
    output.append(f'## {tag_name}\n')
    output.append(f'> **Base Path**: `{base_path}`  ')
    
    if public_count > 0 and protected_count > 0:
        output.append(f'> **Total Endpoints**: {len(endpoints)} ({public_count} public, {protected_count} protected)\n')
    elif public_count > 0:
        output.append(f'> **Total Endpoints**: {len(endpoints)} (all public)\n')
    else:
        output.append(f'> **Total Endpoints**: {len(endpoints)} (all protected)\n')
    
    output.append('<details open>' if tag == 'auth' else '<details>')
    output.append(f'<summary><b>📋 {tag_name} Endpoints</b></summary>\n')
    
    for i, endpoint in enumerate(sorted(endpoints, key=lambda x: (x['path'], x['method']))):
        if i > 0:
            output.append('---\n')
        
        output.append(f'### {endpoint["method"]} `{endpoint["path"]}`')
        output.append(f'{endpoint["auth"]} | {endpoint["summary"] or "No description"}\n')
    
    output.append('</details>\n')
    output.append('---\n')

# Authentication section
output.append('## 🔑 Authentication\n')
output.append('All protected endpoints require JWT token in the `Authorization` header:\n')
output.append('```http')
output.append('Authorization: Bearer <your_jwt_token>')
output.append('```\n')
output.append('### Getting a Token\n')
output.append('1. **Register**: `POST /api/auth/register`')
output.append('2. **Verify Email**: `POST /api/auth/verify-email`')
output.append('3. **Login**: `POST /api/auth/login` → Returns `access_token`')
output.append('4. **Use Token**: Include in all protected requests\n')
output.append('---\n')

# Response Codes
output.append('## 📌 Response Codes\n')
output.append('| Code | Description |')
output.append('|------|-------------|')
output.append('| `200` | OK - Request succeeded |')
output.append('| `201` | Created - Resource created |')
output.append('| `400` | Bad Request - Invalid input |')
output.append('| `401` | Unauthorized - Missing or invalid token |')
output.append('| `403` | Forbidden - Insufficient permissions |')
output.append('| `404` | Not Found - Resource doesn\'t exist |')
output.append('| `409` | Conflict - Resource already exists |')
output.append('| `500` | Internal Server Error |\n')
output.append('---\n')

# Development Tools
output.append('## 🛠️ Development Tools\n')
output.append('### Export Swagger Documentation')
output.append('```bash')
output.append('# Start the application first')
output.append('pnpm run start:dev\n')
output.append('# Export swagger.json')
output.append('pnpm run export:swagger')
output.append('```\n')
output.append('### Regenerate This Documentation')
output.append('```bash')
output.append('pnpm run docs:api')
output.append('```\n')
output.append('---\n')

# Footer
output.append('<div align="center">\n')
output.append('### 📝 Additional Resources\n')
output.append('[Main README](./README.md) • [OpenAPI Spec](./swagger.json) • [Swagger Editor](https://editor.swagger.io/?url=https://raw.githubusercontent.com/ArtyomPivovarov/pivovarov.academy.back/main/swagger.json)\n')
output.append('---\n')
output.append(f'**Last Updated**: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}  ')
output.append(f'**API Version**: {version}\n')
output.append('</div>')

# Write to file
with open('API_DOCUMENTATION.md', 'w', encoding='utf-8') as f:
    f.write('\n'.join(output))

print("✅ API documentation generated: API_DOCUMENTATION.md")
print(f"📊 Statistics:")
print(f"   - Total endpoints: {total_endpoints}")
print(f"   - Public: {total_public}")
print(f"   - Protected: {total_protected}")
print(f"   - Modules: {len(endpoints_by_tag)}")
