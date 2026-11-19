-- ============================================================
-- ContractCommand (P07) – Defense Contract and Procurement Management Platform
-- Relational Database Schema (MySQL 8.0 / InnoDB / utf8mb4)
-- Normalized to Third Normal Form (3NF)
-- ============================================================

CREATE DATABASE IF NOT EXISTS `contractcommand_db`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE `contractcommand_db`;

SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- Table: auth_group (Django Groups / Roles)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `auth_group`;
CREATE TABLE `auth_group` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `name` VARCHAR(150) NOT NULL UNIQUE,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: auth_user (Django User Account)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `auth_user`;
CREATE TABLE `auth_user` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `password` VARCHAR(128) NOT NULL,
    `last_login` DATETIME(6) NULL,
    `is_superuser` TINYINT(1) NOT NULL DEFAULT 0,
    `username` VARCHAR(150) NOT NULL UNIQUE,
    `first_name` VARCHAR(150) NOT NULL,
    `last_name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(254) NOT NULL,
    `is_staff` TINYINT(1) NOT NULL DEFAULT 0,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `date_joined` DATETIME(6) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: auth_user_groups (User to Group Mapping)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `auth_user_groups`;
CREATE TABLE `auth_user_groups` (
    `id` BIGINT AUTO_INCREMENT NOT NULL,
    `user_id` INT NOT NULL,
    `group_id` INT NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `auth_user_groups_user_id_group_id_uniq` (`user_id`, `group_id`),
    CONSTRAINT `fk_auth_user_groups_user` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_auth_user_groups_group` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: accounts_userprofile (Extended User Profile)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `accounts_userprofile`;
