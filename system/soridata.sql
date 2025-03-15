CREATE TABLE `users` (
	`id` INT(100) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`pass` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`sorozatok` LONGTEXT NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`watched` LONGTEXT NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	INDEX `id` (`id`) USING BTREE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=2
;
