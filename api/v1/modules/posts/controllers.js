import { Comment, Post, User } from '#models/index.js';
import { toPostResponse } from './responses.js';

export async function getAll(_req, res) {
  try {
    const posts = await Post.findAll({
      include: [{ model: User, as: 'user', attributes: ['id', 'fullname', 'email'] }],
    });

    return res.json(posts.map(toPostResponse));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getById(req, res) {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'fullname', 'email'] },
        {
          model: Comment,
          as: 'comments',
          include: [{ model: User, as: 'user', attributes: ['id', 'fullname', 'email'] }],
        },
      ],
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

    return res.status(201).json(post);
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
    const deletedCount = await Post.destroy({
      where: { id: req.params.id },
    });

    if (!deletedCount) {
      return res.status(404).json({ error: 'Пост не найден' });
    }

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
      include: [{ model: User, as: 'user', attributes: ['id', 'fullname', 'email'] }],
    });

    return res.json(post);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
