import { createContext } from "react";

// The currently selected mesh is shared across components
export const MeshContext = createContext(null);
// The currently logged-in user is shared
export const UserContext = createContext(null);
// A socket for updates from the API should only be created once
export const ApiSocketContext = createContext(null);
