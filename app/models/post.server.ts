import { Post } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getPostListings() {
  return await prisma.post.findMany({ select: { slug: true, title: true } });
}

export async function getPosts() {
  return await prisma.post.findMany();
}

export async function getPostById(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

export async function createPost(
  post: Pick<Post, "slug" | "title" | "markdown">
) {
  return prisma.post.create({ data: post });
}

export async function updatePost(
  slug: string,
  post: Pick<Post, "slug" | "title" | "markdown">
) {
  return prisma.post.update({ where: { slug }, data: post });
}

export async function deletePost(slug: string) {
  return prisma.post.delete({ where: { slug } });
}
