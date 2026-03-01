"use server";

import { query } from "@/lib/db";

export async function checkDbConnection() {
  try {
    const start = Date.now();
    const result = await query("SELECT current_database(), current_user, version(), inet_server_addr()");
    const duration = Date.now() - start;
    
    return {
      success: true,
      data: result.rows[0],
      duration: `${duration}ms`,
      env: {
        host: process.env.DB_HOST || "via-url",
        db: process.env.DB_NAME || "default",
        user: process.env.DB_USER || "unknown",
        port: process.env.DB_PORT || "5432",
        ssl: process.env.DB_HOST && process.env.DB_HOST.includes('localhost') ? "off" : "on",
      }
    };
  } catch (error: any) {
    console.error("DB Connection Check Failed:", error);
    return {
      success: false,
      error: error.message,
      code: error.code, // Postgres error code
      env: {
        host: process.env.DB_HOST || "via-url",
        db: process.env.DB_NAME || "default",
      }
    };
  }
}
