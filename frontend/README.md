# OKM - UI Demo

A fully functional OKM UI built with React, Next.js, and Tailwind CSS. This is a pure UI demonstration with mock data loaded from JSON files.

## Features

- **File Management UI**: Browse, preview, and manage files and folders
- **Drag & Drop Interface**: Interactive upload area with drag-and-drop support
- **File Preview**: Support for images, PDFs, videos, and audio files
- **Search & Filter**: Advanced search with file type and sorting filters
- **Trash Recovery**: Soft delete with ability to restore deleted items
- **Responsive Design**: Fully responsive layout that works on desktop, tablet, and mobile
- **Beautiful UI**: Modern design with gradients, smooth transitions, and intuitive controls

## Getting Started

### Installation

```bash
npm install
# or
pnpm install
# or
yarn install
```

### Running the Development Server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
/app
  /drive          # Main drive page with file management
  /layout.tsx     # Root layout
  /page.tsx       # Home page (redirects to /drive)

/components
  /drive          # Drive-specific components
    - drive-layout.tsx     # Main layout with sidebar
    - file-grid.tsx        # File and folder grid display
    - file-preview.tsx     # File preview modal
    - upload-area.tsx      # Drag-drop upload interface
    - folder-nav.tsx       # Folder navigation
    - advanced-search.tsx  # Search and filter controls
    - trash-modal.tsx      # Trash/recycle bin
    - breadcrumb.tsx       # Navigation breadcrumbs
  /ui             # Reusable UI components (shadcn/ui)

/public
  /data           # Mock data
    - drive.json  # Sample files and folders
```

## Data Structure

The mock data is stored in `/public/data/drive.json`:

```json
{
  "items": [
    {
      "id": "file-1",
      "name": "Document.pdf",
      "type": "file",
      "fileType": "application/pdf",
      "fileSize": 2048576,
      "createdAt": "2024-03-13T09:15:00Z"
    }
  ],
  "folders": {
    "folder-1": {
      "name": "Projects",
      "items": [...]
    }
  },
  "trash": [...]
}
```

## Key Components

### DriveLayout
Main layout component providing header, sidebar, and responsive design.

### FileGrid
Displays files and folders in a responsive grid with context menu, preview, and rename functionality.

### FilePreview
Modal for previewing different file types with placeholder content.

### AdvancedSearch
Advanced search and filtering UI with multiple sort and filter options.

### TrashModal
Shows deleted items with restore and permanent delete options.

### UploadArea
Drag-and-drop interface for file uploads (demo: shows alerts only).

## Customization

### Add More Files
Edit `/public/data/drive.json` to add more files, folders, and trash items.

### Modify Colors
Edit `app/layout.tsx` and the component files to change the color scheme. The app uses Tailwind CSS utility classes.

### Change File Types
Update the file type filters in `/components/drive/advanced-search.tsx`.

## Notes

- This is a UI-only demonstration. The upload, delete, and rename functions show alerts but don't persist changes.
- All data is loaded from the JSON file and stored in component state.
- No backend, database, or authentication is required.
- Perfect for prototyping, design exploration, or building portfolio projects.

## Technologies Used

- **Next.js 16** - React framework with server-side rendering
- **React 19** - UI library
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Lucide Icons** - Beautiful icon library

## License

MIT
