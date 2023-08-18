import { prisma } from "~/db.server";
import { Post } from "~/interfaces/posts.interfaces";

export async function getPostListings() {
  return await prisma.post.findMany({ select: { slug: true, title: true } });
}

export async function getPosts() {
  return await prisma.post.findMany();
}

export async function getPostById(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

export async function createPost(post: Post) {
  return prisma.post.create({ data: post });
}
