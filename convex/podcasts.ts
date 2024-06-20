import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUrl = mutation({
    args: {
        storageId: v.id('_storage'),
    },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.storageId)
    }
})


export const createPodcast = mutation({
    args: {
        podcastTitle: v.string(),
        podcastDescription: v.string(),
        audioUrl: v.string(),
        imageUrl: v.string(),
        voiceType: v.string(),
        imagePrompt: v.string(),
        voicePrompt: v.string(),
        views: v.number(),
        audioDuration: v.number(),
        audioStorageId: v.id('_storage'),
        imageStorageId: v.id('_storage'),
    },
    handler: async (ctx, args) => {

        // Find out who is creating audiofile
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) {
            throw new ConvexError('Not authenticated')
        }
        // Get the exact user, check if email matches and collect that information
        const user = await ctx.db
        .query('users')
        .filter((q) => q.eq(q.field('email'), identity.email))
        .collect();

        if(user.length === 0) {
            throw new ConvexError('User not found')
        }
        // spreading and inserting automatically plus additional user arguments
        const podcast = await ctx.db.insert('podcast', {
            ...args,
            user: user[0]._id,
            author: user[0].name,
            authorId: user[0].clerkId,
            authorImageUrl: user[0].imageUrl,
        })

        return podcast;
    }
})


export const getTrendingPodcasts = query({
    handler: async (ctx) => {
        const podcasts = await ctx.db.query('podcast').collect();

        return podcasts;
    }
})

// Returns a single file based on id
export const getPodcastById = query({
    args: { podcastId: v.id('podcast') },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.podcastId)
    }
})

