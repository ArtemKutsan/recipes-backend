import User from './User.js';
import Post from './Post.js';
import Comment from './Comment.js';
import Recipe from './Recipe.js';
import Cuisine from './Cuisine.js';
import Tag from './Tag.js';
import MealType from './MealType.js';

// One-to-One
// User.hasOne(Profile, { foreignKey: 'userId', as: 'profile' });
// Profile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// One-to-Many
User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });
User.hasMany(Recipe, { foreignKey: 'userId', as: 'recipes' });
Recipe.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Cuisine.hasMany(Recipe, { foreignKey: 'cuisineId', as: 'recipes' });
Recipe.belongsTo(Cuisine, { foreignKey: 'cuisineId', as: 'cuisine' });

// Many-to-Many
Recipe.belongsToMany(Tag, {
  through: 'recipe_tags',
  timestamps: false,
  foreignKey: 'recipeId',
  otherKey: 'tagId',
  as: 'tags',
});
Tag.belongsToMany(Recipe, {
  through: 'recipe_tags',
  timestamps: false,
  foreignKey: 'tagId',
  otherKey: 'recipeId',
  as: 'recipes',
});
export { User, Post, Comment, Recipe, Cuisine, Tag, MealType };