CREATE TABLE `accounts_userprofile` (
    `id` BIGINT AUTO_INCREMENT NOT NULL,
    `user_id` INT NOT NULL UNIQUE,
    `designation` VARCHAR(50) NOT NULL,
    `phone` VARCHAR(15) NOT NULL DEFAULT '',
    `department` VARCHAR(100) NOT NULL DEFAULT '',
    `city` VARCHAR(100) NOT NULL DEFAULT '',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` DATETIME(6) NOT NULL,
    `updated_at` DATETIME(6) NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_accounts_profile_user` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: vendors_vendor (Vendor Master)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `vendors_vendor`;
CREATE TABLE `vendors_vendor` (
    `id` BIGINT AUTO_INCREMENT NOT NULL,
    `vendor_code` VARCHAR(20) NOT NULL UNIQUE,
    `company_name` VARCHAR(255) NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `contact_person` VARCHAR(100) NOT NULL,
    `email` VARCHAR(254) NOT NULL UNIQUE,
    `phone` VARCHAR(15) NOT NULL,
    `address` LONGTEXT NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `state` VARCHAR(100) NOT NULL,
    `pincode` VARCHAR(6) NOT NULL,
    `gst_number` VARCHAR(20) NOT NULL DEFAULT '',
    `pan_number` VARCHAR(10) NOT NULL DEFAULT '',
    `status` VARCHAR(20) NOT NULL DEFAULT 'Pending',
    `registered_by_id` INT NULL,
    `created_at` DATETIME(6) NOT NULL,
    `updated_at` DATETIME(6) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_vendor_status` (`status`),
    INDEX `idx_vendor_category` (`category`),
    INDEX `idx_vendor_code` (`vendor_code`),
    CONSTRAINT `fk_vendor_registered_by` FOREIGN KEY (`registered_by_id`) REFERENCES `auth_user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: vendors_evaluation (Vendor Evaluation & Scoring)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `vendors_evaluation`;
CREATE TABLE `vendors_evaluation` (
    `id` BIGINT AUTO_INCREMENT NOT NULL,
    `vendor_id` BIGINT NOT NULL,
    `evaluated_by_id` INT NULL,
    `evaluation_date` DATE NOT NULL,
    `quality_score` DECIMAL(4,1) NOT NULL,
    `delivery_score` DECIMAL(4,1) NOT NULL,
    `pricing_score` DECIMAL(4,1) NOT NULL,
    `compliance_score` DECIMAL(4,1) NOT NULL,
    `overall_score` DECIMAL(4,1) NOT NULL,
    `recommendation` VARCHAR(20) NOT NULL,
    `remarks` LONGTEXT NOT NULL,
    `created_at` DATETIME(6) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_evaluation_date` (`evaluation_date`),
    CONSTRAINT `fk_eval_vendor` FOREIGN KEY (`vendor_id`) REFERENCES `vendors_vendor` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_eval_evaluated_by` FOREIGN KEY (`evaluated_by_id`) REFERENCES `auth_user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: contracts_contract (Contracts Master)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `contracts_contract`;
CREATE TABLE `contracts_contract` (
    `id` BIGINT AUTO_INCREMENT NOT NULL,
    `contract_number` VARCHAR(20) NOT NULL UNIQUE,
    `title` VARCHAR(255) NOT NULL,
    `contract_type` VARCHAR(50) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `vendor_id` BIGINT NULL,
    `value` DECIMAL(15,2) NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'Draft',
    `created_by_id` INT NULL,
    `created_at` DATETIME(6) NOT NULL,
    `updated_at` DATETIME(6) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_contract_status` (`status`),
    INDEX `idx_contract_dates` (`start_date`, `end_date`),
    INDEX `idx_contract_number` (`contract_number`),
    CONSTRAINT `fk_contract_vendor` FOREIGN KEY (`vendor_id`) REFERENCES `vendors_vendor` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_contract_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `auth_user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: contracts_contractdocument (Contract Documents)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `contracts_contractdocument`;
CREATE TABLE `contracts_contractdocument` (
    `id` BIGINT AUTO_INCREMENT NOT NULL,
    `contract_id` BIGINT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `file_name` VARCHAR(255) NOT NULL,
    `file_path` VARCHAR(500) NOT NULL,
    `uploaded_by_id` INT NULL,
    `uploaded_at` DATETIME(6) NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_doc_contract` FOREIGN KEY (`contract_id`) REFERENCES `contracts_contract` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_doc_uploaded_by` FOREIGN KEY (`uploaded_by_id`) REFERENCES `auth_user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: procurement_plan (Procurement Plans)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `procurement_plan`;
CREATE TABLE `procurement_plan` (
    `id` BIGINT AUTO_INCREMENT NOT NULL,
    `plan_number` VARCHAR(30) NOT NULL UNIQUE,
    `title` VARCHAR(255) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `fiscal_year` VARCHAR(9) NOT NULL,
    `total_budget` DECIMAL(15,2) NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'Draft',
    `created_by_id` INT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `created_at` DATETIME(6) NOT NULL,
    `updated_at` DATETIME(6) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_plan_status_fy` (`status`, `fiscal_year`),
    CONSTRAINT `fk_plan_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `auth_user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: procurement_requisition (Procurement Requisitions)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `procurement_requisition`;
CREATE TABLE `procurement_requisition` (
    `id` BIGINT AUTO_INCREMENT NOT NULL,
    `requisition_number` VARCHAR(30) NOT NULL UNIQUE,
    `plan_id` BIGINT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `priority` VARCHAR(10) NOT NULL DEFAULT 'Medium',
    `status` VARCHAR(20) NOT NULL DEFAULT 'Pending',
    `required_by_date` DATE NOT NULL,
    `requested_by_id` INT NULL,
    `approved_by_id` INT NULL,
    `approved_at` DATETIME(6) NULL,
    `created_at` DATETIME(6) NOT NULL,
    `updated_at` DATETIME(6) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_req_status` (`status`),
    INDEX `idx_req_priority` (`priority`),
    CONSTRAINT `fk_req_plan` FOREIGN KEY (`plan_id`) REFERENCES `procurement_plan` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_req_requested_by` FOREIGN KEY (`requested_by_id`) REFERENCES `auth_user` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_req_approved_by` FOREIGN KEY (`approved_by_id`) REFERENCES `auth_user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: procurement_requisition_item (Requisition Line Items)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `procurement_requisition_item`;
CREATE TABLE `procurement_requisition_item` (
    `id` BIGINT AUTO_INCREMENT NOT NULL,
    `requisition_id` BIGINT NOT NULL,
    `item_name` VARCHAR(255) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `quantity` DECIMAL(10,2) NOT NULL,
    `unit` VARCHAR(20) NOT NULL DEFAULT 'Unit',
    `unit_price` DECIMAL(12,2) NOT NULL,
    `total_price` DECIMAL(15,2) NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_item_requisition` FOREIGN KEY (`requisition_id`) REFERENCES `procurement_requisition` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: finance_invoice (Invoices Master)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `finance_invoice`;
CREATE TABLE `finance_invoice` (
    `id` BIGINT AUTO_INCREMENT NOT NULL,
    `invoice_number` VARCHAR(20) NOT NULL UNIQUE,
    `contract_id` BIGINT NOT NULL,
    `vendor_id` BIGINT NOT NULL,
    `invoice_date` DATE NOT NULL,
    `due_date` DATE NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'Draft',
    `subtotal` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `tax_percent` DECIMAL(5,2) NOT NULL DEFAULT 18.00,
    `tax_amount` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `total_amount` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `notes` LONGTEXT NOT NULL,
    `created_by_id` INT NULL,
    `created_at` DATETIME(6) NOT NULL,
    `updated_at` DATETIME(6) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_invoice_status` (`status`),
    INDEX `idx_invoice_number` (`invoice_number`),
    INDEX `idx_invoice_due_date` (`due_date`),
    CONSTRAINT `fk_invoice_contract` FOREIGN KEY (`contract_id`) REFERENCES `contracts_contract` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_invoice_vendor` FOREIGN KEY (`vendor_id`) REFERENCES `vendors_vendor` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_invoice_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `auth_user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: finance_invoice_item (Invoice Line Items)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `finance_invoice_item`;
CREATE TABLE `finance_invoice_item` (
    `id` BIGINT AUTO_INCREMENT NOT NULL,
    `invoice_id` BIGINT NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `quantity` DECIMAL(10,2) NOT NULL,
    `unit_price` DECIMAL(12,2) NOT NULL,
    `line_total` DECIMAL(15,2) NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_inv_item_invoice` FOREIGN KEY (`invoice_id`) REFERENCES `finance_invoice` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: finance_payment (Payment Transactions)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `finance_payment`;
CREATE TABLE `finance_payment` (
    `id` BIGINT AUTO_INCREMENT NOT NULL,
    `invoice_id` BIGINT NOT NULL,
    `payment_reference` VARCHAR(50) NOT NULL UNIQUE,
    `payment_date` DATE NOT NULL,
    `amount` DECIMAL(15,2) NOT NULL,
    `payment_method` VARCHAR(20) NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'Initiated',
    `remarks` LONGTEXT NOT NULL,
    `processed_by_id` INT NULL,
    `created_at` DATETIME(6) NOT NULL,
    `updated_at` DATETIME(6) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_payment_status` (`status`),
    INDEX `idx_payment_ref` (`payment_reference`),
    CONSTRAINT `fk_payment_invoice` FOREIGN KEY (`invoice_id`) REFERENCES `finance_invoice` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_payment_processed_by` FOREIGN KEY (`processed_by_id`) REFERENCES `auth_user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
