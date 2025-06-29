# 🎥 Lumora

**Lumora** is a modern video messaging and collaboration platform that enables users to create instant video messages using their camera, microphone, and screen. Share them in seconds to accelerate communication and collaboration.

## ✨ Features

- 🎥 **Instant Video Creation** - Record with camera, microphone, and screen capture
- 📁 **Workspace Management** - Organize videos in workspaces and folders  
- 👥 **Team Collaboration** - Invite team members and share content
- 💬 **Comments & Feedback** - Add comments and replies to videos
- 📊 **Analytics** - Track video views and engagement
- 🔐 **Secure Authentication** - Powered by Better Auth with Google OAuth
- 💳 **Subscription Management** - Free and Pro plans with Stripe integration
- 🎨 **Modern UI** - Beautiful interface built with Tailwind CSS and shadcn/ui

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth
- **Payments**: Stripe
- **State Management**: Redux Toolkit
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form with Zod validation
- **Deployment**: Vercel

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm**
- **PostgreSQL** database
- **Git**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/vagxrth/lumora-web.git
cd lumora-web
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Copy the example environment file and populate it with your own values:

```bash
cp .env.example .env
```

Then edit the `.env` file and populate the values with your actual configuration values.

### 4. Database Setup

Set up your PostgreSQL database and run the Prisma migrations:

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📝 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code linting

## 🔧 Configuration

### Better Auth Setup

1. Create a Google OAuth application at [Google Cloud Console](https://console.cloud.google.com/)
2. Configure OAuth consent screen and create credentials
3. Copy the Client ID and Client Secret to your `.env` file as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
4. Set your authorized redirect URIs to include your app domain + `/api/auth/callback/google`

### Database Configuration

1. Set up a PostgreSQL database (locally or using a service like Supabase, PlanetScale, etc.)
2. Update the `DATABASE_URL` in your `.env` file
3. Run the Prisma commands to set up your database schema

### Stripe Integration (Optional)

1. Create a Stripe account at [Stripe.com](https://stripe.com)
2. Get your publishable and secret keys from the Stripe dashboard
3. Add them to your `.env` file
4. Configure webhook endpoints for subscription management

## 🌐 Deployment

### Deploy on Vercel

The easiest way to deploy your Lumora app is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your project to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

Make sure to:
- Add all environment variables to your Vercel project settings
- Set up your production database
- Configure your Google OAuth production keys
- Set up Stripe webhooks for your production domain

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
