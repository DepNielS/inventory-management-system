CREATE TYPE "public"."stock_adjustment_status" AS ENUM('DRAFT', 'SUBMITTED', 'APPROVED', 'POSTED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."stock_move_status" AS ENUM('DRAFT', 'POSTED', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."stock_opname_status" AS ENUM('DRAFT', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."stock_transfer_status" AS ENUM('DRAFT', 'APPROVED', 'IN_TRANSIT', 'RECEIVED', 'CANCELLED');--> statement-breakpoint
CREATE TABLE "stock_adjustment_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stock_adjustment_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"location_id" uuid NOT NULL,
	"adjustment_qty" numeric(14, 2) NOT NULL,
	"unit_cost" numeric(14, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stock_adjustment_items_unit_cost_check" CHECK ("stock_adjustment_items"."unit_cost" >= 0)
);
--> statement-breakpoint
CREATE TABLE "stock_adjustments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"adjustment_number" text NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"adjustment_date" date NOT NULL,
	"status" "stock_adjustment_status" DEFAULT 'DRAFT' NOT NULL,
	"reason" text NOT NULL,
	"notes" text,
	"created_by" uuid NOT NULL,
	"approved_by" uuid,
	"approved_at" timestamp with time zone,
	"posted_by" uuid,
	"posted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stock_move_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stock_move_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity" numeric(14, 2) NOT NULL,
	"unit_cost" numeric(14, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stock_move_items_quantity_check" CHECK ("stock_move_items"."quantity" > 0),
	CONSTRAINT "stock_move_items_unit_cost_check" CHECK ("stock_move_items"."unit_cost" >= 0)
);
--> statement-breakpoint
CREATE TABLE "stock_moves" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"move_number" text NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"source_location_id" uuid NOT NULL,
	"destination_location_id" uuid NOT NULL,
	"move_date" date NOT NULL,
	"status" "stock_move_status" DEFAULT 'DRAFT' NOT NULL,
	"notes" text,
	"created_by" uuid NOT NULL,
	"posted_by" uuid,
	"posted_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stock_opname_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stock_opname_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"location_id" uuid NOT NULL,
	"system_qty" numeric(14, 2) DEFAULT '0' NOT NULL,
	"counted_qty" numeric(14, 2) NOT NULL,
	"difference_qty" numeric(14, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stock_opname_items_system_qty_check" CHECK ("stock_opname_items"."system_qty" >= 0),
	CONSTRAINT "stock_opname_items_counted_qty_check" CHECK ("stock_opname_items"."counted_qty" >= 0)
);
--> statement-breakpoint
CREATE TABLE "stock_opnames" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"opname_number" text NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"opname_date" date NOT NULL,
	"status" "stock_opname_status" DEFAULT 'DRAFT' NOT NULL,
	"notes" text,
	"created_by" uuid NOT NULL,
	"completed_by" uuid,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stock_transfer_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stock_transfer_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"source_location_id" uuid NOT NULL,
	"destination_location_id" uuid NOT NULL,
	"quantity" numeric(14, 2) NOT NULL,
	"unit_cost" numeric(14, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stock_transfer_items_quantity_check" CHECK ("stock_transfer_items"."quantity" > 0),
	CONSTRAINT "stock_transfer_items_unit_cost_check" CHECK ("stock_transfer_items"."unit_cost" >= 0)
);
--> statement-breakpoint
CREATE TABLE "stock_transfers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transfer_number" text NOT NULL,
	"source_warehouse_id" uuid NOT NULL,
	"destination_warehouse_id" uuid NOT NULL,
	"transfer_date" date NOT NULL,
	"status" "stock_transfer_status" DEFAULT 'DRAFT' NOT NULL,
	"notes" text,
	"created_by" uuid NOT NULL,
	"approved_by" uuid,
	"approved_at" timestamp with time zone,
	"posted_by" uuid,
	"posted_at" timestamp with time zone,
	"received_by" uuid,
	"received_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "stock_adjustment_items" ADD CONSTRAINT "stock_adjustment_items_stock_adjustment_id_stock_adjustments_id_fk" FOREIGN KEY ("stock_adjustment_id") REFERENCES "public"."stock_adjustments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_adjustment_items" ADD CONSTRAINT "stock_adjustment_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_adjustment_items" ADD CONSTRAINT "stock_adjustment_items_location_id_warehouse_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."warehouse_locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_posted_by_users_id_fk" FOREIGN KEY ("posted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_move_items" ADD CONSTRAINT "stock_move_items_stock_move_id_stock_moves_id_fk" FOREIGN KEY ("stock_move_id") REFERENCES "public"."stock_moves"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_move_items" ADD CONSTRAINT "stock_move_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_moves" ADD CONSTRAINT "stock_moves_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_moves" ADD CONSTRAINT "stock_moves_source_location_id_warehouse_locations_id_fk" FOREIGN KEY ("source_location_id") REFERENCES "public"."warehouse_locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_moves" ADD CONSTRAINT "stock_moves_destination_location_id_warehouse_locations_id_fk" FOREIGN KEY ("destination_location_id") REFERENCES "public"."warehouse_locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_moves" ADD CONSTRAINT "stock_moves_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_moves" ADD CONSTRAINT "stock_moves_posted_by_users_id_fk" FOREIGN KEY ("posted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_opname_items" ADD CONSTRAINT "stock_opname_items_stock_opname_id_stock_opnames_id_fk" FOREIGN KEY ("stock_opname_id") REFERENCES "public"."stock_opnames"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_opname_items" ADD CONSTRAINT "stock_opname_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_opname_items" ADD CONSTRAINT "stock_opname_items_location_id_warehouse_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."warehouse_locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_opnames" ADD CONSTRAINT "stock_opnames_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_opnames" ADD CONSTRAINT "stock_opnames_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_opnames" ADD CONSTRAINT "stock_opnames_completed_by_users_id_fk" FOREIGN KEY ("completed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfer_items" ADD CONSTRAINT "stock_transfer_items_stock_transfer_id_stock_transfers_id_fk" FOREIGN KEY ("stock_transfer_id") REFERENCES "public"."stock_transfers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfer_items" ADD CONSTRAINT "stock_transfer_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfer_items" ADD CONSTRAINT "stock_transfer_items_source_location_id_warehouse_locations_id_fk" FOREIGN KEY ("source_location_id") REFERENCES "public"."warehouse_locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfer_items" ADD CONSTRAINT "stock_transfer_items_destination_location_id_warehouse_locations_id_fk" FOREIGN KEY ("destination_location_id") REFERENCES "public"."warehouse_locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_source_warehouse_id_warehouses_id_fk" FOREIGN KEY ("source_warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_destination_warehouse_id_warehouses_id_fk" FOREIGN KEY ("destination_warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_posted_by_users_id_fk" FOREIGN KEY ("posted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_received_by_users_id_fk" FOREIGN KEY ("received_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "stock_adjustment_items_stock_adjustment_id_idx" ON "stock_adjustment_items" USING btree ("stock_adjustment_id");--> statement-breakpoint
CREATE INDEX "stock_adjustment_items_product_id_idx" ON "stock_adjustment_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "stock_adjustment_items_location_id_idx" ON "stock_adjustment_items" USING btree ("location_id");--> statement-breakpoint
CREATE UNIQUE INDEX "stock_adjustments_adjustment_number_unique" ON "stock_adjustments" USING btree ("adjustment_number");--> statement-breakpoint
CREATE INDEX "stock_adjustments_warehouse_id_idx" ON "stock_adjustments" USING btree ("warehouse_id");--> statement-breakpoint
CREATE INDEX "stock_adjustments_status_idx" ON "stock_adjustments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "stock_adjustments_adjustment_date_idx" ON "stock_adjustments" USING btree ("adjustment_date");--> statement-breakpoint
CREATE INDEX "stock_adjustments_created_by_idx" ON "stock_adjustments" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "stock_adjustments_approved_by_idx" ON "stock_adjustments" USING btree ("approved_by");--> statement-breakpoint
CREATE INDEX "stock_adjustments_posted_by_idx" ON "stock_adjustments" USING btree ("posted_by");--> statement-breakpoint
CREATE INDEX "stock_move_items_stock_move_id_idx" ON "stock_move_items" USING btree ("stock_move_id");--> statement-breakpoint
CREATE INDEX "stock_move_items_product_id_idx" ON "stock_move_items" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "stock_moves_move_number_unique" ON "stock_moves" USING btree ("move_number");--> statement-breakpoint
CREATE INDEX "stock_moves_warehouse_id_idx" ON "stock_moves" USING btree ("warehouse_id");--> statement-breakpoint
CREATE INDEX "stock_moves_source_location_id_idx" ON "stock_moves" USING btree ("source_location_id");--> statement-breakpoint
CREATE INDEX "stock_moves_destination_location_id_idx" ON "stock_moves" USING btree ("destination_location_id");--> statement-breakpoint
CREATE INDEX "stock_moves_status_idx" ON "stock_moves" USING btree ("status");--> statement-breakpoint
CREATE INDEX "stock_moves_move_date_idx" ON "stock_moves" USING btree ("move_date");--> statement-breakpoint
CREATE INDEX "stock_moves_created_by_idx" ON "stock_moves" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "stock_moves_posted_by_idx" ON "stock_moves" USING btree ("posted_by");--> statement-breakpoint
CREATE INDEX "stock_opname_items_stock_opname_id_idx" ON "stock_opname_items" USING btree ("stock_opname_id");--> statement-breakpoint
CREATE INDEX "stock_opname_items_product_id_idx" ON "stock_opname_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "stock_opname_items_location_id_idx" ON "stock_opname_items" USING btree ("location_id");--> statement-breakpoint
CREATE UNIQUE INDEX "stock_opnames_opname_number_unique" ON "stock_opnames" USING btree ("opname_number");--> statement-breakpoint
CREATE INDEX "stock_opnames_warehouse_id_idx" ON "stock_opnames" USING btree ("warehouse_id");--> statement-breakpoint
CREATE INDEX "stock_opnames_status_idx" ON "stock_opnames" USING btree ("status");--> statement-breakpoint
CREATE INDEX "stock_opnames_opname_date_idx" ON "stock_opnames" USING btree ("opname_date");--> statement-breakpoint
CREATE INDEX "stock_opnames_created_by_idx" ON "stock_opnames" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "stock_opnames_completed_by_idx" ON "stock_opnames" USING btree ("completed_by");--> statement-breakpoint
CREATE INDEX "stock_transfer_items_stock_transfer_id_idx" ON "stock_transfer_items" USING btree ("stock_transfer_id");--> statement-breakpoint
CREATE INDEX "stock_transfer_items_product_id_idx" ON "stock_transfer_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "stock_transfer_items_source_location_id_idx" ON "stock_transfer_items" USING btree ("source_location_id");--> statement-breakpoint
CREATE INDEX "stock_transfer_items_destination_location_id_idx" ON "stock_transfer_items" USING btree ("destination_location_id");--> statement-breakpoint
CREATE UNIQUE INDEX "stock_transfers_transfer_number_unique" ON "stock_transfers" USING btree ("transfer_number");--> statement-breakpoint
CREATE INDEX "stock_transfers_source_warehouse_id_idx" ON "stock_transfers" USING btree ("source_warehouse_id");--> statement-breakpoint
CREATE INDEX "stock_transfers_destination_warehouse_id_idx" ON "stock_transfers" USING btree ("destination_warehouse_id");--> statement-breakpoint
CREATE INDEX "stock_transfers_status_idx" ON "stock_transfers" USING btree ("status");--> statement-breakpoint
CREATE INDEX "stock_transfers_transfer_date_idx" ON "stock_transfers" USING btree ("transfer_date");--> statement-breakpoint
CREATE INDEX "stock_transfers_created_by_idx" ON "stock_transfers" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "stock_transfers_approved_by_idx" ON "stock_transfers" USING btree ("approved_by");--> statement-breakpoint
CREATE INDEX "stock_transfers_posted_by_idx" ON "stock_transfers" USING btree ("posted_by");--> statement-breakpoint
CREATE INDEX "stock_transfers_received_by_idx" ON "stock_transfers" USING btree ("received_by");