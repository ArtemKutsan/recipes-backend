export function toCommentResponse(comment) {
  const plainComment = comment.toJSON();

  return {
    id: plainComment.id,
    text: plainComment.text,
    author: plainComment.user?.fullname ?? null,
    postId: plainComment.postId,
    createdAt: plainComment.createdAt,
    updatedAt: plainComment.updatedAt,
  };
}
