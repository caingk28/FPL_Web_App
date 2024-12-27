# Fantasy Premier League Web App

A web application for viewing Fantasy Premier League (FPL) data, supporting both regular and draft leagues.

## Features

- View regular FPL team data including:

  - Total points
  - Overall rank
  - Recent gameweek history
  - Manager information

- View draft FPL league data including:
  - League standings
  - Total points per team
  - Last gameweek scores
  - Match statistics (W/D/L)

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **API Integration**: Axios
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/FPL_Web_App.git
cd FPL_Web_App
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Regular FPL

1. Enter your FPL Team ID in the Team tab
2. View your team's performance, including total points and gameweek history

### Draft FPL

1. Toggle "Draft Mode"
2. Enter your Draft League ID in the League tab
3. View league standings, including points and match statistics

## API Endpoints

### `/api/team`

- **Method**: POST
- **Body**: `{ teamId: string, isDraft: boolean }`
- **Response**: Team details including points, rank, and history

### `/api/league`

- **Method**: POST
- **Body**: `{ leagueId: string, isDraft: boolean }`
- **Response**: League standings and team statistics

## Development

### Project Structure

```
src/
├── app/              # Next.js app router
├── components/       # React components
├── hooks/           # Custom React hooks
└── lib/             # Utility functions
```

### Key Components

- `FPLForm`: Main form component for data input
- `api/team/route.ts`: Team data endpoint
- `api/league/route.ts`: League data endpoint
- `use-fpl-data.ts`: Custom hook for data fetching

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Fantasy Premier League API](https://fantasy.premierleague.com/api)
- [Draft Fantasy Premier League API](https://draft.premierleague.com/api)
- [Shadcn UI](https://ui.shadcn.com/)
