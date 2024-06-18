import { v } from "convex/values";
import { mutation } from "./_generated/server";

// generate uploadURL using uploadstuff
 
export const generateUploadUrl = mutation({
  args: {
  },
  handler: async (ctx, args) => {
    return await ctx.storage.generateUploadUrl();
  },
});