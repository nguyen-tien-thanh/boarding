/*
  Warnings:

  - A unique constraint covering the columns `[resource,resourceId,userId]` on the table `resourceMembers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `resourceMembers_resource_resourceId_userId_key` ON `resourceMembers`(`resource`, `resourceId`, `userId`);
