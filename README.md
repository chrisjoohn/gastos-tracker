# Gastos Tracker - Frontend

A modern, responsive web application for tracking and analyzing your expenses. Built with Next.js and React, Gastos Tracker helps you visualize spending patterns, categorize expenses, and stay on top of your finances.

## Features

- 📊 **Interactive Charts** - Visualize expense trends and category breakdowns
- 💳 **Transaction Management** - Track and organize all your expenses
- 📈 **Financial Summary** - Get quick insights with summary cards
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
- 📱 **Mobile Friendly** - Works seamlessly on all devices
- ⚡ **Fast Performance** - Built with Next.js for optimal speed

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 14+
- **UI Library**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Language**: TypeScript
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd gastos-tracker
```

2. Install dependencies
```bash
npm install
```

3. Create environment variables
```bash
cp .env.example .env.local
```

4. Start the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
gastos-tracker/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── ui/                      # Reusable UI components
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── chart.tsx
│   ├── category-chart.tsx       # Expense category visualization
│   ├── recent-transactions.tsx  # Recent transactions list
│   ├── summary-cards.tsx        # Financial summary display
│   └── trend-chart.tsx          # Expense trend chart
├── lib/                          # Utility functions
│   ├── finance-data.ts          # Financial data helpers
│   └── utils.ts                 # General utilities
├── public/                       # Static assets
└── package.json                 # Project dependencies
```

## Available Scripts

### Development
```bash
npm run dev
```
Runs the development server with hot-reload.

### Build
```bash
npm run build
```
Creates an optimized production build.

### Production
```bash
npm start
```
Runs the production server.

### Linting
```bash
npm run lint
```
Runs ESLint to check code quality.

## Key Components

### Summary Cards
Display key financial metrics at a glance, such as total expenses, average spending, and budget status.

### Transaction List
Shows recent transactions with details including date, amount, category, and description.

### Category Chart
Pie or donut chart visualization showing expense breakdown by category.

### Trend Chart
Line chart displaying expense trends over time.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions, please open an issue on the repository.

---

**Happy tracking! 💰**
