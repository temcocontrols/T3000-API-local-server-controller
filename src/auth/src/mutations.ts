import { GraphQLBoolean, GraphQLNonNull, GraphQLString } from 'graphql'

export const authMutations = {
  loginByAccessKey: {
    extensions: { allowRoles: ['UNAUTHORIZED'] },
    type: new GraphQLNonNull(GraphQLBoolean),
    args: {
      access_token: { type: new GraphQLNonNull(GraphQLString) },
    },
    async resolve(_root, args, ctx) {
      if (args.access_token === process.env.ACCESS_KEY) {
        ctx.reply.setCookie('access-key', String(args.access_token), {
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: 60 * 60 * 24 * 30, // 30 days
        })
        return true
      } else {
        return false
      }
    },
  },

  logout: {
    extensions: { preventRoles: ['UNAUTHORIZED'] },
    type: new GraphQLNonNull(GraphQLBoolean),
    async resolve(_root, args, ctx) {
      logout(ctx.reply)
      return true
    },
  },
}

function logout(reply) {
  reply.clearCookie('access-key', {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  })
}