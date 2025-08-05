# Bulk Contributor Assignment - Kontent.ai Custom App

A custom app for Kontent.ai that allows editors to assign content creators as contributors to content items in bulk. This app uses the Subscription API to get user information and the Management API to update content items with contributor assignments.

## Features

- **Bulk Assignment**: Assign multiple contributors to multiple content items at once
- **User Management**: Browse and select users from your Kontent.ai subscription
- **Content Filtering**: Search and filter content items by type and name
- **Real-time Results**: See assignment results with success/error status
- **Modern UI**: Clean, responsive interface with intuitive navigation

## Prerequisites

- Kontent.ai account with Enterprise or Flex plan
- Subscription API key (for user management)
- Management API key (for content item updates)
- Environment ID (for project access)
- Subscription ID (for subscription access)
- Content items with a "contributors" field in your content model

## Setup Instructions

### 1. Get Your API Keys and IDs

#### Subscription API Key
1. Go to Kontent.ai
2. Click your initials in the bottom left corner
3. Click **Subscriptions**
4. Select your subscription
5. In **Subscription API**, copy the API key

#### Management API Key
1. Go to Kontent.ai
2. Click your initials in the bottom left corner
3. Click **API Keys**
4. Create a new Management API key or copy an existing one

#### Environment ID
1. Go to your Kontent.ai project
2. Look at the URL: `https://app.kontent.ai/projects/{environment-id}`
3. Copy the environment ID from the URL
4. Or find it in Project settings → General → Environment ID

#### Subscription ID
1. Go to Kontent.ai
2. Click your initials in the bottom left corner
3. Click **Subscriptions**
4. Select your subscription
5. Copy the Subscription ID from the URL or subscription details

### 2. Content Model Setup

Ensure your content types have a "contributors" field. This field should be:
- Type: Text (multiple values)
- Codename: `contributors`
- Used to store contributor email addresses

### 3. Install Dependencies

```bash
npm install
```

### 4. Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 5. Production Build

```bash
npm run build
```

### 6. Deployment

Deploy the built files to a web server or hosting service (Netlify, Vercel, etc.) that supports HTTPS.

### 7. Add to Kontent.ai

1. In Kontent.ai, navigate to **Environment settings** → **Custom apps**
2. Click **Create new custom app**
3. Enter the app name: "Bulk Contributor Assignment"
4. Enter your hosted URL (HTTPS required)
5. Select roles that can use this app
6. Click **Save changes**

## Usage

### First Time Setup

1. Open the custom app in Kontent.ai
2. Enter your Subscription API key, Management API key, Environment ID, and Subscription ID
3. Click **Save** to initialize the app

### Assigning Contributors

1. **Select Content Items**: Browse and select the content items you want to assign contributors to
2. **Select Contributors**: Choose the users who will be assigned as contributors
3. **Review & Assign**: Review the assignment summary and click "Assign Contributors"
4. **Monitor Results**: View the results of your assignments with success/error details

### Features

- **Search & Filter**: Find content items and users quickly with search functionality
- **Bulk Selection**: Select all items or users with one click
- **Assignment Summary**: See exactly how many assignments will be made
- **Error Handling**: Detailed error messages for failed assignments
- **Retry Failed**: Retry failed assignments without re-selecting everything

## API Integration

This app integrates with two Kontent.ai APIs:

### Subscription API
- **Endpoint**: `https://manage.kontent.ai/v2/subscriptions/{subscription-id}`
- **Purpose**: Retrieve user information (names, emails)
- **Authentication**: Bearer token (Subscription API key)

### Management API
- **Endpoint**: `https://manage.kontent.ai/v2/projects/{environment-id}`
- **Purpose**: Update content items with contributor assignments
- **Authentication**: Bearer token (Management API key)

## Security Considerations

- API keys are stored only in browser memory (not persisted)
- All API calls use HTTPS
- The app runs in a sandboxed iframe within Kontent.ai
- No sensitive data is logged or stored

## Troubleshooting

### Common Issues

1. **"Failed to fetch users"**
   - Check your Subscription API key
   - Verify your Subscription ID is correct
   - Ensure you have Enterprise or Flex plan
   - Verify the API key has not expired

2. **"Failed to fetch content items"**
   - Check your Management API key
   - Verify your Environment ID is correct
   - Ensure the key has access to the current environment
   - Verify the environment ID matches your project

3. **"Failed to assign contributors"**
   - Check that content items have a "contributors" field
   - Verify the field codename is exactly "contributors"
   - Ensure you have write permissions to the content items

4. **App not loading in Kontent.ai**
   - Verify the app URL is accessible via HTTPS
   - Check that the app is properly deployed
   - Ensure the app is added to the correct environment

### Debug Mode

To enable debug logging, open the browser console and look for detailed error messages and API request logs.

## Development

### Project Structure

```
src/
├── components/
│   ├── BulkAssignmentDashboard.tsx    # Main dashboard
│   ├── ContentItemSelector.tsx        # Content item selection
│   ├── ContributorSelector.tsx        # User selection
│   └── AssignmentResults.tsx          # Results display
├── hooks/
│   ├── useBulkAssignment.ts          # Assignment logic
│   └── ...                           # Other hooks
├── services/
│   └── api.ts                        # API service
├── types.ts                          # TypeScript types
└── styles.css                        # Styling
```

### Adding New Features

1. **New API Endpoints**: Add methods to `ApiService` class
2. **New Components**: Create in `components/` directory
3. **New Hooks**: Add to `hooks/` directory
4. **Styling**: Update `styles.css`

### Testing

```bash
npm run type-check  # TypeScript checking
npm run lint        # ESLint checking
```

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the Kontent.ai documentation
3. Check the browser console for error messages
4. Verify your API keys and permissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

Built with ❤️ for the Kontent.ai community