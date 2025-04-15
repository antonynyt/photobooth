# Photobooth Frontend

This is the main frontend for the Photobooth project.

## Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/)
- [Netlify CLI](https://docs.netlify.com/cli/get-started/)
```bash
npm install netlify-cli -g
```

## Installation

1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd photobooth/frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    # or
    bun install
    ```

## Running the Development Server

Start the development server:
```bash
npm run dev
# or
bun run dev
# or
netlify dev #this allow us to test the serverless functions but need to be configured
```

The application will be available at `http://localhost:5173`.
or at `http://localhost:8888` with Netlify dev.


## Building for Production

To create a production build:
```bash
npm run build
# or
bun build
```

The optimized build will be in the `build/` directory.

## Folder Structure

- `src/`: Contains the source code.
- `public/`: Static assets.
- `build/`: Production build output.