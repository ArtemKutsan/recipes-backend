export function toUserResponse(user) {
  const plainUser = user.toJSON();

  return {
    id: plainUser.id,
    fullname: plainUser.fullname,
    email: plainUser.email,
    createdAt: plainUser.createdAt,
    updatedAt: plainUser.updatedAt,
  };
}
