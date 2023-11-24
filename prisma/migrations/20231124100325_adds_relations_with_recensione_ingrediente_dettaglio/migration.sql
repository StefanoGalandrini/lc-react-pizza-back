/*
  Warnings:

  - You are about to drop the column `description` on the `pizzas` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `pizzas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `pizzas` DROP COLUMN `description`,
    DROP COLUMN `image`;

-- CreateTable
CREATE TABLE `pizza_dettagli` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descrizione` TEXT NULL,
    `image` TEXT NULL,
    `pizzaId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `pizza_dettagli_pizzaId_key`(`pizzaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Recensione` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `rating` INTEGER NOT NULL DEFAULT 0,
    `pizzaId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ingrediente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `gluten` BOOLEAN NOT NULL DEFAULT false,
    `vegan` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_IngredienteToPizza` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_IngredienteToPizza_AB_unique`(`A`, `B`),
    INDEX `_IngredienteToPizza_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pizza_dettagli` ADD CONSTRAINT `pizza_dettagli_pizzaId_fkey` FOREIGN KEY (`pizzaId`) REFERENCES `pizzas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recensione` ADD CONSTRAINT `Recensione_pizzaId_fkey` FOREIGN KEY (`pizzaId`) REFERENCES `pizzas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_IngredienteToPizza` ADD CONSTRAINT `_IngredienteToPizza_A_fkey` FOREIGN KEY (`A`) REFERENCES `Ingrediente`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_IngredienteToPizza` ADD CONSTRAINT `_IngredienteToPizza_B_fkey` FOREIGN KEY (`B`) REFERENCES `pizzas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
