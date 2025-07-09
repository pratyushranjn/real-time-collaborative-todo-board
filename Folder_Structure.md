# 📦 Project Folder Structure

real-time-collaborative-todo-board/
│
├── backend/                      # Express server and WebSocket backend
│   ├── config/                   # DB connection and environment config
│   ├── controllers/              # Core logic for auth, tasks, logs
│   ├── middleware/               # Auth middleware and error handling
│   ├── models/                   # Mongoose schemas (User, Task, ActivityLog)
│   ├── routes/                   # Express route modules (auth, tasks, logs)
│   ├── sockets/                  # Socket.IO event handlers (task sync)
│   └── utils/                    # Helpers (Smart Assign, asyncWrapper)
│
└── frontend/                     # React SPA with drag-drop and socket integration
    ├── public/                   # Static files and HTML entry point
    └── src/                      # React source code
        ├── assets/              # Icons, illustrations, and static assets
        ├── components/          # UI components (TaskCard, Modals, Board, etc.)
        ├── context/             # Global state via React Context (auth, board)
        ├── hooks/               # Custom React hooks (e.g., useSmartAssign)
        ├── pages/               # Page-level components (Dashboard, Auth)
        ├── services/            # API layer and socket client
        └── styles/              # CSS styling (task cards, modals, board)
