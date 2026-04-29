# SEL Frontend

Next.js frontend application for the SEL Skill marketplace with integrated UI/UX design system.

## Getting Started

### Development

```bash
# Install dependencies (from monorepo root)
npm install

# Start development server
npm run dev:frontend
```

Open [http://localhost:3000](http://localhost:3000) to view the frontend.

### Building

```bash
npm run build:frontend
npm run start:frontend
```

## Project Structure

- `/src/app` - Next.js App Router pages and layouts
- `/src/context` - React Context providers (Auth, Theme)
- `/src/components` - Reusable UI components

## Design System

All UI components follow the SEL design standards:
- **Colors**: Primary Blue (#0078d4), Secondary Purple (#8b5cf6)
- **Font**: Roboto
- **Dark Mode**: Class-based with `dark:` variants
- **Shadows**: Light, medium, card styles
- **Animations**: Fade, slide, scale transitions

## Environment

Backend API: `http://localhost:4000`
