import {PostWithUser} from "./post";
import {getUserWithPostsIncludeRetweet, UserWithoutPassword} from "./user";

type TweetType = "tweet" | "retweet" | "like";

type Timeline = {
  type: TweetType;
  post: PostWithUser;
  user: UserWithoutPassword;
  activedAt: Date;
};

type UserTimeline = {
  user: UserWithoutPassword;
  timeline: Timeline[];
};

export const getUserPostTimeline = async (
  userId: number
): Promise<UserTimeline | null> => {
  const user = await getUserWithPostsIncludeRetweet(userId);
  if (user === null) return null;
  const timeline: Timeline[] = user.posts
    .map((post): Timeline => {
      return {
        type: "tweet",
        post,
        user: post.user,
        activedAt: post.createdAt,
      };
    })
    .concat(
      user.retweets.map((retweet): Timeline => {
        return {
          type: "retweet",
          post: retweet.post,
          user: retweet.user,
          activedAt: retweet.createdAt,
        };
      })
    );

  timeline.sort((a, b) => {
    return b.activedAt.getTime() - a.activedAt.getTime();
  });
  return {
    user,
    timeline,
  };
};