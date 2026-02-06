import { AppDataSource } from "../db/data-source.js";
import { Post } from "../entities/Post.js";
import { Photo } from "../entities/Photo.js";
import { HttpError } from "../errors/HttpError.js";
import { HTTP_STATUS, POST_ERRORS } from "@uit-volunteer-map/shared";
import {
  CreatePostInput,
  UpdatePostInput,
  CreatePostImageInput,
} from "../schemas/post.js";

export class PostService {
  private postRepo = AppDataSource.getRepository(Post);
  private photoRepo = AppDataSource.getRepository(Photo);

  async getAll() {
    const posts = await this.postRepo.find();
    return posts.filter((post) => post.isDeleted === 0);
  }

  async getOne(id: number) {
    const post = await this.postRepo.findOneBy({ postId: id });
    if (!post || post.isDeleted === 1)
      throw new HttpError(POST_ERRORS.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return post;
  }

  async create(data: CreatePostInput) {
    const newPost = this.postRepo.create({
      title: data.title,
      content: data.content,
      team: { teamId: data.teamId },
      author: { userId: data.authorId },
      isDeleted: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return await this.postRepo.save(newPost);
  }

  async update(id: number, data: UpdatePostInput) {
    const post = await this.getOne(id);
    if (!post || post.isDeleted === 1)
      throw new HttpError(POST_ERRORS.NOT_FOUND, HTTP_STATUS.NOT_FOUND);

    if (data.title) post.title = data.title;

    if (data.content) post.content = data.content;

    if (data.teamId) {
      post.team = { teamId: data.teamId } as Post["team"];
    }
    if (data.authorId) {
      post.author = { userId: data.authorId } as Post["author"];
    }

    post.updatedAt = new Date().toISOString();
    return await this.postRepo.save(post);
  }

  async delete(id: number) {
    const post = await this.getOne(id);
    if (!post || post.isDeleted === 1)
      throw new HttpError(POST_ERRORS.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    post.isDeleted = 1;
    return await this.postRepo.save(post);
  }

  async addPhoto(postId: number, data: CreatePostImageInput) {
    const post = await this.getOne(postId);
    if (!post || post.isDeleted === 1)
      throw new HttpError(POST_ERRORS.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
      const newPhoto = this.photoRepo.create({
        title: data.title ?? undefined,
        imageUrl: data.imageUrl,
        uploadedAt: new Date().toISOString(),
        isFirstImage: data.isFirstImage ?? undefined,
        isDeleted: 0,
        post: { postId } as Photo["post"],
      });

    return await this.photoRepo.save(newPhoto);
  }
}
