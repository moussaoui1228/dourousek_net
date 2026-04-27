# DourousNet

DourousNet is a modern, premium online education platform designed to connect ambitious students with expert professors. Built with a sleek glassmorphic UI and a robust Supabase backend, it offers a seamless experience for session management, resource sharing, and academic growth.

![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-2.104.1-green?style=for-the-badge&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.38.0-ff69b4?style=for-the-badge&logo=framer-motion)

## Key Features

- **Dual Roles**: Tailored experiences for both **Students** and **Professors**.
- **Session Management**: Easily schedule, confirm, or cancel tutoring sessions.
- **Resource Hub**: Centralized sharing of assignments, corrections, and documents (PDF support).
- **Modern UI**: A stunning glassmorphic design with smooth animations powered by Framer Motion.
- **Real-time Backend**: Powered by Supabase for secure authentication and real-time data management.

## Tech Stack

- **Frontend**: [Next.js 15+](https://nextjs.org/) (App Router), [React 19](https://react.dev/)
- **Styling**: Vanilla CSS with Glassmorphism and Custom Design Tokens
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

##  Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- A Supabase account and project

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/dourousek_net.git
   cd dourousek_net
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Initialize Database**:
   - **Option A (SQL Editor)**: Run the SQL scripts located in the `/supabase` directory within your Supabase SQL editor to set up the schema.
   - **Option B (Browser Seed)**: Once the app is running, navigate to `/seed` to automatically create demo professor accounts.

5. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

##  Seeding Data

To quickly get started with sample data, DourousNet includes a built-in seeding utility:
1. Ensure your Supabase environment variables are set.
2. Visit `http://localhost:3000/seed` in your browser.
3. Click the **"Créer les 4 professeurs"** button to automatically populate your database with expert demo profiles.

##  Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/lib`: Shared utility functions and Supabase client configuration.
- `supabase/`: SQL migration and seed files for the database schema.
- `public/`: Static assets.

##  Design Philosophy

DourousNet uses a **Glassmorphic** design language, characterized by:
- Translucent backgrounds with background-blur effects.
- Multi-layered approach with subtle shadows.
- Vibrant, curated gradients.
- Modern typography using the 'Outfit' font family.

---

