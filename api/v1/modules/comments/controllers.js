import { Comment, Post, User } from '#models/index.js';
import { toCommentResponse } from './responses.js';

const commentAuthorInclude = {
  model: User,
  as: 'user',
  attributes: ['id', 'fullname', 'email'],
};

export async function getByPostId(req, res) {
  try {
    const comments = await Comment.findAll({
      where: { postId: req.params.postId },
      include: [commentAuthorInclude],
    });

    return res.json(comments.map(toCommentResponse));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function create(req, res) {
  try {
    const post = await Post.findByPk(req.body.postId);

    if (!post) {
      return res.status(404).json({ error: 'Пост не найден' });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(401).json({ error: 'Пользователь не найден' });
    }

    const comment = await Comment.create({
      postId: req.body.postId,
      text: req.body.text,
      userId: user.id,
    });

    await comment.reload({
      include: [commentAuthorInclude],
    });

    return res.status(201).json(toCommentResponse(comment));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function update(req, res) {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Комментарий не найден' });
    }

    if (comment.userId !== req.user.id) {
      return res.status(403).json({ error: 'Нет прав на изменение этого комментария' });
    }

    comment.text = req.body.text;
    await comment.save();

    await comment.reload({
      include: [commentAuthorInclude],
    });

    return res.json(toCommentResponse(comment));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function remove(req, res) {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Комментарий не найден' });
    }

    if (comment.userId !== req.user.id) {
      return res.status(403).json({ error: 'Нет прав на удаление этого комментария' });
    }

    await comment.destroy();

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
