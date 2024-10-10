# Deck-building Game

## Overview

This is a deck-building game inspired by the popular game Lorcana. This project aims to explore the logic behind deck-building games while incorporating fun UI challenges such as 3D card animations and holographic effects.

_This is a WIP. There's a lot of missing functionality, and limited cards._

## Key Features

Deck-building Logic: Implemented core mechanics for deck-building, including shuffling, drawing, and playing cards.
3D Card Animations: Added interactive 3D animations for cards to enhance the user experience.
Holographic Effects: Incorporated holo effects to make the cards visually appealing and engaging.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

- Clone the repository
- Navigate to the project directory
- Install dependencies

### Running the Project

To start the development server, run: `npm run dev`

This will start the application on <http://localhost:3000>.

## Project Details

### Logic Implementation

The core logic for the deck-building game is implemented in the lib directory. For example, the initial state of a player is generated using the generatePlayerState function in src/lib/lorcana/cards.ts.

My custom cards are stored in src/lib/lorcana/store/test-cards.ts, and these can be used as refernce if you want to make new cards. There are unexplored possibilities with the current logic, so have at it.

### UI Components

The UI components, including the 3D card animations and holo effects, are located in the components directory.

### Configuration

- Tailwind CSS: Configured in tailwind.config.ts.
- TypeScript: Configured in tsconfig.json.
- Next.js: Configured in next.config.mjs.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

##Acknowledgements
Inspired by the game Lorcana.
Thanks to the open-source community for various libraries and tools used in this project.

- [react-mtg-card](https://github.com/germanyn/reactjs-mtg-card) for early designs and inspiration for the card maker
- [shadcn ui](https://github.com/shadcn-ui/ui)

Enjoy building and playing Lorcanito!