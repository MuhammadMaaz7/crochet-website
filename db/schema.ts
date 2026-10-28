import {sqliteTable,text,integer} from "drizzle-orm/sqlite-core";
export const products=sqliteTable("products",{id:text("id").primaryKey(),data:text("data").notNull()});
export const settings=sqliteTable("settings",{id:text("id").primaryKey(),data:text("data").notNull()});
export const requests=sqliteTable("requests",{id:text("id").primaryKey(),data:text("data").notNull(),status:text("status").notNull().default("new"),quote:integer("quote"),payment:text("payment").notNull().default("pending"),created:text("created").notNull()});
export const rateLimits=sqliteTable("rate_limits",{id:text("id").primaryKey(),count:integer("count").notNull(),reset:integer("reset").notNull()});
