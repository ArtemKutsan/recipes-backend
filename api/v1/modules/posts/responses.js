export function toPostResponse(post) {
  const plainPost = post.toJSON();

  return {
    id: plainPost.id,
    title: plainPost.title,
    text: plainPost.text,
    author: plainPost.user?.fullname ?? null,
    likes: plainPost.likes,
    userId: plainPost.userId,
    comments: plainPost.comments?.map((comment) => ({
      id: comment.id,
      author: comment.user?.fullname ?? null,
      text: comment.text,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    })),
    createdAt: plainPost.createdAt,
    updatedAt: plainPost.updatedAt,
  };
}
