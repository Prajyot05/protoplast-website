import { Roles } from "./roles";

declare global {
  // @ts-expect-error: needed to bypass missing global type
  const mongoose: {
    Types: any;
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };

  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}

// Ensure this file is treated as a module
export {};
