import { Comment, Post, User } from '#models/index.js';
import { toPostResponse } from './responses.js';

const postAuthorInclude = {
  model: User,
  as: 'user',
  attributes: ['id', 'fullname', 'email'],
};

const commentAuthorInclude = {
  model: User,
  as: 'user',
  attributes: ['id', 'fullname', 'email'],
};

const postCommentsInclude = {
  model: Comment,
  as: 'comments',
  include: [commentAuthorInclude],
};

export async function getAll(_req, res) {
  try {
    const posts = await Post.findAll({
      include: [postAuthorInclude],
    });

    return res.json(posts.map(toPostResponse));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getById(req, res) {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [postAuthorInclude, postCommentsInclude],
    });

    if (!post) {
      return res.status(404).json({ error: 'Пост не найден' });
    }

    return res.json(toPostResponse(post));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function create(req, res) {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(401).json({ error: 'Пользователь не найден' });
    }

    const post = await Post.create({
      title: req.body.title,
      text: req.body.text,
      userId: user.id,
      likes: 0,
    });

    await post.reload({
      include: [postAuthorInclude, postCommentsInclude],
    });

    return res.status(201).json(toPostResponse(post));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function update(req, res) {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Пост не найден' });
    }

    if (post.userId !== req.user.id) {
      return res.status(403).json({ error: 'Нет прав на изменение этого поста' });
    }

    post.title = req.body.title;
    post.text = req.body.text;

    await post.save();

    return res.json(post);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function remove(req, res) {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Пост не найден' });
    }

    if (post.userId !== req.user.id) {
      return res.status(403).json({ error: 'Нет прав на удаление этого поста' });
    }

    await post.destroy();

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function like(req, res) {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Пост не найден' });
    }

    post.likes += 1;
    await post.save();

    await post.reload({
      include: [postAuthorInclude],
    });

    return res.json(post);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
