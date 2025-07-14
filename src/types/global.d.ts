import { Roles } from "./roles";

declare global {
  //@ts-expect-error
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}

// Make sure this is treated as a module
export {};
